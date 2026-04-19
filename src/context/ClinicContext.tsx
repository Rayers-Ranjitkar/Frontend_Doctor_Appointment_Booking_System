import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import type {
  Appointment,
  AppointmentStatus,
  Doctor,
  Notification,
  Payment,
  PaymentStatus,
  Prescription,
  QueueEntry,
  Review,
  Specialty,
  Patient,
} from '@/utils/clinicData';
import {
  appointments as seedAppointments,
  doctors as seedDoctors,
  notifications as seedNotifications,
  patients as seedPatients,
  payments as seedPayments,
  prescriptions as seedPrescriptions,
  queueEntries as seedQueueEntries,
  reviews as seedReviews,
  specialties as seedSpecialties,
} from '@/utils/clinicData';
import { apiRequest, SOCKET_BASE } from '@/utils/api';
import { useAuth } from '@/constants/AuthContext';

type BootstrapResponse = {
  specialties: Specialty[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  notifications: Notification[];
  prescriptions: Prescription[];
  queueEntries: QueueEntry[];
  reviews: Review[];
  payments: Payment[];
};

type AssistantReply = {
  summary: string;
  suggestions: string[];
  recommendedDoctorId: string | null;
  action?: 'answer_question' | 'recommend_doctor';
};

type PrescriptionPayload = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientPhone?: string;
  patientAddress?: string;
  title: string;
  fileName: string;
  notes: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalTiming: string;
  registrationNumber?: string;
  weightKg?: string;
  heightCm?: string;
  bmi?: string;
  bloodPressure?: string;
  chiefComplaints: string[];
  clinicalFindings: string[];
  diagnosis: string;
  medicines: Prescription['medicines'];
  advice: string[];
  followUpDate?: string;
  documentHtml?: string;
};

type ClinicContextValue = {
  specialties: Specialty[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  notifications: Notification[];
  queueEntries: QueueEntry[];
  currentPatient: Patient;
  currentDoctor: Doctor;
  backendConnected: boolean;
  markAllNotificationsRead: () => void;
  reloadClinic: () => Promise<void>;
  bookAppointment: (payload: {
    doctorId: string;
    date: string;
    time: string;
    reason: string;
    notes?: string;
    paymentStatus: PaymentStatus;
  }) => Promise<{ ok: boolean; error?: string; appointment?: Appointment }>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  rescheduleAppointment: (id: string, date: string, time: string) => Promise<{ ok: boolean; error?: string }>;
  updateQueueEntry: (id: string, payload: Partial<QueueEntry>) => Promise<void>;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

function relativeTimeLabel() {
  return 'just now';
}

function fallbackBootstrap(): BootstrapResponse {
  return {
    specialties: seedSpecialties,
    doctors: seedDoctors,
    patients: seedPatients,
    appointments: seedAppointments,
    notifications: seedNotifications,
    prescriptions: seedPrescriptions,
    queueEntries: seedQueueEntries,
    reviews: seedReviews,
    payments: seedPayments,
  };
}

function filterNotificationsForUser(items: Notification[], role?: 'patient' | 'doctor' | 'admin', profileId?: string | null) {
  if (!role) return [];
  return items.filter((notification) => (
    notification.recipientRole === role &&
    (role === 'admin' || notification.recipientProfileId === profileId)
  ));
}

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [specialties, setSpecialties] = useState(seedSpecialties);
  const [doctors, setDoctors] = useState(seedDoctors);
  const [patients, setPatients] = useState(seedPatients);
  const [appointments, setAppointments] = useState(seedAppointments);
  const [notifications, setNotifications] = useState(seedNotifications);
  const [queueEntries, setQueueEntries] = useState(seedQueueEntries);
  const [backendConnected, setBackendConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const currentPatient = patients.find((patient) => patient.id === user?.profileId) || patients[0];
  const currentDoctor = doctors.find((doctor) => doctor.id === user?.profileId) || doctors[0];

  const applyBootstrap = (data: BootstrapResponse) => {
    setSpecialties(data.specialties);
    setDoctors(data.doctors);
    setPatients(data.patients);
    setAppointments(data.appointments);
    setNotifications(data.notifications);
    setQueueEntries(data.queueEntries);
  };

  const pushNotification = (message: string, type: Notification['type']) => {
    setNotifications((current) => [
      { id: `n${Date.now()}`, message, type, time: relativeTimeLabel(), read: false, recipientRole: user?.role || 'patient', recipientProfileId: user?.profileId || null },
      ...current,
    ]);
  };

  const reloadClinic = async () => {
    if (!isAuthenticated) {
      const fallback = fallbackBootstrap();
      applyBootstrap({
        ...fallback,
        notifications: filterNotificationsForUser(fallback.notifications, user?.role, user?.profileId),
      });
      setBackendConnected(false);
      return;
    }
    try {
      const data = await apiRequest<BootstrapResponse>('/bootstrap');
      applyBootstrap(data);
      setBackendConnected(true);
    } catch {
      const fallback = fallbackBootstrap();
      applyBootstrap({
        ...fallback,
        notifications: filterNotificationsForUser(fallback.notifications, user?.role, user?.profileId),
      });
      setBackendConnected(false);
    }
  };

  useEffect(() => {
    void reloadClinic();
  }, [isAuthenticated]);

  useEffect(() => {
    let socket: Socket | null = null;

    try {
      if (!isAuthenticated) {
        return undefined;
      }
      socket = io(SOCKET_BASE, {
        transports: ['websocket', 'polling'],
      });

      socket.on('realtime:connected', () => {
        setBackendConnected(true);
      });

      socket.on('clinic:changed', () => {
        void reloadClinic();
      });

      socket.on('notifications:changed', () => {
        void reloadClinic();
      });
    } catch {
      socket = null;
    }

    return () => {
      socket?.disconnect();
    };
  }, [isAuthenticated]);

  const markAllNotificationsRead = async () => {
    // Optimistic update
    setNotifications(current => current.map(n => ({ ...n, read: true })));
    if (backendConnected) {
      await apiRequest('/notifications/mark-read', { method: 'PATCH' });
      // No reloadClinic() here — optimistic update is enough
    }
  };

  const hasConflict = (doctorId: string, date: string, time: string, excludeId?: string) =>
    appointments.some(
      (appointment) =>
        appointment.doctorId === doctorId &&
        appointment.date === date &&
        appointment.time === time &&
        appointment.status !== 'cancelled' &&
        appointment.id !== excludeId,
    );

  const bookAppointment: ClinicContextValue['bookAppointment'] = async (payload) => {
    const doctor = doctors.find((item) => item.id === payload.doctorId);
    if (!doctor) {
      return { ok: false, error: 'Doctor not found.' };
    }

    if (!backendConnected) {
      if (hasConflict(doctor.id, payload.date, payload.time)) {
        return { ok: false, error: 'Selected time slot is already booked.' };
      }

      const appointment: Appointment = {
        id: `a${Date.now()}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        patientAge: currentPatient.age,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        hospital: doctor.hospital,
        date: payload.date,
        time: payload.time,
        status: payload.paymentStatus === 'paid' ? 'confirmed' : 'pending',
        paymentStatus: payload.paymentStatus,
        reason: payload.reason,
        notes: payload.notes || '',
        doctorImage: doctor.image,
        queueNumber: 0,
        estimatedWaitMinutes: 0,
        reminderStatus: { sent24h: false, sent1h: false },
      };

      setAppointments((current) => [appointment, ...current]);
      pushNotification(`Appointment booked with ${doctor.name} on ${payload.date} at ${payload.time}.`, payload.paymentStatus === 'paid' ? 'confirmation' : 'payment');
      return { ok: true, appointment };
    }

    try {
      const result = await apiRequest<{ appointment: Appointment }>('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: payload.doctorId,
          patientId: currentPatient.id,
          patientName: currentPatient.name,
          patientAge: currentPatient.age,
          date: payload.date,
          time: payload.time,
          reason: payload.reason,
          notes: payload.notes || '',
          paymentStatus: payload.paymentStatus,
        }),
      });
      await reloadClinic();
      return { ok: true, appointment: result.appointment };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to book appointment.' };
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    if (!backendConnected) {
      setAppointments((current) => current.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)));
      pushNotification(`Appointment ${id.toUpperCase()} updated to ${status}.`, 'info');
      return;
    }

    await apiRequest(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    await reloadClinic();
  };

  const rescheduleAppointment: ClinicContextValue['rescheduleAppointment'] = async (id, date, time) => {
    if (!backendConnected) {
      const appointment = appointments.find((item) => item.id === id);
      if (!appointment) return { ok: false, error: 'Appointment not found.' };
      if (hasConflict(appointment.doctorId, date, time, appointment.id)) {
        return { ok: false, error: 'That time slot is already taken.' };
      }
      setAppointments((current) => current.map((item) => (item.id === id ? { ...item, date, time } : item)));
      return { ok: true };
    }

    try {
      await apiRequest(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ date, time }),
      });
      await reloadClinic();
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to reschedule.' };
    }
  };

  const updateQueueEntry: ClinicContextValue['updateQueueEntry'] = async (id, payload) => {
    if (!backendConnected) {
      setQueueEntries((current) => current.map((entry) => (entry.id === id ? { ...entry, ...payload } : entry)));
      pushNotification('Queue status was updated.', 'queue');
      return;
    }

    await apiRequest(`/queue/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await reloadClinic();
  };

  return (
    <ClinicContext.Provider
      value={{
        specialties,
        doctors,
        patients,
        appointments,
        notifications,
        queueEntries,
        currentPatient,
        currentDoctor,
        backendConnected,
        markAllNotificationsRead,
        reloadClinic,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        updateQueueEntry,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}

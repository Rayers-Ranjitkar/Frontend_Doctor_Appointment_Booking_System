import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
import { filterQueueEntriesForToday, isPastYmd, todayLocalYMD } from '@/utils/calendarDate';
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
  prescriptions: Prescription[];
  queueEntries: QueueEntry[];
  reviews: Review[];
  payments: Payment[];
  currentPatient: Patient;
  currentDoctor: Doctor;
  backendConnected: boolean;
  markAllNotificationsRead: () => void;
  reloadClinic: () => Promise<void>;
  fetchQueue: () => Promise<void>;
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
  addReview: (payload: { appointmentId: string; doctorId: string; rating: number; comment: string }) => Promise<void>;
  uploadPrescription: (payload: PrescriptionPayload) => Promise<void>;
  updatePrescription: (id: string, payload: Partial<PrescriptionPayload>) => Promise<void>;
  updateQueueEntry: (id: string, payload: Partial<QueueEntry>) => Promise<void>;
  updateDoctorVerification: (id: string, status: Doctor['verificationStatus']) => Promise<void>;
  askAssistant: (prompt: string) => Promise<AssistantReply>;
};

const ClinicContext = createContext<ClinicContextValue | null>(null);

function relativeTimeLabel() {
  return 'just now';
}

function fallbackBootstrap(): BootstrapResponse {
  const today = todayLocalYMD();
  return {
    specialties: seedSpecialties,
    doctors: seedDoctors,
    patients: seedPatients,
    appointments: seedAppointments,
    notifications: seedNotifications,
    prescriptions: seedPrescriptions,
    queueEntries: filterQueueEntriesForToday(seedQueueEntries, seedAppointments, today),
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
  const [prescriptions, setPrescriptions] = useState(seedPrescriptions);
  const [queueEntries, setQueueEntries] = useState(seedQueueEntries);
  const [reviews, setReviews] = useState(seedReviews);
  const [payments, setPayments] = useState(seedPayments);
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
    setPrescriptions(data.prescriptions);
    setQueueEntries(data.queueEntries);
    setReviews(data.reviews);
    setPayments(data.payments);
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

  const fetchQueue = useCallback(async () => {
    if (!backendConnected) return;
    try {
      const data = await apiRequest<{ queueEntries: QueueEntry[] }>('/queue');
      setQueueEntries(data.queueEntries);
    } catch (e) {
      console.error('Failed to fetch queue:', e);
    }
  }, [backendConnected]);

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

      socket.on('clinic:changed', (payload?: { type?: string }) => {
        const eventType = payload?.type;
        if (eventType === 'queue-updated' || eventType === 'queue-reordered' || eventType === 'queue-created') {
          void fetchQueue();
          return;
        }
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
      if (isPastYmd(payload.date)) {
        return { ok: false, error: 'Cannot book appointments in the past.' };
      }

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
      if (isPastYmd(date)) {
        return { ok: false, error: 'Cannot reschedule to a date in the past.' };
      }
      if (hasConflict(appointment.doctorId, date, time, appointment.id)) {
        return { ok: false, error: 'That time slot is already taken.' };
      }
      setAppointments((current) => current.map((item) => (item.id === id ? { ...item, date, time } : item)));
      setQueueEntries((current) =>
        current.map((entry) => (entry.appointmentId === id ? { ...entry, appointmentDate: date } : entry)),
      );
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

  const addReview: ClinicContextValue['addReview'] = async (payload) => {
    if (!backendConnected) {
      setReviews((current) => [
        {
          id: `r${Date.now()}`,
          ...payload,
          patientId: currentPatient.id,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      pushNotification('Thank you. Your doctor review has been submitted.', 'info');
      return;
    }

    await apiRequest('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        patientId: currentPatient.id,
      }),
    });
    await reloadClinic();
  };

  const uploadPrescription: ClinicContextValue['uploadPrescription'] = async (payload) => {
    if (!backendConnected) {
      setPrescriptions((current) => [
        {
          id: `rx${Date.now()}`,
          doctorId: currentDoctor.id,
          doctorName: currentDoctor.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          fileUrl: '#',
          ...payload,
        },
        ...current,
      ]);
      pushNotification(`Prescription uploaded for ${payload.patientName}.`, 'info');
      return;
    }

    await apiRequest('/prescriptions', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        fileUrl: '#',
      }),
    });
    await reloadClinic();
  };

  const updatePrescription: ClinicContextValue['updatePrescription'] = async (id, payload) => {
    if (!backendConnected) {
      setPrescriptions((current) => current.map((prescription) => (
        prescription.id === id
          ? { ...prescription, ...payload, updatedAt: new Date().toISOString() }
          : prescription
      )));
      pushNotification('Prescription updated successfully.', 'info');
      return;
    }

    await apiRequest(`/prescriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await reloadClinic();
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

  const updateDoctorVerification: ClinicContextValue['updateDoctorVerification'] = async (id, status) => {
    if (!backendConnected) {
      setDoctors((current) => current.map((doctor) => (doctor.id === id ? { ...doctor, verificationStatus: status } : doctor)));
      pushNotification(`Doctor verification updated to ${status}.`, 'info');
      return;
    }

    await apiRequest(`/doctors/${id}/verification`, {
      method: 'PATCH',
      body: JSON.stringify({ verificationStatus: status }),
    });
    await reloadClinic();
  };

  const askAssistant: ClinicContextValue['askAssistant'] = async (prompt) => {
    if (!backendConnected) {
      const normalized = prompt.toLowerCase();
      if (
        normalized === 'hi' ||
        normalized === 'hello' ||
        normalized === 'hey' ||
        normalized.includes('how are you') ||
        normalized.includes('good morning') ||
        normalized.includes('good evening')
      ) {
        return {
          summary: "Hi! I'm MediBook AI. Tell me your symptom, or ask about hospital hours and departments.",
          suggestions: ['Fever symptoms', 'Hospital hours', 'Departments', 'How to book'],
          recommendedDoctorId: null,
          action: 'answer_question',
        };
      }
      if (normalized.includes('hospital name') || normalized.includes('my hospital') || normalized.includes('name of hospital')) {
        return { summary: 'Your hospital name is Norvic Hospital.', suggestions: ['Opening times', 'Departments', 'Available doctors'], recommendedDoctorId: null, action: 'answer_question' };
      }
      if (normalized.includes('opening') || normalized.includes('closing') || normalized.includes('open time') || normalized.includes('close time')) {
        return { summary: 'Norvic Hospital outpatient hours are Sunday to Friday, 8:00 AM to 6:00 PM.', suggestions: ['Lab hours', 'Pharmacy hours', 'Book appointment'], recommendedDoctorId: null, action: 'answer_question' };
      }
      // Offline fallback: don't try to "recommend doctors" unless the backend AI is connected.
      return {
        summary: 'I can help once the AI assistant is connected. Tell me your symptom (and your age if you can), and I will suggest the right department and doctor.',
        suggestions: ['Try again', 'Hospital hours', 'Departments', 'Find a doctor'],
        recommendedDoctorId: null,
        action: 'answer_question',
      };
    }

    return apiRequest('/assistant', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
  };

  return (
    <ClinicContext.Provider
      value={{
        specialties,
        doctors,
        patients,
        appointments,
        notifications,
        prescriptions,
        queueEntries,
        reviews,
        payments,
        currentPatient,
        currentDoctor,
        backendConnected,
        markAllNotificationsRead,
        reloadClinic,
        fetchQueue,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        addReview,
        uploadPrescription,
        updatePrescription,
        updateQueueEntry,
        updateDoctorVerification,
        askAssistant,
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

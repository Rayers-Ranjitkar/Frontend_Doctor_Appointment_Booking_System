import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
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
} from '../../data/clinicData';
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
} from '../../data/clinicData';

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

  return (
    <ClinicContext.Provider value={{} as ClinicContextValue}>
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
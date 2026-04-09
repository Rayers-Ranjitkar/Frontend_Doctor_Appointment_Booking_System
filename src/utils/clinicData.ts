export type Specialty = {
  id: string;
  name: string;
  icon: string;
  color: string;
  doctorCount: number;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  specialtyId: string;
  hospital: string;
  experience: number;
  rating: number;
  reviews: number;
  image: string;
  price: number;
  about: string;
  education: string[];
  availableDays: string[];
  timeSlots: string[];
  status: 'active' | 'inactive';
  patients: number;
  licenseNumber: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  bloodGroup: string;
  joinedDate: string;
  address: string;
  appointments: number;
  allergies: string[];
  conditions: string[];
};

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'awaiting_payment' | 'paid' | 'failed';

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  reason: string;
  notes?: string;
  doctorImage: string;
  queueNumber: number;
  estimatedWaitMinutes: number;
  reminderStatus?: {
    sent24h: boolean;
    sent1h: boolean;
    lastSentAt?: string;
    lastSentMode?: 'smtp' | 'console-fallback';
  };
};

export type Notification = {
  id: string;
  message: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'info' | 'queue' | 'payment';
  time: string;
  read: boolean;
  recipientRole: 'patient' | 'doctor' | 'admin';
  recipientProfileId?: string | null;
};

export type Prescription = {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  title: string;
  fileName: string;
  fileUrl: string;
  notes: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalTiming: string;
  registrationNumber?: string;
  patientAge?: number;
  patientGender?: string;
  patientPhone?: string;
  patientAddress?: string;
  weightKg?: string;
  heightCm?: string;
  bmi?: string;
  bloodPressure?: string;
  chiefComplaints: string[];
  clinicalFindings: string[];
  diagnosis: string;
  medicines: Array<{
    id: string;
    name: string;
    dosage: string;
    duration: string;
    instructions?: string;
  }>;
  advice: string[];
  followUpDate?: string;
  documentHtml?: string;
  createdAt: string;
  updatedAt?: string;
};

export type QueueEntry = {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  position: number;
  estimatedWaitMinutes: number;
  actualWaitMinutes: number;
  status: 'waiting' | 'in_consultation' | 'completed';
};

export type Review = {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  amount: number;
  provider: 'khalti';
  status: 'paid' | 'failed';
  reference: string;
  paidAt: string;
};

export const specialties: Specialty[] = [
  { id: 'sp1', name: 'Cardiology', icon: '❤️', color: '#EF4444', doctorCount: 12 },
  { id: 'sp2', name: 'Neurology', icon: '🧠', color: '#8B5CF6', doctorCount: 8 },
  { id: 'sp3', name: 'Orthopedics', icon: '🦴', color: '#F59E0B', doctorCount: 10 },
  { id: 'sp4', name: 'Pediatrics', icon: '👶', color: '#10B981', doctorCount: 9 },
  { id: 'sp5', name: 'Dermatology', icon: '🩺', color: '#EC4899', doctorCount: 7 },
  { id: 'sp6', name: 'General Practice', icon: '🏥', color: '#3B82F6', doctorCount: 15 },
];

export const doctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. James Wilson',
    specialty: 'Cardiology',
    specialtyId: 'sp1',
    hospital: 'Norvic Hospital',
    experience: 15,
    rating: 4.9,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 800,
    about: 'Dr. James Wilson specializes in interventional cardiology, preventive screening, and long-term follow-up for heart disease patients.',
    education: ['MD - Johns Hopkins University', 'Residency - Mayo Clinic', 'Fellowship - Cleveland Clinic'],
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'],
    status: 'active',
    patients: 1240,
    licenseNumber: 'NMC-CARD-1001',
    verificationStatus: 'verified',
  },
  {
    id: 'd2',
    name: 'Dr. Sarah Chen',
    specialty: 'Neurology',
    specialtyId: 'sp2',
    hospital: 'Norvic Hospital',
    experience: 12,
    rating: 4.8,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1759350075317-0ef24bee0428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 950,
    about: 'Dr. Sarah Chen treats migraines, seizure disorders, dizziness, and chronic neurology follow-up cases.',
    education: ['MD - Stanford University', 'Residency - UCSF Medical Center', 'Fellowship - Mass General Hospital'],
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:00 PM', '01:30 PM', '02:00 PM'],
    status: 'active',
    patients: 890,
    licenseNumber: 'NMC-NEUR-2044',
    verificationStatus: 'pending',
  },
  {
    id: 'd3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    specialtyId: 'sp4',
    hospital: 'Norvic Hospital',
    experience: 9,
    rating: 4.9,
    reviews: 287,
    image: 'https://images.unsplash.com/photo-1753487050317-919a2b26a6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 700,
    about: 'Dr. Emily Rodriguez supports preventive child care, developmental milestones, and routine pediatric consultations.',
    education: ['MD - Columbia University', "Residency - Boston Children's Hospital"],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM'],
    status: 'active',
    patients: 780,
    licenseNumber: 'NMC-PED-3900',
    verificationStatus: 'verified',
  },
];

export const patients: Patient[] = [
  {
    id: 'p1',
    name: 'Alex Johnson',
    age: 34,
    gender: 'Male',
    email: 'alex.j@email.com',
    phone: '+977-9800000001',
    bloodGroup: 'O+',
    joinedDate: '2025-03-15',
    address: 'Baneshwor, Kathmandu',
    appointments: 8,
    allergies: ['Penicillin'],
    conditions: ['Mild hypertension'],
  },
  {
    id: 'p2',
    name: 'Maria Garcia',
    age: 28,
    gender: 'Female',
    email: 'maria.g@email.com',
    phone: '+977-9800000002',
    bloodGroup: 'A+',
    joinedDate: '2025-05-22',
    address: 'Lalitpur, Nepal',
    appointments: 3,
    allergies: [],
    conditions: [],
  },
];

export const appointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Alex Johnson',
    patientAge: 34,
    doctorId: 'd1',
    doctorName: 'Dr. James Wilson',
    specialty: 'Cardiology',
    hospital: 'Norvic Hospital',
    date: '2026-03-31',
    time: '10:00 AM',
    status: 'confirmed',
    paymentStatus: 'paid',
    reason: 'Regular cardiac checkup and ECG',
    doctorImage: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    queueNumber: 3,
    estimatedWaitMinutes: 18,
    reminderStatus: { sent24h: false, sent1h: false },
  },
  {
    id: 'a2',
    patientId: 'p1',
    patientName: 'Alex Johnson',
    patientAge: 34,
    doctorId: 'd2',
    doctorName: 'Dr. Sarah Chen',
    specialty: 'Neurology',
    hospital: 'Norvic Hospital',
    date: '2026-04-02',
    time: '09:30 AM',
    status: 'pending',
    paymentStatus: 'awaiting_payment',
    reason: 'Migraine consultation',
    doctorImage: 'https://images.unsplash.com/photo-1759350075317-0ef24bee0428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    queueNumber: 0,
    estimatedWaitMinutes: 0,
    reminderStatus: { sent24h: false, sent1h: false },
  },
  {
    id: 'a3',
    patientId: 'p2',
    patientName: 'Maria Garcia',
    patientAge: 28,
    doctorId: 'd3',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    hospital: 'Norvic Hospital',
    date: '2026-03-29',
    time: '11:00 AM',
    status: 'completed',
    paymentStatus: 'paid',
    reason: "Child's routine checkup",
    doctorImage: 'https://images.unsplash.com/photo-1753487050317-919a2b26a6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    notes: 'Advised routine follow-up in 3 months.',
    queueNumber: 0,
    estimatedWaitMinutes: 0,
    reminderStatus: { sent24h: true, sent1h: true, lastSentAt: '2026-03-29T10:00:00.000Z', lastSentMode: 'smtp' },
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    message: 'Your appointment with Dr. James Wilson is confirmed for March 31 at 10:00 AM.',
    type: 'confirmation',
    time: '2 hours ago',
    read: false,
    recipientRole: 'patient',
    recipientProfileId: 'p1',
  },
  {
    id: 'n2',
    message: 'Alex Johnson booked an appointment with you for March 31 at 10:00 AM.',
    type: 'confirmation',
    time: '45 minutes ago',
    read: false,
    recipientRole: 'doctor',
    recipientProfileId: 'd1',
  },
];

export const prescriptions: Prescription[] = [
  {
    id: 'rx1',
    appointmentId: 'a3',
    doctorId: 'd3',
    doctorName: 'Dr. Emily Rodriguez',
    patientId: 'p2',
    patientName: 'Maria Garcia',
    title: 'Routine Pediatric Prescription',
    fileName: 'prescription-rx1.pdf',
    fileUrl: '#',
    notes: 'Vitamin D supplement for 30 days.',
    hospitalName: 'Norvic Hospital',
    hospitalAddress: 'Putalisadak Main Road, Kathmandu',
    hospitalPhone: '+977-01-4567890',
    hospitalTiming: '09:00 AM - 06:00 PM',
    registrationNumber: 'NMC-PED-3900',
    patientAge: 28,
    patientGender: 'Female',
    patientPhone: '+977-9800000002',
    patientAddress: 'Lalitpur, Nepal',
    weightKg: '58',
    heightCm: '162',
    bmi: '22.1',
    bloodPressure: '110/70 mmHg',
    chiefComplaints: ['Routine wellness check', 'Mild fatigue for 3 days'],
    clinicalFindings: ['Vitals stable', 'No respiratory distress', 'General examination within normal range'],
    diagnosis: 'Routine follow-up with mild nutritional fatigue',
    medicines: [
      { id: 'm1', name: 'Vitamin D3 1000 IU', dosage: '1 Morning', duration: '30 Days', instructions: 'After breakfast' },
      { id: 'm2', name: 'Multivitamin Tablet', dosage: '1 Night', duration: '15 Days', instructions: 'After food' },
    ],
    advice: ['Take adequate rest', 'Increase fluids', 'Follow a balanced diet'],
    followUpDate: '2026-04-15',
    createdAt: '2026-03-29T09:30:00.000Z',
    updatedAt: '2026-03-29T09:45:00.000Z',
  },
];

export const queueEntries: QueueEntry[] = [
  {
    id: 'q1',
    appointmentId: 'a1',
    doctorId: 'd1',
    patientId: 'p1',
    patientName: 'Alex Johnson',
    position: 3,
    estimatedWaitMinutes: 18,
    actualWaitMinutes: 0,
    status: 'waiting',
  },
];

export const reviews: Review[] = [
  {
    id: 'r1',
    appointmentId: 'a3',
    doctorId: 'd3',
    patientId: 'p2',
    rating: 5,
    comment: 'Very patient and clear with follow-up steps.',
    createdAt: '2026-03-29T12:00:00.000Z',
  },
];

export const payments: Payment[] = [
  {
    id: 'pay1',
    appointmentId: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    amount: 800,
    provider: 'khalti',
    status: 'paid',
    reference: 'KHALTI-DEMO-10001',
    paidAt: '2026-03-28T10:30:00.000Z',
  },
];

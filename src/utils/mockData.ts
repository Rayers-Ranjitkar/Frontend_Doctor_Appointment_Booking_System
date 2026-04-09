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
  image?: string;
  address: string;
  appointments: number;
};

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
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  doctorImage: string;
  notes?: string;
};

export type Notification = {
  id: string;
  message: string;
  type: 'confirmation' | 'reminder' | 'cancellation' | 'info';
  time: string;
  read: boolean;
};

export const specialties: Specialty[] = [
  { id: 'sp1', name: 'Cardiology', icon: '❤️', color: '#EF4444', doctorCount: 12 },
  { id: 'sp2', name: 'Neurology', icon: '🧠', color: '#8B5CF6', doctorCount: 8 },
  { id: 'sp3', name: 'Orthopedics', icon: '🦴', color: '#F59E0B', doctorCount: 10 },
  { id: 'sp4', name: 'Pediatrics', icon: '👶', color: '#10B981', doctorCount: 9 },
  { id: 'sp5', name: 'Dermatology', icon: '🩺', color: '#EC4899', doctorCount: 7 },
  { id: 'sp6', name: 'General Practice', icon: '🏥', color: '#3B82F6', doctorCount: 15 },
  { id: 'sp7', name: 'Ophthalmology', icon: '👁️', color: '#06B6D4', doctorCount: 6 },
  { id: 'sp8', name: 'Psychiatry', icon: '🧘', color: '#6366F1', doctorCount: 5 },
];

export const doctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. James Wilson',
    specialty: 'Cardiology',
    specialtyId: 'sp1',
    hospital: 'Metro Heart Institute',
    experience: 15,
    rating: 4.9,
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 150,
    about: 'Dr. James Wilson is a highly experienced cardiologist specializing in interventional cardiology and heart failure management. He has treated thousands of patients with complex cardiac conditions.',
    education: ['MD – Johns Hopkins University', 'Residency – Mayo Clinic', 'Fellowship – Cleveland Clinic'],
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
    status: 'active',
    patients: 1240,
  },
  {
    id: 'd2',
    name: 'Dr. Sarah Chen',
    specialty: 'Neurology',
    specialtyId: 'sp2',
    hospital: 'City Neuro Center',
    experience: 12,
    rating: 4.8,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1759350075317-0ef24bee0428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 180,
    about: 'Dr. Sarah Chen is a renowned neurologist with extensive experience in treating migraines, epilepsy, and neurodegenerative disorders. She is known for her patient-centered approach.',
    education: ['MD – Stanford University', 'Residency – UCSF Medical Center', 'Fellowship – Mass General Hospital'],
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '01:00 PM', '01:30 PM', '02:00 PM', '03:00 PM'],
    status: 'active',
    patients: 890,
  },
  {
    id: 'd3',
    name: 'Dr. Michael Torres',
    specialty: 'Orthopedics',
    specialtyId: 'sp3',
    hospital: 'Regional Bone & Joint Hospital',
    experience: 18,
    rating: 4.7,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1758691463605-f4a3a92d6d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 160,
    about: 'Dr. Michael Torres specializes in joint replacement surgery, sports medicine, and trauma orthopedics. He has performed over 3,000 successful surgeries.',
    education: ['MD – Harvard Medical School', 'Residency – NYU Langone', 'Sports Medicine Fellowship – HSS'],
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    timeSlots: ['08:00 AM', '08:30 AM', '09:00 AM', '10:00 AM', '10:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM', '04:30 PM'],
    status: 'active',
    patients: 1560,
  },
  {
    id: 'd4',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    specialtyId: 'sp4',
    hospital: 'Children\'s Wellness Center',
    experience: 9,
    rating: 4.9,
    reviews: 287,
    image: 'https://images.unsplash.com/photo-1753487050317-919a2b26a6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 120,
    about: 'Dr. Emily Rodriguez is a compassionate pediatrician dedicated to providing comprehensive care for children from newborns to adolescents. She specializes in developmental disorders.',
    education: ['MD – Columbia University', 'Pediatric Residency – Boston Children\'s Hospital', 'Fellowship – Cincinnati Children\'s'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
    status: 'active',
    patients: 780,
  },
  {
    id: 'd5',
    name: 'Dr. David Kim',
    specialty: 'General Practice',
    specialtyId: 'sp6',
    hospital: 'Community Health Clinic',
    experience: 7,
    rating: 4.6,
    reviews: 183,
    image: 'https://images.unsplash.com/photo-1659353887977-c310d90c751a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 90,
    about: 'Dr. David Kim provides comprehensive primary care services, preventive medicine, and chronic disease management. He believes in building long-term relationships with patients.',
    education: ['MD – UCLA David Geffen School of Medicine', 'Family Medicine Residency – Kaiser Permanente'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'],
    status: 'active',
    patients: 1100,
  },
  {
    id: 'd6',
    name: 'Dr. Amara Johnson',
    specialty: 'Dermatology',
    specialtyId: 'sp5',
    hospital: 'Skin & Wellness Clinic',
    experience: 11,
    rating: 4.8,
    reviews: 321,
    image: 'https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    price: 140,
    about: 'Dr. Amara Johnson is a board-certified dermatologist specializing in medical, surgical, and cosmetic dermatology. She is an expert in skin cancer detection and treatment.',
    education: ['MD – Yale School of Medicine', 'Dermatology Residency – UCSF', 'Mohs Surgery Fellowship – MSK'],
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
    status: 'active',
    patients: 920,
  },
];

export const patients: Patient[] = [
  { id: 'p1', name: 'Alex Johnson', age: 34, gender: 'Male', email: 'alex.j@email.com', phone: '+1 (555) 234-5678', bloodGroup: 'O+', joinedDate: '2024-03-15', address: '123 Maple St, New York, NY', appointments: 8 },
  { id: 'p2', name: 'Maria Garcia', age: 28, gender: 'Female', email: 'maria.g@email.com', phone: '+1 (555) 345-6789', bloodGroup: 'A+', joinedDate: '2024-05-22', address: '456 Oak Ave, Los Angeles, CA', appointments: 3 },
  { id: 'p3', name: 'Robert Chen', age: 52, gender: 'Male', email: 'robert.c@email.com', phone: '+1 (555) 456-7890', bloodGroup: 'B-', joinedDate: '2023-11-08', address: '789 Pine Rd, Chicago, IL', appointments: 14 },
  { id: 'p4', name: 'Jennifer Williams', age: 41, gender: 'Female', email: 'jen.w@email.com', phone: '+1 (555) 567-8901', bloodGroup: 'AB+', joinedDate: '2024-01-30', address: '321 Elm St, Houston, TX', appointments: 6 },
  { id: 'p5', name: 'Michael Brown', age: 67, gender: 'Male', email: 'mike.b@email.com', phone: '+1 (555) 678-9012', bloodGroup: 'O-', joinedDate: '2023-08-14', address: '654 Cedar Ln, Phoenix, AZ', appointments: 22 },
  { id: 'p6', name: 'Lisa Anderson', age: 23, gender: 'Female', email: 'lisa.a@email.com', phone: '+1 (555) 789-0123', bloodGroup: 'A-', joinedDate: '2025-01-05', address: '987 Birch Blvd, Philadelphia, PA', appointments: 2 },
  { id: 'p7', name: 'David Martinez', age: 38, gender: 'Male', email: 'david.m@email.com', phone: '+1 (555) 890-1234', bloodGroup: 'B+', joinedDate: '2024-07-19', address: '147 Walnut Dr, San Antonio, TX', appointments: 5 },
  { id: 'p8', name: 'Sarah Thompson', age: 45, gender: 'Female', email: 'sarah.t@email.com', phone: '+1 (555) 901-2345', bloodGroup: 'O+', joinedDate: '2023-12-01', address: '258 Spruce Way, Dallas, TX', appointments: 11 },
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
    hospital: 'Metro Heart Institute',
    date: '2026-03-20',
    time: '10:00 AM',
    status: 'confirmed',
    reason: 'Regular cardiac checkup and ECG',
    doctorImage: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a2',
    patientId: 'p1',
    patientName: 'Alex Johnson',
    patientAge: 34,
    doctorId: 'd5',
    doctorName: 'Dr. David Kim',
    specialty: 'General Practice',
    hospital: 'Community Health Clinic',
    date: '2026-03-25',
    time: '09:00 AM',
    status: 'pending',
    reason: 'Annual health checkup',
    doctorImage: 'https://images.unsplash.com/photo-1659353887977-c310d90c751a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a3',
    patientId: 'p1',
    patientName: 'Alex Johnson',
    patientAge: 34,
    doctorId: 'd2',
    doctorName: 'Dr. Sarah Chen',
    specialty: 'Neurology',
    hospital: 'City Neuro Center',
    date: '2026-02-14',
    time: '11:00 AM',
    status: 'completed',
    reason: 'Migraine consultation',
    doctorImage: 'https://images.unsplash.com/photo-1759350075317-0ef24bee0428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    notes: 'Prescribed topiramate 50mg. Follow up in 6 weeks.',
  },
  {
    id: 'a4',
    patientId: 'p1',
    patientName: 'Alex Johnson',
    patientAge: 34,
    doctorId: 'd6',
    doctorName: 'Dr. Amara Johnson',
    specialty: 'Dermatology',
    hospital: 'Skin & Wellness Clinic',
    date: '2026-01-30',
    time: '02:00 PM',
    status: 'cancelled',
    reason: 'Skin rash evaluation',
    doctorImage: 'https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a5',
    patientId: 'p2',
    patientName: 'Maria Garcia',
    patientAge: 28,
    doctorId: 'd4',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrics',
    hospital: "Children's Wellness Center",
    date: '2026-03-18',
    time: '10:30 AM',
    status: 'confirmed',
    reason: "Child's routine checkup",
    doctorImage: 'https://images.unsplash.com/photo-1753487050317-919a2b26a6ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a6',
    patientId: 'p3',
    patientName: 'Robert Chen',
    patientAge: 52,
    doctorId: 'd1',
    doctorName: 'Dr. James Wilson',
    specialty: 'Cardiology',
    hospital: 'Metro Heart Institute',
    date: '2026-03-17',
    time: '09:30 AM',
    status: 'confirmed',
    reason: 'Post-surgery follow-up',
    doctorImage: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a7',
    patientId: 'p4',
    patientName: 'Jennifer Williams',
    patientAge: 41,
    doctorId: 'd3',
    doctorName: 'Dr. Michael Torres',
    specialty: 'Orthopedics',
    hospital: 'Regional Bone & Joint Hospital',
    date: '2026-03-19',
    time: '02:30 PM',
    status: 'pending',
    reason: 'Knee pain evaluation',
    doctorImage: 'https://images.unsplash.com/photo-1758691463605-f4a3a92d6d37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a8',
    patientId: 'p5',
    patientName: 'Michael Brown',
    patientAge: 67,
    doctorId: 'd1',
    doctorName: 'Dr. James Wilson',
    specialty: 'Cardiology',
    hospital: 'Metro Heart Institute',
    date: '2026-03-17',
    time: '11:00 AM',
    status: 'confirmed',
    reason: 'Blood pressure management',
    doctorImage: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a9',
    patientId: 'p6',
    patientName: 'Lisa Anderson',
    patientAge: 23,
    doctorId: 'd6',
    doctorName: 'Dr. Amara Johnson',
    specialty: 'Dermatology',
    hospital: 'Skin & Wellness Clinic',
    date: '2026-03-22',
    time: '10:00 AM',
    status: 'pending',
    reason: 'Acne treatment consultation',
    doctorImage: 'https://images.unsplash.com/photo-1678695972687-033fa0bdbac9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 'a10',
    patientId: 'p7',
    patientName: 'David Martinez',
    patientAge: 38,
    doctorId: 'd2',
    doctorName: 'Dr. Sarah Chen',
    specialty: 'Neurology',
    hospital: 'City Neuro Center',
    date: '2026-03-24',
    time: '09:00 AM',
    status: 'confirmed',
    reason: 'Epilepsy medication review',
    doctorImage: 'https://images.unsplash.com/photo-1759350075317-0ef24bee0428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
];

export const notifications: Notification[] = [
  { id: 'n1', message: 'Your appointment with Dr. James Wilson is confirmed for March 20 at 10:00 AM', type: 'confirmation', time: '2 hours ago', read: false },
  { id: 'n2', message: 'Reminder: Appointment with Dr. David Kim tomorrow at 9:00 AM', type: 'reminder', time: '5 hours ago', read: false },
  { id: 'n3', message: 'Your appointment with Dr. Amara Johnson has been cancelled', type: 'cancellation', time: '2 days ago', read: true },
  { id: 'n4', message: 'New time slots available with Dr. Sarah Chen', type: 'info', time: '3 days ago', read: true },
];

export const adminStats = {
  totalDoctors: 72,
  totalPatients: 3842,
  totalAppointments: 14567,
  todayAppointments: 48,
  pendingRequests: 23,
  completedToday: 31,
  cancelledToday: 5,
  revenue: 124500,
};

export const chartData = [
  { month: 'Oct', appointments: 240, completed: 210, cancelled: 30 },
  { month: 'Nov', appointments: 300, completed: 265, cancelled: 35 },
  { month: 'Dec', appointments: 280, completed: 245, cancelled: 35 },
  { month: 'Jan', appointments: 320, completed: 280, cancelled: 40 },
  { month: 'Feb', appointments: 290, completed: 255, cancelled: 35 },
  { month: 'Mar', appointments: 360, completed: 310, cancelled: 50 },
];

export const specialtyDistribution = [
  { name: 'Cardiology', value: 28, color: '#EF4444' },
  { name: 'Neurology', value: 18, color: '#8B5CF6' },
  { name: 'Orthopedics', value: 22, color: '#F59E0B' },
  { name: 'Pediatrics', value: 16, color: '#10B981' },
  { name: 'Dermatology', value: 12, color: '#EC4899' },
  { name: 'General', value: 24, color: '#3B82F6' },
];

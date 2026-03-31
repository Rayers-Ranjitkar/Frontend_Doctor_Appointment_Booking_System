export type Specialty = {
  id: string;
  name: string;
  icon: string;
  color: string;
  doctorCount: number;
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

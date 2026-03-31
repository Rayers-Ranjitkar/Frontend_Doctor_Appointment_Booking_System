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

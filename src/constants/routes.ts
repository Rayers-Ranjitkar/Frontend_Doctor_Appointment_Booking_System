export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ROLE_SELECT: '/role',
  REGISTER: '/register',

  // Patient
  PATIENT_DASHBOARD: '/dashboard',
  BOOK_APPOINTMENT: '/appointments/book',
  MY_APPOINTMENTS: '/appointments',

  // Doctor
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_SCHEDULE: '/doctor/schedule',
  DOCTOR_PATIENTS: '/doctor/patients',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  MANAGE_DOCTORS: '/admin/doctors',
  MANAGE_PATIENTS: '/admin/patients',
} as const;

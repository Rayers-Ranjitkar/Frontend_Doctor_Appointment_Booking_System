import { Outlet } from 'react-router';
import { Bot, CalendarDays, LayoutDashboard, Pill, Search, TimerReset, User } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';


export default function PatientLayout() {
  
  const navItems = [
    { path: '/patient', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/patient/search', label: 'Find Doctors', icon: Search },
    { path: '/patient/appointments', label: 'My Appointments', icon: CalendarDays },
    { path: '/patient/queue', label: 'Queue Tracker', icon: TimerReset },
    { path: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
    { path: '/patient/assistant', label: 'AI Assistant', icon: Bot },
    { path: '/patient/profile', label: 'My Profile', icon: User },
  ];

  return (
    <AppSidebar
      navItems={navItems}
      role="patient"
      userName={"Alex"}
      userSubtitle={`Patient ID: 12345`}
    >
      <Outlet />
    </AppSidebar>
  );
}



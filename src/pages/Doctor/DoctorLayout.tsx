
import { Outlet } from 'react-router';
import { CalendarDays, Clock, LayoutDashboard, Pill, TimerReset, UserCircle } from 'lucide-react';
import AppSidebar from '../../components/AppSidebar';
import { useClinic } from '../../context/ClinicContext';

export default function DoctorLayout() {
  const { currentDoctor } = useClinic();
  const navItems = [
    { path: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/doctor/appointments', label: 'Appointments', icon: CalendarDays },
    { path: '/doctor/queue', label: 'Queue Manager', icon: TimerReset },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
    { path: '/doctor/schedule', label: 'My Schedule', icon: Clock },
    { path: '/doctor/profile', label: 'My Profile', icon: UserCircle },
  ];
  return (
    <AppSidebar
      navItems={navItems}
      role="doctor"
      userName={currentDoctor.name}
      userImage={currentDoctor.image}
      userSubtitle={currentDoctor.specialty}
    >
      <Outlet />
    </AppSidebar>
  );
}


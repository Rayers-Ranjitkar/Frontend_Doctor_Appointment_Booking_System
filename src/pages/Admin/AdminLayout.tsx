import { Outlet } from 'react-router';
import { CalendarDays, LayoutDashboard, ShieldCheck, Stethoscope, Tag, Users } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/constants/AuthContext';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { path: '/admin/doctors', label: 'Manage Doctors', icon: Stethoscope },
  { path: '/admin/patients', label: 'Manage Patients', icon: Users },
  { path: '/admin/specialties', label: 'Specialties', icon: Tag },
  { path: '/admin/verification', label: 'Verification', icon: ShieldCheck },
];

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <AppSidebar
      navItems={navItems}
      role="admin"
      userName={user?.name || 'Admin User'}
      userSubtitle={user?.email || 'System Administrator'}
    >
      <Outlet />
    </AppSidebar>
  );
}

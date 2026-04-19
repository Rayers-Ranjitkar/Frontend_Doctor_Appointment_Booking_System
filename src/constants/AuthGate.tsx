import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/constants/AuthContext';

export function RequireAuth({ roles }: { roles: Array<'patient' | 'doctor' | 'admin'> }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !roles.includes(user.role)) {
    const fallback = user?.role ? `/${user.role}` : '/login';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading session...</div>;
  }

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
}

export function RequirePatientAuth() {
  return <RequireAuth roles={['patient']} />;
}
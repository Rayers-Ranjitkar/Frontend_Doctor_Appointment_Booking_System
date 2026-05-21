import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_TOKEN_KEY, apiRequest } from '@/utils/api';

export type AuthUser = {
  id: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  username: string;
  email: string;
  phone: string;
  profileId: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: { role: AuthUser['role']; identifier: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  signupPatient: (payload: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    age: string;
    gender: string;
    address: string;
    bloodGroup: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  createAdmin: (payload: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  createDoctor: (payload: {
    name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    specialty: string;
    specialtyId?: string;
    experience: string;
    price: string;
    licenseNumber: string;
    about: string;
    education: string;
    image?: string;
    availableDays: string[];
    timeSlots: string[];
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  changePassword: (payload: { currentPassword: string; newPassword: string }) => Promise<{ ok: boolean; error?: string }>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function setToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const result = await apiRequest<{ user: AuthUser }>('/auth/me');
      setUser(result.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const login: AuthContextValue['login'] = async (payload) => {
    try {
      const result = await apiRequest<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setToken(result.token);
      setUser(result.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to sign in.' };
    }
  };

  const signupPatient: AuthContextValue['signupPatient'] = async (payload) => {
    try {
      const result = await apiRequest<{ token: string; user: AuthUser }>('/auth/signup/patient', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setToken(result.token);
      setUser(result.user);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to create account.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const createAdmin: AuthContextValue['createAdmin'] = async (payload) => {
    try {
      await apiRequest('/auth/create/admin', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to create admin account.' };
    }
  };

  const createDoctor: AuthContextValue['createDoctor'] = async (payload) => {
    try {
      await apiRequest('/auth/create/doctor', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to create doctor account.' };
    }
  };

  const changePassword: AuthContextValue['changePassword'] = async (payload) => {
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Unable to change password.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        signupPatient,
        createAdmin,
        createDoctor,
        logout,
        changePassword,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

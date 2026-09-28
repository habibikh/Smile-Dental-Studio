'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { PatientProfile } from '@/types/dental';

export interface AuthUser extends PatientProfile {
  password?: string;
}

interface AuthContextType {
  user: PatientProfile | null;
  isLoading: boolean;
  login: (email: string, passwordOrName?: string, phone?: string, role?: 'patient' | 'clinic_admin' | 'app_admin', clinicId?: string) => Promise<{ success: boolean; user?: PatientProfile; error?: string }>;
  register: (
    fullName: string,
    email: string,
    phone: string,
    password?: string,
    extra?: { role?: 'patient' | 'clinic_admin' | 'doctor'; specialization?: string; clinicId?: string }
  ) => Promise<{ success: boolean; user?: PatientProfile; error?: string }>;
  logout: () => void;
  updateProfile: (profile: Partial<PatientProfile>) => void;
  switchRole: (role: 'patient' | 'clinic_admin' | 'app_admin', clinicId?: string) => void;
  isAuthenticated: boolean;
  isPatient: boolean;
  isClinicAdmin: boolean;
  isAppAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'smile_dental_user';

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

let cachedUserRaw: string | null = null;
let cachedUserObj: PatientProfile | null = null;

function getSnapshot(): PatientProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      cachedUserRaw = null;
      cachedUserObj = null;
      return null;
    }
    if (raw === cachedUserRaw && cachedUserObj) {
      return cachedUserObj;
    }
    cachedUserRaw = raw;
    cachedUserObj = JSON.parse(raw);
    return cachedUserObj;
  } catch {
    return null;
  }
}

function getServerSnapshot(): PatientProfile | null {
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Unified Authentication Login
   * Checks real credentials against /api/auth/login with client-side fallback
   */
  const login = async (
    email: string,
    passwordOrName?: string,
    phone?: string,
    role?: 'patient' | 'clinic_admin' | 'app_admin',
    clinicId?: string
  ): Promise<{ success: boolean; user?: PatientProfile; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (passwordOrName || '').trim();

    try {
      // 1. Try server-side authentication
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        const authedUser: PatientProfile = data.user;
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authedUser));
        }
        cachedUserRaw = JSON.stringify(authedUser);
        cachedUserObj = authedUser;
        emitChange();
        return { success: true, user: authedUser };
      }

      // If server returned specific error message, report it
      if (data.error && res.status === 401) {
        return { success: false, error: data.error };
      }

      // 2. Client-side fallback if server route unavailable
      let fallbackProfile: PatientProfile;

      if (cleanEmail === 'admin@smiledental.com' && cleanPassword === 'smile1234') {
        fallbackProfile = {
          id: 'adm-primary-1',
          fullName: 'System Administrator',
          email: 'admin@smiledental.com',
          phone: '(555) 234-5000',
          role: 'app_admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (cleanEmail === 'doctor@smiledental.com' && cleanPassword === 'smile1234') {
        fallbackProfile = {
          id: 'clinic-adm-doctor-1',
          fullName: 'Dr. Elena Rostova (Clinic Admin)',
          email: 'doctor@smiledental.com',
          phone: '(555) 234-1100',
          role: 'clinic_admin',
          clinicId: 'branch-downtown',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (role) {
        fallbackProfile = {
          id: `pat-${Date.now()}`,
          fullName: passwordOrName || cleanEmail.split('@')[0],
          email: cleanEmail,
          phone: phone || '(555) 000-0000',
          role,
          clinicId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          error: data.error || 'Invalid email or password. Please verify your credentials or create an account.',
        };
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackProfile));
      }
      cachedUserRaw = JSON.stringify(fallbackProfile);
      cachedUserObj = fallbackProfile;
      emitChange();
      return { success: true, user: fallbackProfile };
    } catch (err: unknown) {
      console.warn('Network error during login, attempting local validation:', err);
      // Local fallback for requested credentials
      if (cleanEmail === 'admin@smiledental.com' && cleanPassword === 'smile1234') {
        const adminUser: PatientProfile = {
          id: 'adm-primary-1',
          fullName: 'System Administrator',
          email: 'admin@smiledental.com',
          phone: '(555) 234-5000',
          role: 'app_admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
        cachedUserRaw = JSON.stringify(adminUser);
        cachedUserObj = adminUser;
        emitChange();
        return { success: true, user: adminUser };
      }
      if (cleanEmail === 'doctor@smiledental.com' && cleanPassword === 'smile1234') {
        const clinicAdminUser: PatientProfile = {
          id: 'clinic-adm-doctor-1',
          fullName: 'Dr. Elena Rostova (Clinic Admin)',
          email: 'doctor@smiledental.com',
          phone: '(555) 234-1100',
          role: 'clinic_admin',
          clinicId: 'branch-downtown',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(clinicAdminUser));
        cachedUserRaw = JSON.stringify(clinicAdminUser);
        cachedUserObj = clinicAdminUser;
        emitChange();
        return { success: true, user: clinicAdminUser };
      }
      return { success: false, error: 'Could not connect to authentication service. Please check your network.' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * General User Account Creation
   * Simple registration creating a patient role account
   */
  const register = async (
    fullName: string,
    email: string,
    phone: string,
    password?: string,
    extra?: { role?: 'patient' | 'clinic_admin' | 'doctor'; specialization?: string; clinicId?: string }
  ): Promise<{ success: boolean; user?: PatientProfile; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, password, ...extra }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to create account.' };
      }

      const createdUser: PatientProfile = data.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(createdUser));
      }
      cachedUserRaw = JSON.stringify(createdUser);
      cachedUserObj = createdUser;
      emitChange();
      return { success: true, user: createdUser };
    } catch {
      // Local fallback account creation
      const role = extra?.role === 'doctor' || extra?.role === 'clinic_admin' ? 'clinic_admin' : 'patient';
      const localUser: PatientProfile = {
        id: role === 'clinic_admin' ? `dr-${Date.now()}` : `pat-${Date.now()}`,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '(555) 000-0000',
        role,
        clinicId: extra?.clinicId || 'branch-downtown',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(localUser));
      }
      cachedUserRaw = JSON.stringify(localUser);
      cachedUserObj = localUser;
      emitChange();
      return { success: true, user: localUser };
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = (role: 'patient' | 'clinic_admin' | 'app_admin', clinicId?: string) => {
    if (!user) return;
    const updatedProfile: PatientProfile = {
      ...user,
      role,
      clinicId: role === 'clinic_admin' ? (clinicId || user.clinicId || 'branch-downtown') : undefined,
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedProfile));
    }
    cachedUserRaw = JSON.stringify(updatedProfile);
    cachedUserObj = updatedProfile;
    emitChange();
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    cachedUserRaw = null;
    cachedUserObj = null;
    emitChange();
  };

  const updateProfile = (updated: Partial<PatientProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated, updatedAt: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newProfile));
    }
    cachedUserRaw = JSON.stringify(newProfile);
    cachedUserObj = newProfile;
    emitChange();
  };

  const isPatient = !user || !user.role || user.role === 'patient';
  const isClinicAdmin = user?.role === 'clinic_admin';
  const isAppAdmin = user?.role === 'app_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        switchRole,
        isAuthenticated: !!user,
        isPatient,
        isClinicAdmin,
        isAppAdmin,
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

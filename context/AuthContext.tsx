'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';
import { PatientProfile } from '@/types/dental';

interface AuthContextType {
  user: PatientProfile | null;
  isLoading: boolean;
  login: (email: string, name?: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<PatientProfile>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_PATIENT: PatientProfile = {
  id: 'pat-demo-user',
  fullName: 'Alex Morgan',
  email: 'patient@example.com',
  phone: '(555) 890-1234',
  dateOfBirth: '1992-05-14',
  gender: 'Prefer not to say',
  address: '428 River Oaks Blvd, Metro City',
  dentalInsurance: 'Delta Dental Premier (ID #8492019)',
  medicalNotes: 'Mild sensitivity to cold drinks on lower right quadrant.',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

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
  if (typeof window === 'undefined') return DEMO_PATIENT;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return DEMO_PATIENT;
    }
    if (raw === cachedUserRaw && cachedUserObj) {
      return cachedUserObj;
    }
    cachedUserRaw = raw;
    cachedUserObj = JSON.parse(raw);
    return cachedUserObj;
  } catch {
    return DEMO_PATIENT;
  }
}

function getServerSnapshot(): PatientProfile | null {
  return DEMO_PATIENT;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, name?: string, phone?: string) => {
    setIsLoading(true);
    try {
      const profile: PatientProfile = {
        id: `pat-${Date.now()}`,
        fullName: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
        email: email.toLowerCase(),
        phone: phone || '(555) 000-0000',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      }
      cachedUserRaw = JSON.stringify(profile);
      cachedUserObj = profile;
      emitChange();
    } finally {
      setIsLoading(false);
    }
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
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


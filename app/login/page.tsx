'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmileAssistant from '@/components/ai/SmileAssistant';
import { useAuth } from '@/context/AuthContext';
import { Smile, Mail, Lock, User, Phone, ArrowRight, AlertCircle, CheckCircle2, Stethoscope, Building2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register, logout, isAppAdmin, isClinicAdmin } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [registerRole, setRegisterRole] = useState<'patient' | 'doctor'>('patient');
  const [specialization, setSpecialization] = useState('Cosmetic & Aesthetic Dentistry');
  const [doctorClinicId, setDoctorClinicId] = useState('branch-downtown');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success && result.user) {
        if (result.user.role === 'app_admin' || result.user.role === 'clinic_admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your email and password.');
      }
    } catch {
      setErrorMessage('Unable to complete sign-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await register(name, email, phone, password, {
        role: registerRole,
        specialization: registerRole === 'doctor' ? specialization : undefined,
        clinicId: registerRole === 'doctor' ? doctorClinicId : undefined,
      });
      if (result.success && result.user) {
        if (result.user.role === 'app_admin' || result.user.role === 'clinic_admin') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMessage(result.error || 'Failed to create account. Please try again.');
      }
    } catch {
      setErrorMessage('Unable to register at this time. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 relative overflow-hidden flex items-center justify-center">
        {/* Soft background decor */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md mx-4 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Smile className="w-6 h-6 text-teal-700" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {user
                ? 'Welcome Back!'
                : isRegister
                ? 'Create Patient Account'
                : 'Sign In to Your Account'}
            </h1>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {user
                ? `Signed in as ${user.fullName} (${user.email})`
                : isRegister
                ? 'Sign up in seconds to book appointments, review treatment roadmaps, and view dental scans.'
                : 'Access your dental appointments, treatment records, and clinical care plan.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Current Role:</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {user.role === 'app_admin'
                      ? 'Application Super Admin'
                      : user.role === 'clinic_admin'
                      ? 'Clinic Administrator'
                      : 'Registered Patient'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Account Email:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">{user.email}</span>
                </div>
              </div>

              {isAppAdmin || isClinicAdmin ? (
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to Administrative Panel</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              ) : (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Go to My Visits Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </button>
              )}

              <button
                onClick={logout}
                className="w-full py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : isRegister ? (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Account Type Toggle */}
              <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setRegisterRole('patient')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    registerRole === 'patient'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Patient Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('doctor')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    registerRole === 'doctor'
                      ? 'bg-teal-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Doctor Account</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {registerRole === 'doctor' ? 'Doctor Full Name' : 'Full Legal Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={registerRole === 'doctor' ? 'Dr. Maya Lin' : 'Alex Morgan'}
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {registerRole === 'doctor' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Clinical Specialization
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                    >
                      <option value="Cosmetic & Aesthetic Dentistry">Cosmetic & Aesthetic Dentistry</option>
                      <option value="Orthodontics & Clear Aligners">Orthodontics & Clear Aligners</option>
                      <option value="Implantology & Oral Reconstruction">Implantology & Oral Reconstruction</option>
                      <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                      <option value="General & Preventive Dentistry">General & Preventive Dentistry</option>
                      <option value="Endodontics (Root Canal Therapy)">Endodontics (Root Canal Therapy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Assigned Clinic Studio
                    </label>
                    <select
                      value={doctorClinicId}
                      onChange={(e) => setDoctorClinicId(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                    >
                      <option value="branch-downtown">Downtown Metro Studio (Main Clinic)</option>
                      <option value="branch-westside">Westside Modern Center</option>
                      <option value="branch-uptown">Uptown Dental Care & Pediatric</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.com"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 234-5678"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMessage(null);
                  }}
                  className="text-xs text-teal-700 hover:text-teal-800 font-medium underline cursor-pointer"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          ) : (
            /* Simple Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMessage(null);
                  }}
                  className="text-xs text-teal-700 hover:text-teal-800 font-medium underline cursor-pointer"
                >
                  Don&apos;t have an account? Create one
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
      <SmileAssistant />
    </div>
  );
}

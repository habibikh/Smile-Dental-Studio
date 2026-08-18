'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmileAssistant from '@/components/ai/SmileAssistant';
import { useAuth } from '@/context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Smile,
  ArrowRight,
  RefreshCw,
  Search,
  Plus
} from 'lucide-react';
import { Appointment } from '@/types/dental';

export default function DashboardPage() {
  const { user } = useAuth();
  const [emailInput, setEmailInput] = useState(() => user?.email || 'patient@example.com');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const fetchAppointments = async (email: string) => {
    if (!email) return;
    setIsLoading(true);
    setActionMessage('');
    try {
      const res = await fetch(`/api/appointments?patientEmail=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const targetEmail = user?.email || 'patient@example.com';

    async function loadData() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/appointments?patientEmail=${encodeURIComponent(targetEmail)}`);
        const data = await res.json();
        if (active && data.appointments) {
          setAppointments(data.appointments);
        }
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [user?.email]);

  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this dental appointment?')) return;
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('Appointment cancelled successfully.');
        fetchAppointments(emailInput);
      }
    } catch (err) {
      alert('Failed to cancel appointment.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                My Dental Appointments
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                View, manage, and reschedule your upcoming clinic visits across all branches.
              </p>
            </div>

            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer w-fit"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Book New Appointment</span>
            </Link>
          </div>

          {/* Email Search Bar */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter patient email address..."
                className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 transition-all"
              />
            </div>
            <button
              onClick={() => fetchAppointments(emailInput)}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Lookup Appointments</span>
            </button>
          </div>

          {actionMessage && (
            <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium">
              {actionMessage}
            </div>
          )}

          {/* Appointments List */}
          {isLoading ? (
            <div className="py-20 text-center text-slate-500 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-700" />
              <p className="text-sm">Fetching appointments from database...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-xs">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No active appointments found</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                We couldn&apos;t find any booked visits for {emailInput}. If you recently booked, make sure the email matches or schedule a new appointment below.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs"
              >
                <span>Book First Visit</span>
                <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appointments.map((appt) => {
                const isCancelled = appt.status === 'cancelled';
                return (
                  <div
                    key={appt.id}
                    className={`p-6 rounded-3xl border transition-all ${
                      isCancelled
                        ? 'bg-slate-100 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 shadow-xs hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                        {appt.appointmentCode}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isCancelled
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1">{appt.serviceName}</h3>
                    <p className="text-xs text-teal-700 font-medium mb-4">{appt.doctorName}</p>

                    <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{appt.appointmentDate} at {appt.startTime} – {appt.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{appt.branchName} ({appt.branchAddress})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>Patient: {appt.patientName} ({appt.patientPhone})</span>
                      </div>
                    </div>

                    {!isCancelled && (
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/book?branchId=${appt.branchId}&doctorId=${appt.doctorId}&serviceId=${appt.serviceId}`}
                          className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 text-center transition-all"
                        >
                          Reschedule
                        </Link>
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <SmileAssistant />
    </div>
  );
}

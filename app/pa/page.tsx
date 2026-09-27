'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  FileText,
  Shield,
  Stethoscope,
  Building2,
  RefreshCw,
  Edit3,
  CalendarCheck,
  Check
} from 'lucide-react';
import { Appointment, Doctor, PersonalAssistant } from '@/types/dental';

function PersonalAssistantContent() {
  const searchParams = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [personalAssistants, setPersonalAssistants] = useState<PersonalAssistant[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [reminderSentId, setReminderSentId] = useState<string | null>(null);

  // Selected Doctor & PA derived
  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0] || null;
  const currentPA = personalAssistants.find((pa) => pa.doctorId === selectedDoctor?.id) || null;

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [docsRes, pasRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/doctors/pa'),
        ]);

        const docsData = await docsRes.json();
        const pasData = await pasRes.json();

        const docsList = docsData.doctors || [];
        setDoctors(docsList);
        setPersonalAssistants(pasData.personalAssistants || []);

        if (docsList.length > 0) {
          const targetId = initialDoctorId && docsList.some((d: Doctor) => d.id === initialDoctorId)
            ? initialDoctorId
            : docsList[0].id;
          setSelectedDoctorId(targetId);
        }
      } catch (err) {
        console.error('Error loading PA portal data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialDoctorId]);

  useEffect(() => {
    let isMounted = true;
    if (!selectedDoctorId) return;

    async function loadDoctorAppointments() {
      try {
        const res = await fetch(`/api/doctors/appointments?doctorId=${selectedDoctorId}`);
        const data = await res.json();
        if (isMounted) {
          setAppointments(data.appointments || []);
        }
      } catch (err) {
        console.error('Error loading appointments:', err);
      }
    }

    loadDoctorAppointments();

    return () => {
      isMounted = false;
    };
  }, [selectedDoctorId]);

  const handleUpdateStatus = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update appointment.');

      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: status as any, notes: notes || a.notes } : a))
      );

      showNotification('success', `Appointment marked as ${status.toUpperCase()} by Personal Assistant.`);
    } catch (err: any) {
      showNotification('error', err.message || 'Error updating appointment');
    }
  };

  const handleSendReminder = (apt: Appointment) => {
    setReminderSentId(apt.id);
    showNotification('success', `Automated SMS & Email visit reminder dispatched to ${apt.patientName} (${apt.patientPhone}).`);
    setTimeout(() => setReminderSentId(null), 3000);
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.appointmentCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${
              notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Banner & Doctor Switcher */}
      <div className="bg-white border-b border-slate-200 sticky top-18 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assisting Doctor:
              </span>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-teal-600 cursor-pointer shadow-2xs"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialization}
                  </option>
                ))}
              </select>
            </div>

            {currentPA ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
                <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                Active PA: {currentPA.name} ({currentPA.title})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                No PA Assigned Yet
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/doctor?id=${selectedDoctorId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs"
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Doctor Clinical View</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Policy & PA Scope Card */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 shadow-md border border-teal-800/40">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-400/20 text-teal-200 border border-teal-400/30">
                    Clinical PA Desk
                  </span>
                  <span className="text-xs text-teal-200/80">Strict 1 PA per Doctor Policy</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mt-1">
                  Personal Assistant Dashboard: {selectedDoctor?.name}
                </h1>
                <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-2xl">
                  Manage patient arrivals, confirm upcoming appointments, take triage notes, and dispatch reminders on behalf of {selectedDoctor?.name}.
                </p>
              </div>
            </div>

            {currentPA && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs space-y-1 sm:text-right shrink-0">
                <span className="text-teal-200 block text-[10px] uppercase font-bold">Designated PA</span>
                <span className="font-bold text-white block">{currentPA.name}</span>
                <span className="text-teal-100 block text-[11px]">{currentPA.email}</span>
                <span className="text-teal-200 block text-[11px]">{currentPA.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search patient, code, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Assigned Patient Appointment Queue ({filteredAppointments.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 mt-2">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Appointments Match Filter</h3>
              <p className="text-xs text-slate-500">There are no patient visits matching your current selection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  {/* Left: Patient & Treatment Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        {apt.appointmentCode}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{apt.patientName}</h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.appointmentDate} at <strong>{apt.startTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.patientPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{apt.patientEmail}</span>
                      </div>
                    </div>

                    {apt.notes && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <strong className="text-slate-900">Notes:</strong> {apt.notes}
                      </div>
                    )}
                  </div>

                  {/* Right: Personal Assistant Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleSendReminder(apt)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {reminderSentId === apt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Reminder Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-slate-500" />
                          <span>Send Reminder</span>
                        </>
                      )}
                    </button>

                    {apt.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Patient</span>
                      </button>
                    )}

                    {apt.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(apt.id, 'completed')}
                        className="px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Check-In / Complete</span>
                      </button>
                    )}

                    {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => {
                          const reason = prompt('Please enter cancellation / reschedule reason:');
                          if (reason !== null) {
                            handleUpdateStatus(apt.id, 'cancelled', `PA Cancelled: ${reason}`);
                          }
                        }}
                        className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel Visit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PersonalAssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PersonalAssistantContent />
    </Suspense>
  );
}

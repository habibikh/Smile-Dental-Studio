'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  CalendarCheck,
  CalendarX,
  Stethoscope,
  MapPin,
  Sparkles,
  Shield,
  FileText,
  Search,
  Filter,
  ChevronRight,
  LogOut,
  ArrowRight,
  Check,
  Building2,
  RefreshCw,
  Award,
  BookOpen,
  Users,
  UserCheck,
  Key,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  Doctor,
  DoctorSchedule,
  DoctorUnavailability,
  Appointment,
  Branch,
  Service,
  PersonalAssistant
} from '@/types/dental';
import ImageUploadField from '@/components/ui/ImageUploadField';

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function DoctorPortalContent() {
  const searchParams = useSearchParams();
  const initialDoctorId = searchParams.get('id') || '';

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId) || null;

  const [activeTab, setActiveTab] = useState<'appointments' | 'availability' | 'timeoff' | 'pa' | 'profile'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<DoctorUnavailability[]>([]);
  const [currentPA, setCurrentPA] = useState<PersonalAssistant | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Action States
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [isAddUnavailabilityModalOpen, setIsAddUnavailabilityModalOpen] = useState(false);
  const [isPAModalOpen, setIsPAModalOpen] = useState(false);
  const [isDeletePAModalOpen, setIsDeletePAModalOpen] = useState(false);
  const [selectedAppointmentForNotes, setSelectedAppointmentForNotes] = useState<Appointment | null>(null);
  const [clinicalNotesInput, setClinicalNotesInput] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Personal Assistant Form State (Strictly 1 PA per doctor)
  const [paFormData, setPaFormData] = useState({
    name: '',
    title: 'Personal Assistant & Clinic Coordinator',
    email: '',
    phone: '',
    password: 'pa123',
    status: 'active' as 'active' | 'inactive' | 'on-leave',
    permissions: {
      canManageAppointments: true,
      canManageSchedules: true,
      canViewPatientNotes: true,
      canReschedule: true,
      canSendReminders: true,
    },
  });

  // New Schedule Form Data
  const [newScheduleData, setNewScheduleData] = useState({
    branchId: '',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
  });

  // New Unavailability Form Data
  const [newUnavailData, setNewUnavailData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: 'Dental Conference / Clinical Leave',
  });

  // Doctor Profile Form
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    title: '',
    phone: '',
    qualification: '',
    specialization: '',
    experienceYears: 10,
    bio: '',
    languages: 'English',
    imageUrl: '',
  });

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const loadDoctorDetails = useCallback(async (docId: string) => {
    try {
      setRefreshing(true);
      const [aptRes, schRes, unRes, paRes] = await Promise.all([
        fetch(`/api/doctors/appointments?doctorId=${docId}`),
        fetch(`/api/doctors/schedules?doctorId=${docId}`),
        fetch(`/api/doctors/unavailability?doctorId=${docId}`),
        fetch(`/api/doctors/pa?doctorId=${docId}`),
      ]);

      const aptData = await aptRes.json();
      const schData = await schRes.json();
      const unData = await unRes.json();
      const paData = await paRes.json();

      setAppointments(aptData.appointments || []);
      setSchedules(schData.schedules || []);
      setUnavailabilities(unData.unavailabilities || []);
      setCurrentPA(paData.pa || null);
    } catch (err) {
      console.error('Failed to load doctor specific details:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Fetch initial master data
  useEffect(() => {
    async function loadMasterData() {
      try {
        setLoading(true);
        const [docsRes, brRes, srvRes] = await Promise.all([
          fetch('/api/doctors'),
          fetch('/api/branches'),
          fetch('/api/services'),
        ]);

        const docsData = await docsRes.json();
        const brData = await brRes.json();
        const srvData = await srvRes.json();

        const docsList = docsData.doctors || [];
        setDoctors(docsList);
        setBranches(brData.branches || []);
        setServices(srvData.services || []);

        if (docsList.length > 0) {
          const targetId = initialDoctorId && docsList.some((d: Doctor) => d.id === initialDoctorId)
            ? initialDoctorId
            : docsList[0].id;
          setSelectedDoctorId(targetId);
        }
      } catch (err) {
        console.error('Error loading master data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMasterData();
  }, [initialDoctorId]);

  // Sync profile form data when selectedDoctor changes or form tab opens
  const syncProfileForm = useCallback((doc: Doctor | null) => {
    if (!doc) return;
    setProfileFormData({
      name: doc.name,
      title: doc.title,
      phone: doc.phone || '(555) 234-1100',
      qualification: doc.qualification,
      specialization: doc.specialization,
      experienceYears: doc.experienceYears,
      bio: doc.bio,
      languages: doc.languages.join(', '),
      imageUrl: doc.imageUrl || '',
    });
    if (doc.branchIds.length > 0) {
      setNewScheduleData((prev) => ({ ...prev, branchId: doc.branchIds[0] }));
    }
  }, []);

  // Load selected doctor's specific data
  useEffect(() => {
    let isMounted = true;
    if (!selectedDoctorId) return;

    async function fetchDoctorData() {
      try {
        const [aptRes, schRes, unRes] = await Promise.all([
          fetch(`/api/doctors/appointments?doctorId=${selectedDoctorId}`),
          fetch(`/api/doctors/schedules?doctorId=${selectedDoctorId}`),
          fetch(`/api/doctors/unavailability?doctorId=${selectedDoctorId}`),
        ]);

        const aptData = await aptRes.json();
        const schData = await schRes.json();
        const unData = await unRes.json();

        if (isMounted) {
          setAppointments(aptData.appointments || []);
          setSchedules(schData.schedules || []);
          setUnavailabilities(unData.unavailabilities || []);
        }
      } catch (err) {
        console.error('Failed to load doctor specific details:', err);
      }
    }

    fetchDoctorData();

    return () => {
      isMounted = false;
    };
  }, [selectedDoctorId]);

  // Handler for doctor selection change
  const handleDoctorChange = (newDocId: string) => {
    setSelectedDoctorId(newDocId);
    const targetDoc = doctors.find((d) => d.id === newDocId) || null;
    syncProfileForm(targetDoc);
  };

  // Appointment Status Handlers
  const handleUpdateAppointment = async (appointmentId: string, status: string, notes?: string) => {
    try {
      const res = await fetch('/api/doctors/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, status, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update appointment');

      showNotification('success', `Appointment status changed to ${status}.`);
      if (selectedDoctorId) {
        loadDoctorDetails(selectedDoctorId);
      }
      setSelectedAppointmentForNotes(null);
      setClinicalNotesInput('');
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Add Schedule
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) return;

    try {
      const res = await fetch('/api/doctors/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          branchId: newScheduleData.branchId,
          dayOfWeek: Number(newScheduleData.dayOfWeek),
          startTime: newScheduleData.startTime,
          endTime: newScheduleData.endTime,
          breakStart: newScheduleData.breakStart,
          breakEnd: newScheduleData.breakEnd,
          active: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save shift');

      showNotification('success', 'Working availability shift added successfully.');
      setIsAddScheduleModalOpen(false);
      loadDoctorDetails(selectedDoctorId);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Delete Schedule
  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to remove this working availability shift?')) return;
    try {
      const res = await fetch(`/api/doctors/schedules?id=${scheduleId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete shift');

      showNotification('success', 'Working shift removed.');
      if (selectedDoctorId) {
        loadDoctorDetails(selectedDoctorId);
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Add Unavailability (Leave / Time-Off)
  const handleAddUnavailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) return;

    try {
      const res = await fetch('/api/doctors/unavailability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          date: newUnavailData.date,
          startTime: newUnavailData.startTime || undefined,
          endTime: newUnavailData.endTime || undefined,
          reason: newUnavailData.reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record leave');

      showNotification('success', 'Leave date added. Booking slots for this date are now blocked.');
      setIsAddUnavailabilityModalOpen(false);
      loadDoctorDetails(selectedDoctorId);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Delete Unavailability
  const handleDeleteUnavailability = async (id: string) => {
    try {
      const res = await fetch(`/api/doctors/unavailability?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove leave record');

      showNotification('success', 'Leave cancelled. Online booking availability restored for this date.');
      if (selectedDoctorId) {
        loadDoctorDetails(selectedDoctorId);
      }
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedDoctor.id,
          name: profileFormData.name,
          title: profileFormData.title,
          phone: profileFormData.phone,
          qualification: profileFormData.qualification,
          specialization: profileFormData.specialization,
          experienceYears: Number(profileFormData.experienceYears),
          bio: profileFormData.bio,
          languages: profileFormData.languages.split(',').map((s) => s.trim()).filter(Boolean),
          imageUrl: profileFormData.imageUrl || selectedDoctor.imageUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      showNotification('success', 'Doctor credentials and profile updated.');
      const updatedDocsRes = await fetch('/api/doctors', { cache: 'no-store' });
      const updatedDocs = await updatedDocsRes.json();
      setDoctors(updatedDocs.doctors || []);
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Open Personal Assistant Modal (prefill if exists)
  const handleOpenPAModal = () => {
    if (currentPA) {
      setPaFormData({
        name: currentPA.name,
        title: currentPA.title || 'Personal Assistant & Clinic Coordinator',
        email: currentPA.email,
        phone: currentPA.phone,
        password: currentPA.password || 'pa123',
        status: currentPA.status || 'active',
        permissions: {
          canManageAppointments: currentPA.permissions?.canManageAppointments ?? true,
          canManageSchedules: currentPA.permissions?.canManageSchedules ?? true,
          canViewPatientNotes: currentPA.permissions?.canViewPatientNotes ?? true,
          canReschedule: currentPA.permissions?.canReschedule ?? true,
          canSendReminders: currentPA.permissions?.canSendReminders ?? true,
        },
      });
    } else {
      setPaFormData({
        name: '',
        title: 'Clinical Personal Assistant',
        email: selectedDoctor?.email ? selectedDoctor.email.replace('@', '.pa@') : '',
        phone: selectedDoctor?.phone || '(555) 234-8800',
        password: 'pa123',
        status: 'active',
        permissions: {
          canManageAppointments: true,
          canManageSchedules: true,
          canViewPatientNotes: true,
          canReschedule: true,
          canSendReminders: true,
        },
      });
    }
    setIsPAModalOpen(true);
  };

  // Save Personal Assistant (Strictly 1 PA per doctor rule)
  const handleSavePA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId) return;

    try {
      const res = await fetch('/api/doctors/pa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          name: paFormData.name,
          title: paFormData.title,
          email: paFormData.email,
          phone: paFormData.phone,
          password: paFormData.password,
          status: paFormData.status,
          permissions: paFormData.permissions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Personal Assistant');

      setCurrentPA(data.pa);
      setIsPAModalOpen(false);
      showNotification('success', 'Personal Assistant account saved successfully.');
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Delete / Reassign Personal Assistant
  const handleDeletePA = async () => {
    if (!selectedDoctorId) return;

    try {
      const res = await fetch(`/api/doctors/pa?doctorId=${selectedDoctorId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove Personal Assistant');

      setCurrentPA(null);
      setIsDeletePAModalOpen(false);
      showNotification('success', 'Personal Assistant unassigned.');
    } catch (err: any) {
      showNotification('error', err.message);
    }
  };

  // Filtered Appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchCode = apt.appointmentCode.toLowerCase().includes(q);
      const matchEmail = apt.patientEmail.toLowerCase().includes(q);
      const matchService = (apt.serviceName || '').toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchEmail && !matchService) return false;
    }
    return true;
  });

  const todayAppointmentsCount = appointments.filter(
    (a) => a.appointmentDate === todayStr && a.status !== 'cancelled'
  ).length;

  const upcomingAppointmentsCount = appointments.filter(
    (a) => a.appointmentDate >= todayStr && a.status === 'confirmed'
  ).length;

  const completedAppointmentsCount = appointments.filter(
    (a) => a.status === 'completed'
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Loading Clinical Doctor Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 animate-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : 'bg-rose-900 text-white border-rose-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Banner / Doctor Switcher Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-18 sm:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Active Doctor Selector */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Logged In Doctor:
              </span>
              <select
                value={selectedDoctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-hidden focus:border-teal-600 cursor-pointer shadow-2xs"
              >
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} — {doc.specialization}
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctor?.email && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 hidden sm:inline">
                {selectedDoctor.email}
              </span>
            )}
          </div>

          {/* Quick Actions / Refresh / Link to Admin */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => selectedDoctorId && loadDoctorDetails(selectedDoctorId)}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-teal-600 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Schedule</span>
            </button>

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-teal-700" />
              <span>Hospital Admin</span>
            </Link>

            <Link
              href="/book"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-teal-400" />
              <span>Patient Booking</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Doctor Header Profile Strip */}
      {selectedDoctor && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Doctor Details */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-teal-600/20 shrink-0 shadow-sm">
                  <Image
                    src={selectedDoctor.imageUrl}
                    alt={selectedDoctor.name}
                    fill
                    unoptimized
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {selectedDoctor.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                      {selectedDoctor.specialization}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {selectedDoctor.qualification} • {selectedDoctor.experienceYears} Years Clinical Experience
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-teal-600" />
                      {selectedDoctor.email || 'doctor@smiledental.com'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      {selectedDoctor.phone || '(555) 234-1100'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-600" />
                      {selectedDoctor.branchIds.length} Assigned Studios
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor Metric Badges */}
              <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-xs text-slate-500 font-semibold block">Today&apos;s Visits</span>
                  <span className="text-lg font-extrabold text-teal-700">{todayAppointmentsCount}</span>
                </div>
                <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-xs text-slate-500 font-semibold block">Upcoming</span>
                  <span className="text-lg font-extrabold text-slate-900">{upcomingAppointmentsCount}</span>
                </div>
                <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-xs text-slate-500 font-semibold block">Completed</span>
                  <span className="text-lg font-extrabold text-emerald-700">{completedAppointmentsCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Clinical Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'appointments'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CalendarCheck className="w-4 h-4 text-teal-400" />
            <span>My Patient Appointments ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('availability')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'availability'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Manage Working Shifts ({schedules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeoff')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'timeoff'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CalendarX className="w-4 h-4 text-rose-400" />
            <span>Time-Off & Leave Dates ({unavailabilities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pa')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'pa'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-teal-400" />
            <span>Personal Assistant (PA) {currentPA ? '• 1 Assigned' : '• None'}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-teal-400" />
            <span>Doctor Profile & Credentials</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: MY PATIENT APPOINTMENTS */}
        {/* ================================================================= */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patient name, phone, code or treatment..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
                  Status:
                </span>
                {['all', 'confirmed', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment Cards List */}
            {filteredAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  There are no appointments matching your current filter criteria for {selectedDoctor?.name}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => {
                  const isToday = apt.appointmentDate === todayStr;
                  const isPast = apt.appointmentDate < todayStr;

                  return (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold">
                            {apt.appointmentCode}
                          </div>
                          {isToday && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
                              Today&apos;s Visit
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${
                              apt.status === 'confirmed'
                                ? 'bg-teal-50 text-teal-800 border-teal-200'
                                : apt.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : apt.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                            {apt.appointmentDate}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            {apt.startTime} - {apt.endTime} ({apt.serviceDuration || 45} mins)
                          </span>
                        </div>
                      </div>

                      {/* Main Patient & Service Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Patient Contact */}
                        <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Patient Record
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            {apt.patientName}
                          </h4>
                          <p className="text-xs text-slate-600 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            {apt.patientPhone || 'No phone on file'}
                          </p>
                          <p className="text-xs text-slate-600 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            {apt.patientEmail}
                          </p>
                        </div>

                        {/* Treatment & Branch */}
                        <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Requested Procedure & Studio
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            {apt.serviceName}
                          </h4>
                          <p className="text-xs text-slate-600 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {apt.branchName}
                          </p>
                          <p className="text-xs font-semibold text-teal-700">
                            Service Fee: ${apt.servicePrice}
                          </p>
                        </div>

                        {/* Medical Notes / Symptoms */}
                        <div className="space-y-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Patient Chief Complaint / Notes
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed italic">
                            {apt.notes ? `"${apt.notes}"` : 'No special symptoms or notes provided.'}
                          </p>
                        </div>
                      </div>

                      {/* Doctor Clinical Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          Created {new Date(apt.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-2">
                          {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedAppointmentForNotes(apt);
                                  setClinicalNotesInput('');
                                }}
                                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Mark as Completed</span>
                              </button>

                              <button
                                onClick={() => {
                                  const reason = prompt('Enter cancellation note / clinical reason:') || 'Doctor clinical schedule adjustment';
                                  handleUpdateAppointment(apt.id, 'cancelled', reason);
                                }}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel Visit</span>
                              </button>
                            </>
                          )}

                          {apt.status === 'completed' && (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Treatment Successfully Rendered
                            </span>
                          )}

                          {apt.status === 'cancelled' && (
                            <button
                              onClick={() => handleUpdateAppointment(apt.id, 'confirmed', 'Reactivated by doctor')}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                            >
                              Re-activate Appointment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: MANAGE WORKING SHIFTS & AVAILABILITY */}
        {/* ================================================================= */}
        {activeTab === 'availability' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header & Add Button */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Weekly Working Shifts & Studio Availability
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Configure your weekly schedule across dental branches. Patients can book slots during these active hours. Any shift added or removed updates the live booking wizard instantly.
                </p>
              </div>

              <button
                onClick={() => setIsAddScheduleModalOpen(true)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Add Working Shift</span>
              </button>
            </div>

            {/* Shifts by Day */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {DAYS_OF_WEEK.map((dayName, dayIndex) => {
                const daySchedules = schedules.filter((s) => s.dayOfWeek === dayIndex);

                return (
                  <div
                    key={dayName}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="font-extrabold text-sm text-slate-900">{dayName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          daySchedules.length > 0
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {daySchedules.length} {daySchedules.length === 1 ? 'Shift' : 'Shifts'}
                      </span>
                    </div>

                    {daySchedules.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">
                        No working shifts assigned (Off Day)
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {daySchedules.map((sch) => {
                          const branch = branches.find((b) => b.id === sch.branchId);

                          return (
                            <div
                              key={sch.id}
                              className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 relative group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                    {sch.startTime} - {sch.endTime}
                                  </span>
                                  <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                    {branch?.name || sch.branchId}
                                  </p>
                                </div>

                                <button
                                  onClick={() => handleDeleteSchedule(sch.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete this working shift"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                                <span>Lunch: {sch.breakStart} - {sch.breakEnd}</span>
                                <span className="text-emerald-700 font-semibold">Active in Booking</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: TIME-OFF & LEAVE DATES (UNAVAILABILITY) */}
        {/* ================================================================= */}
        {activeTab === 'timeoff' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header & Add Button */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Doctor Leave, Time-Off & Blackout Dates
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Declare temporary leave, vacation, surgery days, or conference travel. When a date is added here, the appointment booking engine automatically blocks all time slots for you on that date.
                </p>
              </div>

              <button
                onClick={() => setIsAddUnavailabilityModalOpen(true)}
                className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 text-rose-200" />
                <span>Declare Time-Off / Leave</span>
              </button>
            </div>

            {/* List of Time-Off Dates */}
            {unavailabilities.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <CalendarCheck className="w-12 h-12 text-teal-600/40 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Upcoming Time-Off Scheduled</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  You have full availability scheduled according to your weekly shifts. To block off specific dates for travel or vacation, click the button above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unavailabilities.map((un) => (
                  <div
                    key={un.id}
                    className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs space-y-3 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">
                          {un.date}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {un.startTime && un.endTime ? `${un.startTime} - ${un.endTime}` : 'Full Day Off'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{un.reason}</h4>
                      <p className="text-xs text-slate-500">
                        Patients cannot book appointments with {selectedDoctor?.name} on this date.
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteUnavailability(un.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Cancel this leave & restore availability"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB: PERSONAL ASSISTANT (PA) MANAGEMENT */}
        {/* RULE: Strictly ONLY ONE Personal Assistant per Doctor */}
        {/* ================================================================= */}
        {activeTab === 'pa' && selectedDoctor && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Policy Banner */}
            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-200/60 text-teal-800">
                      Doctor Policy Constraint
                    </span>
                    <span className="text-xs font-bold text-teal-900">Strictly 1 PA per Doctor</span>
                  </div>
                  <p className="text-xs text-teal-700 mt-1">
                    Doctors can add their personal assistant account (only one PA per Doctor). Your assistant can manage patient arrivals, check in visitors, and coordinate schedules.
                  </p>
                </div>
              </div>

              {!currentPA ? (
                <button
                  type="button"
                  onClick={handleOpenPAModal}
                  className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Personal Assistant</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/pa?doctorId=${selectedDoctor.id}`}
                    className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open PA Portal</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleOpenPAModal}
                    className="px-3 py-2 rounded-xl border border-teal-300 bg-white hover:bg-teal-50 text-teal-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit PA</span>
                  </button>
                </div>
              )}
            </div>

            {currentPA ? (
              /* Current PA Card */
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 text-xl font-bold shrink-0">
                      {currentPA.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">{currentPA.name}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {currentPA.status || 'Active'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          Primary PA
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{currentPA.title}</p>
                      <p className="text-xs text-teal-700 font-medium">Assigned to: {selectedDoctor.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsDeletePAModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Unassign PA</span>
                    </button>
                  </div>
                </div>

                {/* Contact and Access Credentials Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Email Address
                    </span>
                    <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {currentPA.email}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Phone Number
                    </span>
                    <p className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {currentPA.phone}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Default Portal PIN / Password
                    </span>
                    <p className="text-xs font-mono font-bold text-teal-800 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-500" />
                      {currentPA.password || 'pa123'}
                    </p>
                  </div>
                </div>

                {/* Granted Permissions List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Designated Clinical Permissions:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Manage Patient Appointments</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Check-In Arrived Patients</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Send Patient SMS / Reminders</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>View Doctor Shift Schedule</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Reschedule & Update Notes</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    No Personal Assistant Currently Assigned
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Under hospital regulations, each doctor can have strictly <strong>one</strong> Personal Assistant (PA) account. Assign an assistant to support your clinical appointments and patient check-ins.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenPAModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Personal Assistant</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: DOCTOR PROFILE & CREDENTIALS */}
        {/* ================================================================= */}
        {activeTab === 'profile' && selectedDoctor && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs max-w-3xl animate-in fade-in duration-150 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Doctor Profile & Credentials
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Manage your public bio, qualifications, and contact information visible to prospective patients.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Doctor Portrait Photo with JPG / PNG Upload */}
              <ImageUploadField
                label="Doctor Portrait Photo"
                value={profileFormData.imageUrl}
                onChange={(url) => setProfileFormData({ ...profileFormData, imageUrl: url })}
                aspectRatio="square"
                placeholderSeed={selectedDoctor.id}
                helperText="Upload your doctor portrait photo in JPG or PNG format, or enter URL."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileFormData.name}
                    onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Title
                  </label>
                  <input
                    type="text"
                    value={profileFormData.title}
                    onChange={(e) => setProfileFormData({ ...profileFormData, title: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileFormData.specialization}
                    onChange={(e) => setProfileFormData({ ...profileFormData, specialization: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Years of Clinical Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={profileFormData.experienceYears}
                    onChange={(e) => setProfileFormData({ ...profileFormData, experienceYears: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Degrees & Qualifications
                </label>
                <input
                  type="text"
                  value={profileFormData.qualification}
                  onChange={(e) => setProfileFormData({ ...profileFormData, qualification: e.target.value })}
                  placeholder="e.g. DDS (Columbia University), AACD Fellow"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Spoken Languages (comma separated)
                </label>
                <input
                  type="text"
                  value={profileFormData.languages}
                  onChange={(e) => setProfileFormData({ ...profileFormData, languages: e.target.value })}
                  placeholder="English, Spanish, Mandarin"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows={4}
                  value={profileFormData.bio}
                  onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* MODAL: ADD WORKING SHIFT */}
      {/* ================================================================= */}
      {isAddScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Add Working Shift</h3>
              </div>
              <button
                onClick={() => setIsAddScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Studio Branch *
                </label>
                <select
                  required
                  value={newScheduleData.branchId}
                  onChange={(e) => setNewScheduleData({ ...newScheduleData, branchId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Day of Week *
                </label>
                <select
                  value={newScheduleData.dayOfWeek}
                  onChange={(e) => setNewScheduleData({ ...newScheduleData, dayOfWeek: Number(e.target.value) })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                >
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <option key={day} value={idx}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shift Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newScheduleData.startTime}
                    onChange={(e) => setNewScheduleData({ ...newScheduleData, startTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shift End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newScheduleData.endTime}
                    onChange={(e) => setNewScheduleData({ ...newScheduleData, endTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lunch Break Start
                  </label>
                  <input
                    type="time"
                    required
                    value={newScheduleData.breakStart}
                    onChange={(e) => setNewScheduleData({ ...newScheduleData, breakStart: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lunch Break End
                  </label>
                  <input
                    type="time"
                    required
                    value={newScheduleData.breakEnd}
                    onChange={(e) => setNewScheduleData({ ...newScheduleData, breakEnd: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: DECLARE TIME-OFF / LEAVE */}
      {/* ================================================================= */}
      {isAddUnavailabilityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <CalendarX className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Declare Time-Off / Leave</h3>
              </div>
              <button
                onClick={() => setIsAddUnavailabilityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUnavailability} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Leave Date (YYYY-MM-DD) *
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={newUnavailData.date}
                  onChange={(e) => setNewUnavailData({ ...newUnavailData, date: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Reason / Description *
                </label>
                <input
                  type="text"
                  required
                  value={newUnavailData.reason}
                  onChange={(e) => setNewUnavailData({ ...newUnavailData, reason: e.target.value })}
                  placeholder="e.g. Annual Dental Surgery Symposium"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUnavailabilityModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Block Off Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: COMPLETE APPOINTMENT & ADD CLINICAL NOTES */}
      {/* ================================================================= */}
      {selectedAppointmentForNotes && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Complete Dental Treatment</h3>
                  <p className="text-xs text-slate-500">Patient: {selectedAppointmentForNotes.patientName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointmentForNotes(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Clinical Summary / Post-Treatment Notes / Next Steps:
              </label>
              <textarea
                rows={4}
                value={clinicalNotesInput}
                onChange={(e) => setClinicalNotesInput(e.target.value)}
                placeholder="e.g. Completed ultrasonic scale and polish with fluoride varnish applied. Patient tolerated well. Advised 6-month recall."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedAppointmentForNotes(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateAppointment(selectedAppointmentForNotes.id, 'completed', clinicalNotesInput)}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
              >
                Save & Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ASSIGN / EDIT PERSONAL ASSISTANT (Strictly 1 PA per doctor) */}
      {/* ================================================================= */}
      {isPAModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {currentPA ? 'Edit Personal Assistant (PA)' : 'Assign Personal Assistant (PA)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Doctor: {selectedDoctor?.name} (Strict 1 PA Limit)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPAModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePA} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assistant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins, RMA"
                    value={paFormData.name}
                    onChange={(e) => setPaFormData({ ...paFormData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assistant Title / Qualification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Clinical PA & RDA"
                    value={paFormData.title}
                    onChange={(e) => setPaFormData({ ...paFormData, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Login / Portal Password PIN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="pa123"
                    value={paFormData.password}
                    onChange={(e) => setPaFormData({ ...paFormData, password: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. assistant@smiledental.com"
                    value={paFormData.email}
                    onChange={(e) => setPaFormData({ ...paFormData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. (555) 234-8801"
                    value={paFormData.phone}
                    onChange={(e) => setPaFormData({ ...paFormData, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  Permissions Granted:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={paFormData.permissions.canManageAppointments}
                      onChange={(e) =>
                        setPaFormData({
                          ...paFormData,
                          permissions: { ...paFormData.permissions, canManageAppointments: e.target.checked },
                        })
                      }
                      className="rounded-sm text-teal-600 focus:ring-teal-500"
                    />
                    <span>Manage Patient Visits</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={paFormData.permissions.canSendReminders}
                      onChange={(e) =>
                        setPaFormData({
                          ...paFormData,
                          permissions: { ...paFormData.permissions, canSendReminders: e.target.checked },
                        })
                      }
                      className="rounded-sm text-teal-600 focus:ring-teal-500"
                    />
                    <span>Send SMS/Email Reminders</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={paFormData.permissions.canReschedule}
                      onChange={(e) =>
                        setPaFormData({
                          ...paFormData,
                          permissions: { ...paFormData.permissions, canReschedule: e.target.checked },
                        })
                      }
                      className="rounded-sm text-teal-600 focus:ring-teal-500"
                    />
                    <span>Reschedule Appointments</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={paFormData.permissions.canManageSchedules}
                      onChange={(e) =>
                        setPaFormData({
                          ...paFormData,
                          permissions: { ...paFormData.permissions, canManageSchedules: e.target.checked },
                        })
                      }
                      className="rounded-sm text-teal-600 focus:ring-teal-500"
                    />
                    <span>View Doctor Shifts</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPAModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                >
                  {currentPA ? 'Save Assistant Changes' : 'Confirm & Assign Assistant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: DELETE / UNASSIGN PERSONAL ASSISTANT CONFIRMATION */}
      {/* ================================================================= */}
      {isDeletePAModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Unassign Personal Assistant?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to remove <strong>{currentPA?.name}</strong> from your doctor account? Their access to your patient appointments and clinic schedule will be revoked.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeletePAModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Keep Assistant
              </button>
              <button
                type="button"
                onClick={handleDeletePA}
                className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
              >
                Yes, Unassign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DoctorPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DoctorPortalContent />
    </Suspense>
  );
}

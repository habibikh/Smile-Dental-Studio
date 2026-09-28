'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmileAssistant from '@/components/ai/SmileAssistant';
import {
  Users,
  Building2,
  Stethoscope,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Shield,
  Eye,
  X,
  Smile,
  BarChart3,
  CalendarCheck,
  Camera,
  Star,
  Download,
  RotateCcw,
  ClipboardList,
  Calendar,
  Check
} from 'lucide-react';
import AdminChartsSection from '@/components/admin/AdminChartsSection';
import {
  PatientProfile,
  Appointment,
  Doctor,
  Branch,
  Service,
  ClinicAdminAccount
} from '@/types/dental';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PatientAccessRestricted from '@/components/admin/PatientAccessRestricted';
import ClinicAdminsTab from '@/components/admin/ClinicAdminsTab';
import ClinicManagementTab from '@/components/admin/ClinicManagementTab';
import PatientHistoryTab from '@/components/admin/PatientHistoryTab';
import DoctorBioModal from '@/components/admin/DoctorBioModal';
import ClinicProfileAndImagesTab from '@/components/admin/ClinicProfileAndImagesTab';

export default function AdminPage() {
  const { user, isPatient, isClinicAdmin, isAppAdmin } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<string>('analytics');

  // Clinic scoping state (locked for clinic admin, selectable for app admin)
  const [selectedClinicId, setSelectedClinicId] = useState<string>('branch-downtown');
  const effectiveClinicId = isClinicAdmin && user?.clinicId ? user.clinicId : selectedClinicId;

  // Core Data States
  const [users, setUsers] = useState<
    (PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[]
  >([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clinicAdmins, setClinicAdmins] = useState<ClinicAdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(
    null
  );

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');

  // Modals & Drawers
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<
    (PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string }) | null
  >(null);
  const [selectedDoctorForBio, setSelectedDoctorForBio] = useState<Doctor | null>(null);

  // Patient Registration Modal State (Clinic Admin)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dentalInsurance: '',
    address: '',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    medicalNotes: '',
  });

  // Doctor Management Modal State (Clinic Admin)
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [doctorFormData, setDoctorFormData] = useState({
    name: '',
    email: '',
    password: 'doctor123',
    phone: '(555) 234-1100',
    title: 'Specialist Dentist',
    qualification: 'DDS / DMD Board Certified',
    specialization: 'Cosmetic & Aesthetic Dentistry',
    experienceYears: 8,
    bio: '',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
    branchIds: ['branch-downtown'],
    serviceIds: ['srv-checkup-cleaning'],
    languages: 'English',
  });

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  }, []);

  // Fetch initial data
  const loadAllAdminData = useCallback(async () => {
    try {
      const [usersRes, aptsRes, docRes, branchRes, srvRes, clinicAdminsRes] = await Promise.all([
        fetch('/api/admin/users').then((r) => r.json()).catch(() => ({})),
        fetch('/api/appointments').then((r) => r.json()).catch(() => ({})),
        fetch('/api/doctors').then((r) => r.json()).catch(() => ({})),
        fetch('/api/branches').then((r) => r.json()).catch(() => ({})),
        fetch('/api/services').then((r) => r.json()).catch(() => ({})),
        fetch('/api/admin/clinic-admins').then((r) => r.json()).catch(() => ({})),
      ]);

      if (usersRes.users) setUsers(usersRes.users);
      if (aptsRes.appointments) setAppointments(aptsRes.appointments);
      if (docRes.doctors) setDoctors(docRes.doctors);
      if (branchRes.branches) setBranches(branchRes.branches);
      if (srvRes.services) setServices(srvRes.services);
      if (clinicAdminsRes.clinicAdmins) setClinicAdmins(clinicAdminsRes.clinicAdmins);
    } catch (err: unknown) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/admin/users').then((r) => r.json()).catch(() => ({})),
      fetch('/api/appointments').then((r) => r.json()).catch(() => ({})),
      fetch('/api/doctors').then((r) => r.json()).catch(() => ({})),
      fetch('/api/branches').then((r) => r.json()).catch(() => ({})),
      fetch('/api/services').then((r) => r.json()).catch(() => ({})),
      fetch('/api/admin/clinic-admins').then((r) => r.json()).catch(() => ({})),
    ]).then(([usersRes, aptsRes, docRes, branchRes, srvRes, clinicAdminsRes]) => {
      if (!active) return;
      if (usersRes?.users) setUsers(usersRes.users);
      if (aptsRes?.appointments) setAppointments(aptsRes.appointments);
      if (docRes?.doctors) setDoctors(docRes.doctors);
      if (branchRes?.branches) setBranches(branchRes.branches);
      if (srvRes?.services) setServices(srvRes.services);
      if (clinicAdminsRes?.clinicAdmins) setClinicAdmins(clinicAdminsRes.clinicAdmins);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // Handle Export Dataset
  const handleExportDatabase = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data.data || data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smiledental-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('success', 'Database JSON backup downloaded.');
    } catch {
      showNotification('error', 'Failed to export database.');
    }
  };

  // Handle Save / Add New Patient (Clinic Admin can register users)
  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.fullName.trim() || !userFormData.email.trim()) {
      showNotification('error', 'Full Name and Email Address are required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userFormData,
          clinicId: selectedClinicId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Patient "${userFormData.fullName}" registered successfully.`);
        setIsAddUserModalOpen(false);
        setUserFormData({
          fullName: '',
          email: '',
          phone: '',
          dentalInsurance: '',
          address: '',
          gender: 'Prefer not to say',
          dateOfBirth: '',
          medicalNotes: '',
        });
        await loadAllAdminData();
      } else {
        throw new Error(data.error || 'Failed to save patient');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showNotification('error', msg);
    }
  };

  // Handle Delete Patient
  const handleDeletePatient = async (patientEmail: string, patientName: string) => {
    if (!confirm(`Are you sure you want to remove registered patient "${patientName}" (${patientEmail})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(patientEmail)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Patient record removed.`);
        if (selectedUserForDetail?.email === patientEmail) setSelectedUserForDetail(null);
        await loadAllAdminData();
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showNotification('error', msg);
    }
  };

  // Handle Save Doctor (Clinic Admin or App Admin can create/edit doctors)
  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorFormData.name.trim() || !doctorFormData.specialization.trim()) {
      showNotification('error', 'Doctor Name and Specialization are required.');
      return;
    }

    // Ensure valid branch IDs (never empty, never 'all')
    const safeBranchIds =
      Array.isArray(doctorFormData.branchIds) && doctorFormData.branchIds.filter((b) => b && b !== 'all').length > 0
        ? doctorFormData.branchIds.filter((b) => b && b !== 'all')
        : [effectiveClinicId !== 'all' ? effectiveClinicId : branches[0]?.id || 'branch-downtown'];

    const safeServiceIds =
      Array.isArray(doctorFormData.serviceIds) && doctorFormData.serviceIds.length > 0
        ? doctorFormData.serviceIds
        : services.length > 0
        ? [services[0].id]
        : ['srv-checkup-cleaning'];

    const safeEmail =
      doctorFormData.email.trim() ||
      `dr.${doctorFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@smiledental.com`;

    const safePassword = doctorFormData.password.trim() || 'doctor123';

    const safeLanguages =
      typeof doctorFormData.languages === 'string'
        ? doctorFormData.languages.split(',').map((s) => s.trim()).filter(Boolean)
        : Array.isArray(doctorFormData.languages)
        ? doctorFormData.languages
        : ['English'];

    const safeImageUrl =
      doctorFormData.imageUrl?.trim() ||
      `https://picsum.photos/seed/${safeEmail.replace(/[^a-z0-9]/g, '')}/800/800`;

    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingDoctorId || undefined,
          name: doctorFormData.name.trim(),
          email: safeEmail,
          password: safePassword,
          phone: doctorFormData.phone.trim() || '(555) 234-1100',
          title: doctorFormData.title.trim() || `Specialist in ${doctorFormData.specialization.trim()}`,
          qualification: doctorFormData.qualification.trim() || 'DDS / DMD Board Certified',
          specialization: doctorFormData.specialization.trim(),
          experienceYears: Number(doctorFormData.experienceYears) || 5,
          bio:
            doctorFormData.bio.trim() ||
            `${doctorFormData.name} is a dedicated dental specialist at Smile Dental Clinic committed to gentle, evidence-based patient care.`,
          imageUrl: safeImageUrl,
          branchIds: safeBranchIds,
          serviceIds: safeServiceIds,
          languages: safeLanguages.length > 0 ? safeLanguages : ['English'],
        }),
      });
      const data = await res.json();
      if (data.success && data.doctor) {
        // Optimistically update doctors state
        setDoctors((prev) => {
          const idx = prev.findIndex((d) => d.id === data.doctor.id);
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = data.doctor;
            return updated;
          }
          return [...prev, data.doctor];
        });

        showNotification(
          'success',
          editingDoctorId
            ? `Doctor "${doctorFormData.name}" updated successfully.`
            : `Doctor account created! Email: ${data.doctor.email} | Password: ${safePassword}`
        );
        setIsAddDoctorModalOpen(false);
        setEditingDoctorId(null);
        await loadAllAdminData();
      } else {
        throw new Error(data.error || 'Failed to save doctor');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      showNotification('error', msg);
    }
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    const validBranchIds =
      doc.branchIds && doc.branchIds.length > 0
        ? doc.branchIds
        : [effectiveClinicId !== 'all' ? effectiveClinicId : branches[0]?.id || 'branch-downtown'];

    setDoctorFormData({
      name: doc.name,
      email: doc.email || `${doc.id}@smiledental.com`,
      password: doc.password || 'doctor123',
      phone: doc.phone || '(555) 234-1100',
      title: doc.title,
      qualification: doc.qualification,
      specialization: doc.specialization,
      experienceYears: doc.experienceYears,
      bio: doc.bio,
      imageUrl: doc.imageUrl,
      branchIds: validBranchIds,
      serviceIds: doc.serviceIds && doc.serviceIds.length > 0 ? doc.serviceIds : ['srv-checkup-cleaning'],
      languages: doc.languages?.join(', ') || 'English',
    });
    setIsAddDoctorModalOpen(true);
  };

  // Handle Delete Doctor (Clinic Admin can delete doctors)
  const handleDeleteDoctor = async (doctorId: string, doctorName: string) => {
    if (!confirm(`Are you sure you want to remove specialist "${doctorName}" from the clinic staff roster?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/doctors?id=${doctorId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Specialist "${doctorName}" removed.`);
        if (selectedDoctorForBio?.id === doctorId) setSelectedDoctorForBio(null);
        await loadAllAdminData();
      } else {
        throw new Error(data.error || 'Failed to delete doctor');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showNotification('error', msg);
    }
  };

  // Active branch object
  const activeBranch = branches.find((b) => b.id === effectiveClinicId) || branches[0] || {
    id: 'branch-downtown',
    name: 'Smile Dental - Downtown Metro',
    city: 'Downtown Metro',
    address: '450 Grand Avenue, Suite 800, New York, NY 10001',
    phone: '(555) 234-5678',
    email: 'downtown@smiledental.com',
    openingHours: 'Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 4:00 PM',
    description: 'Flagship clinical suite equipped with 3D CBCT, aesthetic lasers, and spa amenities.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
  };

  // Scoped doctors for this clinic (or all if app admin selected 'all')
  const visibleDoctors =
    isAppAdmin && effectiveClinicId === 'all'
      ? doctors
      : doctors.filter((d) => d.branchIds?.includes(effectiveClinicId));

  // Scoped appointments for this clinic
  const visibleAppointments =
    isAppAdmin && effectiveClinicId === 'all'
      ? appointments
      : appointments.filter((a) => a.branchId === effectiveClinicId);

  // Scoped patients for this clinic
  const visibleUsers =
    isAppAdmin && effectiveClinicId === 'all'
      ? users
      : users.filter(
          (u) =>
            visibleAppointments.some(
              (a) => a.patientEmail.toLowerCase() === u.email.toLowerCase() || a.patientId === u.id
            ) ||
            !u.clinicId ||
            u.clinicId === effectiveClinicId
        );

  // Filtered Users
  const filteredUsers = visibleUsers.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.dentalInsurance && u.dentalInsurance.toLowerCase().includes(q))
    );
  });

  // Filtered Appointments
  const filteredAppointments = visibleAppointments.filter((apt) => {
    const q = appointmentSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      apt.appointmentCode.toLowerCase().includes(q) ||
      apt.patientName.toLowerCase().includes(q) ||
      apt.patientEmail.toLowerCase().includes(q) ||
      (apt.doctorName && apt.doctorName.toLowerCase().includes(q)) ||
      (apt.serviceName && apt.serviceName.toLowerCase().includes(q))
    );
  });

  // RESTRICT ACCESS IF NOT ADMIN
  if (isPatient) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 pb-20 px-4">
          <PatientAccessRestricted
            patientName={user?.fullName || 'General Visitor'}
            patientEmail={user?.email || 'patient@example.com'}
          />
        </main>
        <Footer />
        <SmileAssistant />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 pb-20">
          <LoadingSpinner size="lg" variant="teal" label="Loading clinical management data..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-80 left-10 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Notification Toast */}
          {notification && (
            <div
              className={`fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 transition-all animate-in slide-in-from-top-4 duration-200 ${
                notification.type === 'success'
                  ? 'bg-teal-900 text-white border-teal-700'
                  : notification.type === 'error'
                  ? 'bg-rose-900 text-white border-rose-700'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="p-1 hover:bg-white/20 rounded-lg text-white/70 hover:text-white ml-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Admin Header & Identity Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  {isAppAdmin ? 'Application Administrator' : 'Clinic Administrator Panel'}
                </span>
                {isClinicAdmin && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    Verified Operator for {activeBranch?.name.replace('Smile Dental - ', '')}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {isAppAdmin
                  ? 'Application Central Administration'
                  : `${activeBranch?.name.replace('Smile Dental - ', '')} Management`}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {isAppAdmin
                  ? 'Administrate clinic studios, manage clinic administrators, view clinic doctors, and monitor comprehensive application analytics.'
                  : `Clinical workspace for ${activeBranch?.name}: manage clinic doctors, register new patients, and review clinical history.`}
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {isAppAdmin && (
                <button
                  onClick={handleExportDatabase}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  title="Download JSON dataset backup"
                >
                  <Download className="w-3.5 h-3.5 text-teal-600" />
                  <span>Export JSON</span>
                </button>
              )}

              {isClinicAdmin && (
                <>
                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-teal-400" />
                    <span>Register Patient</span>
                  </button>

                  <button
                    onClick={() => {
                      const defaultBranch = effectiveClinicId !== 'all' ? effectiveClinicId : branches[0]?.id || 'branch-downtown';
                      setEditingDoctorId(null);
                      setDoctorFormData({
                        name: '',
                        email: '',
                        password: 'doctor123',
                        phone: '(555) 234-1100',
                        title: 'Specialist Dentist',
                        qualification: 'DDS / DMD Board Certified',
                        specialization: 'Cosmetic & Aesthetic Dentistry',
                        experienceYears: 8,
                        bio: '',
                        imageUrl: `https://picsum.photos/seed/doc-${Date.now()}/800/800`,
                        branchIds: [defaultBranch],
                        serviceIds: services.length > 0 ? [services[0].id] : ['srv-checkup-cleaning'],
                        languages: 'English',
                      });
                      setIsAddDoctorModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Doctor</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Active Clinic Scope Banner (App Admin can switch studios to inspect; Clinic Admin is locked to their clinic) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    Active Studio Scope
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {isAppAdmin && selectedClinicId === 'all'
                      ? 'Global Network (All Studios)'
                      : activeBranch?.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>📍 {activeBranch?.address || 'Metro Clinical Facility'}</span>
                  <span>•</span>
                  <span>📞 {activeBranch?.phone || '(555) 234-5678'}</span>
                </p>
              </div>
            </div>

            {/* Clinic Switcher for App Admin only */}
            {isAppAdmin && (
              <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 pl-2">Filter Clinic:</span>
                <select
                  value={selectedClinicId}
                  onChange={(e) => setSelectedClinicId(e.target.value)}
                  className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer focus:outline-hidden focus:border-teal-600 shadow-2xs"
                >
                  <option value="all">🌐 All Studios (Global View)</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      🏥 {b.name.replace('Smile Dental - ', '')}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* NAVIGATION TABS (Strictly tailored by role) */}
          {/* ================================================================= */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {isAppAdmin ? (
              // APP ADMIN TABS: Only Analysis, Administrate Clinics, Clinic Admins, View Doctors
              <>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-teal-400" />
                  <span>Application Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab('branches')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'branches'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span>Administrate Clinics ({branches.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('clinic_admins')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'clinic_admins'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span>Clinic Admins ({clinicAdmins.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'doctors'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span>Doctors in Clinics ({visibleDoctors.length})</span>
                </button>
              </>
            ) : (
              // CLINIC ADMIN TABS: Analysis (this clinic), Doctors Management, Register & Manage Patients, History of Patients, Appointments, Clinic Profile
              <>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'analytics'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-teal-400" />
                  <span>Clinic & Doctor Analysis</span>
                </button>

                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'doctors'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span>Doctors Management ({visibleDoctors.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>Register & Manage Patients ({visibleUsers.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('patient_history')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'patient_history'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-teal-400" />
                  <span>History of Patients</span>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'appointments'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>Clinic Appointments ({visibleAppointments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('clinic_profile')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === 'clinic_profile'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Camera className="w-4 h-4 text-teal-400" />
                  <span>Clinic Profile & Photos</span>
                </button>
              </>
            )}
          </div>

          {/* ================================================================= */}
          {/* TAB CONTENT: ANALYTICS (APP ADMIN = ALL CLINICS; CLINIC ADMIN = THIS CLINIC ONLY) */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {isAppAdmin ? (
                // APP ADMIN METRIC CARDS
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinics Network</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{branches.length} Studios</div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">Central Management</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Specialists</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{doctors.length} Doctors</div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">Across All Clinics</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinic Admins</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{clinicAdmins.length} Admins</div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">Provisioned & Authorized</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Bookings</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{appointments.length} Visits</div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">Network Volume</p>
                  </div>
                </div>
              ) : (
                // CLINIC ADMIN METRIC CARDS (Strictly for this clinic)
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinic Doctors</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{visibleDoctors.length} Specialists</div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">{activeBranch?.name.replace('Smile Dental - ', '')}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinic Patients</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{visibleUsers.length} Patients</div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">Registered in Roster</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Clinic Appointments</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{visibleAppointments.length} Bookings</div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">This Location Only</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Confirmed Visits</span>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">
                      {visibleAppointments.filter((a) => a.status === 'confirmed').length} Completed
                    </div>
                    <p className="text-[11px] text-teal-700 font-medium mt-0.5">Active Consultations</p>
                  </div>
                </div>
              )}

              {/* Render Charts */}
              <AdminChartsSection
                appointments={isAppAdmin ? appointments : visibleAppointments}
                branches={isAppAdmin ? branches : [activeBranch]}
                services={services}
                doctors={isAppAdmin ? doctors : visibleDoctors}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB CONTENT: ADMINISTRATE CLINICS (APP ADMIN ONLY) */}
          {/* ================================================================= */}
          {activeTab === 'branches' && isAppAdmin && (
            <ClinicManagementTab
              branches={branches}
              onRefreshData={loadAllAdminData}
              showNotification={showNotification}
            />
          )}

          {/* ================================================================= */}
          {/* TAB CONTENT: CLINIC ADMINS (APP ADMIN ONLY - ADD & VIEW THEM) */}
          {/* ================================================================= */}
          {activeTab === 'clinic_admins' && isAppAdmin && (
            <ClinicAdminsTab
              clinicAdmins={clinicAdmins}
              branches={branches}
              onRefreshData={loadAllAdminData}
              showNotification={showNotification}
            />
          )}

          {/* ================================================================= */}
          {/* TAB CONTENT: DOCTORS (VIEW-ONLY FOR APP ADMIN, FULL MGMT FOR CLINIC ADMIN) */}
          {/* ================================================================= */}
          {activeTab === 'doctors' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Box */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {isAppAdmin
                      ? 'Doctors Directory in Clinics'
                      : `Specialist Roster & Doctors Management (${activeBranch?.name.replace('Smile Dental - ', '')})`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                    {isAppAdmin
                      ? 'Browse practicing specialists and doctor bios across clinics in the network.'
                      : 'Add, edit, and delete doctor profiles for your clinic studio, and review complete clinical bios.'}
                  </p>
                </div>

                {(isClinicAdmin || isAppAdmin) && (
                  <button
                    onClick={() => {
                      const defaultBranch = effectiveClinicId !== 'all' ? effectiveClinicId : branches[0]?.id || 'branch-downtown';
                      setEditingDoctorId(null);
                      setDoctorFormData({
                        name: '',
                        email: '',
                        password: 'doctor123',
                        phone: '(555) 234-1100',
                        title: 'Specialist Dentist',
                        qualification: 'DDS / DMD Board Certified',
                        specialization: 'Cosmetic & Aesthetic Dentistry',
                        experienceYears: 8,
                        bio: '',
                        imageUrl: `https://picsum.photos/seed/doc-${Date.now()}/800/800`,
                        branchIds: [defaultBranch],
                        serviceIds: services.length > 0 ? [services[0].id] : ['srv-checkup-cleaning'],
                        languages: 'English',
                      });
                      setIsAddDoctorModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4 text-teal-400" />
                    <span>Create Doctor Account</span>
                  </button>
                )}
              </div>

              {/* Doctors Roster Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleDoctors.map((doc) => {
                  const assignedBranchNames = branches
                    .filter((b) => doc.branchIds?.includes(b.id))
                    .map((b) => b.name.replace('Smile Dental - ', ''));
                  const docAppointmentsCount = appointments.filter((a) => a.doctorId === doc.id).length;

                  return (
                    <div
                      key={doc.id}
                      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all"
                    >
                      <div className="space-y-4">
                        {/* Doctor Head Info */}
                        <div className="flex items-start gap-4">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-teal-600/20 shrink-0 shadow-2xs">
                            <Image
                              src={
                                doc.imageUrl && doc.imageUrl.startsWith('http')
                                  ? doc.imageUrl
                                  : `https://picsum.photos/seed/${doc.id}/800/800`
                              }
                              alt={doc.name}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="font-bold text-base text-slate-900 truncate">{doc.name}</h3>
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200 shrink-0">
                                Active
                              </span>
                            </div>
                            <p className="text-xs text-teal-800 font-semibold truncate">{doc.title}</p>
                            <p className="text-[11px] text-slate-500 truncate">{doc.qualification}</p>
                          </div>
                        </div>

                        {/* Specialization & Studios */}
                        <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-500">Specialty:</span>
                            <span className="font-semibold text-slate-900">{doc.specialization}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-500">Experience:</span>
                            <span className="font-semibold text-slate-900">{doc.experienceYears} Years</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-500">Studios:</span>
                            <span className="font-medium text-slate-800 text-right truncate max-w-[170px]">
                              {assignedBranchNames.join(', ') || 'All Studios'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="text-slate-500">Appointments:</span>
                            <span className="font-bold text-teal-800">{docAppointmentsCount} Bookings</span>
                          </div>
                        </div>

                        {/* Bio snippet */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                          &quot;{doc.bio}&quot;
                        </p>
                      </div>

                      {/* Doctor Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        {/* Complete Bio Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedDoctorForBio(doc)}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-400" />
                          <span>View Complete Bio & Qualifications</span>
                        </button>

                        {/* Edit & Delete for Clinic Admin only */}
                        {isClinicAdmin && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditDoctor(doc)}
                              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all border border-slate-200"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                              <span>Edit Doctor</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                              className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all border border-rose-200"
                              title="Delete Doctor"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB CONTENT: REGISTER & MANAGE PATIENTS (CLINIC ADMIN) */}
          {/* ================================================================= */}
          {activeTab === 'users' && isClinicAdmin && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Search & Actions Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by patient name, email, phone, or insurance..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                  {userSearch && (
                    <button
                      onClick={() => setUserSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing <strong className="text-slate-900">{filteredUsers.length}</strong> of {visibleUsers.length} patients
                  </span>
                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register New Patient</span>
                  </button>
                </div>
              </div>

              {/* Patient Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Patient Name & Contact</th>
                        <th className="py-3.5 px-5">Dental Insurance</th>
                        <th className="py-3.5 px-5">Clinical / Medical Notes</th>
                        <th className="py-3.5 px-5 text-center">Visits</th>
                        <th className="py-3.5 px-5">Registered Date</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((patient) => (
                          <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                                  {patient.fullName.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 text-sm">{patient.fullName}</div>
                                  <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    <span>{patient.email}</span>
                                  </div>
                                  <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Phone className="w-3 h-3 text-slate-400" />
                                    <span>{patient.phone || 'No phone'}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-5">
                              {patient.dentalInsurance ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-[11px] font-semibold">
                                  <Shield className="w-3 h-3 text-teal-600" />
                                  {patient.dentalInsurance}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Self-Pay / Private</span>
                              )}
                            </td>

                            <td className="py-4 px-5 max-w-xs">
                              <p className="text-slate-600 line-clamp-2 text-[11px]">
                                {patient.medicalNotes || 'No special clinical notes recorded.'}
                              </p>
                            </td>

                            <td className="py-4 px-5 text-center">
                              <span className="font-extrabold text-slate-900 text-sm">
                                {patient.totalAppointments}
                              </span>
                            </td>

                            <td className="py-4 px-5 text-slate-500 whitespace-nowrap text-[11px]">
                              {new Date(patient.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </td>

                            <td className="py-4 px-5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedUserForDetail(patient)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                  title="View full patient history & profile"
                                >
                                  <Eye className="w-4 h-4 text-teal-700" />
                                </button>
                                <button
                                  onClick={() => handleDeletePatient(patient.email, patient.fullName)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                  title="Delete patient record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500">
                            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="font-semibold text-sm">No registered patients found</p>
                            <p className="text-xs text-slate-400 mt-1">Register a new patient or adjust search criteria.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB CONTENT: HISTORY OF PATIENTS (CLINIC ADMIN) */}
          {/* ================================================================= */}
          {activeTab === 'patient_history' && isClinicAdmin && (
            <PatientHistoryTab
              patients={visibleUsers}
              appointments={visibleAppointments}
              doctors={visibleDoctors}
              clinicName={activeBranch?.name || 'Clinic Studio'}
            />
          )}

          {/* ================================================================= */}
          {/* TAB CONTENT: CLINIC APPOINTMENTS (CLINIC ADMIN) */}
          {/* ================================================================= */}
          {activeTab === 'appointments' && isClinicAdmin && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    placeholder="Search by appointment code, patient, doctor, or treatment..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <span className="text-xs text-slate-500 font-medium shrink-0">
                  Total Bookings: <strong className="text-slate-900">{filteredAppointments.length} Visits</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold bg-teal-50 px-2.5 py-1 rounded-md text-teal-800 border border-teal-200">
                          {apt.appointmentCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : apt.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{apt.serviceName}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Patient: <strong>{apt.patientName}</strong> ({apt.patientEmail})
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>{apt.appointmentDate} at {apt.startTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                          <span className="truncate">{apt.doctorName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-12 text-center text-slate-400 text-xs">
                    No appointments match your search.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB CONTENT: CLINIC PROFILE & PHOTOS (CLINIC ADMIN) */}
          {/* ================================================================= */}
          {activeTab === 'clinic_profile' && isClinicAdmin && activeBranch && (
            <div className="animate-in fade-in duration-200">
              <ClinicProfileAndImagesTab
                branch={activeBranch}
                onRefreshData={loadAllAdminData}
                showNotification={showNotification}
              />
            </div>
          )}
        </div>
      </main>

      {/* ================================================================= */}
      {/* MODAL: COMPLETE BIO OF DOCTOR */}
      {/* ================================================================= */}
      {selectedDoctorForBio && (
        <DoctorBioModal
          doctor={selectedDoctorForBio}
          branches={branches}
          canEdit={isClinicAdmin}
          onClose={() => setSelectedDoctorForBio(null)}
          onEdit={(doc) => {
            setSelectedDoctorForBio(null);
            handleOpenEditDoctor(doc);
          }}
        />
      )}

      {/* ================================================================= */}
      {/* MODAL: CREATE / EDIT DOCTOR ACCOUNT (CLINIC ADMIN) */}
      {/* ================================================================= */}
      {isAddDoctorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingDoctorId ? 'Edit Doctor Profile' : 'Create Clinic Doctor Account'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingDoctorId ? 'Update doctor credentials and clinical bio' : 'Register a new clinician for this studio'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddDoctorModalOpen(false);
                  setEditingDoctorId(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4">
              {/* Doctor Photo */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-teal-600" />
                    Doctor Portrait Photo URL
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">Optional</span>
                </label>
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 ring-2 ring-teal-600/30 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        doctorFormData.imageUrl && doctorFormData.imageUrl.startsWith('http')
                          ? doctorFormData.imageUrl
                          : 'https://picsum.photos/seed/doctor-preview/800/800'
                      }
                      alt="Doctor portrait preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/doctor-preview/800/800';
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    value={doctorFormData.imageUrl}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, imageUrl: e.target.value })}
                    placeholder="https://picsum.photos/seed/... (auto-generated if left blank)"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const seed = Math.floor(Math.random() * 10000);
                      setDoctorFormData({
                        ...doctorFormData,
                        imageUrl: `https://picsum.photos/seed/dentist-${seed}/800/800`,
                      });
                    }}
                    className="px-3 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl whitespace-nowrap cursor-pointer shrink-0"
                    title="Generate randomized avatar URL"
                  >
                    Random Photo
                  </button>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorFormData.name}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, name: e.target.value })}
                    placeholder="e.g. Dr. Maya Lin"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Title
                  </label>
                  <input
                    type="text"
                    value={doctorFormData.title}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, title: e.target.value })}
                    placeholder="e.g. Lead Cosmetic Dentist"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Credentials & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorFormData.specialization}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, specialization: e.target.value })}
                    placeholder="e.g. Orthodontics & Invisalign"
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
                    max="50"
                    value={doctorFormData.experienceYears}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, experienceYears: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Verified Degree / Qualifications */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Degrees & Board Certifications
                </label>
                <input
                  type="text"
                  value={doctorFormData.qualification}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, qualification: e.target.value })}
                  placeholder="e.g. DDS, NYU College of Dentistry | AAED Fellow"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {/* Complete Clinical Biography */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Biography & Profile
                </label>
                <textarea
                  rows={3}
                  value={doctorFormData.bio}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, bio: e.target.value })}
                  placeholder="Comprehensive clinical background, areas of expertise, treatment philosophy... (auto-generated if left blank)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {/* Login Email, Password & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Email (Login ID)
                  </label>
                  <input
                    type="email"
                    value={doctorFormData.email}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, email: e.target.value })}
                    placeholder="dr.name@smiledental.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Login Password
                  </label>
                  <input
                    type="text"
                    value={doctorFormData.password}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, password: e.target.value })}
                    placeholder="doctor123"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Clinical Direct Phone
                  </label>
                  <input
                    type="tel"
                    value={doctorFormData.phone}
                    onChange={(e) => setDoctorFormData({ ...doctorFormData, phone: e.target.value })}
                    placeholder="(555) 234-1100"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Languages Spoken */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Languages Spoken (comma separated)
                </label>
                <input
                  type="text"
                  value={doctorFormData.languages}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, languages: e.target.value })}
                  placeholder="English, Spanish, Mandarin"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              {/* Assigned Clinic Studio(s) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Assigned Clinic Studio(s) *</span>
                  <span className="text-[11px] font-normal text-slate-500">Select where the doctor practices</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {branches.map((b) => {
                    const isSelected = doctorFormData.branchIds.includes(b.id);
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          const exists = doctorFormData.branchIds.includes(b.id);
                          const next = exists
                            ? doctorFormData.branchIds.filter((id) => id !== b.id)
                            : [...doctorFormData.branchIds, b.id];
                          setDoctorFormData({
                            ...doctorFormData,
                            branchIds: next.length > 0 ? next : [b.id],
                          });
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{b.name.replace('Smile Dental - ', '')}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dental Services Offered */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Clinical Procedures & Services *</span>
                  <span className="text-[11px] font-normal text-slate-500">Procedures performed by this doctor</span>
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  {services.map((s) => {
                    const isSelected = doctorFormData.serviceIds.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          const exists = doctorFormData.serviceIds.includes(s.id);
                          const next = exists
                            ? doctorFormData.serviceIds.filter((id) => id !== s.id)
                            : [...doctorFormData.serviceIds, s.id];
                          setDoctorFormData({
                            ...doctorFormData,
                            serviceIds: next.length > 0 ? next : [s.id],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 border-teal-600 text-white font-semibold shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddDoctorModalOpen(false);
                    setEditingDoctorId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {editingDoctorId ? 'Save Doctor Changes' : 'Create Doctor Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: REGISTER NEW PATIENT (CLINIC ADMIN) */}
      {/* ================================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Register New Patient</h3>
                  <p className="text-xs text-slate-500">Add patient profile to clinical records for {activeBranch?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userFormData.fullName}
                  onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Dental Insurance Carrier & Policy ID
                </label>
                <input
                  type="text"
                  value={userFormData.dentalInsurance}
                  onChange={(e) => setUserFormData({ ...userFormData, dentalInsurance: e.target.value })}
                  placeholder="e.g. Delta Dental Premier (ID #88291)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Medical Notes or Allergies
                </label>
                <textarea
                  rows={2}
                  value={userFormData.medicalNotes}
                  onChange={(e) => setUserFormData({ ...userFormData, medicalNotes: e.target.value })}
                  placeholder="e.g. Latex sensitivity, dental anxiety, previous implant..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: PATIENT HISTORY & DETAIL DRAWER */}
      {/* ================================================================= */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
                  {selectedUserForDetail.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">{selectedUserForDetail.fullName}</h3>
                  <p className="text-xs text-slate-500">{selectedUserForDetail.email} • {selectedUserForDetail.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Data Summary */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Insurance Provider:</span>
                <p className="font-bold text-slate-900">{selectedUserForDetail.dentalInsurance || 'None Recorded'}</p>
              </div>
              <div>
                <span className="text-slate-500">Registration Date:</span>
                <p className="font-bold text-slate-900">{new Date(selectedUserForDetail.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">Clinical & Medical Notes:</span>
                <p className="font-medium text-slate-800 mt-0.5">{selectedUserForDetail.medicalNotes || 'No notes on file.'}</p>
              </div>
            </div>

            {/* Booked Appointments for this patient */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Appointment History ({appointments.filter((a) => a.patientEmail.toLowerCase() === selectedUserForDetail.email.toLowerCase()).length})
              </h4>

              <div className="space-y-3">
                {appointments.filter((a) => a.patientEmail.toLowerCase() === selectedUserForDetail.email.toLowerCase()).length > 0 ? (
                  appointments
                    .filter((a) => a.patientEmail.toLowerCase() === selectedUserForDetail.email.toLowerCase())
                    .map((apt) => (
                      <div key={apt.id} className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-teal-800 text-xs bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {apt.appointmentCode}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm mt-1">{apt.serviceName}</h5>
                          <p className="text-xs text-slate-500">
                            Specialist: {apt.doctorName} • {apt.branchName?.replace('Smile Dental - ', '')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 text-xs">{apt.appointmentDate}</div>
                          <div className="text-teal-700 font-semibold text-xs">{apt.startTime} - {apt.endTime}</div>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-rose-50 text-rose-800'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No appointments booked by this patient yet.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedUserForDetail(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <SmileAssistant />
    </div>
  );
}

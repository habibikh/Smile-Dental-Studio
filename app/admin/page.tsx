'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmileAssistant from '@/components/ai/SmileAssistant';
import {
  Users,
  UploadCloud,
  Database,
  Calendar,
  Building2,
  Stethoscope,
  Sparkles,
  Download,
  RotateCcw,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Shield,
  FileText,
  Copy,
  Check,
  Filter,
  Eye,
  X,
  FileJson,
  Layers,
  ArrowRight,
  Smile,
  BarChart3,
  TrendingUp,
  PieChart
} from 'lucide-react';
import AdminChartsSection from '@/components/admin/AdminChartsSection';
import {
  PatientProfile,
  Appointment,
  Doctor,
  Branch,
  Service,
  AdminStats,
  DatabaseDataset
} from '@/types/dental';

export default function AdminPage() {
  // Navigation Tabs: 'analytics' | 'users' | 'data' | 'appointments' | 'doctors' | 'branches' | 'services'
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'data' | 'appointments' | 'doctors' | 'branches' | 'services'>('analytics');

  // Core Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<(PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Search & Filtering
  const [userSearch, setUserSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');
  const [appointmentBranchFilter, setAppointmentBranchFilter] = useState('all');

  // Modals & Drawers
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<(PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string }) | null>(null);
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

  // Re-upload JSON States
  const [jsonUploadCategory, setJsonUploadCategory] = useState<'all' | 'doctors' | 'branches' | 'services' | 'schedules' | 'patients'>('all');
  const [jsonInputText, setJsonInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = React.useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  }, []);

  // Fetch initial data
  const loadAllAdminData = React.useCallback(async () => {
    try {
      const [dataRes, usersRes, aptsRes, docRes, branchRes, srvRes] = await Promise.all([
        fetch('/api/admin/data').then((r) => r.json()),
        fetch('/api/admin/users').then((r) => r.json()),
        fetch('/api/appointments').then((r) => r.json()),
        fetch('/api/doctors').then((r) => r.json()),
        fetch('/api/branches').then((r) => r.json()),
        fetch('/api/services').then((r) => r.json()),
      ]);

      if (dataRes.stats) setStats(dataRes.stats);
      if (usersRes.users) setUsers(usersRes.users);
      if (aptsRes.appointments) setAppointments(aptsRes.appointments);
      if (docRes.doctors) setDoctors(docRes.doctors);
      if (branchRes.branches) setBranches(branchRes.branches);
      if (srvRes.services) setServices(srvRes.services);
    } catch (err: unknown) {
      console.error('Failed to load admin data:', err);
      showNotification('error', 'Failed to load clinic dataset. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAllAdminData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadAllAdminData]);

  // Handle Export Full Database JSON
  const handleExportDatabase = async () => {
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Export failed');

      const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smile-dental-clinic-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('success', 'Full database JSON backup downloaded successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to export';
      showNotification('error', msg);
    }
  };

  // Handle Reset Database to Seed
  const handleResetDatabase = async () => {
    if (!confirm('Are you sure you want to reset the database to original initial seeds? All recent appointments and custom edits will be replaced with clean defaults.')) {
      return;
    }
    setIsUploading(true);
    try {
      const res = await fetch('/api/admin/data', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Database successfully reset to initial clinical seeds.');
        await loadAllAdminData();
      } else {
        throw new Error(data.error || 'Reset failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reset failed';
      showNotification('error', msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle File Input Re-upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonInputText(text);
        showNotification('info', `Loaded file "${file.name}". Click "Apply Re-upload" below to update database.`);
      } catch (err) {
        showNotification('error', 'Failed to read file content.');
      }
    };
    reader.readAsText(file);
  };

  // Handle Reupload JSON Submission
  const handleApplyReupload = async () => {
    if (!jsonInputText.trim()) {
      showNotification('error', 'Please enter or upload a valid JSON payload.');
      return;
    }

    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(jsonInputText);
    } catch (e) {
      showNotification('error', 'JSON syntax error: Please check your JSON format.');
      return;
    }

    setIsUploading(true);
    try {
      let payloadToSend: Record<string, unknown> = {};

      if (jsonUploadCategory === 'all') {
        payloadToSend = parsedPayload;
      } else {
        // Wrap single array under appropriate key if user pasted a raw array
        if (Array.isArray(parsedPayload)) {
          payloadToSend[jsonUploadCategory] = parsedPayload;
        } else if (parsedPayload[jsonUploadCategory]) {
          payloadToSend[jsonUploadCategory] = parsedPayload[jsonUploadCategory];
        } else {
          payloadToSend = parsedPayload;
        }
      }

      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', 'Database updated! ' + JSON.stringify(data.result?.counts || {}));
        setJsonInputText('');
        await loadAllAdminData();
      } else {
        throw new Error(data.error || 'Failed to update database');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Re-upload failed';
      showNotification('error', msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Quick Template Loading
  const handleLoadSampleTemplate = (type: 'all' | 'doctors' | 'branches' | 'services') => {
    setJsonUploadCategory(type);
    if (type === 'doctors') {
      setJsonInputText(JSON.stringify(doctors, null, 2));
    } else if (type === 'branches') {
      setJsonInputText(JSON.stringify(branches, null, 2));
    } else if (type === 'services') {
      setJsonInputText(JSON.stringify(services, null, 2));
    } else {
      // Export current full snapshot to editor
      fetch('/api/admin/data')
        .then((r) => r.json())
        .then((d) => {
          if (d.data) setJsonInputText(JSON.stringify(d.data, null, 2));
        });
    }
  };

  // Handle Save / Add New Patient
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
        body: JSON.stringify(userFormData),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Patient "${userFormData.fullName}" saved to directory.`);
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
      const msg = err instanceof Error ? err.message : 'Save failed';
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

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q) ||
      (u.dentalInsurance && u.dentalInsurance.toLowerCase().includes(q)) ||
      (u.medicalNotes && u.medicalNotes.toLowerCase().includes(q))
    );
  });

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const q = appointmentSearch.toLowerCase().trim();
    if (q) {
      const match =
        apt.appointmentCode.toLowerCase().includes(q) ||
        apt.patientName.toLowerCase().includes(q) ||
        apt.patientEmail.toLowerCase().includes(q) ||
        (apt.doctorName && apt.doctorName.toLowerCase().includes(q)) ||
        (apt.serviceName && apt.serviceName.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (appointmentStatusFilter !== 'all' && apt.status !== appointmentStatusFilter) {
      return false;
    }
    if (appointmentBranchFilter !== 'all' && apt.branchId !== appointmentBranchFilter) {
      return false;
    }
    return true;
  });

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
              {notification.type === 'info' && <Database className="w-5 h-5 text-cyan-400 shrink-0" />}
              <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="p-1 hover:bg-white/20 rounded-lg text-white/70 hover:text-white ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Admin Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Clinic Data & Patient Management
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Inspect registered users, manage schedules, and re-upload complete clinic datasets.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportDatabase}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Download JSON dataset backup"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handleResetDatabase}
                disabled={isUploading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                title="Reset to seed data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span>Add Patient</span>
              </button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-8">
            <div
              onClick={() => setActiveTab('analytics')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'analytics' ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Analytics</span>
                <BarChart3 className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">Charts</div>
              <p className="text-[11px] text-teal-800 font-medium mt-0.5">Distribution</p>
            </div>

            <div
              onClick={() => setActiveTab('users')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'users' ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patients</span>
                <Users className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{users.length}</div>
              <p className="text-[11px] text-teal-800 font-medium mt-0.5">Registered Users</p>
            </div>

            <div
              onClick={() => setActiveTab('appointments')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'appointments' ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Visits</span>
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{appointments.length}</div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Total Bookings</p>
            </div>

            <div
              onClick={() => setActiveTab('doctors')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'doctors' ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Doctors</span>
                <Stethoscope className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{doctors.length}</div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Specialists</p>
            </div>

            <div
              onClick={() => setActiveTab('branches')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'branches' ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Studios</span>
                <Building2 className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{branches.length}</div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Clinic Locations</p>
            </div>

            <div
              onClick={() => setActiveTab('services')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Services</span>
                <Smile className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{services.length}</div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Care Treatments</p>
            </div>

            <div
              onClick={() => setActiveTab('data')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'data' ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600/10' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Re-upload</span>
                <UploadCloud className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">JSON</div>
              <p className="text-[11px] text-teal-800 font-medium mt-0.5">Bulk Upload & Edit</p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Analytics & Charts</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Patients ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Re-upload Data (Doctors, Branches, etc.)</span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'appointments'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>All Appointments ({appointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctors ({doctors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('branches')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'branches'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Studios ({branches.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Services ({services.length})</span>
            </button>
          </div>

          {/* ================================================================= */}
          {/* TAB 0: ANALYTICS & RECHARTS DISTRIBUTION */}
          {/* ================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <AdminChartsSection
                appointments={appointments}
                branches={branches}
                services={services}
                doctors={doctors}
              />
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 1: REGISTERED USERS / PATIENTS DIRECTORY */}
          {/* ================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Search & Actions Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by patient name, email, phone, or insurance provider..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all"
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
                    Showing <strong className="text-slate-900">{filteredUsers.length}</strong> of {users.length} patients
                  </span>
                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Patient</span>
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
                        <th className="py-3.5 px-5">Medical / Clinical Notes</th>
                        <th className="py-3.5 px-5 text-center">Appointments</th>
                        <th className="py-3.5 px-5">Registered Date</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((patient) => {
                          return (
                            <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Patient Contact Info */}
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                                    {patient.fullName.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 text-sm">{patient.fullName}</div>
                                    <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        {patient.email}
                                      </span>
                                    </div>
                                    <div className="text-slate-500 flex items-center gap-1 mt-0.5">
                                      <Phone className="w-3 h-3 text-slate-400" />
                                      {patient.phone || 'No phone'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Dental Insurance */}
                              <td className="py-4 px-5">
                                {patient.dentalInsurance ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 text-[11px] font-semibold">
                                    <Shield className="w-3 h-3 text-teal-600" />
                                    {patient.dentalInsurance}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">Self-Pay / None</span>
                                )}
                              </td>

                              {/* Medical Notes */}
                              <td className="py-4 px-5 max-w-xs">
                                <p className="text-slate-600 line-clamp-2 text-[11px]">
                                  {patient.medicalNotes || 'No special clinical notes recorded.'}
                                </p>
                              </td>

                              {/* Appointments count */}
                              <td className="py-4 px-5 text-center">
                                <div className="inline-flex flex-col items-center">
                                  <span className="font-extrabold text-slate-900 text-sm">
                                    {patient.totalAppointments}
                                  </span>
                                  {patient.upcomingAppointments > 0 ? (
                                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full mt-0.5 border border-teal-200">
                                      {patient.upcomingAppointments} upcoming
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400">0 active</span>
                                  )}
                                </div>
                              </td>

                              {/* Registered Date */}
                              <td className="py-4 px-5 text-slate-500 whitespace-nowrap text-[11px]">
                                {new Date(patient.createdAt).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedUserForDetail(patient)}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                                    title="View patient history & profile"
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
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500">
                            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="font-semibold text-sm">No registered patients found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or register a new patient.</p>
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
          {/* TAB 2: DATA RE-UPLOAD & JSON MANAGER (Doctors, Branches, etc.) */}
          {/* ================================================================= */}
          {activeTab === 'data' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Instructions & Template Shortcuts */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold uppercase tracking-wider mb-2 shadow-xs">
                    <UploadCloud className="w-3.5 h-3.5 text-teal-600" />
                    Bulk JSON Database Importer
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Re-upload Clinic Data & Overwrite Records
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                    You can re-upload or update doctors, branch locations, treatment catalog, doctor schedules, or the full clinic dataset via JSON format. Changes immediately update the live availability engine and booking wizard.
                  </p>
                </div>

                {/* Quick Preset Selector Buttons */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    1. Choose Data Scope or Load Current Dataset Template:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleLoadSampleTemplate('all')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        jsonUploadCategory === 'all'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Full Database Snapshot (All Collections)
                    </button>
                    <button
                      onClick={() => handleLoadSampleTemplate('doctors')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        jsonUploadCategory === 'doctors'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Doctors Only ({doctors.length} records)
                    </button>
                    <button
                      onClick={() => handleLoadSampleTemplate('branches')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        jsonUploadCategory === 'branches'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Studios / Branches ({branches.length} records)
                    </button>
                    <button
                      onClick={() => handleLoadSampleTemplate('services')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        jsonUploadCategory === 'services'
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Services & Pricing ({services.length} records)
                    </button>
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    2. Upload .JSON File or Paste JSON Content:
                  </span>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-teal-600 bg-slate-50 hover:bg-teal-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json,application/json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <FileJson className="w-10 h-10 text-slate-400 group-hover:text-teal-600 mx-auto mb-2 transition-colors" />
                    <p className="text-sm font-bold text-slate-800">
                      Click to browse or drop your JSON file here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports full export backups or category arrays (doctors, branches, services, schedules)
                    </p>
                  </div>
                </div>

                {/* JSON Code Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      JSON Content Editor:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (jsonInputText) {
                            navigator.clipboard.writeText(jsonInputText);
                            setCopiedNotification(true);
                            setTimeout(() => setCopiedNotification(false), 2000);
                          }
                        }}
                        className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedNotification ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedNotification ? 'Copied' : 'Copy JSON'}
                      </button>
                      <button
                        onClick={() => setJsonInputText('')}
                        className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer ml-2"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={14}
                    value={jsonInputText}
                    onChange={(e) => setJsonInputText(e.target.value)}
                    placeholder='{\n  "doctors": [ ... ],\n  "branches": [ ... ],\n  "services": [ ... ]\n}'
                    className="w-full p-4 font-mono text-xs bg-slate-900 text-teal-300 rounded-2xl border border-slate-700 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all leading-relaxed shadow-inner"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-teal-600" />
                    <span>Uploads are validated before committing to clinic store.</span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleApplyReupload}
                      disabled={isUploading || !jsonInputText.trim()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{isUploading ? 'Validating & Committing...' : 'Apply Re-upload & Overwrite'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: ALL APPOINTMENTS */}
          {/* ================================================================= */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Filter controls */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={appointmentSearch}
                    onChange={(e) => setAppointmentSearch(e.target.value)}
                    placeholder="Search by code, patient name, email, or doctor..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={appointmentStatusFilter}
                    onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={appointmentBranchFilter}
                    onChange={(e) => setAppointmentBranchFilter(e.target.value)}
                    className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="all">All Studios</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name.replace('Smile Dental - ', '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointments List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-5">Code & Status</th>
                        <th className="py-3.5 px-5">Patient</th>
                        <th className="py-3.5 px-5">Doctor / Specialist</th>
                        <th className="py-3.5 px-5">Treatment</th>
                        <th className="py-3.5 px-5">Studio Location</th>
                        <th className="py-3.5 px-5">Date & Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((apt) => {
                          const isConfirmed = apt.status === 'confirmed';
                          const isCancelled = apt.status === 'cancelled';
                          return (
                            <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                              <td className="py-4 px-5">
                                <span className="font-mono font-bold text-teal-900 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 block w-fit">
                                  {apt.appointmentCode}
                                </span>
                                <span
                                  className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    isConfirmed
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : isCancelled
                                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {apt.status}
                                </span>
                              </td>

                              <td className="py-4 px-5">
                                <div className="font-bold text-slate-900">{apt.patientName}</div>
                                <div className="text-slate-500 text-[11px]">{apt.patientEmail}</div>
                                <div className="text-slate-400 text-[10px]">{apt.patientPhone}</div>
                              </td>

                              <td className="py-4 px-5 font-semibold text-slate-800">
                                {apt.doctorName || 'Assigned Specialist'}
                              </td>

                              <td className="py-4 px-5 font-medium text-slate-800">
                                {apt.serviceName || 'Consultation'}
                              </td>

                              <td className="py-4 px-5 text-slate-600 text-[11px]">
                                {apt.branchName?.replace('Smile Dental - ', '') || 'Clinic Studio'}
                              </td>

                              <td className="py-4 px-5 whitespace-nowrap">
                                <div className="font-bold text-slate-900">{apt.appointmentDate}</div>
                                <div className="text-teal-700 font-semibold text-[11px]">
                                  {apt.startTime} – {apt.endTime}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-500">
                            No appointments found matching your criteria.
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
          {/* TAB 4: DOCTORS ROSTER */}
          {/* ================================================================= */}
          {activeTab === 'doctors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{doc.name}</h3>
                      <p className="text-xs text-teal-800 font-semibold">{doc.title}</p>
                      <p className="text-xs text-slate-500">{doc.qualification}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{doc.experienceYears} Years Clinical Exp.</span>
                    <span className="font-bold text-slate-900">★ {doc.rating} ({doc.reviewsCount})</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: STUDIOS / BRANCHES */}
          {/* ================================================================= */}
          {activeTab === 'branches' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
              {branches.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{b.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        {b.address}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-800 text-[10px] font-bold rounded-full border border-teal-200">
                      {b.city}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {b.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {b.openingHours}
                    </span>
                    <span className="font-bold text-slate-900">{b.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: SERVICES CATALOG */}
          {/* ================================================================= */}
          {activeTab === 'services' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
              {services.map((srv) => (
                <div key={srv.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {srv.category}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-2">{srv.name}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900">${srv.price}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {srv.shortDescription || srv.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {srv.durationMinutes} Minutes
                    </span>
                    <span className="text-emerald-700 font-semibold">Active in Booking</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ================================================================= */}
      {/* MODAL: ADD / REGISTER NEW PATIENT */}
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
                  <p className="text-xs text-slate-500">Add patient profile to clinical records</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
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

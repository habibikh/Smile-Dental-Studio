'use client';

import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Plus,
  Mail,
  Lock,
  Phone,
  Trash2,
  UserCheck,
  CheckCircle2,
  X,
  KeyRound
} from 'lucide-react';
import { ClinicAdminAccount, Branch } from '@/types/dental';

interface ClinicAdminsTabProps {
  clinicAdmins: ClinicAdminAccount[];
  branches: Branch[];
  onRefreshData: () => Promise<void>;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function ClinicAdminsTab({
  clinicAdmins,
  branches,
  onRefreshData,
  showNotification,
}: ClinicAdminsTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'smile1234',
    phone: '(555) 234-1100',
    clinicId: branches[0]?.id || 'branch-downtown',
  });

  const handleCreateClinicAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.clinicId) {
      showNotification('error', 'Name, email, and assigned studio are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/clinic-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', `Clinic Administrator account "${formData.name}" successfully created.`);
        setIsAddModalOpen(false);
        setFormData({
          name: '',
          email: '',
          password: 'smile1234',
          phone: '(555) 234-1100',
          clinicId: branches[0]?.id || 'branch-downtown',
        });
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to create clinic administrator');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Creation failed';
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (admin: ClinicAdminAccount) => {
    if (!confirm(`Are you sure you want to remove clinic administrator "${admin.name}" (${admin.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/clinic-admins?id=${admin.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Clinic administrator "${admin.name}" removed.`);
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showNotification('error', msg);
    }
  };

  return (
    <div id="clinic-admins-section" className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-slate-900">
                  Clinic Administrators & Directors
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                  Application Admin Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                The clinic admin account can be created by the application admin. Clinic admins manage doctors and studio appointments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Create Clinic Admin</span>
          </button>
        </div>

        {/* Primary Clinic Admin Credentials Callout */}
        <div className="mb-6 p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-teal-900">Primary Clinic Admin Account</p>
              <p className="text-xs text-teal-700">
                Username: <strong className="font-mono text-teal-950 font-bold">doctor@smiledental.com</strong> | Password: <strong className="font-mono text-teal-950 font-bold">smile1234</strong>
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white text-teal-800 border border-teal-300 self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            Can Create Doctor Accounts
          </span>
        </div>

        {/* Clinic Admins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicAdmins.map((admin) => {
            const assignedBranch = branches.find((b) => b.id === admin.clinicId);
            return (
              <div
                key={admin.id}
                className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{admin.name}</h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          <UserCheck className="w-3 h-3" />
                          Clinic Admin
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(admin)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete clinic admin account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Studio Assignment */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Assigned Studio:
                    </span>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{assignedBranch?.name || admin.clinicName || 'Downtown Metro'}</span>
                    </p>
                  </div>

                  {/* Credentials Box */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Username:</span>
                      <span className="font-mono text-slate-900 font-bold truncate max-w-[170px]">{admin.email}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Password:</span>
                      <span className="font-mono text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {admin.password || 'smile1234'}
                      </span>
                    </div>
                    {admin.phone && (
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Phone:</span>
                        <span className="text-slate-800">{admin.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Authorized role: Clinic Admin</span>
                  <span>Can manage doctors</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Create Clinic Admin Account */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create Clinic Admin Account</h3>
                <p className="text-xs text-slate-500">Provide credentials for the clinic administrator</p>
              </div>
            </div>

            <form onSubmit={handleCreateClinicAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Administrator Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Jordan Hayes"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Username / Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="clinic.admin@smiledental.com"
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
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
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="smile1234"
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Direct Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 234-1100"
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned Clinic Studio
                </label>
                <select
                  value={formData.clinicId}
                  onChange={(e) => setFormData({ ...formData, clinicId: e.target.value })}
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white cursor-pointer"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>{isSubmitting ? 'Creating...' : 'Create Clinic Admin Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

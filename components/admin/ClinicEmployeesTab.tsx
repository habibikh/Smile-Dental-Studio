'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Users,
  Briefcase,
  Plus,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  Trash2,
  Stethoscope,
  X,
  UserCheck
} from 'lucide-react';
import { Doctor, PersonalAssistant } from '@/types/dental';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ClinicEmployeesTabProps {
  clinicName: string;
  doctors: Doctor[];
  personalAssistants: PersonalAssistant[];
  onRefreshData: () => Promise<void>;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function ClinicEmployeesTab({
  clinicName,
  doctors,
  personalAssistants,
  onRefreshData,
  showNotification,
}: ClinicEmployeesTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: doctors[0]?.id || '',
    name: '',
    email: '',
    phone: '',
    title: 'Clinical Personal Assistant',
    status: 'active' as const,
  });

  const clinicDoctorIds = new Set(doctors.map((d) => d.id));
  const clinicPAs = personalAssistants.filter((pa) => clinicDoctorIds.has(pa.doctorId));

  // Doctors in this clinic who don't have a PA yet
  const availableDoctors = doctors.filter((doc) => !personalAssistants.some((pa) => pa.doctorId === doc.id));

  const handleSavePA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.name || !formData.email || !formData.phone) {
      showNotification('error', 'All employee fields and doctor assignment are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/doctors/pa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', `Employee "${formData.name}" assigned to doctor.`);
        setIsAddModalOpen(false);
        setFormData({
          doctorId: availableDoctors[0]?.id || '',
          name: '',
          email: '',
          phone: '',
          title: 'Clinical Personal Assistant',
          status: 'active',
        });
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to save employee');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePA = async (pa: PersonalAssistant) => {
    if (!confirm(`Are you sure you want to remove employee "${pa.name}"?`)) return;

    try {
      const res = await fetch(`/api/doctors/pa?doctorId=${pa.doctorId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Employee "${pa.name}" removed from clinic.`);
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to remove');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Remove failed';
      showNotification('error', msg);
    }
  };

  return (
    <div id="clinic-employees-section" className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">
                Clinic Staff & Personal Assistants
              </h3>
              <p className="text-xs text-slate-500">
                Staff members and Personal Assistants assigned to doctors at {clinicName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            disabled={availableDoctors.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Add Staff / Assistant</span>
          </button>
        </div>

        {/* Staff Table / Cards */}
        {clinicPAs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No personal assistants or staff registered for this clinic yet.
            {availableDoctors.length > 0 && (
              <p className="text-xs text-teal-700 mt-1">
                You have {availableDoctors.length} doctor(s) eligible for a Personal Assistant.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinicPAs.map((pa) => {
              const assignedDoctor = doctors.find((d) => d.id === pa.doctorId);

              return (
                <div
                  key={pa.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-sm">
                          {pa.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{pa.name}</h4>
                          <p className="text-xs text-slate-500">{pa.title || 'Personal Assistant'}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Active Staff
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>
                          Assigned to: <strong className="text-slate-900">{assignedDoctor?.name || 'Assigned Specialist'}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{pa.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{pa.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-3 mt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleDeletePA(pa)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Staff</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Assistant */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">Add Staff / Assistant</h4>
                  <p className="text-xs text-slate-500">Strictly 1 Personal Assistant per Doctor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePA} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign to Doctor *
                </label>
                <select
                  required
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                >
                  <option value="">Select Doctor...</option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assistant Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rachel Adams"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="assistant@smiledental.com"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 234-8899"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LoadingSpinner size="sm" variant="white" label="Saving..." />
                  ) : (
                    'Assign Employee'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

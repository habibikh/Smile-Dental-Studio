'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  History
} from 'lucide-react';
import { PatientProfile, Appointment } from '@/types/dental';

interface PatientRegistrationAndHistoryTabProps {
  clinicName: string;
  clinicId: string;
  users: (PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[];
  appointments: Appointment[];
  onRefreshData: () => Promise<void>;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function PatientRegistrationAndHistoryTab({
  clinicName,
  clinicId,
  users,
  appointments,
  onRefreshData,
  showNotification,
}: PatientRegistrationAndHistoryTabProps) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<(PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string }) | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for registering patient
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'smile1234',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    address: '',
    dentalInsurance: '',
    medicalNotes: '',
  });

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      showNotification('error', 'Patient name and email are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clinicId,
          role: 'patient',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', `Patient "${formData.fullName}" successfully registered for ${clinicName}.`);
        setIsRegisterModalOpen(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: 'smile' + Math.floor(1000 + Math.random() * 9000),
          gender: 'Prefer not to say',
          dateOfBirth: '',
          address: '',
          dentalInsurance: '',
          medicalNotes: '',
        });
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to register patient');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered patients
  const filteredPatients = users.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      (p.dentalInsurance && p.dentalInsurance.toLowerCase().includes(q))
    );
  });

  // Patient appointments for history modal
  const patientAppointments = selectedPatientForHistory
    ? appointments.filter(
        (a) =>
          a.patientEmail.toLowerCase() === selectedPatientForHistory.email.toLowerCase() ||
          a.patientId === selectedPatientForHistory.id
      )
    : [];

  return (
    <div id="patient-registration-history" className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-slate-900">
                  Patients & Treatment History
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                  {clinicName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Register new clinic patients, track past treatment visits, review diagnosis notes, and manage medical records.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Register New Patient</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, email, phone, or insurance..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Patient Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Patient Name & Contact</th>
                <th className="py-4 px-6">Insurance & Policy</th>
                <th className="py-4 px-6">Clinical / Medical Notes</th>
                <th className="py-4 px-6 text-center">Visits & History</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    No patient records found for this clinic matching the search filter.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const patientClinicVisits = appointments.filter(
                    (a) =>
                      a.patientEmail.toLowerCase() === patient.email.toLowerCase() ||
                      a.patientId === patient.id
                  );

                  return (
                    <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Contact */}
                      <td className="py-4 px-6">
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
                              {patient.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Insurance */}
                      <td className="py-4 px-6">
                        <div className="text-slate-800 font-semibold">{patient.dentalInsurance || 'Self-Pay / Direct'}</div>
                        <span className="text-[11px] text-slate-400">Verified</span>
                      </td>

                      {/* Notes */}
                      <td className="py-4 px-6 max-w-xs">
                        <p className="text-xs text-slate-600 line-clamp-2 italic">
                          {patient.medicalNotes || 'No specific clinical flags recorded.'}
                        </p>
                      </td>

                      {/* Visits Count */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                          <Calendar className="w-3.5 h-3.5 text-teal-600" />
                          {patientClinicVisits.length} Visits
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedPatientForHistory(patient)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5 text-teal-400" />
                          <span>View History</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Patient User */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Register New Patient</h3>
                <p className="text-xs text-slate-500">Create patient file and portal account for {clinicName}</p>
              </div>
            </div>

            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Samantha Miller"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patient@example.com"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 234-5678"
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white cursor-pointer"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dental Insurance Policy
                </label>
                <input
                  type="text"
                  value={formData.dentalInsurance}
                  onChange={(e) => setFormData({ ...formData, dentalInsurance: e.target.value })}
                  placeholder="e.g. Delta Dental Premier (ID #99482)"
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Medical Notes / Sensitivities
                </label>
                <textarea
                  rows={3}
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  placeholder="e.g. Mild cold sensitivity on upper left molar, latex sensitivity"
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  <span>{isSubmitting ? 'Registering...' : 'Register Patient in Clinic'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Drawer: Patient History & Past Visits */}
      {selectedPatientForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedPatientForHistory(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Patient Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-lg shadow-xs">
                {selectedPatientForHistory.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedPatientForHistory.fullName}</h3>
                <p className="text-xs text-slate-500">
                  {selectedPatientForHistory.email} • {selectedPatientForHistory.phone}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                    {selectedPatientForHistory.dentalInsurance || 'Direct Pay'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Patient ID: {selectedPatientForHistory.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Medical Notes */}
            {selectedPatientForHistory.medicalNotes && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px]">
                  Clinical & Medical Notes:
                </span>
                <p className="text-amber-950 font-medium leading-relaxed">
                  {selectedPatientForHistory.medicalNotes}
                </p>
              </div>
            )}

            {/* Appointment Visits History List */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-teal-600" />
                <span>Appointment Visits History ({patientAppointments.length})</span>
              </h4>

              {patientAppointments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No previous or scheduled appointments recorded for this patient yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {patientAppointments.map((apt) => {
                    const isCompleted = apt.status === 'completed';
                    const isConfirmed = apt.status === 'confirmed';
                    const isCancelled = apt.status === 'cancelled';

                    return (
                      <div
                        key={apt.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {apt.appointmentCode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : isConfirmed
                                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                : isCancelled
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {apt.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700">
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Treatment:</span>
                            <span className="font-semibold text-slate-900">{apt.serviceName || 'Consultation'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Attending Doctor:</span>
                            <span className="font-semibold text-slate-900">{apt.doctorName || 'Specialist'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Date & Time:</span>
                            <span className="font-medium text-slate-800">
                              {apt.appointmentDate} ({apt.startTime} - {apt.endTime})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">Clinic Studio:</span>
                            <span className="font-medium text-slate-800">{apt.branchName || clinicName}</span>
                          </div>
                        </div>

                        {apt.notes && (
                          <div className="pt-2 border-t border-slate-200/60 text-slate-600 text-[11px] italic">
                            &quot;{apt.notes}&quot;
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

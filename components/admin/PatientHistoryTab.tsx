'use client';

import React, { useState } from 'react';
import {
  FileText,
  Search,
  Calendar,
  Clock,
  User,
  Shield,
  Stethoscope,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Mail,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { PatientProfile, Appointment, Doctor } from '@/types/dental';

interface PatientHistoryTabProps {
  patients: (PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string })[];
  appointments: Appointment[];
  doctors: Doctor[];
  clinicName: string;
}

export default function PatientHistoryTab({
  patients,
  appointments,
  doctors,
  clinicName,
}: PatientHistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<(PatientProfile & { totalAppointments: number; upcomingAppointments: number; lastVisit?: string }) | null>(
    patients[0] || null
  );

  const filteredPatients = patients.filter((p) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.dentalInsurance?.toLowerCase().includes(q)
    );
  });

  const activePatientAppointments = selectedPatient
    ? appointments
        .filter((a) => a.patientEmail.toLowerCase() === selectedPatient.email.toLowerCase() || a.patientId === selectedPatient.id)
        .sort((a, b) => b.appointmentDate.localeCompare(a.appointmentDate))
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
            Clinical Records & Consultation History
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Patient Consultation & Dental History
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Review comprehensive patient visit timelines, clinical dental notes, procedures performed, attending doctors, and insurance records for {clinicName}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
          <User className="w-4 h-4 text-teal-600" />
          <span>Total Records: <strong className="text-slate-900">{patients.length} Patients</strong></span>
        </div>
      </div>

      {/* Main Split View: Patient Directory (Left) + Detailed History (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Patient List with Search */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient records..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto space-y-1">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => {
                const isSelected = selectedPatient?.id === patient.id;
                const aptCount = appointments.filter(
                  (a) => a.patientEmail.toLowerCase() === patient.email.toLowerCase() || a.patientId === patient.id
                ).length;

                return (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border border-teal-300 ring-1 ring-teal-600/10'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {patient.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{patient.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{patient.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {aptCount} visits
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No patients match &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Full Clinical History Timeline for Selected Patient */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {selectedPatient ? (
            <>
              {/* Patient Profile Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-xl shadow-sm">
                    {selectedPatient.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedPatient.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {selectedPatient.email}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {selectedPatient.phone || 'No phone recorded'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedPatient.dentalInsurance ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-900 border border-teal-200 text-xs font-semibold">
                      <Shield className="w-3.5 h-3.5 text-teal-600" />
                      {selectedPatient.dentalInsurance}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      Self-Pay / Private
                    </span>
                  )}
                </div>
              </div>

              {/* Clinical Notes & Health Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  Medical & Dental History Notes
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedPatient.medicalNotes ||
                    'Patient has no known allergies or pre-existing medical restrictions on file.'}
                </p>
                <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-500">
                  <span>Registered: <strong>{new Date(selectedPatient.createdAt).toLocaleDateString()}</strong></span>
                  <span>•</span>
                  <span>Primary Studio: <strong>{clinicName}</strong></span>
                </div>
              </div>

              {/* Consultation & Visit Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    Appointment History ({activePatientAppointments.length} Visits)
                  </h4>
                </div>

                {activePatientAppointments.length > 0 ? (
                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 before:z-0">
                    {activePatientAppointments.map((apt) => {
                      const isConfirmed = apt.status === 'confirmed';
                      const isCancelled = apt.status === 'cancelled';
                      const attendingDoctor = doctors.find((d) => d.id === apt.doctorId);

                      return (
                        <div
                          key={apt.id}
                          className="relative z-10 pl-11 bg-white"
                        >
                          {/* Timeline Node */}
                          <div
                            className={`absolute left-3 top-4 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center -translate-x-1/2 ${
                              isConfirmed
                                ? 'border-teal-600 bg-teal-50'
                                : isCancelled
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-slate-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isConfirmed ? 'bg-teal-600' : isCancelled ? 'bg-rose-500' : 'bg-slate-400'
                              }`}
                            />
                          </div>

                          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-teal-800">
                                  {apt.appointmentCode}
                                </span>
                                <h5 className="font-bold text-sm text-slate-900">{apt.serviceName}</h5>
                              </div>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                                  isConfirmed
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : isCancelled
                                    ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                <span>{apt.appointmentDate} at {apt.startTime} - {apt.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                                <span>Attending Specialist: <strong>{apt.doctorName || attendingDoctor?.name || 'Dr. Sarah Chen'}</strong></span>
                              </div>
                            </div>

                            {apt.notes && (
                              <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200 mt-2">
                                <strong className="text-slate-700">Patient / Clinical Notes:</strong> {apt.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No Consultation History Yet</p>
                    <p className="mt-0.5">This registered patient has not completed or scheduled any clinical visits yet.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              <User className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-700 text-sm">Select a Patient to View Clinical History</p>
              <p className="mt-1">Pick a patient from the list on the left to see their full consultation records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

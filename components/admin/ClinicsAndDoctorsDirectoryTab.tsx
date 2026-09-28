'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  Search,
  ExternalLink,
  Award
} from 'lucide-react';
import { Branch, Doctor, ClinicAdminAccount } from '@/types/dental';

interface ClinicsAndDoctorsDirectoryTabProps {
  branches: Branch[];
  doctors: Doctor[];
  clinicAdmins: ClinicAdminAccount[];
}

export default function ClinicsAndDoctorsDirectoryTab({
  branches,
  doctors,
  clinicAdmins,
}: ClinicsAndDoctorsDirectoryTabProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBranches = selectedBranchId === 'all'
    ? branches
    : branches.filter((b) => b.id === selectedBranchId);

  return (
    <div id="clinics-doctors-directory" className="space-y-8 animate-in fade-in duration-200">
      {/* Overview Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-slate-900">
                  Clinics & Clinical Doctors Directory
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                  Network Administration
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Central overview of all licensed studio clinics and the specialist doctors practicing within each clinic.
              </p>
            </div>
          </div>

          {/* Studio Filter Filter */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-600">Filter Studio:</span>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600 cursor-pointer shadow-2xs"
            >
              <option value="all">🌐 All Studios ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  🏥 {b.name.replace('Smile Dental - ', '')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="pt-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, specialty, or clinic..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-teal-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Clinics and their Doctors List */}
      <div className="space-y-8">
        {filteredBranches.map((branch) => {
          const branchDoctors = doctors.filter((d) => {
            const matchesBranch = d.branchIds?.includes(branch.id);
            if (!matchesBranch) return false;
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              return (
                d.name.toLowerCase().includes(q) ||
                d.specialization.toLowerCase().includes(q) ||
                branch.name.toLowerCase().includes(q)
              );
            }
            return true;
          });

          const branchAdmins = clinicAdmins.filter((a) => a.clinicId === branch.id);

          return (
            <div
              key={branch.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Studio Header Card */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-400" />
                    <h4 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                      {branch.name}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      {branch.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      {branch.address}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-400" />
                      {branch.phone}
                    </span>
                  </p>
                </div>

                {/* Assigned Clinic Admin info */}
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
                  <span className="text-[10px] uppercase font-bold text-teal-300 block">Assigned Clinic Admin:</span>
                  <span className="font-semibold text-white">
                    {branchAdmins.length > 0 ? branchAdmins.map((a) => a.name).join(', ') : 'Pending Assignment'}
                  </span>
                </div>
              </div>

              {/* Doctors Practicing at this Clinic */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span>Specialist Doctors at this Clinic ({branchDoctors.length})</span>
                  </h5>
                  <span className="text-xs text-slate-400">Read-Only Directory View</span>
                </div>

                {branchDoctors.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No doctors assigned to this clinic matching the search filter.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branchDoctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0 ring-1 ring-slate-200">
                              <Image
                                src={doc.imageUrl}
                                alt={doc.name}
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0">
                              <h6 className="font-bold text-sm text-slate-900 truncate">{doc.name}</h6>
                              <p className="text-xs text-teal-800 font-semibold truncate">{doc.specialization}</p>
                              <p className="text-[11px] text-slate-500 truncate">{doc.title}</p>
                            </div>
                          </div>

                          <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Experience:</span>
                              <span className="font-semibold text-slate-800">{doc.experienceYears} Years</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Doctor Email:</span>
                              <span className="font-mono text-slate-800 text-[11px] truncate max-w-[150px]">{doc.email || 'doctor@smiledental.com'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 text-[11px]">Rating:</span>
                              <span className="font-bold text-amber-600">{doc.rating} ★</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 text-[10px] text-slate-400 uppercase tracking-wider font-semibold border-t border-slate-200/60">
                          {doc.languages?.join(', ') || 'English'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

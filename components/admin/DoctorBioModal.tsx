'use client';

import React from 'react';
import Image from 'next/image';
import {
  X,
  Stethoscope,
  GraduationCap,
  Award,
  Globe2,
  Clock,
  Building2,
  Mail,
  Phone,
  Sparkles,
  CalendarCheck,
  Star,
  Edit3
} from 'lucide-react';
import { Doctor, Branch } from '@/types/dental';

interface DoctorBioModalProps {
  doctor: Doctor | null;
  branches: Branch[];
  canEdit?: boolean;
  onClose: () => void;
  onEdit?: (doc: Doctor) => void;
}

export default function DoctorBioModal({
  doctor,
  branches,
  canEdit = false,
  onClose,
  onEdit,
}: DoctorBioModalProps) {
  if (!doctor) return null;

  const assignedBranches = branches.filter((b) => doctor.branchIds?.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-teal-600/30 shrink-0 shadow-sm">
              <Image
                src={
                  doctor.imageUrl && (doctor.imageUrl.startsWith('http') || doctor.imageUrl.startsWith('data:image/'))
                    ? doctor.imageUrl
                    : `https://picsum.photos/seed/${doctor.id}/800/800`
                }
                alt={doctor.name}
                fill
                unoptimized
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">{doctor.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                  {doctor.title}
                </span>
              </div>
              <p className="text-sm font-semibold text-teal-700 mt-0.5">{doctor.specialization}</p>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {doctor.rating || 4.9} ({doctor.reviewsCount || 120}+ reviews)
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{doctor.experienceYears} Years Clinical Experience</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Complete Clinical Biography */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            Complete Clinical Bio & Background
          </h4>
          <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
            <p className="font-medium text-slate-800">{doctor.bio}</p>
            <p className="text-slate-600 text-xs">
              Specializing in patient-centered dental health, minimally invasive clinical procedures, and digital smile design. Committed to continuing dental education and advanced biomimetic techniques.
            </p>
          </div>
        </div>

        {/* Credentials & Qualifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-teal-700" />
              Verified Education & Degree
            </span>
            <p className="text-xs font-bold text-slate-900">{doctor.qualification || 'Doctor of Dental Surgery (DDS)'}</p>
            <p className="text-[11px] text-slate-500">Board Certified Specialist & ADA/AAED Fellow</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-teal-600" />
              Languages Spoken
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(doctor.languages || ['English']).map((lang, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-800">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Studio Locations & Clinic Shifts */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-teal-600" />
            Practicing Studios & Facilities
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assignedBranches.map((b) => (
              <div key={b.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="font-bold text-xs text-slate-900">{b.name}</div>
                <p className="text-[11px] text-slate-500 truncate">{b.address}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-teal-700">
                  <Clock className="w-3 h-3" />
                  <span>{b.openingHours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Account Credentials */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
            Doctor Account Details
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">Email:</span>
              <strong className="text-slate-900 font-mono">{doctor.email || `${doctor.id}@smiledental.com`}</strong>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-600">Phone:</span>
              <strong className="text-slate-900">{doctor.phone || '(555) 234-1100'}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {canEdit && onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(doctor);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Doctor Profile</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs cursor-pointer shadow-xs"
          >
            Close Bio
          </button>
        </div>
      </div>
    </div>
  );
}

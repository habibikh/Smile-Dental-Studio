'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Calendar, ArrowRight, Lock, Building2, User } from 'lucide-react';

interface PatientAccessRestrictedProps {
  patientName?: string;
  patientEmail?: string;
  onSwitchToClinicAdmin?: () => void;
  onSwitchToAppAdmin?: () => void;
}

export default function PatientAccessRestricted({
  patientName = 'Alex Morgan',
  patientEmail = 'patient@example.com',
}: PatientAccessRestrictedProps) {
  return (
    <div id="patient-access-restricted" className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Subtle top indicator bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-rose-500" />

        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-900 border border-amber-200 uppercase tracking-wider mb-4">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          Access Policy Enforced
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Patient Accounts Cannot Access Administrative Panel
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
          You are currently signed in as patient <strong className="text-slate-900 font-semibold">{patientName}</strong> ({patientEmail}). 
          Administrative panels, clinical staff management, and internal hospital records are restricted exclusively to authorized Clinic Administrators and Application Super Admins.
        </p>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-6 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Current Profile Role:
            </span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Registered Patient
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-700 font-medium">
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Administrative Scope:
            </span>
            <span className="text-slate-500">None (Patient-Facing Only)</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 text-teal-400" />
            <span>Sign In with Administrator Account</span>
          </Link>

          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Return to My Visits (Patient Portal)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

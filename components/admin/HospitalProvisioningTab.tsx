'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  FileText,
  BadgeCheck,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { HospitalRegistration } from '@/types/dental';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface HospitalProvisioningTabProps {
  hospitalRegistrations: HospitalRegistration[];
  onRefreshData: () => Promise<void>;
  onSelectClinic: (clinicId: string) => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function HospitalProvisioningTab({
  hospitalRegistrations,
  onRefreshData,
  onSelectClinic,
  showNotification,
}: HospitalProvisioningTabProps) {
  const [provisioningHospitalId, setProvisioningHospitalId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleProvisionClinic = async (hospital: HospitalRegistration) => {
    setProvisioningHospitalId(hospital.id);
    try {
      const res = await fetch('/api/admin/provision-clinic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: hospital.id,
          provisionedBy: 'Application Super Admin',
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(
          'success',
          `Clinical Admin Panel for "${hospital.hospitalName}" successfully created and provisioned by Application Admin.`
        );
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Provisioning failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Provisioning failed';
      showNotification('error', msg);
    } finally {
      setProvisioningHospitalId(null);
    }
  };

  const handleCopyInviteLink = (token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullLink = `${origin}/hospital/setup-admin?token=${token}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedToken(token);
    showNotification('success', 'Single-use Administrator setup link copied to clipboard.');
    setTimeout(() => setCopiedToken(null), 3000);
  };

  const pendingCount = hospitalRegistrations.filter((h) => !h.panelProvisioned).length;
  const provisionedCount = hospitalRegistrations.filter((h) => h.panelProvisioned).length;

  return (
    <div id="hospital-provisioning-section" className="space-y-6 animate-in fade-in duration-200">
      {/* Policy Governance Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
              <Shield className="w-3.5 h-3.5" />
              Application Admin Governance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Clinical Admin Panel Provisioning & Licensing
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              <strong>Mandatory Rule:</strong> The clinical admin panel can <span className="text-amber-300 font-semibold underline decoration-amber-400">only be created by the Administrator of the Application</span>. 
              When a hospital pays their service fee and registration is verified, only the Application Admin can approve and provision their dedicated clinical admin panel.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 shrink-0">
            <div>
              <div className="text-2xl font-black text-amber-400">{pendingCount}</div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Pending Creation</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="text-2xl font-black text-emerald-400">{provisionedCount}</div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Active Panels</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Registrations List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900">Hospital Applications & Clinical Panels</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review paid service fees ($499 USD) and authorize dedicated clinical admin panels
            </p>
          </div>
          <Link
            href="/hospital/register"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Open Hospital Registration Form</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {hospitalRegistrations.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No hospital registrations submitted yet.
            </div>
          ) : (
            hospitalRegistrations.map((hospital) => {
              const isProvisioned = !!hospital.panelProvisioned;
              const isProcessing = provisioningHospitalId === hospital.id;

              return (
                <div
                  key={hospital.id}
                  className={`p-6 transition-all ${
                    !isProvisioned ? 'bg-amber-50/30' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Hospital Information */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
                          <Building2 className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-base text-slate-900">
                              {hospital.hospitalName}
                            </h4>
                            {isProvisioned ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                                Panel Created & Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                <Clock className="w-3 h-3 text-amber-600" />
                                Awaiting Application Admin Creation
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            License: <span className="font-mono text-slate-700 font-semibold">{hospital.licenseNumber}</span> • Director: {hospital.directorName}
                          </p>
                        </div>
                      </div>

                      {/* Fee Payment & License Confirmation */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Service Fee</span>
                          <p className="font-extrabold text-emerald-700">
                            ${hospital.registrationFeeAmount?.toFixed(2) || '499.00'} USD
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Fee Payment Status</span>
                          <p className="font-bold text-slate-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            {hospital.feePaymentStatus || 'Verified'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Transaction ID</span>
                          <p className="font-mono text-[11px] text-slate-700 font-semibold truncate">
                            {hospital.transactionId || 'TXN-CONFIRMED'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Hospital Address</span>
                          <p className="text-slate-700 font-medium truncate">
                            {hospital.address}, {hospital.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                      {!isProvisioned ? (
                        <div className="flex flex-col items-start lg:items-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleProvisionClinic(hospital)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                          >
                            {isProcessing ? (
                              <LoadingSpinner size="sm" variant="white" label="Provisioning..." />
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 text-teal-400" />
                                <span>Create Clinical Admin Panel</span>
                              </>
                            )}
                          </button>
                          <span className="text-[11px] text-amber-700 font-medium">
                            Authorized exclusively by Application Admin
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                          {hospital.branchId && (
                            <button
                              type="button"
                              onClick={() => onSelectClinic(hospital.branchId!)}
                              className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              <span>View Scoped Admin Panel</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {hospital.adminInviteToken && (
                            <button
                              type="button"
                              onClick={() => handleCopyInviteLink(hospital.adminInviteToken)}
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                              title="Copy single-use admin setup link"
                            >
                              {copiedToken === hospital.adminInviteToken ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">Link Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Copy Invite Link</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {isProvisioned && hospital.panelProvisionedBy && (
                        <p className="text-[11px] text-slate-400">
                          Provisioned by {hospital.panelProvisionedBy} on {new Date(hospital.panelProvisionedAt || hospital.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

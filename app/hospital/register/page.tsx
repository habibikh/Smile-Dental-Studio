'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  DollarSign,
  FileCheck,
  Copy,
  Check,
  ExternalLink,
  Info,
  Clock,
  Send,
  Stethoscope,
  Users
} from 'lucide-react';

export default function HospitalRegisterPage() {
  const [formData, setFormData] = useState({
    hospitalName: '',
    licenseNumber: '',
    directorName: '',
    officialEmail: '',
    phone: '',
    city: 'Metro City',
    address: '',
    suiteCount: 8,
    paymentMethod: 'Credit Card (Corporate)',
    agreeToTerms: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    registration: any;
    inviteToken: any;
    inviteUrl: string;
    receipt: any;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.hospitalName || !formData.licenseNumber || !formData.directorName || !formData.officialEmail || !formData.phone || !formData.address) {
      setError('Please fill in all required hospital details, medical license, and official email.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/app/api/hospital/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalName: formData.hospitalName,
          licenseNumber: formData.licenseNumber,
          directorName: formData.directorName,
          officialEmail: formData.officialEmail,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          suiteCount: formData.suiteCount,
          paymentMethod: formData.paymentMethod,
          registrationFeeAmount: 499.00,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete hospital registration.');
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Breadcrumb / Title */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Hospital & Clinic Onboarding Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hospital Registration & Application Services Fee
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Register your dental medical center, verify clinical licensing, and pay the platform application service fee to receive your exclusive single-use hospital administrator setup link.
          </p>
        </div>

        {/* PRIMARY COMPLIANCE & POLICY STATEMENT CARD (Requested Statement) */}
        <div className="mb-10 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 p-6 sm:p-7 text-white shadow-xl border border-teal-800/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  Hospital Onboarding Rule
                </span>
                <span className="text-xs text-teal-200/80 font-medium">Single-Use Security Protocol</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-teal-50 leading-relaxed">
                &ldquo;If hospital pay the application services fee and the fee is confirmed they can create one admin the link will be sent to them via email(seperate link no one other can access it only use once then link expire)&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-teal-200/80">
                Each hospital activation link is cryptographically tied to the verified transaction. The single-use link permanently expires the exact moment your primary administrator registers.
              </p>
            </div>
          </div>
        </div>

        {!successData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Registration & Fee Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Hospital Details & Licensing</h2>
                  <p className="text-xs text-slate-500 mt-1">Official hospital accreditation and administrative contact</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                  Step 1 of 2
                </span>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Registration Error</p>
                    <p className="text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Hospital / Clinic Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Metro Smile Dental Hospital & Surgical Center"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Medical License / Registry # <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., HOSP-MED-2026-9921"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Chief Medical Director Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Dr. Jonathan Reynolds"
                      value={formData.directorName}
                      onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Official Hospital Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., licensing@smiledental.com"
                      value={formData.officialEmail}
                      onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">The exclusive single-use admin link will be sent here.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Official Hospital Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., (555) 234-5000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      City / Region <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Metro City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Number of Clinical Suites
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={formData.suiteCount}
                      onChange={(e) => setFormData({ ...formData, suiteCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Physical Hospital Facility Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 100 Grand Medical Way, Pavilion 4, Metro City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Payment Method for Application Services Fee
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'Credit Card (Corporate)', label: 'Corporate Card', desc: 'Instant Confirmation' },
                      { id: 'Bank Wire / ACH', label: 'Bank Wire / ACH', desc: 'Direct Verification' },
                      { id: 'Direct Hospital License', label: 'Institutional Billing', desc: 'Priority Setup' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          formData.paymentMethod === m.id
                            ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/20'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{m.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Auto-fill button for easy demo review */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        hospitalName: 'St. Jude Grand Dental Hospital & Surgical Pavilion',
                        licenseNumber: 'HOSP-DENT-2026-4491',
                        directorName: 'Dr. Jonathan Reynolds, Chief Medical Officer',
                        officialEmail: 'director.reynolds@stjudedental.org',
                        phone: '(555) 345-9800',
                        city: 'Metro City',
                        address: '740 Medical Center Boulevard, Suite 500',
                        suiteCount: 12,
                        paymentMethod: 'Credit Card (Corporate)',
                        agreeToTerms: true,
                      });
                    }}
                    className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline cursor-pointer"
                  >
                    Auto-Fill Sample Hospital Data
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Processing Payment & Generating Single-Use Link...</span>
                  ) : (
                    <>
                      <span>Pay Application Services Fee ($499.00) & Register</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right: Fee Summary & Features Breakdown */}
            <div className="lg:col-span-5 space-y-6">
              {/* Fee Receipt Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>Application Services Fee Summary</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Official Fee
                  </span>
                </h3>

                <div className="py-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Hospital Application & Licensing Fee</span>
                    <span className="font-semibold text-slate-900">$499.00 USD</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Primary Admin Single-Use Token</span>
                    <span className="font-semibold text-emerald-600">Included (1 Admin)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Doctor & Assistant Roster Engine</span>
                    <span className="font-semibold text-emerald-600">Included</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Patient Appointment Booking Cloud</span>
                    <span className="font-semibold text-emerald-600">Included</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total Payable Amount</span>
                    <span className="text-2xl font-extrabold text-teal-800">$499.00</span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Instant fee confirmation & email transmission of the secret single-use administrator link.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Hospital admin can manage all doctors, branches, and clinic schedules.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Doctors can assign their 1 designated Personal Assistant (PA).</span>
                  </div>
                </div>
              </div>

              {/* Security & Access Guarantee */}
              <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-2xl p-6 text-white border border-slate-800 shadow-md space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Exclusive Single-Use Link Protocol</h4>
                    <p className="text-xs text-teal-200/70">Anti-tampering & Zero-Leak Guarantee</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Only the hospital recipient possessing the unspent token sent to the verified official email can initialize the administrator account. After successful registration, the token is permanently destroyed.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* PAYMENT CONFIRMATION & EMAIL INBOX SIMULATOR */
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Payment Verified Banner */}
            <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                    <FileCheck className="w-3.5 h-3.5" />
                    Application Services Fee Confirmed & Paid
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Hospital Registration Verified
                  </h2>
                  <p className="text-sm text-slate-600">
                    Transaction ID <strong className="font-mono text-slate-900">{successData.receipt.transactionId}</strong> for <strong>$499.00 USD</strong> was confirmed.
                  </p>
                </div>
              </div>

              {/* Receipt Specs */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Hospital</span>
                  <span className="font-bold text-slate-900 truncate block">{successData.registration.hospitalName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">License #</span>
                  <span className="font-bold text-slate-900">{successData.registration.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fee Paid</span>
                  <span className="font-bold text-emerald-700">$499.00 USD</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Email Delivered To</span>
                  <span className="font-bold text-slate-900 truncate block">{successData.registration.officialEmail}</span>
                </div>
              </div>
            </div>

            {/* SIMULATED EMAIL INBOX (Interactive demonstration of the separate single-use link) */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-teal-400" />
                  <span className="font-bold text-sm sm:text-base">Hospital Official Email Inbox — Incoming Notification</span>
                </div>
                <span className="text-xs font-mono text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800">
                  Inbox: {successData.registration.officialEmail}
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <p className="text-xs text-slate-500 font-medium">
                    From: <span className="font-semibold text-slate-800">Smile Dental Studio Licensing Authority &lt;licensing@smiledental.com&gt;</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    To: <span className="font-semibold text-slate-800">{successData.registration.officialEmail} ({successData.registration.directorName})</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Subject: <strong className="text-slate-900 font-bold">CONFIDENTIAL: Create Your Hospital Administrator Account (Single-Use Activation Link)</strong>
                  </p>
                </div>

                <div className="prose prose-sm text-slate-700 max-w-none space-y-4">
                  <p className="font-medium">
                    Dear {successData.registration.directorName},
                  </p>
                  <p>
                    Thank you for submitting your hospital accreditation and paying the application services fee ($499.00 USD) for <strong>{successData.registration.hospitalName}</strong> (License: {successData.registration.licenseNumber}). Your payment and hospital registration are confirmed.
                  </p>
                  
                  {/* Highlighted Quote in Email */}
                  <div className="p-4 rounded-xl bg-teal-50 border-l-4 border-teal-600 text-teal-900 text-xs sm:text-sm font-semibold">
                    &ldquo;If hospital pay the application services fee and the fee is confirmed they can create one admin the link will be sent to them via email(seperate link no one other can access it only use once then link expire)&rdquo;
                  </div>

                  <p className="text-xs text-slate-600">
                    Below is your exclusive, encrypted link to create the Primary Administrator account for your hospital. <strong>Warning:</strong> This link can only be used once. Once your administrator is created, this link will immediately expire permanently and no one else will ever be able to access it.
                  </p>

                  {/* The Secret Link Display */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
                      Exclusive Single-Use Administrator Setup Link:
                    </span>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined' ? `${window.location.origin}${successData.inviteUrl}` : successData.inviteUrl}
                        className="bg-slate-800 border border-slate-700 text-teal-200 text-xs font-mono px-3.5 py-2.5 rounded-lg flex-1 focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(typeof window !== 'undefined' ? `${window.location.origin}${successData.inviteUrl}` : successData.inviteUrl)}
                        className="px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Link
                      href={successData.inviteUrl}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Open Secure One-Time Admin Setup Page</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSuccessData(null)}
                      className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      Register Another Hospital
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

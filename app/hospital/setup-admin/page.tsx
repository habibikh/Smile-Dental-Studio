'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Mail,
  Key,
  Phone,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  LogIn
} from 'lucide-react';

function SetupAdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [verifying, setVerifying] = useState(true);
  const [tokenStatus, setTokenStatus] = useState<{
    valid: boolean;
    reason?: 'not_found' | 'expired' | 'already_used';
    message: string;
    tokenData?: any;
    hospital?: any;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdAdmin, setCreatedAdmin] = useState<any | null>(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setTokenStatus({
          valid: false,
          reason: 'not_found',
          message: 'No activation token provided in the URL.',
        });
        setVerifying(false);
        return;
      }

      try {
        setVerifying(true);
        const res = await fetch(`/api/hospital/verify-token?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        setTokenStatus(data);

        if (data.valid && data.tokenData) {
          setFormData((prev) => ({
            ...prev,
            name: data.tokenData.directorName || 'Hospital Administrator',
            email: data.tokenData.officialEmail || '',
          }));
        }
      } catch (err: any) {
        setTokenStatus({
          valid: false,
          reason: 'not_found',
          message: err.message || 'Error connecting to token validation service.',
        });
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords do not match. Please re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      setSubmitError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/hospital/create-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create hospital administrator account.');
      }

      setCreatedAdmin(data.admin);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {verifying ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Validating Single-Use Activation Token...</h2>
            <p className="text-xs text-slate-500">Verifying hospital application fee and token status with the central registry</p>
          </div>
        ) : !tokenStatus?.valid ? (
          /* TOKEN INVALID, EXPIRED, OR ALREADY USED (Security Policy Enforcement) */
          <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-xl overflow-hidden">
            <div className="bg-rose-600 p-6 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider bg-rose-700 px-2.5 py-0.5 rounded-md text-white">
                  Access Prohibited
                </span>
                <h1 className="text-2xl font-extrabold mt-1">Single-Use Link Expired or Invalid</h1>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {tokenStatus?.reason === 'already_used' ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <p className="font-bold text-sm">Strict Single-Use Security Protocol Enforced:</p>
                  <p className="text-xs leading-relaxed">
                    This exclusive administrator setup link has already been claimed to create your hospital&apos;s Primary Administrator account. As per hospital security policy, <strong>the link has permanently expired and no one else can access or reuse it</strong>.
                  </p>
                  {tokenStatus.tokenData?.usedAt && (
                    <p className="text-[11px] font-mono text-amber-800">
                      Token consumed on: {new Date(tokenStatus.tokenData.usedAt).toLocaleString()} by {tokenStatus.tokenData.createdAdminEmail}
                    </p>
                  )}
                </div>
              ) : tokenStatus?.reason === 'expired' ? (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed">
                  <p className="font-bold text-sm mb-1">Link Expired</p>
                  This invitation link exceeded its 48-hour validity window. Please contact hospital licensing to request a fresh authorization token.
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs">
                  <p className="font-bold text-sm mb-1">Invalid Token</p>
                  The provided token is not recognized in our verified hospital records.
                </div>
              )}

              {/* Policy Statement Reminder */}
              <div className="p-4 rounded-xl bg-slate-900 text-teal-300 text-xs border border-slate-800 space-y-1">
                <span className="font-bold uppercase tracking-wider text-slate-400 block text-[10px]">
                  Official Rule
                </span>
                <p className="italic text-teal-100">
                  &ldquo;If hospital pay the application services fee and the fee is confirmed they can create one admin the link will be sent to them via email(seperate link no one other can access it only use once then link expire)&rdquo;
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Go to Hospital Admin Login</span>
                </Link>

                <Link
                  href="/hospital/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Hospital Registration Portal</span>
                </Link>
              </div>
            </div>
          </div>
        ) : createdAdmin ? (
          /* SUCCESS STATE: PRIMARY ADMIN CREATED & TOKEN BURNED */
          <div className="bg-white rounded-2xl border-2 border-emerald-500 shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                Primary Administrator Created
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Hospital Admin Account Active
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your Primary Administrator account has been registered for <strong>{tokenStatus?.tokenData?.hospitalName}</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs max-w-md mx-auto text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Admin Full Name:</span>
                <span className="font-bold text-slate-900">{createdAdmin.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Login Email:</span>
                <span className="font-bold text-slate-900">{createdAdmin.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-emerald-700 uppercase">Primary Hospital Administrator</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Token Status:</span>
                <span className="font-bold text-rose-600">Permanently Expired (Used)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/admin"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Launch Hospital Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* FORM: VALID TOKEN - CREATE THE ONE PRIMARY ADMIN */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-6 sm:p-7 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300">
                    Verified Single-Use Authorization
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    Create Hospital Primary Administrator
                  </h1>
                </div>
              </div>

              {/* Verified Hospital Badge */}
              <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div>
                  <span className="text-teal-200 block text-[11px]">Authorized Hospital:</span>
                  <span className="font-bold text-white text-sm">{tokenStatus.tokenData?.hospitalName}</span>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-teal-200 block text-[11px]">Authorized Recipient:</span>
                  <span className="font-mono text-teal-100">{tokenStatus.tokenData?.officialEmail}</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 sm:p-8">
              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Administrator Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Jonathan Reynolds"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Administrator Portal Login Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., admin@smiledental.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Direct Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., (555) 234-5000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Admin Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    Single-Use Link Security Notice:
                  </p>
                  <p>
                    Once you click &ldquo;Create Primary Administrator Account&rdquo;, this single-use link will immediately be burned and permanently expired. No other person will be able to reuse this link.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Creating Administrator & Expiring Token...</span>
                  ) : (
                    <>
                      <span>Create Primary Administrator Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SetupAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SetupAdminContent />
    </Suspense>
  );
}

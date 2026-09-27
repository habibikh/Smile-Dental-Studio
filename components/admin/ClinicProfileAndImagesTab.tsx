'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  Camera,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Sparkles,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { Branch } from '@/types/dental';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ClinicProfileAndImagesTabProps {
  branch: Branch;
  onRefreshData: () => Promise<void>;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

const CLINIC_IMAGE_PRESETS = [
  {
    name: 'Modern Aesthetic Studio',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
    description: 'Clean minimalist architectural lounge with digital check-in',
  },
  {
    name: 'Surgical Dental Pavilion',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200',
    description: 'State-of-the-art sterile surgical suites and recovery lounge',
  },
  {
    name: 'Digital Operatory & 3D Scanner',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
    description: 'High-tech operatory chair with 3D intraoral imaging screens',
  },
  {
    name: 'Boutique Smile Lounge',
    url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1200',
    description: 'Warm contemporary reception area and aesthetic patient lounge',
  },
];

export default function ClinicProfileAndImagesTab({
  branch,
  onRefreshData,
  showNotification,
}: ClinicProfileAndImagesTabProps) {
  const [formData, setFormData] = useState({
    name: branch.name,
    city: branch.city,
    address: branch.address,
    phone: branch.phone,
    email: branch.email,
    openingHours: branch.openingHours,
    description: branch.description,
    imageUrl: branch.imageUrl,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: branch.id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification('success', `Clinic profile and media photos for "${formData.name}" successfully updated.`);
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to update clinic');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      showNotification('error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="clinic-profile-images-section" className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-slate-900">
                Clinic Studio Profile & Media Management
              </h3>
              <p className="text-xs text-slate-500">
                Manage your clinic facility photos, studio information, and operating hours
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Clinic Photo Management Section */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-600" />
                  Clinic Facility & Exterior Images
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  This image represents your studio in patient searches and bookings
                </p>
              </div>
              <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Live Preview
              </span>
            </div>

            {/* Current Image Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-1">
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 group">
                  <Image
                    src={formData.imageUrl || branch.imageUrl}
                    alt={formData.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-[11px] font-semibold flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Current Studio Cover Photo
                    </span>
                  </div>
                </div>
              </div>

              {/* URL Input and Presets */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Studio Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 shadow-xs"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Quick Clinical Image Presets (Click to apply)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {CLINIC_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          formData.imageUrl === preset.url
                            ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/10'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-bold text-slate-900 truncate">{preset.name}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{preset.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Information Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinic Studio Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City / Region *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Physical Street Address *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinic Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Operating Hours *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  placeholder="Mon - Sat: 8:00 AM - 6:00 PM"
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Clinic Description & Facilities Overview
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <LoadingSpinner size="sm" variant="white" label="Saving Studio Profile..." />
              ) : (
                <>
                  <Save className="w-4 h-4 text-teal-400" />
                  <span>Save Clinic Profile & Media</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

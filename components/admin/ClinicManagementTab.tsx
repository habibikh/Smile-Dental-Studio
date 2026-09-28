'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  Plus,
  MapPin,
  Clock,
  Phone,
  Mail,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Camera,
  Star
} from 'lucide-react';
import { Branch } from '@/types/dental';

interface ClinicManagementTabProps {
  branches: Branch[];
  onRefreshData: () => Promise<void>;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export default function ClinicManagementTab({
  branches,
  onRefreshData,
  showNotification,
}: ClinicManagementTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    city: 'New York, NY',
    address: '',
    phone: '(555) 234-5678',
    email: 'clinic@smiledental.com',
    openingHours: 'Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 4:00 PM',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200',
  });

  const handleOpenAdd = () => {
    setEditingBranchId(null);
    setFormData({
      name: '',
      city: 'New York, NY',
      address: '',
      phone: '(555) 234-5678',
      email: 'clinic@smiledental.com',
      openingHours: 'Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 4:00 PM',
      description: 'Full-service modern dental studio equipped with 3D digital imaging, CBCT, and aesthetic surgical suites.',
      imageUrl: `https://picsum.photos/seed/clinic-${Date.now()}/800/600`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setFormData({
      name: branch.name,
      city: branch.city,
      address: branch.address,
      phone: branch.phone,
      email: branch.email || 'clinic@smiledental.com',
      openingHours: branch.openingHours,
      description: branch.description,
      imageUrl: branch.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) {
      showNotification('error', 'Clinic name and address are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingBranchId || undefined,
          ...formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(
          'success',
          editingBranchId ? `Clinic "${formData.name}" updated successfully.` : `New clinic "${formData.name}" established.`
        );
        setIsModalOpen(false);
        setEditingBranchId(null);
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Failed to save clinic');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Save failed';
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (branch: Branch) => {
    if (!confirm(`Are you sure you want to deactivate and remove clinic "${branch.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/branches?id=${branch.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showNotification('success', `Clinic "${branch.name}" removed from network.`);
        await onRefreshData();
      } else {
        throw new Error(data.error || 'Delete failed');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      showNotification('error', msg);
    }
  };

  const filteredBranches = branches.filter((b) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            Central Hospital & Clinic Administration
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Administrate Clinics & Studio Branches
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Configure studio facilities, operational hours, addresses, contact details, and add new clinic locations across the metropolitan network.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Add New Clinic</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clinics by name, city, address, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium shrink-0">
          Total Studios: <strong className="text-slate-900">{filteredBranches.length} Active</strong>
        </span>
      </div>

      {/* Clinics Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBranches.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & Badge */}
              <div className="relative h-44 sm:h-48 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={b.imageUrl || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200'}
                  alt={b.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/90 text-white backdrop-blur-xs uppercase tracking-wider">
                      {b.city}
                    </span>
                    <h3 className="text-lg font-bold mt-1 text-white">{b.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{b.rating || 4.9}</span>
                  </div>
                </div>
              </div>

              {/* Clinic Info */}
              <div className="p-5 sm:p-6 space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{b.address}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{b.openingHours}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold">{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{b.email || 'clinic@smiledental.com'}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {b.description}
                </p>
              </div>
            </div>

            {/* Administrate Actions Footer */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Studio
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={() => handleDelete(b)}
                  className="p-1.5 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 shadow-2xs transition-colors cursor-pointer"
                  title="Remove Clinic Location"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add / Edit Clinic Location */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingBranchId ? 'Edit Clinic Location' : 'Add New Clinic Studio'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingBranchId ? 'Update facility address and operational details' : 'Register a new studio branch in the clinic network'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinic Studio Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Smile Dental - Midtown Highline"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City / Neighborhood *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Manhattan, NY"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 234-5678"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Physical Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 520 West 28th St, Suite 400"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  placeholder="Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 4:00 PM"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinic Description & Facility Amenities
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="State-of-the-art facility featuring 3D imaging, sedation suites, and private recovery areas."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Studio Photo URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingBranchId ? 'Save Changes' : 'Establish Clinic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

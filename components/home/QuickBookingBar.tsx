'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Smile,
  User,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Branch, Service, Doctor, TimeSlot } from '@/types/dental';

export default function QuickBookingBar() {
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  // Selected values
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Live calculated slots
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);
  const [slotMessage, setSlotMessage] = useState<string>('');

  // Load initial dropdowns
  useEffect(() => {
    async function loadData() {
      try {
        const [bRes, sRes, dRes] = await Promise.all([
          fetch('/api/branches').then((r) => r.json()),
          fetch('/api/services').then((r) => r.json()),
          fetch('/api/doctors').then((r) => r.json()),
        ]);

        if (bRes.branches) {
          setBranches(bRes.branches);
          if (bRes.branches.length > 0) setSelectedBranch(bRes.branches[0].id);
        }
        if (sRes.services) {
          setServices(sRes.services);
          if (sRes.services.length > 0) setSelectedService(sRes.services[0].id);
        }
        if (dRes.doctors) {
          setDoctors(dRes.doctors);
          if (dRes.doctors.length > 0) setSelectedDoctor(dRes.doctors[0].id);
        }

        // Set default date to tomorrow or nearest weekday
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tYyyy = tomorrow.getFullYear();
        const tMm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tDd = String(tomorrow.getDate()).padStart(2, '0');
        setSelectedDate(`${tYyyy}-${tMm}-${tDd}`);
      } catch (err) {
        console.error('Error loading quick booking data:', err);
      }
    }
    loadData();
  }, []);

  // Filter doctors based on branch and service
  const filteredDoctors = doctors.filter((doc) => {
    if (selectedBranch && !doc.branchIds.includes(selectedBranch)) return false;
    if (selectedService && !doc.serviceIds.includes(selectedService)) return false;
    return true;
  });

  const effectiveDoctor = filteredDoctors.some((d) => d.id === selectedDoctor)
    ? selectedDoctor
    : filteredDoctors.length > 0
    ? filteredDoctors[0].id
    : '';

  // Fetch real availability when doctor, branch, service, and date are selected
  useEffect(() => {
    if (!effectiveDoctor || !selectedBranch || !selectedService || !selectedDate) {
      return;
    }

    let isMounted = true;
    async function checkAvailability() {
      setIsCheckingSlots(true);
      setSlotMessage('');
      setSelectedTime('');

      try {
        const res = await fetch(
          `/api/availability?doctorId=${effectiveDoctor}&branchId=${selectedBranch}&serviceId=${selectedService}&date=${selectedDate}`
        );
        const data = await res.json();

        if (isMounted) {
          if (data.isClosed) {
            setAvailableSlots([]);
            setSlotMessage(data.closureReason || 'Doctor is not scheduled on this day.');
          } else {
            const valid = data.slots || [];
            setAvailableSlots(valid);
            const open = valid.filter((s: TimeSlot) => s.available);
            if (open.length > 0) {
              setSelectedTime(open[0].time);
            } else {
              setSlotMessage('All slots are booked for this date.');
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setSlotMessage('Failed to check availability.');
        }
      } finally {
        if (isMounted) setIsCheckingSlots(false);
      }
    }

    checkAvailability();

    return () => {
      isMounted = false;
    };
  }, [effectiveDoctor, selectedBranch, selectedService, selectedDate]);

  const handleProceedToBooking = () => {
    const params = new URLSearchParams({
      branchId: selectedBranch,
      serviceId: selectedService,
      doctorId: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
    });
    router.push(`/book?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Quick Appointment Finder
            </h2>
          </div>
          <span className="text-xs text-teal-800 font-medium flex items-center gap-1.5 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            Synchronized Live Availability
          </span>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Branch */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              1. Studio
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-white text-slate-900">
                  {b.name.replace('Smile Dental - ', '')}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-teal-600" />
              2. Treatment
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all cursor-pointer"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900">
                  {s.name} (${s.price})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Doctor */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" />
              3. Specialist
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              disabled={filteredDoctors.length === 0}
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all disabled:opacity-50 cursor-pointer"
            >
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((d) => (
                  <option key={d.id} value={d.id} className="bg-white text-slate-900">
                    {d.name.split(',')[0]} ({d.specialization.split('&')[0]})
                  </option>
                ))
              ) : (
                <option value="" className="bg-white text-slate-500">No specialists at this studio</option>
              )}
            </select>
          </div>

          {/* 4. Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
              4. Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              suppressHydrationWarning
              className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all cursor-pointer"
            />
          </div>

          {/* 5. Live Slots & Action */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              5. Open Slot
            </label>

            {isCheckingSlots ? (
              <div className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>Checking live slots...</span>
              </div>
            ) : availableSlots.filter((s) => s.available).length > 0 ? (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full h-11 px-3 bg-teal-50 border border-teal-300 rounded-xl text-xs sm:text-sm font-semibold text-teal-900 focus:outline-hidden focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all cursor-pointer"
              >
                {availableSlots
                  .filter((s) => s.available)
                  .map((s) => (
                    <option key={s.time} value={s.time} className="bg-white text-slate-900">
                      {s.time} ({s.endTime}) — Available
                    </option>
                  ))}
              </select>
            ) : (
              <div className="h-11 px-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center text-xs text-rose-700 font-medium truncate">
                {slotMessage || 'No slots available'}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Booking CTA row */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Real-time slot reservation prevents double-booking. Transparent patient pricing.
            </span>
          </div>

          <button
            onClick={handleProceedToBooking}
            disabled={!selectedTime || isCheckingSlots || !selectedDoctor}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Proceed to Book ({selectedTime || 'Select Slot'})</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

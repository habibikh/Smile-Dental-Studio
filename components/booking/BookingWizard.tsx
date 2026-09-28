'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  MapPin,
  User,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Phone,
  Mail,
  FileText,
  Download,
  CalendarCheck
} from 'lucide-react';
import { Branch, Service, Doctor, TimeSlot, Appointment } from '@/types/dental';
import { useAuth } from '@/context/AuthContext';
import { safeFetchJson } from '@/lib/utils';

export default function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Wizard Steps: 1: Branch, 2: Service, 3: Doctor, 4: Date & Time, 5: Patient Info, 6: Success
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Data Catalogs
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  // Selections
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Patient Info Form
  const [patientName, setPatientName] = useState(() => user?.fullName || '');
  const [patientEmail, setPatientEmail] = useState(() => user?.email || '');
  const [patientPhone, setPatientPhone] = useState(() => user?.phone || '');
  const [patientNotes, setPatientNotes] = useState('');

  // Live Slots Calculation
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isCalculatingSlots, setIsCalculatingSlots] = useState(false);
  const [slotClosureMessage, setSlotClosureMessage] = useState('');

  // Booking Execution State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Load Catalogs
  useEffect(() => {
    async function load() {
      try {
        const [bRes, sRes, dRes] = await Promise.all([
          safeFetchJson<{ branches: Branch[] }>('/api/branches'),
          safeFetchJson<{ services: Service[] }>('/api/services'),
          safeFetchJson<{ doctors: Doctor[] }>('/api/doctors'),
        ]);

        if (bRes?.branches) setBranches(bRes.branches);
        if (sRes?.services) setServices(sRes.services);
        if (dRes?.doctors) setDoctors(dRes.doctors);

        // Pre-fill from query params if passed
        const qBranch = searchParams.get('branchId');
        const qService = searchParams.get('serviceId');
        const qDoctor = searchParams.get('doctorId');
        const qDate = searchParams.get('date');
        const qTime = searchParams.get('time');

        if (qBranch) setSelectedBranchId(qBranch);
        if (qService) setSelectedServiceId(qService);
        if (qDoctor) setSelectedDoctorId(qDoctor);
        if (qDate) setSelectedDate(qDate);
        if (qTime) setSelectedSlot(qTime);

        if (qBranch && qService && qDoctor && qDate) {
          setCurrentStep(4);
        } else if (qBranch && qService) {
          setCurrentStep(3);
        } else if (qBranch) {
          setCurrentStep(2);
        }
      } catch (err) {
        console.error('Error initializing booking wizard:', err);
      } finally {
        setIsLoadingCatalogs(false);
      }
    }
    load();
  }, [searchParams]);

  // Filter Doctors by Branch & Service
  const availableDoctors = doctors.filter((doc) => {
    if (selectedBranchId && !doc.branchIds.includes(selectedBranchId)) return false;
    if (selectedServiceId && !doc.serviceIds.includes(selectedServiceId)) return false;
    return true;
  });

  // Calculate slots when step 4 is active
  useEffect(() => {
    if (!selectedDoctorId || !selectedBranchId || !selectedServiceId || !selectedDate) {
      return;
    }

    let active = true;
    async function fetchAvailability() {
      setIsCalculatingSlots(true);
      setSlotClosureMessage('');

      try {
        const res = await fetch(
          `/api/availability?doctorId=${selectedDoctorId}&branchId=${selectedBranchId}&serviceId=${selectedServiceId}&date=${selectedDate}`
        );
        const data = await res.json();

        if (active) {
          if (data.isClosed) {
            setAvailableSlots([]);
            setSlotClosureMessage(data.closureReason || 'Doctor is not available on this day.');
          } else {
            setAvailableSlots(data.slots || []);
          }
        }
      } catch (err) {
        if (active) setSlotClosureMessage('Failed to calculate available slots.');
      } finally {
        if (active) setIsCalculatingSlots(false);
      }
    }

    fetchAvailability();

    return () => {
      active = false;
    };
  }, [selectedDoctorId, selectedBranchId, selectedServiceId, selectedDate]);

  // Selected Entities
  const currentBranch = branches.find((b) => b.id === selectedBranchId);
  const currentService = services.find((s) => s.id === selectedServiceId);
  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId);

  // Submit Booking
  const handleConfirmBooking = async () => {
    setBookingError('');
    setIsSubmitting(true);

    try {
      const payload = {
        doctorId: selectedDoctorId,
        branchId: selectedBranchId,
        serviceId: selectedServiceId,
        appointmentDate: selectedDate,
        startTime: selectedSlot,
        patientName,
        patientEmail,
        patientPhone,
        notes: patientNotes,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Booking failed.');
      }

      setConfirmedAppointment(data.appointment);
      setCurrentStep(6); // Success screen

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      setBookingError(err.message || 'An error occurred during booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate .ICS Calendar File
  const handleDownloadIcs = () => {
    if (!confirmedAppointment) return;
    const { appointmentCode, doctorName, serviceName, branchName, branchAddress, appointmentDate, startTime, endTime } = confirmedAppointment;
    
    const startIso = `${appointmentDate.replace(/-/g, '')}T${startTime.replace(':', '')}00`;
    const endIso = `${appointmentDate.replace(/-/g, '')}T${endTime.replace(':', '')}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Smile Dental//Appointment System//EN',
      'BEGIN:VEVENT',
      `UID:${appointmentCode}@smiledental.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:Smile Dental: ${serviceName} with ${doctorName}`,
      `DESCRIPTION:Appointment Code: ${appointmentCode}\\nService: ${serviceName}\\nSpecialist: ${doctorName}`,
      `LOCATION:${branchName}, ${branchAddress}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `SmileDental-${appointmentCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingCatalogs) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-700 mb-3" />
        <p className="text-sm font-medium text-slate-600">Initializing Dental Appointment Platform...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Stepper Indicator */}
      {currentStep < 6 && (
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-3">
            {[
              { num: 1, label: 'Branch' },
              { num: 2, label: 'Service' },
              { num: 3, label: 'Doctor' },
              { num: 4, label: 'Date & Time' },
              { num: 5, label: 'Review & Book' },
            ].map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (step.num < currentStep) setCurrentStep(step.num);
                    }}
                    disabled={step.num > currentStep}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                      isCompleted
                        ? 'bg-teal-700 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-slate-900 text-white ring-4 ring-teal-500/20 shadow-xs'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                  </button>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${
                      isCurrent ? 'text-teal-800' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden max-w-2xl mx-auto">
            <div
              className="bg-teal-700 h-full transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: SELECT BRANCH */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 1 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Select Your Preferred Clinic Branch
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Choose the Smile Dental clinic location most convenient for you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {branches.map((branch) => {
              const isSelected = selectedBranchId === branch.id;
              return (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">{branch.city}</span>
                      <span className="text-xs font-bold text-amber-500">★ {branch.rating}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{branch.name}</h3>
                    <p className="text-xs text-slate-600 mb-4">{branch.description}</p>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{branch.openingHours}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                      setCurrentStep(2);
                    }}
                    className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    Select This Branch
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!selectedBranchId}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Continue to Services</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT SERVICE */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 2 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Choose Dental Treatment or Procedure
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select the care you require today. Duration and pricing are fixed with zero hidden charges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/40 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">{service.category}</span>
                      <span className="text-base font-extrabold text-slate-900">${service.price}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1">{service.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                      {service.shortDescription || service.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {service.durationMinutes} mins
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        isSelected ? 'text-teal-700' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              disabled={!selectedServiceId}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Continue to Doctor Selection</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SELECT DOCTOR */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 3 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Select Your Dental Specialist
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Showing active specialists for {currentService?.name} at {currentBranch?.name}.
            </p>
          </div>

          {availableDoctors.length === 0 ? (
            <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <h3 className="text-base font-bold text-amber-900">No specialists found for this combination</h3>
              <p className="text-xs text-amber-700 mt-1">
                Please go back and select a different branch or service category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDoctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/40 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm">
                          {doc.name.charAt(3)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                          <p className="text-xs text-teal-700 font-medium">{doc.specialization}</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-3 mb-4">{doc.bio}</p>

                      <div className="space-y-1 text-xs text-slate-500">
                        <p><strong className="text-slate-700">Experience:</strong> {doc.experienceYears} Years</p>
                        <p><strong className="text-slate-700">Rating:</strong> <span className="text-amber-500 font-bold">★ {doc.rating}</span> ({doc.reviewsCount} reviews)</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setCurrentStep(4);
                      }}
                      className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ Specialist Selected' : 'Choose This Specialist'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              disabled={!selectedDoctorId}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DATE & REAL-TIME TIME SLOT SELECTION */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 4 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Select Appointment Date & Time
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Real-time available slots for {currentDoctor?.name} at {currentBranch?.name}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Date Selector */}
            <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Calendar Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                suppressHydrationWarning
                className="w-full h-12 px-4 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-teal-600 transition-all"
              />

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Duration: {currentService?.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Doctor Shift + Lunch Breaks Factored</span>
                </div>
              </div>
            </div>

            {/* Right: Calculated Slots Grid */}
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Time Slots ({selectedDate || 'Pick date'})
                </label>
                {isCalculatingSlots && (
                  <span className="text-xs text-teal-700 flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Querying PostgreSQL...
                  </span>
                )}
              </div>

              {!selectedDate ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 text-xs">
                  Please pick a date on the left to display available appointment slots.
                </div>
              ) : isCalculatingSlots ? (
                <div className="grid grid-cols-3 gap-3 py-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="p-6 text-center bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                  {slotClosureMessage || 'No available slots for this specialist on this date. Please try another day.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlot === slot.time;
                    if (!slot.available) {
                      return (
                        <div
                          key={slot.time}
                          className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-medium text-center cursor-not-allowed opacity-60 flex flex-col justify-center"
                          title={slot.reason}
                        >
                          <span className="line-through">{slot.time}</span>
                          <span className="text-[10px] text-slate-400 truncate">{slot.reason || 'Booked'}</span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`px-3 py-2.5 rounded-xl border-2 text-xs font-bold text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-700 text-white border-teal-700 shadow-xs scale-[1.02]'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-teal-500 hover:bg-teal-50/50'
                        }`}
                      >
                        {slot.time}
                        <span className="block text-[10px] opacity-80">({slot.endTime})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={() => setCurrentStep(5)}
              disabled={!selectedSlot || !selectedDate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Continue to Patient Details</span>
              <ArrowRight className="w-4 h-4 text-teal-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PATIENT DETAILS & FINAL REVIEW */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 5 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Patient Details & Confirmation
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Please review your booking details and provide your contact information.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Summary Card */}
            <div className="lg:col-span-5 bg-slate-50 text-slate-900 p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                  Appointment Summary
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold">
                  Locked Slot
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Specialist</span>
                  <p className="text-sm font-bold text-slate-900">{currentDoctor?.name}</p>
                  <p className="text-teal-700 font-medium">{currentDoctor?.specialization}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Dental Procedure</span>
                  <p className="text-sm font-bold text-slate-900">{currentService?.name}</p>
                  <p className="text-slate-600">{currentService?.durationMinutes} mins • ${currentService?.price}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Clinic Branch</span>
                  <p className="text-sm font-bold text-slate-900">{currentBranch?.name}</p>
                  <p className="text-slate-600">{currentBranch?.address}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Date & Time</span>
                  <p className="text-sm font-bold text-teal-800">
                    {selectedDate} at {selectedSlot}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">Total Consultation Fee</span>
                <span className="font-extrabold text-xl text-slate-900">${currentService?.price}</span>
              </div>
            </div>

            {/* Right: Patient Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              {bookingError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address (For Confirmation) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dental Symptoms or Medical Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  placeholder="e.g. Sensitivity to cold water, previous filling lost, anxiety-prone..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-teal-600 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting || !patientName || !patientEmail || !patientPhone}
                  className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Slot in Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Date & Time
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SUCCESS CONFIRMATION SCREEN */}
      {currentStep === 6 && confirmedAppointment && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-teal-50 border border-teal-200 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">
              Booking Confirmed
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              You&apos;re All Set for Dental Care!
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A confirmation email has been logged. Your official clinic appointment code is:
            </p>
            <div className="inline-block mt-3 px-5 py-2 bg-slate-50 border border-teal-300 text-teal-900 font-mono font-bold text-lg rounded-xl shadow-xs">
              {confirmedAppointment.appointmentCode}
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left text-xs space-y-3">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Specialist:</span>
              <span className="font-bold text-slate-900">{confirmedAppointment.doctorName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-900">{confirmedAppointment.serviceName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Branch:</span>
              <span className="font-bold text-slate-900">{confirmedAppointment.branchName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-bold text-teal-800">
                {confirmedAppointment.appointmentDate} at {confirmedAppointment.startTime} ({confirmedAppointment.endTime})
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Patient:</span>
              <span className="font-bold text-slate-900">{confirmedAppointment.patientName} ({confirmedAppointment.patientEmail})</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleDownloadIcs}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-700" />
              Add to Calendar (.ICS)
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              <CalendarCheck className="w-4 h-4 text-teal-400" />
              View in My Appointments
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import {
  Building2,
  Smile,
  Calendar,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Sparkles,
  Layers,
  Award,
  DollarSign,
  Activity,
  Stethoscope,
  Users
} from 'lucide-react';
import { Appointment, Branch, Service, Doctor } from '@/types/dental';

interface AdminChartsSectionProps {
  appointments: Appointment[];
  branches: Branch[];
  services: Service[];
  doctors: Doctor[];
  isClinicAdmin?: boolean;
  clinicName?: string;
}

const TEAL_PALETTE = ['#0d9488', '#0f766e', '#14b8a6', '#065f46', '#2dd4bf', '#047857', '#5eead4'];
const ACCENT_PALETTE = ['#0d9488', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export default function AdminChartsSection({
  appointments,
  branches,
  services,
  doctors,
  isClinicAdmin = false,
  clinicName = 'Clinic Studio',
}: AdminChartsSectionProps) {
  const [chartType, setChartType] = useState<'all' | 'doctors' | 'services'>('all');

  // 1. Appointments by Doctor (Scoped to this clinic for Clinic Admin, or all doctors for App Admin)
  const doctorData = useMemo(() => {
    const docCounts: Record<string, { id: string; name: string; shortName: string; specialization: string; total: number; confirmed: number; cancelled: number }> = {};

    doctors.forEach((d) => {
      docCounts[d.id] = {
        id: d.id,
        name: d.name,
        shortName: d.name.replace('Dr. ', '').split(',')[0],
        specialization: d.specialization,
        total: 0,
        confirmed: 0,
        cancelled: 0,
      };
    });

    appointments.forEach((apt) => {
      if (apt.doctorId && docCounts[apt.doctorId]) {
        docCounts[apt.doctorId].total += 1;
        if (apt.status === 'confirmed') docCounts[apt.doctorId].confirmed += 1;
        if (apt.status === 'cancelled') docCounts[apt.doctorId].cancelled += 1;
      }
    });

    return Object.values(docCounts).sort((a, b) => b.total - a.total);
  }, [appointments, doctors]);

  // 2. Appointments by Branch (for Application Admin)
  const branchData = useMemo(() => {
    const branchCounts: Record<string, { name: string; shortName: string; total: number; confirmed: number; cancelled: number; value: number }> = {};

    branches.forEach((b) => {
      const cleanName = b.name.replace('Smile Dental - ', '').replace(' Studio', '');
      branchCounts[b.id] = {
        name: b.name,
        shortName: cleanName,
        total: 0,
        confirmed: 0,
        cancelled: 0,
        value: 0,
      };
    });

    appointments.forEach((apt) => {
      const branchId = apt.branchId;
      if (!branchCounts[branchId]) {
        branchCounts[branchId] = {
          name: apt.branchName || 'Other Studio',
          shortName: (apt.branchName || 'Other').replace('Smile Dental - ', ''),
          total: 0,
          confirmed: 0,
          cancelled: 0,
          value: 0,
        };
      }
      branchCounts[branchId].total += 1;
      if (apt.status === 'confirmed') branchCounts[branchId].confirmed += 1;
      if (apt.status === 'cancelled') branchCounts[branchId].cancelled += 1;

      const srv = services.find((s) => s.id === apt.serviceId);
      if (srv) branchCounts[branchId].value += srv.price;
    });

    return Object.values(branchCounts);
  }, [appointments, branches, services]);

  // 3. Appointments by Service
  const serviceData = useMemo(() => {
    const serviceCounts: Record<string, { name: string; shortName: string; category: string; count: number; value: number }> = {};

    services.forEach((s) => {
      serviceCounts[s.id] = {
        name: s.name,
        shortName: s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name,
        category: s.category,
        count: 0,
        value: 0,
      };
    });

    appointments.forEach((apt) => {
      const srvId = apt.serviceId;
      if (serviceCounts[srvId]) {
        serviceCounts[srvId].count += 1;
        const srv = services.find((s) => s.id === srvId);
        if (srv) serviceCounts[srvId].value += srv.price;
      } else {
        const name = apt.serviceName || 'General Consultation';
        serviceCounts[srvId || 'other'] = {
          name,
          shortName: name.length > 18 ? name.substring(0, 16) + '...' : name,
          category: 'general',
          count: (serviceCounts[srvId || 'other']?.count || 0) + 1,
          value: 120,
        };
      }
    });

    return Object.values(serviceCounts).sort((a, b) => b.count - a.count).slice(0, 6);
  }, [appointments, services]);

  // Key KPI metrics
  const topDoctor = useMemo(() => {
    if (doctorData.length === 0) return 'N/A';
    return doctorData[0]?.name || 'N/A';
  }, [doctorData]);

  const topBranch = useMemo(() => {
    if (branchData.length === 0) return 'N/A';
    const sorted = [...branchData].sort((a, b) => b.total - a.total);
    return sorted[0]?.shortName || 'N/A';
  }, [branchData]);

  const topService = useMemo(() => {
    if (serviceData.length === 0) return 'N/A';
    return serviceData[0]?.name || 'N/A';
  }, [serviceData]);

  const confirmationRate = useMemo(() => {
    if (appointments.length === 0) return 0;
    const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
    return Math.round((confirmedCount / appointments.length) * 100);
  }, [appointments]);

  return (
    <div id="analytics-charts-section" className="space-y-6">
      {/* Analytics Banner Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
              {isClinicAdmin ? 'Clinic-Scoped Performance Analysis' : 'Application & Network Performance'}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {isClinicAdmin
                ? `${clinicName} Doctor & Patient Analysis`
                : 'Application Network Analysis: Studios, Doctors & Visits'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {isClinicAdmin
                ? `Detailed clinical analysis strictly for ${clinicName} and its practicing doctors. Shows doctor workload, appointment confirmation rates, and treatment popularity.`
                : 'Network-wide analysis across all dental studios, complete doctor roster, treatment distributions, and application booking volume.'}
            </p>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isClinicAdmin ? 'Top Doctor in Clinic' : 'Top Studio Location'}
              </span>
              {isClinicAdmin ? <Stethoscope className="w-4 h-4 text-teal-600" /> : <Building2 className="w-4 h-4 text-teal-600" />}
            </div>
            <div className="text-xl font-extrabold text-slate-900 truncate">
              {isClinicAdmin ? topDoctor : topBranch}
            </div>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">
              {isClinicAdmin ? 'Highest clinical consultation volume' : 'Highest patient booking volume'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Most Booked Treatment</span>
              <Smile className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 truncate" title={topService}>
              {topService}
            </div>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">Leading dental procedure</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmation Rate</span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{confirmationRate}%</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {appointments.length} total visits evaluated
            </p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: Doctor Appointments Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isClinicAdmin ? `Doctor Workload (${clinicName})` : 'Doctor Workload & Bookings Across Studios'}
                  </h3>
                  <p className="text-xs text-slate-500">Confirmed vs cancelled visits per doctor</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                {doctors.length} Doctors
              </span>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={doctorData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#2dd4bf' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar
                    dataKey="confirmed"
                    name="Confirmed Visits"
                    fill="#0d9488"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="cancelled"
                    name="Cancelled"
                    fill="#f43f5e"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Specialist consultation capacity</span>
            <span className="font-semibold text-slate-800">
              {doctorData.reduce((acc, d) => acc + d.total, 0)} Total Doctor Visits
            </span>
          </div>
        </div>

        {/* CHART 2: If App Admin show Studios comparison, if Clinic Admin show Treatments distribution */}
        {!isClinicAdmin ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Appointments by Studio Branch</h3>
                    <p className="text-xs text-slate-500">Total patient visits distribution per location</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                  {branches.length} Studios
                </span>
              </div>

              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="shortName"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      itemStyle={{ color: '#2dd4bf' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar
                      dataKey="confirmed"
                      name="Confirmed Visits"
                      fill="#0d9488"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="cancelled"
                      name="Cancelled"
                      fill="#f43f5e"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Macro studio load balance</span>
              <span className="font-semibold text-slate-800">
                {branchData.reduce((acc, b) => acc + b.total, 0)} Total Network Bookings
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Smile className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Treatments Booked at this Clinic</h3>
                    <p className="text-xs text-slate-500">Service popularity for {clinicName}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                  {serviceData.length} Procedures
                </span>
              </div>

              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis
                      dataKey="shortName"
                      type="category"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="count" name="Patient Bookings" fill="#0d9488" radius={[0, 6, 6, 0]}>
                      {serviceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={TEAL_PALETTE[index % TEAL_PALETTE.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Patient treatment preferences</span>
              <span className="font-semibold text-slate-800">
                {serviceData.reduce((acc, s) => acc + s.count, 0)} Procedures Booked
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

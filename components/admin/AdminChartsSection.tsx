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
  Activity
} from 'lucide-react';
import { Appointment, Branch, Service, Doctor } from '@/types/dental';

interface AdminChartsSectionProps {
  appointments: Appointment[];
  branches: Branch[];
  services: Service[];
  doctors: Doctor[];
}

const TEAL_PALETTE = ['#0d9488', '#0f766e', '#14b8a6', '#065f46', '#2dd4bf', '#047857', '#5eead4'];
const ACCENT_PALETTE = ['#0d9488', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

export default function AdminChartsSection({
  appointments,
  branches,
  services,
  doctors
}: AdminChartsSectionProps) {
  const [chartType, setChartType] = useState<'all' | 'branch' | 'service'>('all');

  // 1. Compute Appointments by Branch
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

      // Add service price estimation if matching service exists
      const srv = services.find((s) => s.id === apt.serviceId);
      if (srv) branchCounts[branchId].value += srv.price;
    });

    return Object.values(branchCounts);
  }, [appointments, branches, services]);

  // 2. Compute Appointments by Service
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

    // Sort by most booked
    return Object.values(serviceCounts).sort((a, b) => b.count - a.count);
  }, [appointments, services]);

  // 3. Compute Service Category Breakdown
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    appointments.forEach((apt) => {
      const srv = services.find((s) => s.id === apt.serviceId);
      const cat = srv?.category || 'general';
      const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
      categories[formattedCat] = (categories[formattedCat] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [appointments, services]);

  // Key KPI metrics
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
    if (appointments.length === 0) return 100;
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    return Math.round((confirmed / appointments.length) * 100);
  }, [appointments]);

  return (
    <div className="space-y-8">
      {/* Visual Analytics Overview Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Appointment Distribution & Patient Trends
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Visual breakdown of patient bookings across clinic branches and dental care treatments.
            </p>
          </div>

          {/* Filter View Selector */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setChartType('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Charts
            </button>
            <button
              onClick={() => setChartType('branch')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'branch'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Studio Branch
            </button>
            <button
              onClick={() => setChartType('service')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                chartType === 'service'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Dental Service
            </button>
          </div>
        </div>

        {/* Quick Analytical Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Top Studio Location</span>
              <Building2 className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{topBranch}</div>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">Highest patient booking volume</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Most Booked Treatment</span>
              <Smile className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900 truncate" title={topService}>
              {topService}
            </div>
            <p className="text-[11px] text-teal-700 font-medium mt-0.5">Leading clinical specialty</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmation Rate</span>
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{confirmationRate}%</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Active confirmed visits</p>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: Distribution of Appointments by Branch (Bar Chart) */}
        {(chartType === 'all' || chartType === 'branch') && (
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

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Updated automatically with real-time bookings</span>
              <span className="font-semibold text-slate-800">{appointments.length} Total Bookings</span>
            </div>
          </div>
        )}

        {/* CHART 2: Distribution of Appointments by Dental Service (Pie / Donut Chart) */}
        {(chartType === 'all' || chartType === 'service') && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Smile className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Appointments by Dental Treatment</h3>
                    <p className="text-xs text-slate-500">Service breakdown by patient clinical demand</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                  {services.length} Services
                </span>
              </div>

              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceData.filter((s) => s.count > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="name"
                      label={({ name, percent }: { name?: string; percent?: number }) => `${(name || '').split(' ')[0]} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      labelLine={false}
                    >
                      {serviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ACCENT_PALETTE[index % ACCENT_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Includes preventative, restorative & cosmetic</span>
              <span className="font-semibold text-slate-800">Top: {topService}</span>
            </div>
          </div>
        )}

        {/* CHART 3: Service Categories Horizontal Comparison */}
        {chartType === 'all' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Treatment Volume by Specialty Service</h3>
                  <p className="text-xs text-slate-500">Detailed booking volume comparison across all offered treatments</p>
                </div>
              </div>
            </div>

            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    tick={{ fontSize: 11, fill: '#334155' }}
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: any, props: any) => [`${value} bookings`, props.payload.name]}
                  />
                  <Bar
                    dataKey="count"
                    name="Bookings"
                    fill="#0d9488"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

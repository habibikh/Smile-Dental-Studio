'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Calendar,
  Percent,
  Info,
  Layers,
  ChevronRight
} from 'lucide-react';

interface TreatmentOption {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  unitLabel: string;
  minUnits: number;
  maxUnits: number;
  defaultUnits: number;
  description: string;
  insuranceCoverPercent: number;
}

const TREATMENTS: TreatmentOption[] = [
  {
    id: 'whitening',
    name: 'Laser Teeth Whitening',
    category: 'Cosmetic',
    basePrice: 299,
    unitLabel: 'session(s)',
    minUnits: 1,
    maxUnits: 3,
    defaultUnits: 1,
    description: 'In-clinic LED wavelength laser bleaching with sensitivity shield.',
    insuranceCoverPercent: 0,
  },
  {
    id: 'veneers',
    name: 'Handcrafted Porcelain Veneers',
    category: 'Cosmetic',
    basePrice: 850,
    unitLabel: 'tooth/teeth',
    minUnits: 2,
    maxUnits: 12,
    defaultUnits: 6,
    description: 'Ultra-thin E-max ceramic veneers custom-crafted in our digital lab.',
    insuranceCoverPercent: 15,
  },
  {
    id: 'aligners',
    name: 'Clear Aligners (Full Arch)',
    category: 'Orthodontics',
    basePrice: 2800,
    unitLabel: 'case',
    minUnits: 1,
    maxUnits: 1,
    defaultUnits: 1,
    description: 'Custom 3D-planned transparent aligners with bi-weekly refinements.',
    insuranceCoverPercent: 30,
  },
  {
    id: 'implants',
    name: 'Titanium Dental Implant + Crown',
    category: 'Restorative',
    basePrice: 1650,
    unitLabel: 'implant(s)',
    minUnits: 1,
    maxUnits: 6,
    defaultUnits: 1,
    description: 'Swiss Straumann implant post, custom titanium abutment & zirconia crown.',
    insuranceCoverPercent: 50,
  },
  {
    id: 'hygiene',
    name: 'Comprehensive Checkup & Airflow Polish',
    category: 'General',
    basePrice: 120,
    unitLabel: 'visit',
    minUnits: 1,
    maxUnits: 2,
    defaultUnits: 1,
    description: 'Complete ultrasonic scaling, micro-particle stain removal & digital scans.',
    insuranceCoverPercent: 80,
  },
];

export default function SmileCostCalculator() {
  const router = useRouter();
  const [selectedTreatments, setSelectedTreatments] = useState<{ [id: string]: boolean }>({
    whitening: true,
    hygiene: true,
  });

  const [quantities, setQuantities] = useState<{ [id: string]: number }>({
    whitening: 1,
    veneers: 6,
    aligners: 1,
    implants: 1,
    hygiene: 1,
  });

  const [insuranceType, setInsuranceType] = useState<'standard' | 'premium' | 'none'>('standard');
  const [financingMonths, setFinancingMonths] = useState<number>(24);

  const toggleTreatment = (id: string) => {
    setSelectedTreatments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const setQuantity = (id: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  // Calculations
  const rawTotal = TREATMENTS.reduce((sum, item) => {
    if (selectedTreatments[item.id]) {
      const qty = quantities[item.id] || item.defaultUnits;
      return sum + item.basePrice * qty;
    }
    return sum;
  }, 0);

  const insuranceFactor = insuranceType === 'premium' ? 1.25 : insuranceType === 'standard' ? 1.0 : 0;
  
  const estimatedInsuranceCoverage = TREATMENTS.reduce((sum, item) => {
    if (selectedTreatments[item.id]) {
      const qty = quantities[item.id] || item.defaultUnits;
      const itemCost = item.basePrice * qty;
      const coverageRate = (item.insuranceCoverPercent / 100) * insuranceFactor;
      return sum + itemCost * Math.min(coverageRate, 0.8);
    }
    return sum;
  }, 0);

  const outOfPocketTotal = Math.max(0, rawTotal - estimatedInsuranceCoverage);
  const monthlyPayment = outOfPocketTotal > 0 ? Math.round(outOfPocketTotal / financingMonths) : 0;

  const handleBookWithPlan = () => {
    const selectedIds = Object.keys(selectedTreatments).filter((k) => selectedTreatments[k]);
    const serviceParam = selectedIds.length > 0 ? selectedIds[0] : 'srv-checkup-cleaning';
    router.push(`/book?serviceId=${serviceParam}&estimatedCost=${outOfPocketTotal}`);
  };

  return (
    <section id="smile-calculator" className="py-20 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Transparent Pricing.{' '}
            <span className="text-teal-700">
              Zero Hidden Fees.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Customize your dental treatment goals to calculate estimated fees, insurance coverage discounts, and flexible 0% APR monthly financing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Procedure Selector */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Select Desired Procedures
              </span>
              <span className="text-xs text-teal-700 font-semibold">
                {Object.values(selectedTreatments).filter(Boolean).length} selected
              </span>
            </div>

            <div className="space-y-3">
              {TREATMENTS.map((item) => {
                const isSelected = !!selectedTreatments[item.id];
                const qty = quantities[item.id] || item.defaultUnits;
                const itemTotal = item.basePrice * qty;

                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'bg-teal-50/40 border-teal-300 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleTreatment(item.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-teal-700 border-teal-700 text-white font-bold'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              onClick={() => toggleTreatment(item.id)}
                              className="font-bold text-sm sm:text-base text-slate-900 cursor-pointer hover:text-teal-700"
                            >
                              {item.name}
                            </h3>
                            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {item.description}
                          </p>

                          {/* Unit controls if selectable */}
                          {isSelected && item.maxUnits > 1 && (
                            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200">
                              <span className="text-xs text-slate-500">Quantity:</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={qty <= item.minUnits}
                                  onClick={() => setQuantity(item.id, Math.max(item.minUnits, qty - 1))}
                                  className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold text-teal-800 min-w-[50px] text-center">
                                  {qty} {item.unitLabel}
                                </span>
                                <button
                                  type="button"
                                  disabled={qty >= item.maxUnits}
                                  onClick={() => setQuantity(item.id, Math.min(item.maxUnits, qty + 1))}
                                  className="w-6 h-6 rounded-md bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-slate-900">
                          ${itemTotal.toLocaleString()}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          ${item.basePrice}/{item.unitLabel.split('/')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Insurance Tier Selector */}
            <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Dental Insurance Coverage Tier
              </span>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setInsuranceType('standard')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    insuranceType === 'standard'
                      ? 'bg-teal-50 border-teal-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Standard PPO</div>
                  <div className="text-[11px] text-teal-700">Delta, Cigna, MetLife</div>
                </button>

                <button
                  type="button"
                  onClick={() => setInsuranceType('premium')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    insuranceType === 'premium'
                      ? 'bg-teal-50 border-teal-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Premium Tier</div>
                  <div className="text-[11px] text-teal-700">Max Co-pay (~80%)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setInsuranceType('none')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    insuranceType === 'none'
                      ? 'bg-teal-50 border-teal-500 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Self-Pay / Cash</div>
                  <div className="text-[11px] text-teal-700">0% APR Financing</div>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Cost Summary & Financing Breakdown Card */}
          <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Custom Estimate Breakdown
              </h3>
              <span className="text-xs bg-teal-50 text-teal-800 font-semibold px-2.5 py-1 rounded-full border border-teal-200">
                Guaranteed Rates
              </span>
            </div>

            {/* Price lines */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Standard Clinical Fee Total:</span>
                <span className="font-semibold text-slate-900">${rawTotal.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-teal-700">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-4 h-4" />
                  Estimated Insurance Co-pay:
                </span>
                <span className="font-semibold">-${Math.round(estimatedInsuranceCoverage).toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold">
                    Estimated Out-of-Pocket
                  </span>
                  <span className="text-[11px] text-slate-500">Subject to studio insurance verification</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ${Math.round(outOfPocketTotal).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Monthly 0% APR Financing Box */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  0% APR Monthly Payment Plan
                </span>
                <span className="text-[11px] text-teal-800 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  No Hard Credit Check
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    ${monthlyPayment}
                  </span>
                  <span className="text-xs text-slate-500"> / month</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {[12, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFinancingMonths(m)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        financingMonths === m
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {m} mo
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Partnered with Cherry & CareCredit for instant soft-inquiry pre-approvals at checkout.
              </p>
            </div>

            {/* CTA */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleBookWithPlan}
                disabled={rawTotal === 0}
                className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                Book Consultation with This Estimate
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Free 3D Scan Included
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  0 Cancellation Fees
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

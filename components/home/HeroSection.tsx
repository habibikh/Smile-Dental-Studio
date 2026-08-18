'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  ShieldCheck,
  Award,
  ArrowRight,
  Clock,
  Calculator
} from 'lucide-react';
import DentalVisual from '@/components/visuals/DentalVisual';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copywriting & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Gentle, personalized dental care for your{' '}
              <span className="text-teal-600">
                healthiest smile
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              From routine cleanings and checkups to clear aligners and restorative implants, our experienced dental team provides compassionate, high-quality care in a calm, modern setting.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-sm transition-all"
              >
                <Calendar className="w-5 h-5 text-teal-400" />
                Book an Appointment
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <a
                href="#smile-calculator"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-slate-700 font-semibold text-base border border-slate-200 shadow-xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all"
              >
                <Calculator className="w-5 h-5 text-teal-600" />
                Estimate Treatment Cost
              </a>
            </div>

            {/* Key Clinical Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Board-Certified</p>
                  <p className="text-[11px] text-slate-500">Experienced Clinicians</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Easy Online Booking</p>
                  <p className="text-[11px] text-slate-500">Instant confirmation</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">4.98/5.0 Rating</p>
                  <p className="text-[11px] text-slate-500">Over 2,400 Reviews</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Stage */}
          <div className="lg:col-span-6">
            <DentalVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

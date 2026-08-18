'use client';

import React, { useState } from 'react';
import {
  Award,
  Shield,
  Scan,
  HeartHandshake,
  Clock,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Activity,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function WhyUsSection() {
  const [activePillar, setActivePillar] = useState<number>(0);

  const pillars = [
    {
      icon: <Scan className="w-6 h-6 text-teal-600" />,
      title: '100% Digital 3D Impressions',
      badge: 'Zero Putty Molds',
      description: 'Our optical 3D scanners capture 6,000 frames per second at 20-micron accuracy. We render an instant 3D model of your dental arches in under 60 seconds with zero gag reflex.',
      stat: '20µm',
      statLabel: 'Scanning Precision',
    },
    {
      icon: <Cpu className="w-6 h-6 text-teal-600" />,
      title: 'In-House Same-Day CAD/CAM Milling',
      badge: 'Single Visit Crowns',
      description: 'Custom all-ceramic E-max and zirconia crowns, onlays, and veneers precision-milled in our studio in under 45 minutes while you relax in our private media lounge.',
      stat: '45 mins',
      statLabel: 'Avg Fabrication Time',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-teal-600" />,
      title: 'Zero-Anxiety Sedation Suite',
      badge: 'Gentle Dentistry',
      description: 'From warm aromatherapy eye pillows and active noise-canceling headphones to computerized wand anesthesia and twilight conscious sedation.',
      stat: '99.4%',
      statLabel: 'Patient Comfort Score',
    },
    {
      icon: <Shield className="w-6 h-6 text-teal-600" />,
      title: 'Hospital-Grade Cleanroom Sterilization',
      badge: 'Class-B Autoclave',
      description: 'Every operatory features surgical-grade medical HEPA-14 filtration with negative air pressure cycles and RFID-tracked sterilization protocols.',
      stat: '100%',
      statLabel: 'Sterile Compliance',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/60 text-slate-900 relative overflow-hidden border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Where Advanced Technology Meets{' '}
            <span className="text-teal-700">
              Human Compassion
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            We redesigned the clinical dental journey from the ground up to eliminate discomfort, eliminate waiting room delays, and deliver flawless biomimetic outcomes.
          </p>
        </div>

        {/* 4 Architectural Clinical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border p-7 transition-all duration-300 flex flex-col justify-between group ${
                activePillar === index
                  ? 'bg-white border-teal-400 shadow-md ring-1 ring-teal-400/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
              onMouseEnter={() => setActivePillar(index)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:scale-105 transition-all">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Metric footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">{item.statLabel}</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    {item.stat}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-teal-700 group-hover:bg-teal-50 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Assurance Bar */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                100% Satisfaction & Aesthetic Guarantee
              </h4>
              <p className="text-xs text-slate-600">
                We guarantee the shade, fit, and aesthetic symmetry of all restorative and cosmetic restorations.
              </p>
            </div>
          </div>

          <Link
            href="/book"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            Experience Our Care
          </Link>
        </div>
      </div>
    </section>
  );
}


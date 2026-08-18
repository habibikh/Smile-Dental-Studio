'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Quote,
  CheckCircle2,
  Smile,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CaseStory {
  id: string;
  patientName: string;
  age: number;
  treatment: string;
  duration: string;
  doctorName: string;
  quote: string;
  rating: number;
  beforeNotes: string;
  afterNotes: string;
  imageUrl: string;
  tag: string;
}

const STORIES: CaseStory[] = [
  {
    id: 'case-1',
    patientName: 'Alexandra M.',
    age: 31,
    treatment: 'Handcrafted Porcelain Veneers (8 Upper)',
    duration: '2 appointments (14 days)',
    doctorName: 'Dr. Sarah Jenkins, DDS',
    quote: 'I had avoided smiling in photos for nearly a decade because of chipped enamel and uneven spacing. Dr. Jenkins designed my smile digitally first—the result looks completely natural, luminous, and gave me my confidence back.',
    rating: 5,
    beforeNotes: 'Tetracycline discoloration & incisal edge micro-fractures',
    afterNotes: 'Custom E-Max ultra-translucent ceramic porcelain (BL2 shade)',
    imageUrl: 'https://picsum.photos/seed/dentalcase1/700/500',
    tag: 'Cosmetic Smile Makeover',
  },
  {
    id: 'case-2',
    patientName: 'David K.',
    age: 44,
    treatment: 'Single-Tooth Swiss Implant + CAD Crown',
    duration: 'Single surgery + 3D scan crown',
    doctorName: 'Dr. Marcus Vance, Oral Surgeon',
    quote: 'I lost a lower molar from a sports accident. The 3D computer-guided surgical implant was entirely painless. I was back at work the next morning with zero discomfort. The final crown matches my natural teeth perfectly.',
    rating: 5,
    beforeNotes: 'Missing tooth #19 with localized bone resorption',
    afterNotes: 'Guided Straumann Titanium implant & monolithic zirconia crown',
    imageUrl: 'https://picsum.photos/seed/dentalcase2/700/500',
    tag: 'Restorative Implantology',
  },
  {
    id: 'case-3',
    patientName: 'Elena R.',
    age: 28,
    treatment: 'Invisalign Clear Aligners & In-Clinic Whitening',
    duration: '7 months active aligners',
    doctorName: 'Dr. Emily Chen, Orthodontist',
    quote: 'Dr. Chen showed me the 3D outcome video on day one! The aligners were so discreet my colleagues barely noticed. Finishing with the laser whitening was the cherry on top.',
    rating: 5,
    beforeNotes: 'Class I malocclusion with 4mm anterior crowding',
    afterNotes: 'Ideal arch form, class I occlusion & 6 shades brighter enamel',
    imageUrl: 'https://picsum.photos/seed/dentalcase3/700/500',
    tag: 'Digital Orthodontics',
  },
];

export default function TestimonialsSection() {
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const activeStory = STORIES[activeStoryIdx];

  const handlePrev = () => {
    setActiveStoryIdx((prev) => (prev === 0 ? STORIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveStoryIdx((prev) => (prev === STORIES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Loved by Over{' '}
              <span className="text-teal-700">
                12,000+ Smiling Patients
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Read how precision digital dentistry and anxiety-free gentle care transformed our patients&apos; lives and daily confidence.
            </p>
          </div>

          {/* Social Proof Badges */}
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xs text-white ring-2 ring-white">AM</div>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white ring-2 ring-white">DK</div>
              <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center font-bold text-xs text-white ring-2 ring-white">ER</div>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white ring-2 ring-white">+2k</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-800 font-semibold mt-0.5">
                4.98 / 5.0 on Google Reviews
              </div>
            </div>
          </div>
        </div>

        {/* Featured Showcase Story Card */}
        <div className="bg-slate-50/70 rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Story Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  {activeStory.tag}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Verified Clinic Case
                </span>
              </div>

              <div className="relative">
                <Quote className="w-10 h-10 text-teal-600/15 absolute -top-4 -left-4 -z-10" />
                <p className="text-base sm:text-xl text-slate-800 font-medium leading-relaxed italic">
                  &ldquo;{activeStory.quote}&rdquo;
                </p>
              </div>

              {/* Patient and Doctor info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {activeStory.patientName}, <span className="text-slate-500 text-sm font-normal">Age {activeStory.age}</span>
                  </h3>
                  <div className="text-xs text-teal-700 font-semibold mt-0.5">
                    Treated by {activeStory.doctorName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Treatment Timeline</div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{activeStory.duration}</div>
                </div>
              </div>

              {/* Clinical notes comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-rose-700 font-bold block mb-1">Pre-Treatment Finding:</span>
                  <span className="text-slate-600">{activeStory.beforeNotes}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                  <span className="text-teal-700 font-bold block mb-1">Clinical Outcome:</span>
                  <span className="text-slate-600">{activeStory.afterNotes}</span>
                </div>
              </div>
            </div>

            {/* Story Visual Thumbnail & Navigation Controls */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 group shadow-xs">
                <Image
                  src={activeStory.imageUrl}
                  alt={activeStory.treatment}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                  <div>
                    <span className="text-xs text-teal-300 font-bold uppercase tracking-wider block">
                      Case Study
                    </span>
                    <span className="text-sm font-bold text-white">
                      {activeStory.treatment}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between w-full pt-2">
                <div className="flex items-center gap-1.5">
                  {STORIES.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveStoryIdx(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeStoryIdx === idx ? 'w-8 bg-teal-700' : 'w-2 bg-slate-300'
                      }`}
                      aria-label={`View story ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    aria-label="Previous case"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                    aria-label="Next case"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-12 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all hover:scale-[1.02]"
          >
            <span>Begin Your Own Smile Transformation</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}

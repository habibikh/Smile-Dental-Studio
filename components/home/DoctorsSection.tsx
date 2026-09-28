'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  Award,
  Calendar,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';
import { Doctor } from '@/types/dental';
import { safeFetchJson } from '@/lib/utils';

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await safeFetchJson<{ doctors: Doctor[] }>('/api/doctors');
        if (data?.doctors) setDoctors(data.doctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  return (
    <section className="py-20 bg-slate-50/50 relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Meet Our Board-Certified Dentists
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-2xl">
              Our multidisciplinary team combines Ivy League clinical training with gentle, patient-centered techniques across all dental specialties.
            </p>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 self-start md:self-end group"
          >
            <span>View all dental specialists</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.slice(0, 6).map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Badge Header */}
                  <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                    {/* Top rating badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 border border-slate-200 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-500 font-normal">({doctor.reviewsCount})</span>
                    </div>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="inline-block text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
                        {doctor.experienceYears} Years Clinical Exp
                      </span>
                      <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-xs">
                        {doctor.name}
                      </h3>
                      <p className="text-xs text-slate-200 line-clamp-1">{doctor.title}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-xs text-teal-700 mb-3 font-medium">
                      <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate">{doctor.qualification}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {doctor.bio}
                    </p>

                    {/* Languages */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Languages:</span>
                      <span className="font-semibold text-slate-800">{doctor.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 flex items-center gap-2">
                  <Link
                    href={`/doctors`}
                    className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    View Bio
                  </Link>

                  <Link
                    href={`/book?doctorId=${doctor.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Specialist
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

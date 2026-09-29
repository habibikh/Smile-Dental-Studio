'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Star,
  Building2,
  Calendar
} from 'lucide-react';
import { Branch } from '@/types/dental';
import { safeFetchJson } from '@/lib/utils';

export default function BranchesSection() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBranches() {
      try {
        const data = await safeFetchJson<{ branches: Branch[] }>('/api/branches');
        if (data?.branches) setBranches(data.branches);
      } catch (err) {
        console.error('Failed to load branches:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBranches();
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              4 Modern Clinics Across Metro City
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-2xl">
              Each branch is fully equipped with digital X-rays, 3D intraoral scanners, private consultation suites, and validated patient parking.
            </p>
          </div>

          <Link
            href="/branches"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 self-start md:self-end group"
          >
            <span>View all branches & directions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Branches Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={branch.imageUrl}
                      alt={branch.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 border border-slate-200 shadow-xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <span>{branch.rating}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                      {branch.city} Branch
                    </span>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-teal-700 transition-colors">
                      {branch.name.replace('Smile Dental - ', '')}
                    </h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-500">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 text-slate-600">{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="text-slate-700 font-medium">{branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{branch.openingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/book?branchId=${branch.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-700 hover:text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book at This Branch
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

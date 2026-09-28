'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Shield,
  Sun,
  Activity,
  Heart,
  Zap,
  Smile,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Info,
  X,
  Calendar
} from 'lucide-react';
import { Service } from '@/types/dental';
import { safeFetchJson } from '@/lib/utils';

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await safeFetchJson<{ services: Service[] }>('/api/services');
        if (data?.services) setServices(data.services);
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchServices();
  }, []);

  const categories = ['All', 'General', 'Cosmetic', 'Orthodontics', 'Restorative', 'Pediatric'];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category === activeCategory;
  });

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-teal-600" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-600" />;
      case 'Smile':
        return <Smile className="w-5 h-5 text-teal-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-purple-600" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <section className="py-20 bg-slate-50/50 border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Dental Care Under One Roof
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-2xl">
              From preventative cleanings to surgical implants and aesthetic smile designs, each treatment is performed with digital precision and gentle sedation options.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 self-start md:self-end group"
          >
            <span>View all procedures & transparent fees</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-teal-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center group-hover:bg-teal-100/80 transition-colors">
                      {getServiceIcon(service.iconName)}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">${service.price}</span>
                      <span className="block text-[11px] text-slate-500 font-medium">Transparent fee</span>
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 border border-slate-200 text-slate-700 mb-2">
                    {service.category}
                  </span>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {service.shortDescription || service.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {service.benefits.slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span className="truncate">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedServiceForModal(service)}
                    className="text-xs text-slate-500 hover:text-teal-700 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Clinical Protocol</span>
                  </button>

                  <Link
                    href={`/book?serviceId=${service.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-700 hover:text-white text-xs font-semibold transition-all"
                  >
                    <span>Book Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Steps Quick View Modal */}
      {selectedServiceForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-900 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedServiceForModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {selectedServiceForModal.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-600" />
                {selectedServiceForModal.durationMinutes} mins appointment
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {selectedServiceForModal.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {selectedServiceForModal.description}
            </p>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                Step-by-Step Clinical Protocol
              </h4>
              <div className="space-y-2.5">
                {selectedServiceForModal.procedureSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Procedure Fee</span>
                <span className="text-2xl font-extrabold text-teal-700">${selectedServiceForModal.price}</span>
              </div>

              <Link
                href={`/book?serviceId=${selectedServiceForModal.id}`}
                onClick={() => setSelectedServiceForModal(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book This Treatment
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

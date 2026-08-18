'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, AlertCircle, Clock, ShieldCheck, ChevronRight, X } from 'lucide-react';

export default function EmergencyBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside aria-label="Emergency dental care notice" className="bg-rose-50 border-b border-rose-200/80 text-rose-900 py-2.5 px-4 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-center sm:text-left flex-wrap sm:flex-nowrap">
          <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
          </span>
          <p className="text-rose-950 font-medium hidden md:inline">
            Severe toothache, broken crown, or sudden facial trauma? On-call surgeons available across all 4 studios.
          </p>
          <p className="text-rose-950 font-medium md:hidden">
            Severe pain or dental emergency? Same-day priority slots available.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:5552342273"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>(555) 234-CARE</span>
          </a>
          <Link
            href="/book?serviceId=srv-emergency"
            className="inline-flex items-center gap-1 text-xs text-rose-800 hover:text-rose-950 font-semibold underline underline-offset-2"
          >
            <span>Priority Booking</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="text-rose-500 hover:text-rose-800 p-1 rounded-md transition-colors ml-1"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}


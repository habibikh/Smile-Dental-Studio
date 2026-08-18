'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smile,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Heart
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 relative overflow-hidden">
      {/* Main footer contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
                <Smile className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Smile<span className="text-teal-400">Dental</span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Smile Dental Studio is an architectural practice dedicated to painless, digital dental surgery, aesthetics, and preventative health care across 4 metro studios.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span className="text-white font-semibold">(555) 234-CARE (2273)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400" />
                <span className="text-slate-300">concierge@smiledental.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>Mon–Sat: 8:00 AM – 7:00 PM (24/7 Emergency On-Call)</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Treatments
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors">
                  Teeth Cleaning & Hygiene
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors">
                  Laser Teeth Whitening
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors">
                  Invisalign Clear Aligners
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors">
                  Dental Implants & 3D CBCT
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors">
                  Painless Root Canal Therapy
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-400 transition-colors">
                  Porcelain Aesthetic Veneers
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinic Branches */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Studio Locations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/branches" className="hover:text-teal-400 transition-colors">
                  Downtown Metro Flagship
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-teal-400 transition-colors">
                  Westside Plaza Practice
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-teal-400 transition-colors">
                  Northshore Surgical Center
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-teal-400 transition-colors">
                  Uptown Family Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Patient Portal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Patient Concierge
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/book" className="hover:text-teal-300 transition-colors font-semibold text-teal-400">
                  Book Live Appointment
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
                  My Appointments & Reschedule
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-teal-400 transition-colors">
                  Clinical Roster & Bio
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">
                  Patient Portal Login
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-teal-400 transition-colors">
                  Admin & Data Manager
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Smile Dental Studio Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Care</span>
            <span className="hover:text-slate-200 cursor-pointer">HIPAA Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


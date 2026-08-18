'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does your real-time online appointment booking work?',
      a: 'Our booking engine connects directly to each doctor\'s live clinic schedule and operatory availability. When you select a date and time slot, that slot is instantly locked for you in the database, completely preventing double-booking.',
    },
    {
      q: 'What should I bring to my first dental appointment?',
      a: 'Please bring a photo ID and your dental insurance card if you have coverage. If you have recent dental X-rays from the past 12 months, you can bring them or our clinic can take digital low-radiation scans during your visit.',
    },
    {
      q: 'Do you offer anxiety-free sedation for nervous patients?',
      a: 'Yes! We specialize in anxiety-free dentistry. We offer multiple sedation options including soothing nitrous oxide (laughing gas), oral conscious sedation, and IV sedation for surgical procedures.',
    },
    {
      q: 'How does Smile Assistant AI help with booking and dental questions?',
      a: 'Smile Assistant is our specialized clinical AI coordinator. You can talk or type to check real doctor availability, find out procedure costs, book slots, or reschedule your appointments directly through chat.',
    },
    {
      q: 'Can I reschedule or cancel my appointment online?',
      a: 'Yes, you can easily reschedule or cancel your appointment through your Patient Dashboard or via the Smile Assistant chatbot at any time up to 24 hours before your scheduled visit.',
    },
    {
      q: 'Are your treatment fees transparent?',
      a: 'Absolutely. We provide itemized, transparent pricing before any procedure begins, with zero hidden facility or tray charges.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Everything you need to know about our clinics, doctors, insurance, and booking process.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-teal-500 shadow-sm'
                    : 'border-slate-200/90 hover:border-slate-300'
                } overflow-hidden`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-hidden cursor-pointer"
                >
                  <span className="text-base font-bold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

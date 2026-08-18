'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Smile,
  X,
  Send,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredCards?: any[];
}

let chatCounter = 0;
function createMessageId(prefix: string) {
  chatCounter += 1;
  return `${prefix}-${chatCounter}`;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content:
      '👋 Hello! I am **Smile Assistant**, your AI dental coordinator. I can help you check real-time doctor availability, explore dental services, book appointments, or reschedule your visits across our 4 clinics. How can I help you today?',
    timestamp: 'Just now',
  },
];

export default function SmileAssistant() {
  const router = useRouter();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const suggestedQuestions = [
    'What dental services do you offer?',
    'Which dentists are available tomorrow?',
    'What are your clinic branch hours?',
    'Help me book teeth cleaning',
    'How much does laser whitening cost?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: createMessageId('user'),
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: user
            ? {
                name: user.fullName,
                email: user.email,
                phone: user.phone,
              }
            : null,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: createMessageId('asst'),
        role: 'assistant',
        content: data.text || 'I have retrieved the clinic details for you.',
        timestamp: 'Just now',
        structuredCards: data.structuredCards || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId('asst-err'),
          role: 'assistant',
          content: 'I apologize, I encountered a temporary connection issue. Please try again or book directly through our booking page.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickBookSlot = (card: any, timeSlot: string) => {
    const params = new URLSearchParams({
      doctorId: card.doctorId,
      branchId: card.branchId,
      serviceId: card.serviceId,
      date: card.date,
      time: timeSlot,
    });
    setIsOpen(false);
    router.push(`/book?${params.toString()}`);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        id="smile-assistant-launcher"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-slate-900 text-white font-semibold text-sm shadow-lg hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all group cursor-pointer border border-slate-700/50"
        aria-label="Open Smile Assistant AI"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-teal-400" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 border-2 border-slate-900 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 border-2 border-slate-900 rounded-full" />
        </div>
        <span className="hidden sm:inline">Smile Assistant AI</span>
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          id="smile-assistant-panel"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">Smile Assistant</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    Live AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Direct Database & Booking Sync</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="max-w-[84%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-700 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>

                    {/* Structured Action Cards (e.g. Real Availability Slots returned by tool) */}
                    {msg.structuredCards && msg.structuredCards.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                        {msg.structuredCards.map((card, cIdx) => {
                          if (card.type === 'availability_slots') {
                            return (
                              <div
                                key={cIdx}
                                className="bg-slate-50 border border-teal-200 rounded-xl p-3 text-slate-800 space-y-2"
                              >
                                <div className="flex items-center justify-between text-[11px] font-bold text-teal-800">
                                  <span>{card.doctorName}</span>
                                  <span>{card.date}</span>
                                </div>
                                <p className="text-[11px] text-slate-600">{card.branchName} • {card.serviceName}</p>

                                <div className="grid grid-cols-3 gap-1.5 pt-1">
                                  {card.slots.slice(0, 6).map((slot: any, sIdx: number) => (
                                    <button
                                      key={sIdx}
                                      onClick={() => handleQuickBookSlot(card, slot.time)}
                                      className="px-2 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs text-center transition-all shadow-xs cursor-pointer"
                                    >
                                      {slot.time}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          }

                          if (card.type === 'booking_confirmed') {
                            return (
                              <div
                                key={cIdx}
                                className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 space-y-1.5 text-xs shadow-xs"
                              >
                                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Confirmed Code: {card.appointment.appointmentCode}</span>
                                </div>
                                <p className="text-slate-700">
                                  {card.appointment.doctorName} on {card.appointment.appointmentDate} at{' '}
                                  {card.appointment.startTime}
                                </p>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs py-1">
                <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl flex items-center gap-2 text-teal-800 shadow-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Checking clinic schedules & availability...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          {messages.length < 3 && (
            <div className="px-3 py-2 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 hover:border-teal-500 hover:text-teal-800 transition-colors shrink-0 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about dentists, prices, or book..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-teal-600 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-teal-400" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

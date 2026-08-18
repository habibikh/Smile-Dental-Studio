'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Smile,
  Sun,
  Shield,
  Layers,
  Activity,
  Scan,
  CheckCircle2,
  Sliders,
  Zap,
  Info
} from 'lucide-react';

export default function DentalVisual() {
  const [activeTab, setActiveTab] = useState<'whitening' | 'anatomy' | 'scanner'>('whitening');
  const [shadeLevel, setShadeLevel] = useState(85); // 0 (yellowish A4) to 100 (Hollywood Bleach B1)
  const [selectedLayer, setSelectedLayer] = useState<'enamel' | 'dentin' | 'pulp'>('enamel');
  const [scanProgress, setScanProgress] = useState(65);

  // Periodic scanner animation cycle
  useEffect(() => {
    if (activeTab === 'scanner') {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 0 : prev + 5));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  // Compute tooth color gradient based on shade level
  const getToothColor = () => {
    const ratio = shadeLevel / 100;
    const red = Math.round(240 + (255 - 240) * ratio);
    const green = Math.round(225 + (255 - 225) * ratio);
    const blue = Math.round(195 + (255 - 195) * ratio);
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <div className="w-full bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md overflow-hidden relative">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 relative z-10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Interactive Smile & Care Visualizer
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore tooth shade whitening, anatomical layers, and 3D precision imaging.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('whitening')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'whitening'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            Whitening
          </button>
          <button
            onClick={() => setActiveTab('anatomy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'anatomy'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            Anatomy
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'scanner'
                ? 'bg-white text-teal-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-teal-600" />
            3D Scan
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-center relative z-10">
        {/* Left Column: Visual Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[340px] relative bg-slate-50 rounded-2xl border border-slate-200 p-6 overflow-hidden">
          {/* TAB 1: WHITENING SIMULATOR */}
          {activeTab === 'whitening' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center relative"
            >
              {/* Sparkling Particle Floating Badges */}
              <motion.div
                animate={{
                  y: [-3, 3, -3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 left-4 bg-white text-teal-800 border border-teal-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                Shade: {shadeLevel > 90 ? 'B1 (Hollywood Bleach)' : shadeLevel > 70 ? 'A1 (Bright Porcelain)' : shadeLevel > 40 ? 'A2 (Natural Enamel)' : 'A3.5 (Baseline)'}
              </motion.div>

              <motion.div
                animate={{
                  y: [3, -3, 3],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-2 right-4 bg-white text-slate-800 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Enamel Gloss: 100%
              </motion.div>

              {/* Central Dynamic Tooth SVG */}
              <div className="relative py-4">
                <svg
                  width="220"
                  height="250"
                  viewBox="0 0 200 240"
                  className="drop-shadow-md transition-all duration-300"
                >
                  <defs>
                    {/* Gloss Highlights */}
                    <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={getToothColor()} />
                      <stop offset="70%" stopColor={getToothColor()} />
                      <stop offset="100%" stopColor="#cbd5e1" />
                    </linearGradient>
                    <linearGradient id="enamelReflection" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>

                  {/* Anatomical Molar Crown Outline */}
                  <path
                    d="M 40 40 
                       C 40 20, 70 15, 85 30 
                       C 95 20, 105 20, 115 30 
                       C 130 15, 160 20, 160 40 
                       C 165 75, 170 110, 165 145 
                       C 160 175, 145 225, 135 230 
                       C 125 235, 115 190, 105 160 
                       C 95 190, 85 235, 75 230 
                       C 65 225, 45 175, 40 145 
                       C 35 110, 35 75, 40 40 Z"
                    fill="url(#toothGradient)"
                    stroke={shadeLevel > 70 ? '#0d9488' : '#94a3b8'}
                    strokeWidth="2.5"
                  />

                  {/* Crown Gloss Sheen Curve */}
                  <path
                    d="M 55 45 C 50 90, 52 130, 60 150 C 62 120, 65 75, 75 45 Z"
                    fill="url(#enamelReflection)"
                  />

                  {/* Enamel Cusp Grooves */}
                  <path
                    d="M 85 35 C 95 65, 105 65, 115 35"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              </div>

              <div className="text-center mt-2">
                <span className="text-xs text-slate-500 font-medium">
                  Adjust slider on the right to test shade transitions
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ANATOMY LAYER EXPLORER */}
          {activeTab === 'anatomy' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center relative py-2"
            >
              <div className="relative">
                <svg width="220" height="250" viewBox="0 0 200 240">
                  {/* Layer 1: Outer Enamel Shell */}
                  <path
                    d="M 40 40 C 40 20, 70 15, 85 30 C 95 20, 105 20, 115 30 C 130 15, 160 20, 160 40 C 165 75, 170 110, 165 145 C 160 175, 145 225, 135 230 C 125 235, 115 190, 105 160 C 95 190, 85 235, 75 230 C 65 225, 45 175, 40 145 C 35 110, 35 75, 40 40 Z"
                    fill={selectedLayer === 'enamel' ? '#0d9488' : '#e2e8f0'}
                    fillOpacity={selectedLayer === 'enamel' ? 0.85 : 0.6}
                    stroke="#0f766e"
                    strokeWidth={selectedLayer === 'enamel' ? 3 : 1.5}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedLayer('enamel')}
                  />

                  {/* Layer 2: Dentin Middle Core */}
                  <path
                    d="M 55 55 C 55 40, 75 35, 88 45 C 95 38, 105 38, 112 45 C 125 35, 145 40, 145 55 C 150 80, 152 110, 148 135 C 142 165, 130 200, 125 205 C 118 210, 110 170, 102 145 C 95 170, 88 210, 80 205 C 75 200, 60 165, 56 135 C 52 110, 52 80, 55 55 Z"
                    fill={selectedLayer === 'dentin' ? '#f59e0b' : '#cbd5e1'}
                    fillOpacity={selectedLayer === 'dentin' ? 0.95 : 0.7}
                    stroke="#d97706"
                    strokeWidth={selectedLayer === 'dentin' ? 3 : 1}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedLayer('dentin')}
                  />

                  {/* Layer 3: Pulp & Vascular Nerves */}
                  <path
                    d="M 75 75 C 75 65, 85 62, 92 68 C 96 64, 104 64, 108 68 C 115 62, 125 65, 125 75 C 128 95, 130 115, 126 130 C 120 150, 116 180, 114 185 C 110 170, 106 145, 100 130 C 94 145, 90 170, 86 185 C 84 180, 80 150, 74 130 C 70 115, 72 95, 75 75 Z"
                    fill={selectedLayer === 'pulp' ? '#e11d48' : '#94a3b8'}
                    fillOpacity={selectedLayer === 'pulp' ? 0.95 : 0.6}
                    stroke="#be123c"
                    strokeWidth={selectedLayer === 'pulp' ? 3 : 1.5}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedLayer('pulp')}
                  />
                </svg>
              </div>

              {/* Layer Selection Chips */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedLayer('enamel')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedLayer === 'enamel'
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  1. Enamel Shield
                </button>
                <button
                  onClick={() => setSelectedLayer('dentin')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedLayer === 'dentin'
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  2. Dentin Layer
                </button>
                <button
                  onClick={() => setSelectedLayer('pulp')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    selectedLayer === 'pulp'
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  3. Pulp & Nerves
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: 3D OPTICAL SCANNER */}
          {activeTab === 'scanner' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center justify-center relative py-2"
            >
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* 3D Wireframe Arch Simulation */}
                <svg width="240" height="240" viewBox="0 0 200 200" className="relative z-10">
                  {/* Digital Alignment Grid */}
                  <circle cx="100" cy="100" r="80" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.3" />
                  <circle cx="100" cy="100" r="50" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.3" />

                  {/* Dental Arch Arc */}
                  <path
                    d="M 30 150 C 30 50, 170 50, 170 150"
                    stroke="#0d9488"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Individual Teeth Nodes */}
                  {[
                    { cx: 35, cy: 145 },
                    { cx: 42, cy: 110 },
                    { cx: 58, cy: 80 },
                    { cx: 80, cy: 62 },
                    { cx: 100, cy: 55 },
                    { cx: 120, cy: 62 },
                    { cx: 142, cy: 80 },
                    { cx: 158, cy: 110 },
                    { cx: 165, cy: 145 },
                  ].map((node, i) => (
                    <g key={i}>
                      <circle cx={node.cx} cy={node.cy} r="6" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                    </g>
                  ))}
                </svg>

                {/* Laser Scanning Beam Sweep */}
                <motion.div
                  animate={{
                    top: ['10%', '85%', '10%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-4 right-4 h-1 bg-teal-500 shadow-sm z-20"
                />
              </div>

              <div className="w-full max-w-xs mt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span className="flex items-center gap-1">
                    <Scan className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                    3D Optical Scan Resolution: 20µm
                  </span>
                  <span className="text-teal-700 font-bold">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-full transition-all duration-150"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Interactive Controls & Clinical Insights */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-5">
          {activeTab === 'whitening' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-600" />
                    Adjust Whitening Intensity
                  </label>
                  <span className="text-xs font-bold text-teal-800 px-2 py-0.5 bg-teal-50 rounded-md border border-teal-200">
                    +{Math.round((shadeLevel / 100) * 8)} Shades Whiter
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={shadeLevel}
                  onChange={(e) => setShadeLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-medium">
                  <span>Baseline A3</span>
                  <span>Natural A1</span>
                  <span className="text-teal-700 font-semibold">Laser Bleach B1</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Cold-Light Laser Technology:</strong> Activates desensitized peroxide crystals without overheating nerve endings.
                  </span>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    Results visible immediately in 60 minutes with up to 18–24 months duration.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'anatomy' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-teal-600" />
                  {selectedLayer === 'enamel' && 'Layer 1: Hydroxyapatite Enamel'}
                  {selectedLayer === 'dentin' && 'Layer 2: Living Dentinal Tubules'}
                  {selectedLayer === 'pulp' && 'Layer 3: Dental Pulp & Microvascular Bed'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {selectedLayer === 'enamel' &&
                    'The hardest mineralized substance in the human body (96% mineral). Protects internal structures against thermal shock, bite pressure, and acid erosion.'}
                  {selectedLayer === 'dentin' &&
                    'Micro-tubular sensitive layer containing fluid channels. Proper fluoride mineralization seals tubules to prevent sudden tooth sensitivity.'}
                  {selectedLayer === 'pulp' &&
                    'The vital living heart of each tooth, carrying arterioles, veins, and sensory nerves that maintain tooth hydration and immune defense.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Mineral Density</span>
                  <span className="text-teal-700 font-bold text-sm">
                    {selectedLayer === 'enamel' ? '96% (Ultra-Dense)' : selectedLayer === 'dentin' ? '70% (Flexible)' : 'Organic Vital'}
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Clinical Focus</span>
                  <span className="text-slate-900 font-bold text-sm">
                    {selectedLayer === 'enamel' ? 'Fluoride / Sealants' : selectedLayer === 'dentin' ? 'Desensitizing' : 'Micro-Endodontics'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scanner' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600" />
                  3D AI Intraoral Telemetry
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Arch Symmetry Score</span>
                    <span className="text-teal-700 font-semibold">99.2% Nominal</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Occlusal Contact Points</span>
                    <span className="text-slate-900 font-semibold">Balanced Bilateral</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Clear Aligner Staging</span>
                    <span className="text-teal-700 font-semibold">Ready for 3D Print</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Zero Goopy Putty Impressions — 100% painless 3D laser scan in under 3 minutes.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



'use client';

import React, { useState } from 'react';
import { NatureSubject } from '@/types';
import { COLORADO_SUBJECTS, MONTH_ABBR, ELEVATION_LABELS } from '@/data/colorado-data';
import { 
  X, 
  ArrowLeftRight, 
  Sparkles, 
  MapPin, 
  Mountain, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface SpeciesComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSubjectA?: NatureSubject | null;
  initialSubjectB?: NatureSubject | null;
}

const PRESET_COMPARISONS = [
  { name: 'Grizzly Bear vs. Black Bear', idA: 'grizzly_bear', idB: 'black_bear' },
  { name: 'Trumpeter Swan vs. Tundra Swan', idA: 'trumpeter_swan', idB: 'tundra_swan' },
  { name: 'American Badger vs. Wolverine', idA: 'american_badger', idB: 'wolverine' },
  { name: 'Canada Lynx vs. Bobcat', idA: 'canada_lynx', idB: 'bobcat' },
  { name: 'Bighorn Sheep vs. Mountain Goat', idA: 'bighorn_sheep', idB: 'mountain_goat' },
  { name: 'Sandhill Crane vs. Great Blue Heron', idA: 'sandhill_crane', idB: 'great_blue_heron' },
];

export const SpeciesComparisonModal: React.FC<SpeciesComparisonModalProps> = ({
  isOpen,
  onClose,
  initialSubjectA,
  initialSubjectB,
}) => {
  const [subjectAId, setSubjectAId] = useState<string>(
    initialSubjectA?.id || 'grizzly_bear'
  );
  const [subjectBId, setSubjectBId] = useState<string>(
    initialSubjectB?.id || 'black_bear'
  );

  if (!isOpen) return null;

  const subjectA = COLORADO_SUBJECTS.find(s => s.id === subjectAId) || COLORADO_SUBJECTS[0];
  const subjectB = COLORADO_SUBJECTS.find(s => s.id === subjectBId) || COLORADO_SUBJECTS[1];

  const handleSelectPreset = (idA: string, idB: string) => {
    setSubjectAId(idA);
    setSubjectBId(idB);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Side-by-Side Lookalike Comparison</span>
              </h2>
              <p className="text-xs text-slate-400">
                Compare field marks, distinct facial cues, phenology timing, and habitats.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-auto p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Popular Pairs:</span>
          {PRESET_COMPARISONS.map(preset => {
            const isActive = subjectAId === preset.idA && subjectBId === preset.idB;
            return (
              <button
                key={preset.name}
                onClick={() => handleSelectPreset(preset.idA, preset.idB)}
                className={`px-3 py-1 rounded-lg shrink-0 font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {preset.name}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Selector A */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Species A
              </label>
              <select
                value={subjectAId}
                onChange={(e) => setSubjectAId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {COLORADO_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.scientificName})
                  </option>
                ))}
              </select>
            </div>

            {/* Selector B */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Species B
              </label>
              <select
                value={subjectBId}
                onChange={(e) => setSubjectBId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {COLORADO_SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.scientificName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side by Side Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* CARD A */}
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-5">
              {/* Photo */}
              <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                {subjectA.imageUrl && (
                  <img
                    src={subjectA.imageUrl}
                    alt={subjectA.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                  {subjectA.category.toUpperCase()}
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-extrabold text-white">{subjectA.name}</h3>
                <p className="text-xs font-mono italic text-slate-400">{subjectA.scientificName}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{subjectA.tagline}</p>
              </div>

              {/* Diagnostic Marks */}
              <div className="space-y-2 bg-slate-900/90 border border-emerald-500/20 rounded-xl p-3.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Diagnostic Field Marks</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {subjectA.identificationMarks?.map((mark, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{mark}</span>
                    </li>
                  )) || <li className="text-slate-500 italic">No specific marks recorded</li>}
                </ul>
              </div>

              {/* Distinguishing Guide */}
              {subjectA.distinguishingTips && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                  <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">
                    How to Tell Apart in the Field
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {subjectA.distinguishingTips}
                  </p>
                </div>
              )}

              {/* 12 Month Phenology */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Annual Phenology Cycle
                </span>
                <div className="grid grid-cols-12 gap-1 text-center">
                  {subjectA.phenology.map((p, idx) => (
                    <div
                      key={p.month}
                      className={`py-1.5 rounded text-[10px] font-semibold border ${
                        p.status === 2
                          ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400'
                          : p.status === 1
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}
                      title={`${MONTH_ABBR[idx]}: ${p.status === 2 ? 'Peak' : p.status === 1 ? 'Active' : 'Off'}`}
                    >
                      {MONTH_ABBR[idx]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Habitats */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="font-semibold text-slate-400">Elevation Life Zones:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {subjectA.elevationBands.map(band => (
                    <span key={band} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                      {ELEVATION_LABELS[band].name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CARD B */}
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-5">
              {/* Photo */}
              <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                {subjectB.imageUrl && (
                  <img
                    src={subjectB.imageUrl}
                    alt={subjectB.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs font-bold">
                  {subjectB.category.toUpperCase()}
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-xl font-extrabold text-white">{subjectB.name}</h3>
                <p className="text-xs font-mono italic text-slate-400">{subjectB.scientificName}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{subjectB.tagline}</p>
              </div>

              {/* Diagnostic Marks */}
              <div className="space-y-2 bg-slate-900/90 border border-amber-500/20 rounded-xl p-3.5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Diagnostic Field Marks</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {subjectB.identificationMarks?.map((mark, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{mark}</span>
                    </li>
                  )) || <li className="text-slate-500 italic">No specific marks recorded</li>}
                </ul>
              </div>

              {/* Distinguishing Guide */}
              {subjectB.distinguishingTips && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                  <span className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">
                    How to Tell Apart in the Field
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {subjectB.distinguishingTips}
                  </p>
                </div>
              )}

              {/* 12 Month Phenology */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Annual Phenology Cycle
                </span>
                <div className="grid grid-cols-12 gap-1 text-center">
                  {subjectB.phenology.map((p, idx) => (
                    <div
                      key={p.month}
                      className={`py-1.5 rounded text-[10px] font-semibold border ${
                        p.status === 2
                          ? 'bg-amber-500/30 text-amber-300 border-amber-400'
                          : p.status === 1
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-600 border-slate-800'
                      }`}
                      title={`${MONTH_ABBR[idx]}: ${p.status === 2 ? 'Peak' : p.status === 1 ? 'Active' : 'Off'}`}
                    >
                      {MONTH_ABBR[idx]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Habitats */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="font-semibold text-slate-400">Elevation Life Zones:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {subjectB.elevationBands.map(band => (
                    <span key={band} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                      {ELEVATION_LABELS[band].name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            WildSeason Visual Identification System
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { NatureSubject } from '@/types';
import { 
  MONTH_NAMES, 
  MONTH_ABBR, 
  ELEVATION_LABELS, 
  REGION_LABELS 
} from '@/data/colorado-data';
import { 
  X, 
  Camera, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Bookmark, 
  PlusCircle, 
  Sparkles, 
  Compass, 
  Layers,
  Calendar,
  Globe,
  Eye,
  CheckCircle2,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { HotspotEphemerisCard } from '@/components/HotspotEphemerisCard';

interface SubjectDetailModalProps {
  subject: NatureSubject | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onLogSighting: (subject: NatureSubject) => void;
  onAddToPlanner: (subject: NatureSubject) => void;
  onOpenLightbox?: (subject: NatureSubject) => void;
}

export const SubjectDetailModal: React.FC<SubjectDetailModalProps> = ({
  subject,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onLogSighting,
  onAddToPlanner,
  onOpenLightbox,
}) => {
  const [selectedMonthTab, setSelectedMonthTab] = useState<number>(new Date().getMonth() + 1);

  if (!subject) return null;

  const currentMonthData = subject.phenology.find(p => p.month === selectedMonthTab);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {subject.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400 font-mono italic">
              {subject.scientificName}
            </span>
            {subject.states?.map(st => (
              <span key={st} className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-950 text-amber-300 border border-amber-500/30">
                {st}
              </span>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {subject.name}
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            {subject.tagline}
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4">
            <button
              onClick={() => onToggleBookmark(subject.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                isBookmarked
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              <span>{isBookmarked ? 'Saved in Targets' : 'Add to Target List'}</span>
            </button>

            <button
              onClick={() => onLogSighting(subject)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm shadow-emerald-900/50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Field Sighting</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 divide-y divide-slate-800/80">
          {/* Section 0: Visual Field Identification & Photo */}
          {subject.imageUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Field Identification Guide</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Visual Reference</span>
              </div>

              {/* Photo Showcase */}
              <div 
                onClick={() => onOpenLightbox && onOpenLightbox(subject)}
                className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={subject.imageUrl}
                  alt={subject.name}
                  loading="lazy"
                  className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Click to Expand Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenLightbox) onOpenLightbox(subject);
                  }}
                  className="absolute top-3 right-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700 text-xs backdrop-blur-md transition shadow-xl"
                  title="Open full-screen uncropped view"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full-Screen Uncropped Photo</span>
                </button>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 pointer-events-none">
                  <span className="font-semibold text-white">{subject.name}</span>
                  <span className="italic text-slate-400 text-[11px] font-mono">{subject.scientificName}</span>
                </div>
              </div>

              {/* Key Diagnostic Identification Marks */}
              {subject.identificationMarks && subject.identificationMarks.length > 0 && (
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Key Diagnostic Field Marks</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {subject.identificationMarks.map((mark, i) => (
                      <div key={i} className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start space-x-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{mark}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Distinguishing Tips */}
              {subject.distinguishingTips && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 font-semibold mr-1.5">How to Distinguish from Lookalikes:</strong>
                    <span>{subject.distinguishingTips}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 1: Overview & Habitat */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Field Description & Habitat
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {subject.description}
            </p>

            {/* Elevation & Regions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2">
                  <Layers className="w-4 h-4" />
                  <span>Elevation & Habitat Bands</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subject.elevationBands.map(band => (
                    <div key={band} className="text-xs bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <strong className="text-slate-200">{ELEVATION_LABELS[band].name}</strong>
                      <span className="text-slate-400 text-[10px] ml-1">({ELEVATION_LABELS[band].range})</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Primary Parks & Natural Regions</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {subject.regions.map(r => (
                    <span key={r} className="text-xs bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                      <strong className="text-emerald-400 mr-1">[{REGION_LABELS[r]?.state}]</strong>
                      {REGION_LABELS[r]?.label || r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 12-Month Phenology Matrix */}
          <div className="pt-6 space-y-4">
            {/* Legend & Title */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Annual Phenology & Life Cycle</span>
              </h3>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] text-emerald-300 font-bold">★ Peak Season</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[11px] text-amber-300 font-medium">Shoulder / Waning</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                  <span className="text-[11px] text-slate-500">Off-Season</span>
                </span>
              </div>
            </div>

            {/* 12-Month Bar */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {subject.phenology.map((p, idx) => {
                const isSelected = selectedMonthTab === p.month;
                let statusBadge = 'bg-slate-950 text-slate-600 border-slate-800';
                if (p.status === 1) statusBadge = 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-medium';
                if (p.status === 2) statusBadge = 'bg-emerald-500/25 text-emerald-300 border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/20';

                return (
                  <button
                    key={p.month}
                    onClick={() => setSelectedMonthTab(p.month)}
                    className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center ${statusBadge} ${
                      isSelected ? 'ring-2 ring-white scale-105 z-10' : ''
                    }`}
                  >
                    <span className="text-xs font-semibold">{MONTH_ABBR[idx]}</span>
                    <span className="text-[10px] mt-0.5">
                      {p.status === 2 ? '★ Peak' : p.status === 1 ? 'Shoulder' : 'Off'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Month Detail Banner */}
            {currentMonthData && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start space-x-3">
                <div className={`p-2 rounded-xl border ${
                  currentMonthData.status === 2 
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
                    : currentMonthData.status === 1
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                } mt-0.5`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">
                    {MONTH_NAMES[selectedMonthTab - 1]} Status:
                    <span className={`ml-2 ${
                      currentMonthData.status === 2 
                        ? 'text-emerald-300 font-bold' 
                        : currentMonthData.status === 1
                        ? 'text-amber-300 font-semibold'
                        : 'text-slate-400 font-normal'
                    }`}>
                      {currentMonthData.status === 2 
                        ? '★ Peak Photography Window (Prime Action / Colors)' 
                        : currentMonthData.status === 1 
                        ? 'Shoulder / Waning / Emerging (Active transition)' 
                        : 'Dormant / Off-Season'}
                    </span>
                  </h4>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                    {currentMonthData.keyActivity}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Photography Field Guide & Gear */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Photographer’s Field Guide</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recommended Lenses & Kit</h4>
                <ul className="space-y-1.5">
                  {subject.photographyGuide.recommendedLenses.map((lens, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{lens}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Terrain Difficulty: </span>
                  <span className="text-amber-400">{subject.photographyGuide.difficultyRating}</span>
                </div>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Best Lighting & Time of Day</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {subject.photographyGuide.bestLighting}
                </p>
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Field Behavior Cues</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    {subject.photographyGuide.fieldBehaviorNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Ethics Alert */}
            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl flex items-start space-x-3 text-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="font-semibold text-amber-300">Wildlife & Wilderness Ethics:</strong>
                <p className="text-amber-200/90 leading-relaxed">
                  {subject.photographyGuide.ethicalGuidelines}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Hotspots & Scouting Locations */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Curated Public Land Hotspots</span>
            </h3>

            <div className="space-y-4">
              {subject.hotspots.map((spot, i) => (
                <HotspotEphemerisCard 
                  key={i} 
                  hotspot={spot} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            WildSeason Nature Field Guide
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { NatureSubject } from '@/types';
import { MONTH_ABBR, ELEVATION_LABELS } from '@/data/colorado-data';
import { 
  Bookmark, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  PawPrint,
  Feather,
  Flower2,
  Trees,
  Crosshair,
  Maximize2,
  Eye,
  ArrowLeftRight
} from 'lucide-react';

interface SubjectCardProps {
  subject: NatureSubject;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectSubject: (subject: NatureSubject) => void;
  activeMonth: number | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHighlighted?: boolean;
  isFocused?: boolean;
  onFocusOnMap?: (subject: NatureSubject) => void;
  onOpenLightbox?: (subject: NatureSubject) => void;
  onCompare?: (subject: NatureSubject) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  isBookmarked,
  onToggleBookmark,
  onSelectSubject,
  activeMonth,
  onMouseEnter,
  onMouseLeave,
  isHighlighted = false,
  isFocused = false,
  onFocusOnMap,
  onOpenLightbox,
  onCompare,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const targetMonth = activeMonth ?? currentMonth;
  const currentPhenology = subject.phenology.find(p => p.month === targetMonth);
  const isCurrentPeak = currentPhenology?.status === 2;
  const isCurrentShoulder = currentPhenology?.status === 1;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'mammal': return <PawPrint className="w-3.5 h-3.5 text-amber-400" />;
      case 'bird': return <Feather className="w-3.5 h-3.5 text-sky-400" />;
      case 'wildflower': return <Flower2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'tree_foliage': return <Trees className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const handleCardClick = () => {
    if (onFocusOnMap) {
      onFocusOnMap(subject);
    } else {
      onSelectSubject(subject);
    }
  };

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleCardClick}
      className={`group relative bg-slate-900/80 hover:bg-slate-900 border rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        isFocused
          ? 'border-emerald-400 ring-2 ring-emerald-400/50 bg-slate-900 shadow-emerald-950/50'
          : isHighlighted 
          ? 'border-slate-500 ring-1 ring-slate-400/40 bg-slate-900' 
          : 'border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Top row: Category & State Badges & Bookmark */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-1">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-300">
              {getCategoryIcon(subject.category)}
              <span className="capitalize">{subject.category.replace('_', ' ')}</span>
            </div>

            {/* State Badges */}
            {subject.states?.slice(0, 3).map(st => (
              <span key={st} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-900/60">
                {st}
              </span>
            ))}

            {isFocused && (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950">
                <Crosshair className="w-3 h-3" />
                <span>On Map</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            {isCurrentPeak && (
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>Peak Now</span>
              </span>
            )}
            {!isCurrentPeak && isCurrentShoulder && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Shoulder
              </span>
            )}

            <button
              onClick={() => onToggleBookmark(subject.id)}
              title={isBookmarked ? 'Remove from Saved Targets' : 'Save to Target List'}
              className={`p-2 rounded-xl border transition ${
                isBookmarked
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Visual Identification Photo */}
        {subject.imageUrl && (
          <div 
            onClick={(e) => {
              if (onOpenLightbox) {
                e.stopPropagation();
                onOpenLightbox(subject);
              }
            }}
            className="group/img relative w-full h-56 sm:h-64 mb-3 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md cursor-zoom-in"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={subject.imageUrl}
              alt={subject.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent pointer-events-none" />

            {/* Quick Full Photo Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenLightbox) onOpenLightbox(subject);
                else onSelectSubject(subject);
              }}
              className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950/85 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/70 text-xs backdrop-blur-md opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
              title="Click to view full uncropped photo & field marks"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Photo</span>
            </button>

            {/* Diagnostic Field Mark Overlay */}
            {subject.identificationMarks && subject.identificationMarks.length > 0 && (
              <div className="absolute bottom-2 left-2 right-2 flex items-center text-xs bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/60 truncate pointer-events-none shadow-md">
                <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0 mr-1.5" />
                <span className="font-bold text-emerald-400 shrink-0 mr-1">ID:</span>
                <span className="text-slate-200 truncate font-medium">{subject.identificationMarks[0]}</span>
              </div>
            )}
          </div>
        )}

        {/* Titles */}
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
            {subject.name}
          </h3>
          <p className="text-xs italic text-slate-400 font-mono mb-2">
            {subject.scientificName}
          </p>
          <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {subject.tagline}
          </p>
        </div>

        {/* Elevation Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {subject.elevationBands.map(band => (
            <span
              key={band}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
            >
              {ELEVATION_LABELS[band].name}
            </span>
          ))}
        </div>

        {/* 12-Month Mini Heatmap Timeline with Intuitive Colors */}
        <div className="mb-4 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-slate-400">12-Month Phenology</span>
            <div className="flex items-center space-x-2.5">
              <span className="flex items-center space-x-1" title="Vibrant Green = Peak photography window">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-emerald-300 font-semibold">Peak</span>
              </span>
              <span className="flex items-center space-x-1" title="Amber / Yellow = Shoulder or waning season">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-[10px] text-amber-300">Shoulder</span>
              </span>
              <span className="flex items-center space-x-1" title="Gray = Dormant / Absent">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="text-[10px] text-slate-500">Off</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1">
            {subject.phenology.map((p, idx) => {
              const isSelected = activeMonth === p.month;
              let bg = 'bg-slate-800/40 text-slate-600 border border-transparent';
              
              if (p.status === 1) {
                bg = 'bg-amber-500/15 text-amber-300 border border-amber-500/40 font-medium';
              }
              if (p.status === 2) {
                bg = 'bg-emerald-500/25 text-emerald-300 border border-emerald-400 font-extrabold shadow-sm shadow-emerald-500/20';
              }

              return (
                <div
                  key={p.month}
                  title={`${MONTH_ABBR[idx]}: ${p.status === 2 ? '[PEAK] ' : p.status === 1 ? '[SHOULDER] ' : '[OFF] '}${p.keyActivity}`}
                  className={`text-[9px] h-6 flex items-center justify-center rounded transition ${bg} ${
                    isSelected ? 'ring-2 ring-white scale-105 z-10' : ''
                  }`}
                >
                  {MONTH_ABBR[idx][0]}
                </div>
              );
            })}
          </div>

          {currentPhenology && (
            <p className="text-[11px] text-slate-300 mt-2 font-medium truncate">
              <span className={isCurrentPeak ? 'text-emerald-400 font-bold' : isCurrentShoulder ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                {MONTH_ABBR[targetMonth - 1]} ({isCurrentPeak ? '★ Peak' : isCurrentShoulder ? 'Shoulder' : 'Off-Season'}):
              </span>{' '}
              {currentPhenology.keyActivity}
            </p>
          )}
        </div>
      </div>

      {/* Bottom row: Primary Hotspot & Explicit Field Guide button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1 text-xs text-slate-400 truncate max-w-[65%]">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            {subject.hotspots[0]?.name ? `${subject.hotspots[0].name} (${subject.hotspots[0].state})` : 'Wilderness'}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {onCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompare(subject);
              }}
              title="Compare with another species"
              className="flex items-center space-x-1 text-xs px-2 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Compare</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubject(subject);
            }}
            className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 transition group/btn shrink-0 cursor-pointer"
          >
            <span>Field Guide</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

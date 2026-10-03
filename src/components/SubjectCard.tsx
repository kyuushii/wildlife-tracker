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
  Trees
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
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const targetMonth = activeMonth ?? currentMonth;
  const currentPhenology = subject.phenology.find(p => p.month === targetMonth);
  const isCurrentPeak = currentPhenology?.status === 2;

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'mammal': return <PawPrint className="w-3.5 h-3.5 text-amber-400" />;
      case 'bird': return <Feather className="w-3.5 h-3.5 text-sky-400" />;
      case 'wildflower': return <Flower2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'tree_foliage': return <Trees className="w-3.5 h-3.5 text-amber-500" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative bg-slate-900/80 hover:bg-slate-900 border rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between ${
        isHighlighted 
          ? 'border-emerald-400 ring-2 ring-emerald-500/30 bg-slate-900' 
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
          </div>

          <div className="flex items-center space-x-1">
            {isCurrentPeak && (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>Peak Now</span>
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark(subject.id);
              }}
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

        {/* Titles */}
        <div className="cursor-pointer" onClick={() => onSelectSubject(subject)}>
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

        {/* 12-Month Mini Heatmap Timeline */}
        <div className="mb-4 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-slate-400">12-Month Phenology</span>
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[9px]">Active</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="text-[9px]">Peak</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-1">
            {subject.phenology.map((p, idx) => {
              const isSelected = activeMonth === p.month;
              let bg = 'bg-slate-800/40 text-slate-600';
              if (p.status === 1) bg = 'bg-emerald-950 text-emerald-400 border border-emerald-800/50';
              if (p.status === 2) bg = 'bg-amber-500/25 text-amber-300 border border-amber-500/70 font-bold';

              return (
                <div
                  key={p.month}
                  title={`${MONTH_ABBR[idx]}: ${p.keyActivity}`}
                  className={`text-[9px] h-6 flex items-center justify-center rounded transition ${bg} ${
                    isSelected ? 'ring-2 ring-emerald-400 font-extrabold' : ''
                  }`}
                >
                  {MONTH_ABBR[idx][0]}
                </div>
              );
            })}
          </div>

          {currentPhenology && (
            <p className="text-[11px] text-slate-300 mt-2 font-medium truncate">
              <span className="text-amber-400 font-semibold">{MONTH_ABBR[targetMonth - 1]}: </span>
              {currentPhenology.keyActivity}
            </p>
          )}
        </div>
      </div>

      {/* Bottom row: Primary Hotspot & Drill-in Button */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1 text-xs text-slate-400 truncate max-w-[65%]">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">
            {subject.hotspots[0]?.name ? `${subject.hotspots[0].name} (${subject.hotspots[0].state})` : 'Wilderness'}
          </span>
        </div>

        <button
          onClick={() => onSelectSubject(subject)}
          className="flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition group/btn shrink-0"
        >
          <span>Field Guide</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};

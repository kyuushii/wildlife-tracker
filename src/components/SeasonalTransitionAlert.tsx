'use client';

import React, { useState, useMemo } from 'react';
import { NatureSubject } from '@/types';
import { COLORADO_SUBJECTS, MONTH_NAMES, MONTH_ABBR } from '@/data/colorado-data';
import { 
  TrendingUp, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  AlertTriangle,
  Sparkles,
  Calendar
} from 'lucide-react';

interface SeasonalTransitionAlertProps {
  onSelectSubject: (subject: NatureSubject) => void;
  currentMonth?: number;
}

export const SeasonalTransitionAlert: React.FC<SeasonalTransitionAlertProps> = ({
  onSelectSubject,
  currentMonth = new Date().getMonth() + 1,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

  // Species starting peak next month
  const arrivingPeaks = useMemo(() => {
    return COLORADO_SUBJECTS.filter(s => {
      const cur = s.phenology.find(p => p.month === currentMonth);
      const nxt = s.phenology.find(p => p.month === nextMonth);
      return cur?.status !== 2 && nxt?.status === 2;
    });
  }, [currentMonth, nextMonth]);

  // Species whose peak is ending after this month
  const departingPeaks = useMemo(() => {
    return COLORADO_SUBJECTS.filter(s => {
      const cur = s.phenology.find(p => p.month === currentMonth);
      const nxt = s.phenology.find(p => p.month === nextMonth);
      return cur?.status === 2 && nxt?.status !== 2;
    });
  }, [currentMonth, nextMonth]);

  if (arrivingPeaks.length === 0 && departingPeaks.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all">
      {/* Header bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white tracking-tight uppercase">
                14 to 30-Day Phenology Scouting Outlook
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {MONTH_ABBR[currentMonth - 1]} → {MONTH_ABBR[nextMonth - 1]} Shift
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              <span className="text-emerald-400 font-semibold">{arrivingPeaks.length} species</span> arriving at peak next month •{' '}
              <span className="text-amber-400 font-semibold">{departingPeaks.length} species</span> in final peak window
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="hidden sm:inline">{isExpanded ? 'Hide Details' : 'View Forecast'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Forecast Details */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            {/* Arriving Peaks */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prime Windows Opening in {MONTH_NAMES[nextMonth - 1]}</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {arrivingPeaks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No major new species peaks commencing next month.</p>
                ) : (
                  arrivingPeaks.map(subject => (
                    <div
                      key={subject.id}
                      onClick={() => onSelectSubject(subject)}
                      className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/40 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {subject.imageUrl && (
                          <img
                            src={subject.imageUrl}
                            alt={subject.name}
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-700"
                          />
                        )}
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition">
                            {subject.name}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            {subject.tagline}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition" />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Departing Peaks */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>Last Chance / Peak Ending Soon</span>
              </div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {departingPeaks.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No current peaks departing at month end.</p>
                ) : (
                  departingPeaks.map(subject => (
                    <div
                      key={subject.id}
                      onClick={() => onSelectSubject(subject)}
                      className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-amber-500/40 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {subject.imageUrl && (
                          <img
                            src={subject.imageUrl}
                            alt={subject.name}
                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-700"
                          />
                        )}
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition">
                            {subject.name}
                          </h5>
                          <p className="text-[10px] text-slate-400 truncate">
                            {subject.tagline}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0 ml-2 group-hover:translate-x-0.5 transition" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { NatureSubject } from '@/types';
import { COLORADO_SUBJECTS, MONTH_NAMES } from '@/data/colorado-data';
import { 
  Calendar, 
  MapPin, 
  Camera, 
  Printer, 
  CheckSquare, 
  Square, 
  Bookmark, 
  Sparkles,
  Compass,
  ChevronRight
} from 'lucide-react';
import { FieldPacketPrintModal } from '@/components/FieldPacketPrintModal';

interface TripPlannerViewProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onSelectSubject: (subject: NatureSubject) => void;
  onNavigateToExplore: () => void;
}

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  bookmarkedIds,
  onToggleBookmark,
  onSelectSubject,
  onNavigateToExplore,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const bookmarkedSubjects = COLORADO_SUBJECTS.filter(s => bookmarkedIds.includes(s.id));

  const toggleItem = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const filtered = selectedMonth === 'all'
    ? bookmarkedSubjects
    : bookmarkedSubjects.filter(s => s.phenology.some(p => p.month === selectedMonth && p.status > 0));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>Expedition & Shoot Planner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Field Scouting Itinerary
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {bookmarkedSubjects.length} target species & blooms saved for upcoming photography expeditions
          </p>
        </div>

        {bookmarkedSubjects.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Field Sheet</span>
            </button>
          </div>
        )}
      </div>

      {/* Month Filter */}
      {bookmarkedSubjects.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold px-2">Filter Targets By Month:</span>
          <button
            onClick={() => setSelectedMonth('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition ${
              selectedMonth === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Year ({bookmarkedSubjects.length})
          </button>
          {MONTH_NAMES.map((name, idx) => {
            const m = idx + 1;
            const count = bookmarkedSubjects.filter(s => s.phenology.some(p => p.month === m && p.status > 0)).length;
            if (count === 0) return null;

            return (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  selectedMonth === m
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {bookmarkedSubjects.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-800/40 text-amber-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Target Subjects Saved</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            As you browse through the season tracker, click the bookmark icon on any species, bloom, or foliage event to assemble your scouting itinerary.
          </p>
          <button
            onClick={onNavigateToExplore}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Nature Subjects</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filtered.map(s => {
              const isChecked = !!completedItems[s.id];
              return (
                <div
                  key={s.id}
                  className={`bg-slate-900/90 border rounded-2xl p-5 shadow-lg transition ${
                    isChecked
                      ? 'border-emerald-500/40 bg-emerald-950/10 opacity-75'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleItem(s.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <h4 className={`text-base font-bold text-white ${isChecked ? 'line-through text-slate-400' : ''}`}>
                            {s.name}
                          </h4>
                          <span className="text-xs italic text-slate-400 font-mono hidden sm:inline">
                            {s.scientificName}
                          </span>
                          {s.states?.map(st => (
                            <span key={st} className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-950 text-emerald-400 border border-emerald-900/50">
                              {st}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {s.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <button
                        onClick={() => onSelectSubject(s)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 transition flex items-center space-x-1"
                      >
                        <span>Field Guide</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleBookmark(s.id)}
                        className="p-2 rounded-xl bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 transition"
                        title="Remove from targets"
                      >
                        <Bookmark className="w-4 h-4 fill-current text-amber-400" />
                      </button>
                    </div>
                  </div>

                  {/* Hotspots & Gear Checklist Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Recommended Locations</span>
                      </span>
                      <p className="text-slate-300">
                        {s.hotspots.map(h => `${h.name} (${h.state})`).join(' • ')}
                      </p>
                    </div>

                    <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-semibold text-amber-400 flex items-center space-x-1">
                        <Camera className="w-3 h-3" />
                        <span>Recommended Glass</span>
                      </span>
                      <p className="text-slate-300">
                        {s.photographyGuide.recommendedLenses.join('; ')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Field Kit Packing Checklist */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-3 print:border-black">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Wildlife & Nature Photography Field Kit Checklist</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-300">
              <label className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <input type="checkbox" className="rounded text-emerald-500 accent-emerald-500" />
                <span>Heavy-duty tripod + gimbal / fluid head</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <input type="checkbox" className="rounded text-emerald-500 accent-emerald-500" />
                <span>Spare cold-weather camera batteries (keep warm in inner pocket)</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <input type="checkbox" className="rounded text-emerald-500 accent-emerald-500" />
                <span>Circular Polarizer (CPL) & ND filters</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <input type="checkbox" className="rounded text-emerald-500 accent-emerald-500" />
                <span>All-weather lens rain & dust storm cover</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <input type="checkbox" className="rounded text-emerald-500 accent-emerald-500" />
                <span>Red-light headlamp for blue hour & nocturnal shoots</span>
              </label>
              <label className="flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <input type="checkbox" className="rounded text-emerald-500 accent-emerald-500" />
                <span>EPA-approved bear spray with holster (Rockies/Yellowstone/AK)</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Field Packet Printable Preview Modal */}
      <FieldPacketPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        bookmarkedIds={bookmarkedIds}
      />
    </div>
  );
};

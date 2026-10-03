'use client';

import React from 'react';
import { 
  FilterState, 
  SubjectCategory, 
  ColoradoRegion, 
  ElevationBand 
} from '@/types';
import { 
  REGION_LABELS, 
  ELEVATION_LABELS, 
  MONTH_NAMES, 
  MONTH_ABBR 
} from '@/data/colorado-data';
import { 
  Search, 
  Sparkles, 
  RotateCcw, 
  Calendar, 
  MapPin, 
  Mountain,
  PawPrint,
  Feather,
  Flower2,
  Trees
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalMatches,
}) => {
  // Current month (1-12)
  const currentMonth = new Date().getMonth() + 1;

  const categories: { id: SubjectCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Subjects', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'mammal', label: 'Mammals & Big Game', icon: <PawPrint className="w-3.5 h-3.5" /> },
    { id: 'bird', label: 'Birds & Raptors', icon: <Feather className="w-3.5 h-3.5" /> },
    { id: 'wildflower', label: 'Wildflowers', icon: <Flower2 className="w-3.5 h-3.5" /> },
    { id: 'tree_foliage', label: 'Trees & Foliage', icon: <Trees className="w-3.5 h-3.5" /> },
  ];

  const handleReset = () => {
    setFilters({
      category: 'all',
      selectedMonth: null,
      selectedRegion: 'all',
      selectedElevation: 'all',
      searchQuery: '',
      onlyPeak: false,
    });
  };

  const isFiltered = 
    filters.category !== 'all' || 
    filters.selectedMonth !== null || 
    filters.selectedRegion !== 'all' || 
    filters.selectedElevation !== 'all' || 
    filters.searchQuery !== '' || 
    filters.onlyPeak;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Search and Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search by animal, flower, tree, or location (e.g. Elk, Crested Butte, Columbine)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick "In Season Right Now" button */}
          <button
            onClick={() => setFilters(prev => ({
              ...prev,
              selectedMonth: prev.selectedMonth === currentMonth ? null : currentMonth,
              onlyPeak: false
            }))}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium flex items-center space-x-1.5 transition ${
              filters.selectedMonth === currentMonth
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peaking Now ({MONTH_ABBR[currentMonth - 1]})</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {categories.map(cat => {
          const active = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                active 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/30' 
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Month Scrubber */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Month of Year:</span>
          </span>
          {filters.selectedMonth !== null && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, selectedMonth: null }))}
              className="text-amber-400 hover:underline text-[11px]"
            >
              Showing: {MONTH_NAMES[filters.selectedMonth - 1]} (Show all year)
            </button>
          )}
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {MONTH_ABBR.map((abbr, idx) => {
            const m = idx + 1;
            const isSelected = filters.selectedMonth === m;
            const isCurrent = m === currentMonth;

            return (
              <button
                key={m}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  selectedMonth: isSelected ? null : m
                }))}
                className={`py-1.5 px-1 rounded-lg text-xs font-medium text-center relative transition ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
                    : 'bg-slate-950/40 text-slate-300 hover:bg-slate-800 border border-slate-800/60'
                }`}
              >
                {abbr}
                {isCurrent && !isSelected && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Region & Elevation Selectors + Peak Only Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-800/60">
        {/* Region */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span>Colorado Region</span>
          </label>
          <select
            value={filters.selectedRegion}
            onChange={(e) => setFilters(prev => ({ ...prev, selectedRegion: e.target.value as ColoradoRegion | 'all' }))}
            className="w-full py-2 px-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Regions of Colorado</option>
            {Object.entries(REGION_LABELS).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>

        {/* Elevation Band */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Mountain className="w-3 h-3 text-emerald-400" />
            <span>Elevation Zone</span>
          </label>
          <select
            value={filters.selectedElevation}
            onChange={(e) => setFilters(prev => ({ ...prev, selectedElevation: e.target.value as ElevationBand | 'all' }))}
            className="w-full py-2 px-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Elevation Zones</option>
            {Object.entries(ELEVATION_LABELS).map(([k, info]) => (
              <option key={k} value={k}>
                {info.name} ({info.range})
              </option>
            ))}
          </select>
        </div>

        {/* Peak Filter Toggle */}
        <div className="flex items-end pb-0.5">
          <label className="flex items-center space-x-2.5 cursor-pointer bg-slate-950/60 hover:bg-slate-950 p-2 rounded-xl border border-slate-800 w-full transition">
            <input
              type="checkbox"
              checked={filters.onlyPeak}
              onChange={(e) => setFilters(prev => ({ ...prev, onlyPeak: e.target.checked }))}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
            />
            <div className="text-xs">
              <span className="font-semibold text-amber-300">Peak Window Only</span>
              <p className="text-[10px] text-slate-400">Strictly prime photographic timing</p>
            </div>
          </label>
        </div>
      </div>

      {/* Match counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/40">
        <span>Found <strong className="text-slate-200">{totalMatches}</strong> matching subjects</span>
        {filters.selectedMonth && (
          <span className="text-slate-400">
            Filtering for <strong className="text-emerald-400">{MONTH_NAMES[filters.selectedMonth - 1]}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

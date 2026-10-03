'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  NatureSubject, 
  FilterState, 
  UserSighting, 
  ElevationBand,
  MapBounds
} from '@/types';
import { 
  COLORADO_SUBJECTS, 
  MONTH_NAMES, 
  MONTH_ABBR,
} from '@/data/colorado-data';
import { 
  getBookmarks, 
  toggleBookmark as toggleBookmarkStorage, 
  getLocalSightings 
} from '@/lib/storage';
import { Header } from '@/components/Header';
import { FilterBar } from '@/components/FilterBar';
import { SubjectCard } from '@/components/SubjectCard';
import { SubjectDetailModal } from '@/components/SubjectDetailModal';
import { SightingModal } from '@/components/SightingModal';
import { TripPlannerView } from '@/components/TripPlannerView';
import { FieldLogView } from '@/components/FieldLogView';
import { ElevationGuideModal } from '@/components/ElevationGuideModal';
import { SettingsModal } from '@/components/SettingsModal';
import { NatureMapWrapper } from '@/components/NatureMapWrapper';
import { 
  Sparkles, 
  Compass, 
  ArrowRight,
  Columns,
  LayoutGrid,
  Map as MapIcon,
  RotateCcw
} from 'lucide-react';

export default function HomePage() {
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // App Tabs & View Modes
  const [activeTab, setActiveTab] = useState<'explore' | 'planner' | 'journal'>('explore');
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    selectedState: 'all',
    selectedMonth: null,
    selectedRegion: 'all',
    selectedElevation: 'all',
    searchQuery: '',
    onlyPeak: false,
    mapBounds: null,
    searchAsMapMoves: true,
  });

  // Hover sync state for map pins
  const [highlightedSubjectId, setHighlightedSubjectId] = useState<string | null>(null);

  // Local Storage States
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [sightings, setSightings] = useState<UserSighting[]>([]);

  // Modals
  const [selectedSubject, setSelectedSubject] = useState<NatureSubject | null>(null);
  const [sightingSubject, setSightingSubject] = useState<NatureSubject | null>(null);
  const [isElevationGuideOpen, setIsElevationGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load storage on mount
  useEffect(() => {
    setBookmarkedIds(getBookmarks());
    setSightings(getLocalSightings());
  }, []);

  const refreshData = () => {
    setBookmarkedIds(getBookmarks());
    setSightings(getLocalSightings());
  };

  const handleToggleBookmark = (id: string) => {
    toggleBookmarkStorage(id);
    setBookmarkedIds(getBookmarks());
  };

  // Callback from Map when viewport pans/zooms (Zillow style)
  const handleBoundsChange = useCallback((bounds: MapBounds) => {
    setFilters(prev => ({
      ...prev,
      mapBounds: bounds,
    }));
  }, []);

  // Filter subjects based on criteria (category, state, region, elevation, search, month)
  const allFilteredSubjects = useMemo(() => {
    return COLORADO_SUBJECTS.filter(subject => {
      // Category filter
      if (filters.category !== 'all' && subject.category !== filters.category) {
        return false;
      }

      // State / Destination filter
      if (filters.selectedState !== 'all' && !subject.states?.includes(filters.selectedState)) {
        return false;
      }

      // Specific Region filter
      if (filters.selectedRegion !== 'all' && !subject.regions.includes(filters.selectedRegion)) {
        return false;
      }

      // Elevation filter
      if (filters.selectedElevation !== 'all' && !subject.elevationBands.includes(filters.selectedElevation)) {
        return false;
      }

      // Month filter & Peak filter
      if (filters.selectedMonth !== null) {
        const monthPhenology = subject.phenology.find(p => p.month === filters.selectedMonth);
        if (!monthPhenology || monthPhenology.status === 0) {
          return false;
        }
        if (filters.onlyPeak && monthPhenology.status !== 2) {
          return false;
        }
      } else if (filters.onlyPeak) {
        if (subject.peakMonths.length === 0) {
          return false;
        }
      }

      // Search query filter (matches name, scientific name, hotspot, state, or description)
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = subject.name.toLowerCase().includes(q);
        const matchesSci = subject.scientificName.toLowerCase().includes(q);
        const matchesTagline = subject.tagline.toLowerCase().includes(q);
        const matchesState = subject.states?.some(st => st.toLowerCase().includes(q));
        const matchesHotspot = subject.hotspots.some(h => 
          h.name.toLowerCase().includes(q) || 
          h.accessNotes.toLowerCase().includes(q) ||
          h.state.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesSci && !matchesTagline && !matchesHotspot && !matchesState) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  // List of subjects visible within the current map bounding box (Zillow-style)
  const listSubjects = useMemo(() => {
    if (viewMode !== 'grid' && filters.searchAsMapMoves && filters.mapBounds) {
      const { southWest, northEast } = filters.mapBounds;
      return allFilteredSubjects.filter(subject => {
        return subject.hotspots.some(h => {
          if (!h.lat || !h.lng) return false;
          return (
            h.lat >= southWest.lat &&
            h.lat <= northEast.lat &&
            h.lng >= southWest.lng &&
            h.lng <= northEast.lng
          );
        });
      });
    }
    return allFilteredSubjects;
  }, [allFilteredSubjects, filters.searchAsMapMoves, filters.mapBounds, viewMode]);

  // Current month's peaking subjects
  const currentMonthPeaking = useMemo(() => {
    return COLORADO_SUBJECTS.filter(s => 
      s.phenology.some(p => p.month === currentMonth && p.status === 2)
    );
  }, [currentMonth]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkCount={bookmarkedIds.length}
        sightingCount={sightings.length}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenElevationGuide={() => setIsElevationGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* Seasonal Highlights Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-900/40 rounded-3xl p-6 sm:p-7 shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>WildSeason Map Intelligence • {MONTH_NAMES[currentMonth - 1]} Season</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentMonthPeaking.length} Premier Photography Subjects Peaking This Month
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Explore across North America. Drag and zoom the interactive map to filter wildlife and floral events in real-time, or filter by destination, elevation zone, and peak window.
                  </p>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      selectedMonth: currentMonth,
                      onlyPeak: true,
                    }))}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
                  >
                    <span>View {MONTH_ABBR[currentMonth - 1]} Peak Highlights</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setIsElevationGuideOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Habitats & Elevation</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              totalMatches={listSubjects.length}
            />

            {/* View Mode Switcher & Map Bound Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/70 p-3 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-semibold">View Layout:</span>
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode('split')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      viewMode === 'split'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Split Map & List</span>
                  </button>

                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      viewMode === 'grid'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Cards Grid</span>
                  </button>

                  <button
                    onClick={() => setViewMode('map')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                      viewMode === 'map'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Map Expanded</span>
                  </button>
                </div>
              </div>

              {/* Status / Reset map bounds */}
              {viewMode !== 'grid' && filters.searchAsMapMoves && filters.mapBounds && (
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="flex items-center space-x-1 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Filtering by visible map viewport</span>
                  </span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, mapBounds: null }))}
                    className="text-[11px] text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset map filter</span>
                  </button>
                </div>
              )}
            </div>

            {/* RESULTS DISPLAY: SPLIT / GRID / MAP */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Sticky Interactive Slippy Map */}
                <div className="lg:col-span-6 h-[480px] lg:h-[calc(100vh-210px)] lg:sticky lg:top-20 z-10">
                  <NatureMapWrapper
                    subjects={allFilteredSubjects}
                    activeMonth={filters.selectedMonth}
                    selectedState={filters.selectedState}
                    onSelectSubject={setSelectedSubject}
                    onBoundsChange={handleBoundsChange}
                    searchAsMapMoves={filters.searchAsMapMoves}
                    setSearchAsMapMoves={(val) => setFilters(prev => ({ ...prev, searchAsMapMoves: val }))}
                    highlightedSubjectId={highlightedSubjectId}
                  />
                </div>

                {/* Right: Scrollable Subject Cards */}
                <div className="lg:col-span-6 space-y-4">
                  {listSubjects.length === 0 ? (
                    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <MapIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-white">No hotspots in current map view</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        There are {allFilteredSubjects.length} subjects in other regions. Drag the map, zoom out, or reset the map area to see them.
                      </p>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, mapBounds: null, selectedState: 'all' }))}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition shadow-md"
                      >
                        Reset Map Viewport ({allFilteredSubjects.length} subjects)
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                      {listSubjects.map(subject => (
                        <SubjectCard
                          key={subject.id}
                          subject={subject}
                          isBookmarked={bookmarkedIds.includes(subject.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectSubject={setSelectedSubject}
                          activeMonth={filters.selectedMonth}
                          onMouseEnter={() => setHighlightedSubjectId(subject.id)}
                          onMouseLeave={() => setHighlightedSubjectId(null)}
                          isHighlighted={highlightedSubjectId === subject.id}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              <div>
                {allFilteredSubjects.length === 0 ? (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">No Subjects Match Your Filter Criteria</h3>
                    <p className="text-xs sm:text-sm text-slate-400">
                      Try resetting your search query, state, or elevation filters.
                    </p>
                    <button
                      onClick={() => setFilters({
                        category: 'all',
                        selectedState: 'all',
                        selectedMonth: null,
                        selectedRegion: 'all',
                        selectedElevation: 'all',
                        searchQuery: '',
                        onlyPeak: false,
                        mapBounds: null,
                        searchAsMapMoves: true,
                      })}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allFilteredSubjects.map(subject => (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        isBookmarked={bookmarkedIds.includes(subject.id)}
                        onToggleBookmark={handleToggleBookmark}
                        onSelectSubject={setSelectedSubject}
                        activeMonth={filters.selectedMonth}
                        onMouseEnter={() => setHighlightedSubjectId(subject.id)}
                        onMouseLeave={() => setHighlightedSubjectId(null)}
                        isHighlighted={highlightedSubjectId === subject.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="space-y-4">
                <div className="h-[70vh] w-full">
                  <NatureMapWrapper
                    subjects={allFilteredSubjects}
                    activeMonth={filters.selectedMonth}
                    selectedState={filters.selectedState}
                    onSelectSubject={setSelectedSubject}
                    onBoundsChange={handleBoundsChange}
                    searchAsMapMoves={filters.searchAsMapMoves}
                    setSearchAsMapMoves={(val) => setFilters(prev => ({ ...prev, searchAsMapMoves: val }))}
                    highlightedSubjectId={highlightedSubjectId}
                  />
                </div>

                {/* Horizontal drawer of cards beneath map */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-200">
                      Showing {listSubjects.length} subjects in current map area
                    </span>
                    <span>Scroll horizontally to browse cards</span>
                  </div>

                  <div className="flex space-x-4 overflow-x-auto pb-4">
                    {listSubjects.map(subject => (
                      <div key={subject.id} className="w-[320px] shrink-0">
                        <SubjectCard
                          subject={subject}
                          isBookmarked={bookmarkedIds.includes(subject.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectSubject={setSelectedSubject}
                          activeMonth={filters.selectedMonth}
                          onMouseEnter={() => setHighlightedSubjectId(subject.id)}
                          onMouseLeave={() => setHighlightedSubjectId(null)}
                          isHighlighted={highlightedSubjectId === subject.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRIP PLANNER TAB */}
        {activeTab === 'planner' && (
          <TripPlannerView
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onSelectSubject={setSelectedSubject}
            onNavigateToExplore={() => setActiveTab('explore')}
          />
        )}

        {/* FIELD LOG / SIGHTINGS TAB */}
        {activeTab === 'journal' && (
          <FieldLogView
            sightings={sightings}
            onRefresh={refreshData}
            onNavigateToExplore={() => setActiveTab('explore')}
          />
        )}
      </main>

      {/* Drill-In Detail Modal */}
      <SubjectDetailModal
        subject={selectedSubject}
        onClose={() => setSelectedSubject(null)}
        isBookmarked={selectedSubject ? bookmarkedIds.includes(selectedSubject.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onLogSighting={(sub) => {
          setSelectedSubject(null);
          setSightingSubject(sub);
        }}
        onAddToPlanner={(sub) => {
          handleToggleBookmark(sub.id);
        }}
      />

      {/* Sighting Logger Modal */}
      <SightingModal
        subject={sightingSubject}
        onClose={() => setSightingSubject(null)}
        onSightingSaved={refreshData}
      />

      {/* Elevation Zones Guide Modal */}
      <ElevationGuideModal
        isOpen={isElevationGuideOpen}
        onClose={() => setIsElevationGuideOpen(false)}
        onSelectElevation={(band: ElevationBand) => {
          setFilters(prev => ({ ...prev, selectedElevation: band }));
        }}
      />

      {/* Settings & Sync Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onDataChanged={refreshData}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-slate-400">
            WildSeason: Wildlife & Nature Photography Season Tracker • Built for macOS & Windows
          </p>
          <p className="text-[11px] text-slate-500">
            Real-time interactive spatial map search with North American wildlife and flora phenology.
          </p>
        </div>
      </footer>
    </div>
  );
}

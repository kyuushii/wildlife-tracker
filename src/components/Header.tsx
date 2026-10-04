'use client';

import React from 'react';
import { 
  Compass, 
  Mountain, 
  Bookmark, 
  BookOpen, 
  Settings as SettingsIcon,
  Calendar,
  Layers,
  LogOut,
  ArrowLeftRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  activeTab: 'explore' | 'planner' | 'journal';
  setActiveTab: (tab: 'explore' | 'planner' | 'journal') => void;
  bookmarkCount: number;
  sightingCount: number;
  onOpenSettings: () => void;
  onOpenElevationGuide: () => void;
  onOpenCompare: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  bookmarkCount,
  sightingCount,
  onOpenSettings,
  onOpenElevationGuide,
  onOpenCompare,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 border border-emerald-400/30">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-100 tracking-tight">WildSeason</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Field Guide
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Nature, Wildlife & Botanical Phenology for Photographers</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Mountain className="w-4 h-4" />
              <span>Explore Seasons</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'planner'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Trip Planner</span>
              {bookmarkCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold">
                  {bookmarkCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'journal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Field Log</span>
              {sightingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-bold">
                  {sightingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Tools */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCompare}
              title="Side-by-Side Lookalike ID & Comparison"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Compare</span>
            </button>
            <button
              onClick={onOpenElevationGuide}
              title="Habitat & Elevation Zones Guide"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettings}
              title="Cloud Sync & Data Settings"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              title="Lock / Log Out"
              className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-300 border border-slate-800 hover:border-red-800/50 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

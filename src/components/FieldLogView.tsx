'use client';

import React, { useState } from 'react';
import { UserSighting } from '@/types';
import { deleteLocalSighting, exportUserDataAsJSON } from '@/lib/storage';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  Camera, 
  Star, 
  Trash2, 
  Download, 
  Search,
  Sparkles
} from 'lucide-react';

interface FieldLogViewProps {
  sightings: UserSighting[];
  onRefresh: () => void;
  onNavigateToExplore: () => void;
}

export const FieldLogView: React.FC<FieldLogViewProps> = ({
  sightings,
  onRefresh,
  onNavigateToExplore,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete sighting entry for ${name}?`)) {
      deleteLocalSighting(id);
      onRefresh();
    }
  };

  const handleExportJSON = () => {
    const json = exportUserDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colorado-nature-field-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = sightings.filter(s => 
    s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.photographyNotes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Field Observations Journal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Personal Sighting Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {sightings.length} total entries recorded across Colorado
          </p>
        </div>

        {sightings.length > 0 && (
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Backup (.JSON)</span>
          </button>
        )}
      </div>

      {/* Filter / Search Bar */}
      {sightings.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your logs by subject, location, or photo notes..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* Empty State */}
      {sightings.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No Field Sightings Logged Yet</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            When you encounter wildlife or peak wildflowers in the field, click on any subject in the Explore tab and choose <strong>"Log Field Sighting"</strong> to record your location, camera gear, and photo notes.
          </p>
          <button
            onClick={onNavigateToExplore}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Colorado Subjects</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No sightings match your search query "{searchTerm}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(s => (
            <div
              key={s.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {s.subjectName}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>{s.date}</span>
                    </span>
                    {s.elevationFt && (
                      <span className="text-[11px] font-mono text-slate-400">
                        • {s.elevationFt.toLocaleString()} ft
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: s.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(s.id, s.subjectName)}
                    className="p-1.5 rounded-lg bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 transition border border-slate-800"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{s.locationName}</span>
              </div>

              {/* Gear */}
              {s.gearNotes && (
                <div className="text-xs bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 font-mono text-slate-300">
                  <span className="text-slate-400">Kit: </span>{s.gearNotes}
                </div>
              )}

              {/* Notes */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {s.photographyNotes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

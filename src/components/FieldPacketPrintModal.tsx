'use client';

import React, { useMemo } from 'react';
import { NatureSubject } from '@/types';
import { COLORADO_SUBJECTS, MONTH_NAMES } from '@/data/colorado-data';
import { getSolarTimes, formatTime } from '@/lib/ephemeris';
import { 
  Printer, 
  X, 
  MapPin, 
  Camera, 
  Sun, 
  CheckSquare, 
  Compass, 
  FileText 
} from 'lucide-react';

interface FieldPacketPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedIds: string[];
}

export const FieldPacketPrintModal: React.FC<FieldPacketPrintModalProps> = ({
  isOpen,
  onClose,
  bookmarkedIds,
}) => {
  if (!isOpen) return null;

  const plannedSubjects = useMemo(() => {
    return COLORADO_SUBJECTS.filter(s => bookmarkedIds.includes(s.id));
  }, [bookmarkedIds]);

  // Extract unique hotspots across all planned subjects
  const allHotspots = useMemo(() => {
    const spots: { subjectName: string; name: string; state: string; lat?: number; lng?: number; accessNotes: string; bestTime: string }[] = [];
    plannedSubjects.forEach(s => {
      s.hotspots.forEach(h => {
        if (!spots.some(existing => existing.name === h.name)) {
          spots.push({
            subjectName: s.name,
            name: h.name,
            state: h.state,
            lat: h.lat,
            lng: h.lng,
            accessNotes: h.accessNotes,
            bestTime: h.bestTime,
          });
        }
      });
    });
    return spots;
  }, [plannedSubjects]);

  // Use the first hotspot with lat/lng for solar table
  const primaryHotspot = allHotspots.find(h => h.lat && h.lng);
  const solar = primaryHotspot && primaryHotspot.lat && primaryHotspot.lng
    ? getSolarTimes(primaryHotspot.lat, primaryHotspot.lng, new Date())
    : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Printable Field Scouting Packet</h3>
              <p className="text-[11px] text-slate-400">
                Optimized high-contrast layout for single-page paper or PDF export.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 print:p-0 print:m-0 print:overflow-visible font-sans">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                WildSeason Field Scouting Sheet
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                North American Wildlife & Nature Photography • Field Reference Card
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Date Printed: {new Date().toLocaleDateString()}</div>
              <div className="font-semibold text-slate-800">{plannedSubjects.length} Target Species Planned</div>
            </div>
          </div>

          {/* Ephemeris & Sun Table */}
          {solar && (
            <div className="border border-slate-300 rounded-lg p-3 mb-4 bg-slate-50 text-xs grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500">First Light</span>
                <span className="font-mono font-bold text-slate-900">{formatTime(solar.blueHourDawnStart)}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-amber-700">Morning Golden</span>
                <span className="font-mono font-bold text-amber-900">
                  {formatTime(solar.sunrise)} – {formatTime(solar.goldenHourMorningEnd)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-amber-700">Evening Golden</span>
                <span className="font-mono font-bold text-amber-900">
                  {formatTime(solar.goldenHourEveningStart)} – {formatTime(solar.sunset)}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase text-slate-500">Last Light</span>
                <span className="font-mono font-bold text-slate-900">{formatTime(solar.blueHourDuskEnd)}</span>
              </div>
            </div>
          )}

          {/* Target Species Table */}
          <div className="mb-5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-300 pb-1">
              1. Target Species & Biological Field Marks
            </h2>
            <div className="space-y-2.5">
              {plannedSubjects.map(sub => (
                <div key={sub.id} className="border border-slate-200 rounded p-2.5 text-xs">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{sub.name}</span>
                    <span className="font-mono italic text-[11px] text-slate-500">{sub.scientificName}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 mb-1">
                    <strong>Recommended Glass:</strong> {sub.photographyGuide.recommendedLenses.join(', ')} • <strong>Prime Light:</strong> {sub.photographyGuide.bestLighting}
                  </div>
                  {sub.identificationMarks && sub.identificationMarks.length > 0 && (
                    <div className="text-[11px] text-slate-800 bg-slate-100 rounded p-1.5">
                      <strong>Diagnostic Marks: </strong>
                      {sub.identificationMarks.join(' • ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hotspots & GPS Coordinates Table */}
          <div className="mb-5">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-300 pb-1">
              2. Public Land Hotspots & GPS Coordinates
            </h2>
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-700">
                  <th className="p-1.5 border-r border-slate-300">Hotspot</th>
                  <th className="p-1.5 border-r border-slate-300">State</th>
                  <th className="p-1.5 border-r border-slate-300">Decimal GPS</th>
                  <th className="p-1.5">Trailhead Access & Pullout Notes</th>
                </tr>
              </thead>
              <tbody>
                {allHotspots.map((h, i) => (
                  <tr key={i} className="border-b border-slate-200">
                    <td className="p-1.5 font-bold border-r border-slate-200">{h.name}</td>
                    <td className="p-1.5 border-r border-slate-200">{h.state}</td>
                    <td className="p-1.5 font-mono text-[11px] border-r border-slate-200">
                      {h.lat && h.lng ? `${h.lat.toFixed(4)}, ${h.lng.toFixed(4)}` : 'Coordinates pending'}
                    </td>
                    <td className="p-1.5 text-[11px] text-slate-700">{h.accessNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Field Gear Checklist */}
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2 border-b border-slate-300 pb-1">
              3. Field Pack Checklist
            </h2>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700">
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border border-slate-400 rounded inline-block" />
                <span>Cold-weather spare batteries</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border border-slate-400 rounded inline-block" />
                <span>Circular polarizer / ND filters</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border border-slate-400 rounded inline-block" />
                <span>Lens rain covers & microfiber</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border border-slate-400 rounded inline-block" />
                <span>1.4x / 2.0x Teleconverters</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border border-slate-400 rounded inline-block" />
                <span>Red-light dawn headlamp</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 border border-slate-400 rounded inline-block" />
                <span>EPA-approved bear spray in holster</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

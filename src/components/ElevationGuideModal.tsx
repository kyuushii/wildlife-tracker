'use client';

import React from 'react';
import { ElevationBand } from '@/types';
import { X, Layers, Mountain } from 'lucide-react';

interface ElevationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElevation: (band: ElevationBand) => void;
}

export const ElevationGuideModal: React.FC<ElevationGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectElevation,
}) => {
  if (!isOpen) return null;

  const zones: {
    band: ElevationBand;
    name: string;
    range: string;
    keySubjects: string;
    photoTips: string;
    color: string;
  }[] = [
    {
      band: 'alpine',
      name: 'Alpine Tundra & High Summits',
      range: 'Above 11,500 ft (Treeline)',
      keySubjects: 'American Pika, White-Tailed Ptarmigan, Dwarf Cushion Blooms, Bristlecone Pine',
      photoTips: 'Severe ultraviolet light; polarizers are essential. In high mountains, monitor convective lightning building after 12:00 PM.',
      color: 'border-sky-500/40 bg-sky-950/20 text-sky-300',
    },
    {
      band: 'subalpine',
      name: 'Subalpine High Country & Tarns',
      range: '10,000 - 11,500 ft',
      keySubjects: 'Shiras Moose, Mount Rainier & Crested Butte Wildflower Basins, Spruce-Fir, High Aspen Fringes',
      photoTips: 'Early morning alpenglow reflects in still glacial tarns before mountain breezes begin around 8:30 AM.',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
    },
    {
      band: 'montane',
      name: 'Montane Forest Zone',
      range: '8,000 - 10,000 ft',
      keySubjects: 'Rocky Mountain Elk (Autumn Rut), Yellowstone Bison Rut, Large Aspen Stands, Gray Wolves',
      photoTips: 'Prime elevation for autumn foliage transitions (late Sept). Frosty mornings yield dramatic steaming bugle breath.',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
    },
    {
      band: 'foothills',
      name: 'Foothills, Canyons & High Deserts',
      range: '6,000 - 8,000 ft',
      keySubjects: 'Bighorn Sheep (Nov-Dec rut), Zion Sandstone Canyons, Great Smokies High Ridges',
      photoTips: 'Deep canyon walls reflect warm ambient bounce light into shadowed river beds and cottonwood groves.',
      color: 'border-teal-500/40 bg-teal-950/20 text-teal-300',
    },
    {
      band: 'plains',
      name: 'Lowlands, Coasts & Plains',
      range: '< 6,000 ft (Sea Level to Lowlands)',
      keySubjects: 'Katmai Coastal Brown Bears & Salmon, Bald Eagles, Sonoran Saguaro Bloom, Synchronous Fireflies',
      photoTips: 'Tidal lighting in coastal zones; rich dawn/dusk twilight horizons across prairie and coastal marshes.',
      color: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 text-slate-100 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Topography & Life Zones</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            Elevation & Habitat Zones Guide
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Seasonality flows down the mountains in autumn (high peaks peak first, river valleys peak last) and moves up the mountains in spring.
          </p>
        </div>

        {/* Zone Cards */}
        <div className="space-y-3">
          {zones.map(z => (
            <div
              key={z.band}
              className={`p-4 rounded-2xl border ${z.color} space-y-1.5 transition hover:scale-[1.01] cursor-pointer`}
              onClick={() => {
                onSelectElevation(z.band);
                onClose();
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white flex items-center space-x-2">
                  <Mountain className="w-4 h-4" />
                  <span>{z.name}</span>
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800">
                  {z.range}
                </span>
              </div>
              <p className="text-xs text-slate-200">
                <strong className="text-slate-400">Key Subjects: </strong>{z.keySubjects}
              </p>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-400">Field Light Note: </strong>{z.photoTips}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Click any zone above to filter subjects instantly.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

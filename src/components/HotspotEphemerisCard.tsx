'use client';

import React, { useState, useMemo } from 'react';
import { Hotspot } from '@/types';
import { getSolarTimes, getMoonInfo, formatTime } from '@/lib/ephemeris';
import { 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  MapPin, 
  Navigation, 
  Copy, 
  Check, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';

interface HotspotEphemerisCardProps {
  hotspot: Hotspot;
  selectedDate?: Date;
}

export const HotspotEphemerisCard: React.FC<HotspotEphemerisCardProps> = ({
  hotspot,
  selectedDate = new Date(),
}) => {
  const [copied, setCopied] = useState(false);

  const solar = useMemo(() => {
    if (!hotspot.lat || !hotspot.lng) return null;
    return getSolarTimes(hotspot.lat, hotspot.lng, selectedDate);
  }, [hotspot.lat, hotspot.lng, selectedDate]);

  const moon = useMemo(() => {
    return getMoonInfo(selectedDate);
  }, [selectedDate]);

  const handleCopyGps = () => {
    if (!hotspot.lat || !hotspot.lng) return;
    const text = `${hotspot.lat.toFixed(5)}, ${hotspot.lng.toFixed(5)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = hotspot.lat && hotspot.lng 
    ? `https://www.google.com/maps/dir/?api=1&destination=${hotspot.lat},${hotspot.lng}` 
    : null;

  const appleMapsUrl = hotspot.lat && hotspot.lng 
    ? `https://maps.apple.com/?daddr=${hotspot.lat},${hotspot.lng}` 
    : null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 hover:border-slate-700 transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <h4 className="text-sm font-bold text-white tracking-tight">{hotspot.name}</h4>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
              {hotspot.publicLandType}
            </span>
            <span>•</span>
            <span>{hotspot.state}</span>
            {hotspot.elevation && (
              <>
                <span>•</span>
                <span>{hotspot.elevation}</span>
              </>
            )}
          </div>
        </div>

        {/* GPS Copy Button */}
        {hotspot.lat && hotspot.lng && (
          <button
            onClick={handleCopyGps}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 transition cursor-pointer"
            title="Copy coordinates to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{hotspot.lat.toFixed(3)}, {hotspot.lng.toFixed(3)}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Access Notes & Prime Hours */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Prime Field Lighting</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{hotspot.bestTime}</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <Navigation className="w-3.5 h-3.5" />
            <span>Access & Parking</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">{hotspot.accessNotes}</p>
        </div>
      </div>

      {/* Solar Ephemeris & Golden Hour Panel */}
      {solar && (
        <div className="bg-gradient-to-r from-amber-950/20 via-slate-950/80 to-indigo-950/20 border border-amber-900/30 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Solar & Lighting Ephemeris (Today)</span>
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>{moon.emoji}</span>
              <span>{moon.phaseName} ({moon.illumination}%)</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            {/* Morning Golden Hour */}
            <div className="bg-slate-900/80 border border-amber-500/20 rounded-lg p-2">
              <div className="text-[10px] text-amber-400/90 font-semibold uppercase flex items-center justify-center gap-1">
                <Sunrise className="w-3 h-3" />
                <span>Morning Golden</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {formatTime(solar.sunrise)} – {formatTime(solar.goldenHourMorningEnd)}
              </div>
              <div className="text-[9px] text-slate-500">First Light: {formatTime(solar.blueHourDawnStart)}</div>
            </div>

            {/* Sunrise */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sunrise</div>
              <div className="text-xs font-bold text-amber-200 mt-0.5">
                {formatTime(solar.sunrise)}
              </div>
              <div className="text-[9px] text-slate-500">Blue Dawn: {formatTime(solar.blueHourDawnStart)}</div>
            </div>

            {/* Sunset */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Sunset</div>
              <div className="text-xs font-bold text-amber-200 mt-0.5">
                {formatTime(solar.sunset)}
              </div>
              <div className="text-[9px] text-slate-500">Blue Dusk: {formatTime(solar.blueHourDuskEnd)}</div>
            </div>

            {/* Evening Golden Hour */}
            <div className="bg-slate-900/80 border border-amber-500/20 rounded-lg p-2">
              <div className="text-[10px] text-amber-400/90 font-semibold uppercase flex items-center justify-center gap-1">
                <Sunset className="w-3 h-3" />
                <span>Evening Golden</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {formatTime(solar.goldenHourEveningStart)} – {formatTime(solar.sunset)}
              </div>
              <div className="text-[9px] text-slate-500">Last Light: {formatTime(solar.blueHourDuskEnd)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      {hotspot.lat && hotspot.lng && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500 font-medium">Get Directions:</span>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
          {appleMapsUrl && (
            <a
              href={appleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <span>Apple Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

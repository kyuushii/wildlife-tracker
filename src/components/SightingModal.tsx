'use client';

import React, { useState } from 'react';
import { NatureSubject } from '@/types';
import { saveLocalSighting } from '@/lib/storage';
import { X, Camera, MapPin, Star, Calendar, Check } from 'lucide-react';

interface SightingModalProps {
  subject: NatureSubject | null;
  onClose: () => void;
  onSightingSaved: () => void;
}

export const SightingModal: React.FC<SightingModalProps> = ({
  subject,
  onClose,
  onSightingSaved,
}) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState<string>('');
  const [elevationFt, setElevationFt] = useState<string>('');
  const [gearNotes, setGearNotes] = useState<string>('');
  const [photographyNotes, setPhotographyNotes] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!subject) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim() || !photographyNotes.trim()) return;

    saveLocalSighting({
      subjectId: subject.id,
      subjectName: subject.name,
      date,
      locationName: locationName.trim(),
      elevationFt: elevationFt ? parseInt(elevationFt, 10) : undefined,
      gearNotes: gearNotes.trim(),
      photographyNotes: photographyNotes.trim(),
      rating,
    });

    setIsSaved(true);
    setTimeout(() => {
      onSightingSaved();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 mb-1 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Camera className="w-4 h-4" />
          <span>Field Sighting Journal</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">
          Log Sighting: {subject.name}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Date Encountered</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Elevation (ft)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 9800"
                value={elevationFt}
                onChange={(e) => setElevationFt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Location Name */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Specific Location / Trailhead</label>
            <input
              type="text"
              required
              placeholder="e.g., Horseshoe Park, Trail Ridge Road turnout mile 14"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Gear Used */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Camera & Lens Setup</label>
            <input
              type="text"
              placeholder="e.g., Sony A1 + 600mm f/4 GM, 1/1600s, f/4, ISO 800"
              value={gearNotes}
              onChange={(e) => setGearNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Photography Notes */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Field Observations & Lighting</label>
            <textarea
              required
              rows={3}
              placeholder="Describe animal behavior, light quality, wind, distance, angle of approach..."
              value={photographyNotes}
              onChange={(e) => setPhotographyNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Encounter Quality / Photo Rating</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:text-amber-400 transition"
                >
                  <Star className={`w-5 h-5 ${rating >= star ? 'text-amber-400 fill-amber-400' : ''}`} />
                </button>
              ))}
              <span className="text-xs text-slate-400 ml-2">{rating} of 5 Stars</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaved}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-lg ${
                isSaved
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sighting Saved to Field Log!</span>
                </>
              ) : (
                <span>Save to Field Log</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

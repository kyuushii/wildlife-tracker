'use client';

import React, { useEffect } from 'react';
import { NatureSubject } from '@/types';
import { X, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Eye, Download, Maximize2 } from 'lucide-react';

interface ImageLightboxModalProps {
  subject: NatureSubject | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  subject,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!subject || !subject.imageUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div 
        className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4 pb-3 border-b border-slate-800/80 shrink-0 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3 truncate">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
            {subject.category.replace('_', ' ')}
          </span>
          <div className="truncate">
            <h2 className="text-base sm:text-xl font-extrabold text-white truncate">
              {subject.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono italic truncate">
              {subject.scientificName}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <a
            href={subject.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original high-res in new tab"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition"
          >
            <Maximize2 className="w-4 h-4" />
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage with Next / Prev Navigation */}
      <div 
        className="relative flex-1 my-3 flex items-center justify-center min-h-[50vh] max-h-[72vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {hasPrev && onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/80 shadow-2xl transition hover:scale-110"
            title="Previous species (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Uncropped High-Resolution Image */}
        <div className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={subject.imageUrl}
            alt={subject.name}
            className="max-h-[70vh] w-auto max-w-full object-contain select-none"
          />
        </div>

        {/* Next Button */}
        {hasNext && onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/80 shadow-2xl transition hover:scale-110"
            title="Next species (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Field Marks & Identification Panel */}
      <div 
        className="w-full max-w-6xl mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl shrink-0 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Field Identification Marks
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Use arrow keys &larr; &rarr; to browse all species
          </span>
        </div>

        {/* 3 Key Marks */}
        {subject.identificationMarks && subject.identificationMarks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {subject.identificationMarks.map((mark, i) => (
              <div 
                key={i} 
                className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{mark}</span>
              </div>
            ))}
          </div>
        )}

        {/* Distinguishing Tips */}
        {subject.distinguishingTips && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-semibold mr-1.5">How to Tell Apart:</strong>
              <span>{subject.distinguishingTips}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

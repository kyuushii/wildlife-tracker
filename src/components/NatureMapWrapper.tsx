'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { NatureSubject, MapBounds } from '@/types';
import { Compass } from 'lucide-react';

interface NatureMapWrapperProps {
  subjects: NatureSubject[];
  activeMonth: number | null;
  selectedState: string;
  onSelectSubject: (subject: NatureSubject) => void;
  onBoundsChange: (bounds: MapBounds) => void;
  searchAsMapMoves: boolean;
  setSearchAsMapMoves: (val: boolean) => void;
  highlightedSubjectId: string | null;
}

const DynamicNatureMap = dynamic(
  () => import('./NatureMap').then(mod => mod.NatureMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[450px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center text-slate-500">
        <div className="flex items-center space-x-2 text-xs font-medium">
          <Compass className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Loading Interactive Field Map...</span>
        </div>
      </div>
    ),
  }
);

export const NatureMapWrapper: React.FC<NatureMapWrapperProps> = (props) => {
  return <DynamicNatureMap {...props} />;
};

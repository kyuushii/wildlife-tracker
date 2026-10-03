'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { NatureSubject, Hotspot, MapBounds } from '@/types';
import { 
  MapPin, 
  Sparkles, 
  Layers, 
  Compass, 
  Maximize2,
  Mountain,
  Satellite,
  Globe
} from 'lucide-react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';

interface NatureMapProps {
  subjects: NatureSubject[];
  activeMonth: number | null;
  selectedState: string;
  onSelectSubject: (subject: NatureSubject) => void;
  onBoundsChange: (bounds: MapBounds) => void;
  searchAsMapMoves: boolean;
  setSearchAsMapMoves: (val: boolean) => void;
  highlightedSubjectId: string | null;
}

const TILE_PROVIDERS = {
  topo: {
    id: 'topo',
    name: 'Outdoor Topo',
    icon: <Mountain className="w-3 h-3" />,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; USGS, NPS, GIS User Community',
    maxZoom: 19,
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    icon: <Satellite className="w-3 h-3" />,
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  osm: {
    id: 'osm',
    name: 'Street / Terrain',
    icon: <Globe className="w-3 h-3" />,
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
};

// Controller component inside MapContainer to capture pan & zoom events
function MapEventsHandler({ 
  onBoundsChange, 
  searchAsMapMoves 
}: { 
  onBoundsChange: (bounds: MapBounds) => void; 
  searchAsMapMoves: boolean;
}) {
  const map = useMapEvents({
    moveend: () => {
      if (!searchAsMapMoves) return;
      const b = map.getBounds();
      onBoundsChange({
        southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
        northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
      });
    },
    zoomend: () => {
      if (!searchAsMapMoves) return;
      const b = map.getBounds();
      onBoundsChange({
        southWest: { lat: b.getSouthWest().lat, lng: b.getSouthWest().lng },
        northEast: { lat: b.getNorthEast().lat, lng: b.getNorthEast().lng },
      });
    },
  });

  return null;
}

// Helper component to center on state or fit markers
function MapCenterController({ 
  selectedState, 
  hotspotPoints 
}: { 
  selectedState: string; 
  hotspotPoints: [number, number][];
}) {
  const map = useMap();
  const prevRef = useRef(selectedState);

  useEffect(() => {
    if (prevRef.current !== selectedState) {
      prevRef.current = selectedState;

      const stateCenters: Record<string, { center: [number, number]; zoom: number }> = {
        CO: { center: [39.1130, -105.8580], zoom: 7 },
        WY: { center: [43.6000, -109.5000], zoom: 7 },
        AK: { center: [61.2000, -150.0000], zoom: 5 },
        WA: { center: [47.3000, -121.5000], zoom: 7 },
        AZ: { center: [33.5000, -111.9000], zoom: 7 },
        UT: { center: [38.2000, -111.9000], zoom: 7 },
        NC: { center: [35.6000, -82.6000], zoom: 8 },
        TN: { center: [35.7000, -83.6000], zoom: 8 },
        all: { center: [42.0000, -106.0000], zoom: 5 },
      };

      const target = stateCenters[selectedState] || stateCenters.all;
      map.flyTo(target.center, target.zoom, { duration: 1.2 });
    }
  }, [selectedState, map]);

  return null;
}

// Reset/Fit button inside map
function FitBoundsButton({ hotspotPoints }: { hotspotPoints: [number, number][] }) {
  const map = useMap();

  const handleFit = () => {
    if (hotspotPoints.length === 0) return;
    const bounds = L.latLngBounds(hotspotPoints);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
  };

  return (
    <button
      onClick={handleFit}
      title="Fit map to all markers"
      className="p-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-700 hover:bg-slate-900 text-slate-300 hover:text-white transition shadow-xl pointer-events-auto"
    >
      <Maximize2 className="w-4 h-4" />
    </button>
  );
}

export const NatureMap: React.FC<NatureMapProps> = ({
  subjects,
  activeMonth,
  selectedState,
  onSelectSubject,
  onBoundsChange,
  searchAsMapMoves,
  setSearchAsMapMoves,
  highlightedSubjectId,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTileType, setActiveTileType] = useState<'topo' | 'satellite' | 'osm'>('topo');
  const currentMonth = new Date().getMonth() + 1;
  const targetMonth = activeMonth ?? currentMonth;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Flatten hotspots with their parent subjects
  const hotspotItems = useMemo(() => {
    const items: {
      subject: NatureSubject;
      hotspot: Hotspot;
      isPeak: boolean;
      status: number;
    }[] = [];

    subjects.forEach(subject => {
      const monthData = subject.phenology.find(p => p.month === targetMonth);
      const isPeak = monthData?.status === 2;
      const status = monthData?.status ?? 0;

      subject.hotspots.forEach(hotspot => {
        if (hotspot.lat && hotspot.lng) {
          items.push({
            subject,
            hotspot,
            isPeak,
            status,
          });
        }
      });
    });

    return items;
  }, [subjects, targetMonth]);

  const hotspotPoints = useMemo<[number, number][]>(() => {
    return hotspotItems.map(item => [item.hotspot.lat, item.hotspot.lng]);
  }, [hotspotItems]);

  // Create styled Leaflet DivIcons
  const createCustomMarker = (cat: string, isPeak: boolean, isHighlighted: boolean) => {
    let colorBg = 'bg-slate-800 text-slate-300 border-slate-600';
    let ring = '';

    if (cat === 'mammal') colorBg = 'bg-amber-600 text-amber-100 border-amber-400';
    if (cat === 'bird') colorBg = 'bg-sky-600 text-sky-100 border-sky-300';
    if (cat === 'wildflower') colorBg = 'bg-emerald-600 text-emerald-100 border-emerald-300';
    if (cat === 'tree_foliage') colorBg = 'bg-orange-600 text-orange-100 border-orange-300';

    if (isPeak) {
      ring = 'ring-4 ring-emerald-400/80 animate-pulse';
    }
    if (isHighlighted) {
      ring = 'ring-4 ring-white scale-125 z-50';
    }

    const html = `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-2xl cursor-pointer transition-transform duration-150 ${colorBg} ${ring}">
        <span class="text-xs font-black">${cat[0].toUpperCase()}</span>
        ${isPeak ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-950"></span>' : ''}
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-leaflet-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[450px] bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center text-slate-500">
        <div className="flex items-center space-x-2 text-xs font-medium">
          <Compass className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Initializing Field Map...</span>
        </div>
      </div>
    );
  }

  const selectedTile = TILE_PROVIDERS[activeTileType];

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search as I move the map toggle */}
        <label className="pointer-events-auto flex items-center space-x-2 bg-slate-950/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 text-xs font-semibold text-slate-200 shadow-xl cursor-pointer hover:bg-slate-900 transition">
          <input
            type="checkbox"
            checked={searchAsMapMoves}
            onChange={(e) => setSearchAsMapMoves(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
          />
          <span className="text-slate-100">Search as I move the map</span>
          {searchAsMapMoves && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </label>

        {/* Tile Layer Switcher & Fit Button */}
        <div className="pointer-events-auto flex items-center space-x-1.5 bg-slate-950/95 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl">
          {(['topo', 'satellite', 'osm'] as const).map(t => {
            const info = TILE_PROVIDERS[t];
            const active = activeTileType === t;
            return (
              <button
                key={t}
                onClick={() => setActiveTileType(t)}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {info.icon}
                <span>{info.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={[39.1130, -105.8580]}
        zoom={6}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[450px]"
      >
        {/* Free Public Tile Layer (No API Key Required!) */}
        <TileLayer
          key={selectedTile.id}
          attribution={selectedTile.attribution}
          url={selectedTile.url}
          maxZoom={selectedTile.maxZoom}
        />

        <MapEventsHandler
          onBoundsChange={onBoundsChange}
          searchAsMapMoves={searchAsMapMoves}
        />

        <MapCenterController
          selectedState={selectedState}
          hotspotPoints={hotspotPoints}
        />

        {/* Hotspot Markers */}
        {hotspotItems.map((item, idx) => {
          const isHighlighted = highlightedSubjectId === item.subject.id;
          const icon = createCustomMarker(item.subject.category, item.isPeak, isHighlighted);

          return (
            <Marker
              key={`${item.subject.id}-${item.hotspot.name}-${idx}`}
              position={[item.hotspot.lat, item.hotspot.lng]}
              icon={icon}
            >
              <Popup>
                <div className="p-1 space-y-2 min-w-[210px] text-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-emerald-400 border border-emerald-900/60">
                      {item.hotspot.state}
                    </span>
                    {item.isPeak ? (
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/50">
                        <Sparkles className="w-3 h-3" />
                        <span>★ Peak Now</span>
                      </span>
                    ) : item.status === 1 ? (
                      <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/40">
                        Shoulder
                      </span>
                    ) : null}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {item.subject.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono italic">
                      {item.subject.scientificName}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="font-semibold text-slate-200 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{item.hotspot.name}</span>
                    </div>
                    {item.hotspot.elevation && (
                      <p className="text-[10px] text-slate-400">
                        Elevation: {item.hotspot.elevation}
                      </p>
                    )}
                    <p className="text-[11px] text-amber-300/90 font-medium">
                      Best: {item.hotspot.bestTime}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectSubject(item.subject)}
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center space-x-1 shadow-md"
                  >
                    <span>Open Field Guide</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Bottom right floating controls: Markers Count & Fit Button */}
      <div className="absolute bottom-4 right-4 z-[400] flex items-center space-x-2 pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs text-slate-300 shadow-xl flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span><strong>{hotspotItems.length}</strong> photo hotspots</span>
        </div>
      </div>
    </div>
  );
};

export type SubjectCategory = 'mammal' | 'bird' | 'wildflower' | 'tree_foliage';

export type ElevationBand = 
  | 'plains'      // Lowland, coastal, or plains (< 6,000 ft in Rockies / sea level to lowlands)
  | 'foothills'   // Low mountain valleys / foothills (6,000 - 8,000 ft)
  | 'montane'     // Montane forest (8,000 - 10,000 ft)
  | 'subalpine'   // Subalpine forests / high tarns (10,000 - 11,500 ft)
  | 'alpine';     // Alpine tundra above treeline (> 11,500 ft in Rockies / high altitude)

export type DestinationRegion =
  // Colorado
  | 'co_rmnp_frontrange'
  | 'co_san_juan'
  | 'co_central_rockies'
  | 'co_north_park'
  | 'co_san_luis_valley'
  | 'co_gunnison_crested_butte'
  | 'co_western_slope'
  | 'co_eastern_plains'
  // Greater Yellowstone & Wyoming / Montana
  | 'wy_yellowstone_lamar'
  | 'wy_grand_teton'
  // Alaska
  | 'ak_katmai_brooks'
  | 'ak_denali'
  | 'ak_kenai_coastal'
  // Pacific Northwest
  | 'pnw_olympic_rainforest'
  | 'pnw_cascades_rainier'
  // Desert Southwest
  | 'sw_sonoran_desert'
  | 'sw_zion_canyon'
  | 'sw_moab_arches'
  // Appalachia & Great Smokies
  | 'app_great_smokies'
  | 'app_blue_ridge';

export type StateOrZone = 
  | 'ALL'
  | 'CO' 
  | 'WY' 
  | 'AK' 
  | 'WA' 
  | 'AZ' 
  | 'UT' 
  | 'NC' 
  | 'TN';

export type MonthStatus = 0 | 1 | 2; // 0: Dormant/Absent, 1: Present/Active, 2: Peak Photography Window

export interface MonthPhenology {
  month: number; // 1-12
  status: MonthStatus;
  keyActivity: string;
}

export interface Hotspot {
  name: string;
  region: DestinationRegion;
  state: string; // e.g. "CO", "WY", "AK", "NC"
  elevation?: string;
  publicLandType: 'National Park' | 'National Forest' | 'State Park' | 'Wildlife Refuge' | 'Wilderness Area' | 'BLM' | 'National Monument';
  accessNotes: string;
  bestTime: string;
  lat: number;
  lng: number;
}

export interface PhotographyGuide {
  recommendedLenses: string[];
  bestLighting: string;
  fieldBehaviorNotes: string;
  ethicalGuidelines: string;
  difficultyRating: 'Easy / Roadside' | 'Moderate Hike' | 'Rugged Alpine Backcountry';
}

export interface NatureSubject {
  id: string;
  name: string;
  scientificName: string;
  category: SubjectCategory;
  tagline: string;
  description: string;
  imageUrl?: string;
  identificationMarks?: string[];
  distinguishingTips?: string;
  states: string[];
  elevationBands: ElevationBand[];
  regions: DestinationRegion[];
  phenology: MonthPhenology[];
  peakMonths: number[];
  keyEvents: string[];
  hotspots: Hotspot[];
  photographyGuide: PhotographyGuide;
  iconName: string;
  colorAccent: string;
}

export interface UserSighting {
  id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  stateOrRegion?: string;
  locationName: string;
  elevationFt?: number;
  gearNotes?: string;
  photographyNotes: string;
  rating: number; // 1 - 5 stars
  createdAt: string;
}

export interface TripTarget {
  id: string;
  subjectId: string;
  targetMonth: number;
  targetRegion: string;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface MapBounds {
  southWest: { lat: number; lng: number };
  northEast: { lat: number; lng: number };
}

export interface FilterState {
  category: SubjectCategory | 'all' | 'wildlife' | 'botanical';
  selectedState: string; // 'all' | 'CO' | 'WY' | 'AK' | 'WA' | 'AZ' | 'UT' | 'NC' | 'TN'
  selectedMonth: number | null; // 1-12 or null
  selectedRegion: DestinationRegion | 'all';
  selectedElevation: ElevationBand | 'all';
  searchQuery: string;
  onlyPeak: boolean;
  mapBounds: MapBounds | null;
  searchAsMapMoves: boolean;
}

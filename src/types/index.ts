export type SubjectCategory = 'mammal' | 'bird' | 'wildflower' | 'tree_foliage';

export type ElevationBand = 
  | 'plains'      // < 6,000 ft
  | 'foothills'   // 6,000 - 8,000 ft
  | 'montane'     // 8,000 - 10,000 ft
  | 'subalpine'   // 10,000 - 11,500 ft
  | 'alpine';     // > 11,500 ft (treeline & tundra)

export type ColoradoRegion =
  | 'rmnp_frontrange'        // Rocky Mountain NP, Estes Park, Front Range Foothills
  | 'san_juan'               // Ouray, Silverton, Telluride, Lake City
  | 'central_rockies'        // Aspen, Vail, Breckenridge, Sawatch Range
  | 'north_park'             // Walden, State Forest State Park (Moose Capital)
  | 'san_luis_valley'        // Monte Vista NWR, Great Sand Dunes
  | 'gunnison_crested_butte' // Crested Butte, Kebler Pass, Taylor Park
  | 'western_slope'          // Grand Mesa, Colorado National Monument
  | 'eastern_plains';        // Pawnee National Grasslands, Barr Lake, Arkansas Valley

export type MonthStatus = 0 | 1 | 2; // 0: Dormant/Absent, 1: Present/Active, 2: Peak Photography Window

export interface MonthPhenology {
  month: number; // 1-12
  status: MonthStatus;
  keyActivity: string; // e.g., "Bugling & Harems", "Alpine Tundra Bloom", "Velvet Antlers"
}

export interface Hotspot {
  name: string;
  region: ColoradoRegion;
  elevation: string;
  publicLandType: 'National Park' | 'National Forest' | 'State Park' | 'Wildlife Refuge' | 'Wilderness Area' | 'BLM';
  accessNotes: string;
  bestTime: string;
  coordinates?: string;
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
  elevationBands: ElevationBand[];
  regions: ColoradoRegion[];
  phenology: MonthPhenology[];
  peakMonths: number[]; // e.g. [9, 10] for Elk Rut
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
  targetRegion: ColoradoRegion;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface FilterState {
  category: SubjectCategory | 'all';
  selectedMonth: number | null; // 1-12 or null (all months)
  selectedRegion: ColoradoRegion | 'all';
  selectedElevation: ElevationBand | 'all';
  searchQuery: string;
  onlyPeak: boolean;
}

import { UserSighting, TripTarget } from '@/types';
import { getSupabaseClient } from './supabase';

const SIGHTINGS_KEY = 'cp_sightings_v1';
const TARGETS_KEY = 'cp_targets_v1';
const BOOKMARKS_KEY = 'cp_bookmarks_v1';

export function getLocalSightings(): UserSighting[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SIGHTINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalSighting(sighting: Omit<UserSighting, 'id' | 'createdAt'>): UserSighting {
  const list = getLocalSightings();
  const newEntry: UserSighting = {
    ...sighting,
    id: `sighting-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newEntry);
  localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(list));

  // If Supabase is active, asynchronously sync
  const client = getSupabaseClient();
  if (client) {
    client.from('sightings').insert([{
      subject_id: newEntry.subjectId,
      subject_name: newEntry.subjectName,
      date: newEntry.date,
      location_name: newEntry.locationName,
      elevation_ft: newEntry.elevationFt,
      gear_notes: newEntry.gearNotes,
      photography_notes: newEntry.photographyNotes,
      rating: newEntry.rating,
    }]).then(({ error }) => {
      if (error) console.warn('Supabase sync warning:', error.message);
    });
  }

  return newEntry;
}

export function deleteLocalSighting(id: string): void {
  const list = getLocalSightings().filter(s => s.id !== id);
  localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(list));
}

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(subjectId: string): boolean {
  const current = getBookmarks();
  let updated: string[];
  let isBookmarked: boolean;

  if (current.includes(subjectId)) {
    updated = current.filter(id => id !== subjectId);
    isBookmarked = false;
  } else {
    updated = [...current, subjectId];
    isBookmarked = true;
  }

  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return isBookmarked;
}

export function getTripTargets(): TripTarget[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TARGETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTripTarget(target: Omit<TripTarget, 'id' | 'createdAt' | 'completed'>): TripTarget {
  const list = getTripTargets();
  const newEntry: TripTarget = {
    ...target,
    id: `target-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newEntry);
  localStorage.setItem(TARGETS_KEY, JSON.stringify(list));
  return newEntry;
}

export function toggleTripTargetComplete(id: string): void {
  const list = getTripTargets().map(t => {
    if (t.id === id) return { ...t, completed: !t.completed };
    return t;
  });
  localStorage.setItem(TARGETS_KEY, JSON.stringify(list));
}

export function deleteTripTarget(id: string): void {
  const list = getTripTargets().filter(t => t.id !== id);
  localStorage.setItem(TARGETS_KEY, JSON.stringify(list));
}

export function exportUserDataAsJSON(): string {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sightings: getLocalSightings(),
    bookmarks: getBookmarks(),
    tripTargets: getTripTargets(),
  };
  return JSON.stringify(data, null, 2);
}

export function importUserDataFromJSON(jsonString: string): { success: boolean; count: number } {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed.sightings)) {
      localStorage.setItem(SIGHTINGS_KEY, JSON.stringify(parsed.sightings));
    }
    if (Array.isArray(parsed.bookmarks)) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(parsed.bookmarks));
    }
    if (Array.isArray(parsed.tripTargets)) {
      localStorage.setItem(TARGETS_KEY, JSON.stringify(parsed.tripTargets));
    }
    return {
      success: true,
      count: (parsed.sightings?.length || 0) + (parsed.bookmarks?.length || 0) + (parsed.tripTargets?.length || 0),
    };
  } catch (err) {
    console.error('Import error:', err);
    return { success: false, count: 0 };
  }
}

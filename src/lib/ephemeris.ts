/**
 * Pure TypeScript Solar and Lunar Ephemeris Calculator.
 * Calculates exact Golden Hour, Blue Hour, Sunrise, Sunset, and Moon Phase
 * for any GPS latitude/longitude without any external API dependencies.
 */

export interface SolarTimes {
  astronomicalDawn: Date;
  nauticalDawn: Date;
  blueHourDawnStart: Date;
  blueHourDawnEnd: Date;
  sunrise: Date;
  goldenHourMorningEnd: Date;
  solarNoon: Date;
  goldenHourEveningStart: Date;
  sunset: Date;
  blueHourDuskStart: Date;
  blueHourDuskEnd: Date;
  astronomicalDusk: Date;
}

export interface MoonInfo {
  phase: number; // 0 to 1 (0 = New Moon, 0.5 = Full Moon)
  phaseName: string;
  illumination: number; // 0 to 100%
  emoji: string;
}

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function fromJulian(j: number): Date {
  return new Date((j - 2440587.5) * 86400000);
}

function toDays(date: Date): number {
  return toJulian(date) - 2451545.0;
}

// Solar coordinates
function rightAscension(l: number, b: number): number {
  return Math.atan2(Math.sin(l) * Math.cos(23.4397 * RAD) - Math.tan(b) * Math.sin(23.4397 * RAD), Math.cos(l));
}

function declination(l: number, b: number): number {
  return Math.asin(Math.sin(b) * Math.cos(23.4397 * RAD) + Math.cos(b) * Math.sin(23.4397 * RAD) * Math.sin(l));
}

function solarMeanAnomaly(d: number): number {
  return RAD * (357.5291 + 0.98560028 * d);
}

function eclipticLongitude(M: number): number {
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const P = RAD * 102.9372; // perihelion of the Earth
  return M + C + P + Math.PI;
}

function julianCycle(d: number, lw: number): number {
  return Math.round(d - 0.0009 - lw / (2 * Math.PI));
}

function approxTransit(Ht: number, lw: number, n: number): number {
  return 0.0009 + (Ht + lw) / (2 * Math.PI) + n;
}

function solarTransitJ(ds: number, M: number, L: number): number {
  return 2451545.0 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
}

function hourAngle(h: number, phi: number, dec: number): number {
  const cosH = (Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
  if (cosH > 1) return -Infinity; // Sun never rises
  if (cosH < -1) return Infinity; // Sun never sets
  return Math.acos(cosH);
}

function getSetJ(h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number): { rise: number; set: number } {
  const w = hourAngle(h, phi, dec);
  const a = approxTransit(w, lw, n);
  const Jtransit = solarTransitJ(a, M, L);
  return {
    rise: Jtransit - (w / (2 * Math.PI)),
    set: Jtransit + (w / (2 * Math.PI)),
  };
}

/**
 * Calculates complete solar ephemeris for a specific date and lat/lng.
 */
export function getSolarTimes(lat: number, lng: number, date: Date = new Date()): SolarTimes {
  const lw = -lng * RAD;
  const phi = lat * RAD;
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);

  // Standard angles
  // Sunrise/sunset center: -0.833°
  // Golden hour upper boundary: +6.0°
  // Blue hour / civil twilight boundary: -6.0°
  // Nautical twilight: -12.0°
  // Astronomical twilight: -18.0°
  const sunTimes = getSetJ(-0.833 * RAD, lw, phi, dec, n, M, L);
  const goldenHourTimes = getSetJ(6.0 * RAD, lw, phi, dec, n, M, L);
  const civilTimes = getSetJ(-6.0 * RAD, lw, phi, dec, n, M, L);
  const nauticalTimes = getSetJ(-12.0 * RAD, lw, phi, dec, n, M, L);
  const astroTimes = getSetJ(-18.0 * RAD, lw, phi, dec, n, M, L);

  return {
    astronomicalDawn: fromJulian(astroTimes.rise),
    nauticalDawn: fromJulian(nauticalTimes.rise),
    blueHourDawnStart: fromJulian(civilTimes.rise),
    blueHourDawnEnd: fromJulian(sunTimes.rise),
    sunrise: fromJulian(sunTimes.rise),
    goldenHourMorningEnd: fromJulian(goldenHourTimes.rise),
    solarNoon: fromJulian(Jnoon),
    goldenHourEveningStart: fromJulian(goldenHourTimes.set),
    sunset: fromJulian(sunTimes.set),
    blueHourDuskStart: fromJulian(sunTimes.set),
    blueHourDuskEnd: fromJulian(civilTimes.set),
    astronomicalDusk: fromJulian(astroTimes.set),
  };
}

/**
 * Computes moon phase, percentage of illumination, and name.
 */
export function getMoonInfo(date: Date = new Date()): MoonInfo {
  // Known new moon: Jan 11, 2024 at 11:57 UTC (Julian Day: 2460321.0)
  // Synodic month = 29.53058867 days
  const jd = toJulian(date);
  const knownNewMoon = 2460321.0;
  const synodicMonth = 29.53058867;
  const phase = ((jd - knownNewMoon) % synodicMonth + synodicMonth) % synodicMonth / synodicMonth;
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

  let phaseName = 'New Moon';
  let emoji = '🌑';

  if (phase < 0.03 || phase >= 0.97) {
    phaseName = 'New Moon';
    emoji = '🌑';
  } else if (phase < 0.22) {
    phaseName = 'Waxing Crescent';
    emoji = '🌒';
  } else if (phase < 0.28) {
    phaseName = 'First Quarter';
    emoji = '🌓';
  } else if (phase < 0.47) {
    phaseName = 'Waxing Gibbous';
    emoji = '🌔';
  } else if (phase < 0.53) {
    phaseName = 'Full Moon';
    emoji = '🌕';
  } else if (phase < 0.72) {
    phaseName = 'Waning Gibbous';
    emoji = '🌖';
  } else if (phase < 0.78) {
    phaseName = 'Last Quarter';
    emoji = '🌗';
  } else {
    phaseName = 'Waning Crescent';
    emoji = '🌘';
  }

  return {
    phase,
    phaseName,
    illumination,
    emoji,
  };
}

/**
 * Format a Date object to a clean 12-hour time string (e.g. "6:42 AM").
 */
export function formatTime(date: Date): string {
  if (isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

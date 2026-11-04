import {SceneKey} from './scenes';

/**
 * The run, stage by stage. Physics numbers (checked):
 * - LA → NYC straight line ≈ 3,936 km
 * - walk 5 km/h → 32.8 days; Usain Bolt 44.7 km/h → 88 h (3.7 days)
 * - Mach 1 = 1,235 km/h → 3 h 11 min; Mach 10 → 19 min (stagnation temp ≈ 6,000 K)
 * - orbital speed 7.9 km/s → 8.3 min
 * - in 1 s: 3,936 km/s = Mach 11,474 = 1.3% of light speed; v²/R ≈ 248,000 g;
 *   kinetic energy of an 80 kg runner ≈ 6.2e14 J ≈ 148 kt TNT ≈ 10 × Hiroshima (15 kt)
 */
export const DISTANCE_KM = 3936;

export type Stage = {
  /** Speed shown on the HUD, km/h. */
  kmh: number;
  /** Mach number shown on the HUD. */
  mach: number;
  /** Trip time at this speed, as shown on the HUD. */
  eta: string;
  /** Short HUD label for the stage. */
  label: string;
};

export const STAGES: Record<SceneKey, Stage> = {
  hook: {kmh: 0, mach: 0, eta: '—', label: 'READY'},
  walk: {kmh: 5, mach: 0.004, eta: '33 DAYS', label: 'WALKING'},
  sprint: {kmh: 44.7, mach: 0.036, eta: '3.7 DAYS', label: 'USAIN BOLT'},
  mach1: {kmh: 1235, mach: 1, eta: '3 H 11 MIN', label: 'SOUND BARRIER'},
  mach10: {kmh: 12350, mach: 10, eta: '19 MIN', label: 'MACH 10'},
  orbit: {kmh: 28440, mach: 23, eta: '8 MIN', label: 'ORBITAL SPEED'},
  onesecond: {kmh: 14_170_000, mach: 11474, eta: '1 SEC', label: 'FLASH MODE'},
  ending: {kmh: 0, mach: 0, eta: 'ARRIVED', label: 'NEW YORK'},
};

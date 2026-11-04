import {interpolate} from 'remotion';
import {TOTAL_FRAMES, FPS} from '../config/scenes';
import {logMix, mix, smooth} from '../lib/timeline';
import {BEATS} from './beats';

/**
 * Visual running speed (m/s) at a global frame. Not the real physics (that is
 * on the HUD): tuned so each stage *feels* faster than the last.
 */
const speedAt = (f: number): number => {
  if (f < BEATS.sprint) return 1.6 * smooth(BEATS.walk + 6, BEATS.walk + 36, f);
  if (f < BEATS.mach1) return mix(1.6, 11, smooth(BEATS.sprint, BEATS.sprint + 30, f));
  if (f < BEATS.barrier) {
    const t = (f - BEATS.mach1) / (BEATS.barrier - BEATS.mach1);
    return logMix(11, 343, t * t);
  }
  if (f < BEATS.mach10) return mix(343, 420, smooth(BEATS.barrier, BEATS.mach10, f));
  if (f < BEATS.orbit) return logMix(420, 2400, smooth(BEATS.mach10, BEATS.mach10 + 45, f));
  return mix(2400, 3200, smooth(BEATS.orbit, BEATS.curves, f));
};

/** Steps per second (head-bob rate). */
const stepRateAt = (f: number, v: number): number => {
  if (f < BEATS.sprint) return 1.9 * Math.min(1, v / 1.6);
  if (f < BEATS.mach1) return mix(1.9, 4.6, smooth(BEATS.sprint, BEATS.sprint + 30, f));
  return mix(4.6, 9, smooth(BEATS.mach1, BEATS.barrier, f));
};

// Integrate speed and step phase once, so distance is exact and deterministic.
const N = TOTAL_FRAMES + 2;
const SPEED = new Float64Array(N);
const DIST = new Float64Array(N);
const STEP = new Float64Array(N);
const SCROLL = new Float64Array(N);
/** Motion-blur stretch of ground textures: 1 when slow, long streaks when fast. */
const stretchOf = (v: number) => 1 + v / FPS / 5;
for (let f = 0; f < N; f++) {
  SPEED[f] = speedAt(f);
  if (f > 0) {
    DIST[f] = DIST[f - 1] + SPEED[f - 1] / FPS;
    STEP[f] = STEP[f - 1] + stepRateAt(f - 1, SPEED[f - 1]) / FPS;
    // Texture scroll in stretched space, so streaks keep moving coherently as the stretch grows.
    SCROLL[f] = SCROLL[f - 1] + SPEED[f - 1] / FPS / stretchOf(SPEED[f - 1]);
  }
}

const sample = (arr: Float64Array, f: number) => {
  const c = Math.min(N - 2, Math.max(0, f));
  const i = Math.floor(c);
  return mix(arr[i], arr[i + 1], c - i);
};

/** Distance travelled (m) at a global frame. */
export const distAt = (f: number) => sample(DIST, f);

/** Desert (0) → plains/farmland (1) by position along the road, so the change rushes toward you. */
const BIOME_FROM = distAt(BEATS.barrier) - 60;
const BIOME_TO = BIOME_FROM + 520;
export const biomeAt = (s: number) => smooth(BIOME_FROM, BIOME_TO, s);
export const BIOME_RANGE = [BIOME_FROM, BIOME_TO] as const;

/** Deterministic smooth-ish noise for camera shake. */
const wobble = (t: number, seed: number) =>
  Math.sin(t * 1.7 + seed) * 0.5 + Math.sin(t * 3.1 + seed * 2.3) * 0.3 + Math.sin(t * 7.3 + seed * 5.1) * 0.2;

export type WorldState = {
  /** Visual speed, m/s. */
  speed: number;
  /** Metres moved this frame: drives motion-blur stretching. */
  motion: number;
  /** Distance travelled, m. */
  dist: number;
  /** Ground texture stretch (motion blur) and its scroll offset. */
  stretch: number;
  scroll: number;
  /** Camera position and rotation (radians). */
  x: number;
  y: number;
  pitch: number;
  yaw: number;
  roll: number;
  /** Vertical field of view, degrees. */
  fov: number;
  /** 0 → 1: dawn → full day. */
  day: number;
  /** 0 → 1: heat of the compressed air (Mach 10). */
  heat: number;
  /** 0 → 1: climbing into space (sky darkens, ground curves). */
  space: number;
  /** Visual curvature 1/R of the ground, 1/m. */
  curve: number;
};

/** Everything the ground-phase camera and environment need for a global frame. */
export const worldAt = (f: number): WorldState => {
  const t = f / FPS;
  const speed = sample(SPEED, f);
  const step = sample(STEP, f) * Math.PI * 2;

  // Head bob: walk → sprint, then fades into a high-speed vibration.
  const bobAmp =
    f < BEATS.sprint
      ? 0.035 * Math.min(1, speed / 1.6)
      : mix(0.035, 0.085, smooth(BEATS.sprint, BEATS.sprint + 30, f)) * (1 - 0.75 * smooth(BEATS.mach1, BEATS.barrier, f));
  const bobY = -bobAmp * (0.5 - 0.5 * Math.cos(step));
  const bobX = bobAmp * 0.6 * Math.sin(step / 2);

  // Idle breathing sway, strongest when standing still.
  const idle = 1 - smooth(BEATS.walk, BEATS.walk + 40, f);
  const swayY = 0.012 * Math.sin(t * 1.3) * idle;

  // Shake: rumble at speed, spikes at the sonic boom.
  const boom = Math.exp(-Math.max(0, f - BEATS.barrier) / 9) * (f >= BEATS.barrier ? 1 : 0);
  const heat = Math.max(0.3 * smooth(BEATS.mach10, BEATS.mach10 + 45, f), smooth(BEATS.slams - 10, BEATS.degrees, f)) *
    (1 - smooth(BEATS.curves - 20, BEATS.leave, f));
  const shake = 0.0015 * smooth(BEATS.mach1 + 40, BEATS.barrier, f) + 0.025 * boom + 0.004 * heat;

  // Hook: start glancing at the sign, then settle looking down the road.
  const look = interpolate(f, [0, BEATS.walk + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lookE = look * look * (3 - 2 * look);
  const yaw = mix(-0.09, 0, lookE) + 0.006 * Math.sin(t * 0.7) * idle + shake * wobble(t * 9, 1);

  // Orbit: rise and pitch up as the ground falls away.
  const rise = smooth(BEATS.curves, BEATS.leave + 14, f);
  const space = smooth(BEATS.curves, BEATS.leave + 6, f);
  const y = 1.7 + bobY + swayY + Math.pow(rise, 2.2) * 6000;
  const pitch = mix(0.1, 0.035, lookE) + 0.12 * smooth(BEATS.curves + 10, BEATS.leave + 14, f) + shake * wobble(t * 11, 2);
  const roll = bobX * 0.15 + shake * 0.6 * wobble(t * 8, 3);

  const fov =
    78 +
    6 * smooth(BEATS.sprint, BEATS.sprint + 40, f) +
    12 * smooth(BEATS.mach1 + 30, BEATS.barrier, f) -
    6 * smooth(BEATS.barrier, BEATS.barrier + 5, f) * Math.exp(-Math.max(0, f - BEATS.barrier) / 12) +
    10 * smooth(BEATS.mach10, BEATS.mach10 + 45, f) -
    18 * smooth(BEATS.curves, BEATS.leave, f);

  return {
    speed,
    motion: speed / FPS,
    dist: sample(DIST, f),
    stretch: stretchOf(speed),
    scroll: sample(SCROLL, f),
    x: bobX,
    y,
    pitch,
    yaw,
    roll,
    fov,
    day: smooth(BEATS.walk + 60, BEATS.mach1 + 30, f),
    heat,
    space,
    curve: mix(0, 1 / 40000, smooth(BEATS.curves, BEATS.curves + 50, f)),
  };
};

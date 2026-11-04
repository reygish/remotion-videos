import {Easing, interpolate} from 'remotion';
import {SCENE_ORDER, SCENE_START, SceneKey} from '../config/scenes';
import {STAGES} from '../config/run';
import {clamp} from './math';
import {cue} from './voiceover';

/** Scene playing at global frame `f`. */
export const sceneAt = (f: number): SceneKey => {
  let scene = SCENE_ORDER[0];
  for (const key of SCENE_ORDER) if (f >= SCENE_START[key]) scene = key;
  return scene;
};

const prevScene = (key: SceneKey): SceneKey => SCENE_ORDER[Math.max(0, SCENE_ORDER.indexOf(key) - 1)];

/** Local frames (within each scene) over which the HUD speed ramps to that scene's stage, on the narration. */
const RAMPS: Record<SceneKey, [number, number]> = {
  hook: [0, 1],
  walk: [0, 24],
  sprint: [cue('sprint', "Bolt's"), cue('sprint', "Bolt's") + 24],
  mach1: [cue('mach1', '1,235'), cue('mach1', 'kilometers')],
  mach10: [cue('mach10', 'Mach'), cue('mach10', 'Mach') + 30],
  orbit: [cue('orbit', 'Push'), cue('orbit', 'kilometers')],
  onesecond: [cue('onesecond', 'one'), cue('onesecond', '11,000') + 12],
  ending: [0, 1],
};

/** Global frame where the runner stops in New York (the "release" flash). */
export const ARRIVE_AT = SCENE_START.onesecond + cue('onesecond', 'release');
/** Global frame where the HUD slides in (after the hook title, on "Los Angeles"). */
export const HUD_IN_AT = SCENE_START.hook + cue('hook', 'Los');

const ONE_AT = SCENE_START.onesecond + cue('onesecond', 'one');
const SWOOSH_END = SCENE_START.onesecond + cue('onesecond', 'second') + 18;

/** Log-scale interpolation so the count feels steady from 5 km/h to 14 million km/h. */
const logLerp = (a: number, b: number, t: number) =>
  10 ** interpolate(t, [0, 1], [Math.log10(a + 1), Math.log10(b + 1)]) - 1;

/**
 * Illustrative runner position on the LA→NYC route (0..1): barely moves until
 * Mach 1, swooshes across during "one second", arrives on "release".
 */
export const routeAt = (f: number): number => {
  if (f < ONE_AT)
    return interpolate(
      f,
      [SCENE_START.walk, SCENE_START.mach1, SCENE_START.mach10, SCENE_START.orbit, ONE_AT],
      [0, 0.006, 0.03, 0.07, 0.12],
      clamp
    );
  if (f < SWOOSH_END)
    return interpolate(f, [ONE_AT, SWOOSH_END], [0.12, 0.9], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return interpolate(f, [SWOOSH_END, ARRIVE_AT - 6, ARRIVE_AT], [0.9, 0.95, 1], clamp);
};

export type HudState = {
  scene: SceneKey;
  kmh: number;
  mach: number;
  eta: string;
  label: string;
  route: number;
  arrived: boolean;
};

/** Everything the HUD shows at global frame `f`. */
export const hudState = (f: number): HudState => {
  const scene = sceneAt(f);
  const local = f - SCENE_START[scene];
  const prev = STAGES[prevScene(scene)];
  const cur = STAGES[scene];
  const [start, end] = RAMPS[scene];
  const t = interpolate(local, [start, end], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  let kmh = logLerp(prev.kmh, cur.kmh, t);
  let mach = logLerp(prev.mach, cur.mach, t);
  let eta = t < 0.5 ? prev.eta : cur.eta;
  const arrived = f >= ARRIVE_AT;
  if (arrived) {
    const stop = interpolate(f, [ARRIVE_AT, ARRIVE_AT + 8], [1, 0], clamp);
    kmh *= stop;
    mach *= stop;
    eta = 'ARRIVED';
  }
  return {scene, kmh, mach, eta, label: cur.label, route: routeAt(f), arrived};
};

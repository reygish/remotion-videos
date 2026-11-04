import {SCENE_START, SceneKey} from '../config/scenes';
import {cue} from './voiceover';

/** Global frame at which `word` is spoken in `scene` (see cue()). */
export const at = (scene: SceneKey, word: string, nth = 0): number => SCENE_START[scene] + cue(scene, word, nth);

/** Hermite smoothstep between edges a and b. */
export const smooth = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Linear interpolation. */
export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Interpolates in log space: good for speeds spanning orders of magnitude. */
export const logMix = (a: number, b: number, t: number): number => Math.exp(mix(Math.log(a), Math.log(b), t));

/** Positive modulo. */
export const wrap = (x: number, m: number): number => ((x % m) + m) % m;

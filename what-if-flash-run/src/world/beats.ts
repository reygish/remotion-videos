import {SCENE_START, TOTAL_FRAMES} from '../config/scenes';
import {at} from '../lib/timeline';

/** Global frames where the 3D world changes, landed on narration cue words. */
export const BEATS = {
  walk: SCENE_START.walk,
  sprint: SCENE_START.sprint,
  mach1: SCENE_START.mach1,
  /** "...you break the sound BARRIER": sonic boom. */
  barrier: at('mach1', 'barrier'),
  /** "Every town you PASS": a town flies by. */
  pass: at('mach1', 'pass'),
  /** "...gets a sonic BOOM": a second, smaller shock ring. */
  boom: at('mach1', 'boom'),
  mach10: SCENE_START.mach10,
  /** "It SLAMS together and heats up to 6,000 DEGREES": heat builds. */
  slams: at('mach10', 'slams'),
  degrees: at('mach10', 'degrees'),
  orbit: SCENE_START.orbit,
  /** "The Earth CURVES away": camera starts to rise. */
  curves: at('orbit', 'curves'),
  /** "Your feet LEAVE the ground": cross-fade into the orbital view. */
  leave: at('orbit', 'leave'),
  onesecond: SCENE_START.onesecond,
  /** "in ONE second?": jump into the streak tunnel. */
  one: at('onesecond', 'one'),
  /** "HUGGING the Earth's curve": the tunnel bends. */
  hugging: at('onesecond', 'hugging'),
  /** "...would CRUSH you": heavy shake. */
  crush: at('onesecond', 'crush'),
  /** "And STOPPING in New York": arrival at the skyline. */
  stopping: at('onesecond', 'stopping'),
  /** "...would RELEASE the energy": white flash + shockwave. */
  release: at('onesecond', 'release'),
  ending: SCENE_START.ending,
  /** "Take a PLANE": the airplane is mid-frame. */
  plane: at('ending', 'plane'),
  end: TOTAL_FRAMES,
};

/** Frames of the ground → orbit cross-fade. */
export const ORBIT_FADE = {from: BEATS.leave - 6, to: BEATS.leave + 14};
/** The city view starts slightly before "stopping", so the stop lands on the word. */
export const CITY_START = BEATS.stopping - 16;

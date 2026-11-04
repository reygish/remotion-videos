import voiceover from './voiceover.json';

export const FPS = 30;

/** Frames of silence at the start of each scene before the narration starts. */
export const VOICE_LEAD = 8;
/** Frames held after the narration ends before the next scene. */
const VOICE_TAIL = 12;

/** Minimum scene lengths in frames: enough time for each scene's animation. */
const MIN_FRAMES = {
  hook: 150,
  walk: 180,
  sprint: 180,
  mach1: 240,
  mach10: 240,
  orbit: 240,
  onesecond: 300,
  ending: 180,
};

export type SceneKey = keyof typeof MIN_FRAMES;

/** Play order of the scenes. */
export const SCENE_ORDER = Object.keys(MIN_FRAMES) as SceneKey[];

/**
 * Final scene lengths: each scene lasts as long as its animation or its
 * narration (from voiceover.json), whichever is longer.
 */
export const SCENES = Object.fromEntries(
  SCENE_ORDER.map((key) => {
    const speech = Math.ceil(voiceover.scenes[key].duration * FPS);
    return [key, Math.max(MIN_FRAMES[key], VOICE_LEAD + speech + VOICE_TAIL)];
  })
) as Record<SceneKey, number>;

/** First frame of each scene on the global timeline. */
export const SCENE_START = SCENE_ORDER.reduce(
  (acc, key, i) => {
    acc[key] = i === 0 ? 0 : acc[SCENE_ORDER[i - 1]] + SCENES[SCENE_ORDER[i - 1]];
    return acc;
  },
  {} as Record<SceneKey, number>
);

export const TOTAL_FRAMES = SCENE_ORDER.reduce((sum, key) => sum + SCENES[key], 0);

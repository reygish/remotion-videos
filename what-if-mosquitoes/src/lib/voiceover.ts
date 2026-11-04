import voiceover from '../config/voiceover.json';
import {FPS, VOICE_LEAD, SceneKey} from '../config/scenes';

export type TimedWord = {text: string; start: number; end: number};

const normalize = (s: string) => s.toLowerCase().replace(/[^\w]/g, '');

/** Narration words of a scene, with start/end converted to frames within the scene. */
export const sceneWords = (scene: SceneKey): TimedWord[] =>
  voiceover.scenes[scene].words.map((w) => ({
    text: w.text,
    start: VOICE_LEAD + Math.round(w.start * FPS),
    end: VOICE_LEAD + Math.round(w.end * FPS),
  }));

export const hasCaptions = (scene: SceneKey): boolean => voiceover.scenes[scene].captions;

/**
 * Frame (within the scene) at which `word` is spoken, so animations can land
 * on the narration. `nth` picks a later occurrence of the same word.
 */
export const cue = (scene: SceneKey, word: string, nth = 0): number => {
  const hits = sceneWords(scene).filter((w) => normalize(w.text) === normalize(word));
  if (!hits[nth]) throw new Error(`cue: "${word}" not found in ${scene} narration`);
  return hits[nth].start;
};

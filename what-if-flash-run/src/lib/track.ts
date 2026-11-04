import {wrap} from './timeline';

/**
 * Slot of a repeating object along the road. Objects live on a strip of
 * length `window` that wraps around as we run, so a few instances fill an
 * endless road. Returns how far ahead it is (`ahead`, m; negative = behind us)
 * and its lap `k` (changes on every wrap, to re-randomise the object).
 */
export const trackSlot = (dist: number, base: number, window: number, behind: number) => {
  const raw = base - dist + behind;
  const k = Math.floor(raw / window);
  return {ahead: wrap(raw, window) - behind, k};
};

import {interpolate} from 'remotion';
import {clamp} from './math';

/**
 * Decaying camera-shake offset (px) for a hit at frame `at`.
 * Deterministic, so every render frame gets the same jitter.
 */
export const shake = (f: number, at: number, amp = 26, dur = 20): {x: number; y: number} => {
  if (f < at || f > at + dur) return {x: 0, y: 0};
  const k = interpolate(f, [at, at + dur], [1, 0], clamp) ** 2;
  const t = f - at;
  return {
    x: Math.sin(t * 2.7 + 1.3) * amp * k,
    y: Math.cos(t * 3.4 + 0.4) * amp * 0.7 * k,
  };
};

/** Sum of several shakes. */
export const shakeAll = (f: number, hits: {at: number; amp?: number; dur?: number}[]) =>
  hits.reduce(
    (acc, h) => {
      const s = shake(f, h.at, h.amp, h.dur);
      return {x: acc.x + s.x, y: acc.y + s.y};
    },
    {x: 0, y: 0}
  );

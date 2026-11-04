import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BEATS, CITY_START} from './beats';

/** A white flash: instant attack, exponential decay. */
const flash = (frame: number, at: number, peak: number, decay: number, hold = 0) => {
  const t = frame - at;
  if (t < -1) return 0;
  if (t < 0) return peak * 0.4;
  if (t <= hold) return peak;
  return peak * Math.exp(-(t - hold) / decay);
};

/** Full-screen flashes over the 3D world: sonic boom, jump to light speed, arrival, the energy release. */
export const WorldFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = Math.min(
    1,
    flash(frame, BEATS.barrier, 0.6, 5) + flash(frame, BEATS.one, 0.95, 6) + flash(frame, CITY_START, 0.85, 5) + flash(frame, BEATS.release, 1, 7, 2)
  );
  if (o < 0.005) return null;
  return <AbsoluteFill style={{background: '#fffaf0', opacity: o}} />;
};

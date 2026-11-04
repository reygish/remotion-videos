import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/math';

/** Brief full-screen white flash peaking at frame `at`. */
export const FlashOverlay: React.FC<{at: number; peak?: number; hold?: number; fade?: number}> = ({
  at,
  peak = 0.9,
  hold = 2,
  fade = 12,
}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at - 2, at, at + hold, at + hold + fade], [0, peak, peak, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: '#FFFDF5', opacity: o, pointerEvents: 'none'}} />;
};

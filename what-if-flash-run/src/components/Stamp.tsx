import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {INK} from '../lib/palette';
import {clamp} from '../lib/math';

/**
 * Huge stroked text that slams in at frame `at` (scale-down pop) and, if
 * `out` is set, lifts away. Thick dark stroke keeps it legible over a bright 3D sky.
 */
export const Stamp: React.FC<{
  at: number;
  out?: number;
  top: number;
  size?: number;
  color?: string;
  glow?: string;
  from?: number;
  children: React.ReactNode;
}> = ({at, out, top, size = 150, color = 'white', glow, from = 1.8, children}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || (out !== undefined && f > out + 10)) return null;
  const s = spring({frame: f - at, fps, config: {damping: 12, mass: 0.6, stiffness: 170}});
  const exit = out === undefined ? 0 : interpolate(f, [out, out + 10], [0, 1], clamp);
  const scale = interpolate(s, [0, 1], [from, 1]) * (1 - exit * 0.15);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: -size * 0.025,
        color,
        WebkitTextStroke: `${Math.round(size * 0.1)}px ${INK}`,
        paintOrder: 'stroke fill',
        textShadow: `0 ${Math.round(size * 0.06)}px 0 rgba(0,0,0,0.4)${glow ? `, 0 0 ${Math.round(size * 0.35)}px ${glow}` : ''}`,
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        opacity: Math.min(1, s * 2.5) * (1 - exit),
        transform: `translateY(${-exit * 50}px) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};

import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {INK, ORANGE} from '../lib/palette';
import {clamp} from '../lib/math';

/** Comic-style "BOOM" text burst on a jagged starburst, popping at `at` and fading out. */
export const BoomBurst: React.FC<{at: number; x?: number; y?: number; size?: number; tilt?: number}> = ({
  at,
  x = 540,
  y = 880,
  size = 1,
  tilt = -8,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f - at;
  if (t < 0 || t > 36) return null;
  const s = spring({frame: t, fps, config: {damping: 8, mass: 0.5, stiffness: 220}});
  const fade = interpolate(t, [22, 36], [1, 0], clamp);
  const spikes = 14;
  const points = Array.from({length: spikes * 2}, (_, i) => {
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 300 : 175 + ((i * 37) % 40);
    return `${300 + Math.cos(a) * r},${300 + Math.sin(a) * r * 0.7}`;
  }).join(' ');
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 300,
        top: y - 300,
        width: 600,
        height: 600,
        opacity: fade,
        transform: `scale(${s * size * (1 + t * 0.006)}) rotate(${tilt}deg)`,
      }}
    >
      <svg width={600} height={600} viewBox="0 0 600 600" style={{position: 'absolute', inset: 0}}>
        <polygon points={points} fill="white" stroke={INK} strokeWidth={10} strokeLinejoin="round" />
        <polygon points={points} fill={ORANGE} transform="translate(300 300) scale(0.78) translate(-300 -300)" />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 150,
          letterSpacing: -4,
          color: 'white',
          WebkitTextStroke: `14px ${INK}`,
          paintOrder: 'stroke fill',
          textShadow: '0 10px 0 rgba(0,0,0,0.35)',
        }}
      >
        BOOM
      </div>
    </div>
  );
};

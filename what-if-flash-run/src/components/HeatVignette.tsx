import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

/** Orange/white plasma glow creeping in from the screen edges; `intensity` 0..1. */
export const HeatVignette: React.FC<{intensity: number}> = ({intensity}) => {
  const f = useCurrentFrame();
  if (intensity <= 0) return null;
  const flicker = 0.9 + Math.sin(f * 1.7) * 0.05 + Math.sin(f * 4.3 + 1) * 0.05;
  const i = Math.min(1, intensity) * flicker;
  const inner = 66 - i * 18;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 58% at 50% 46%, rgba(255,120,20,0) ${inner}%, rgba(255,110,20,${0.42 * i}) ${inner + 22}%, rgba(255,190,110,${0.85 * i}) 92%, rgba(255,245,225,${0.95 * i}) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          mixBlendMode: 'screen',
          background: `linear-gradient(90deg, rgba(255,150,40,${0.45 * i}) 0%, rgba(255,150,40,0) 18%, rgba(255,150,40,0) 82%, rgba(255,150,40,${0.45 * i}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

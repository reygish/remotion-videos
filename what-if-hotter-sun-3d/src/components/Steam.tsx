import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rand} from '../lib/math';

/** Soft steam wisps rising from a horizontal strip; `amount` (0-1) fades them in. */
export const Steam: React.FC<{x: number; y: number; width: number; amount: number; rise?: number; seed?: number}> = ({
  x,
  y,
  width,
  amount,
  rise = 260,
  seed = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: 22}).map((_, i) => {
        const t = ((f + rand(seed + i) * 60) % 60) / 60;
        const s = 40 + rand(seed + i + 30) * 50;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + rand(seed + i + 9) * width + Math.sin(f / 12 + i) * 20 - s / 2,
              top: y - t * rise - s / 2,
              width: s * (1 + t),
              height: s * (1 + t),
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.75), transparent 70%)',
              opacity: amount * Math.sin(t * Math.PI) * 0.8,
            }}
          />
        );
      })}
    </>
  );
};

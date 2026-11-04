import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rand} from '../lib/math';

/** Twinkling background stars scattered over the whole frame. */
export const Starfield: React.FC<{count?: number; seed?: number}> = ({count = 70, seed = 0}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: count}).map((_, i) => {
        const s = 2 + rand(seed + i * 7) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: rand(seed + i) * 1080,
              top: rand(seed + i + 500) * 1920,
              width: s,
              height: s,
              borderRadius: s,
              background: 'white',
              opacity: 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(f / 10 + i * 1.3)),
            }}
          />
        );
      })}
    </>
  );
};

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rand} from '../lib/math';

/** Twinkling star field across the top part of the frame. */
export const Stars: React.FC<{count?: number; height?: number; opacity?: number}> = ({count = 70, height = 1100, opacity = 1}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: count}).map((_, i) => {
        const s = 2 + rand(i + 300) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: rand(i + 100) * 1080,
              top: rand(i + 200) * height,
              width: s,
              height: s,
              borderRadius: s,
              background: 'white',
              opacity: opacity * (0.35 + 0.65 * Math.abs(Math.sin(f / 18 + i * 1.7))),
            }}
          />
        );
      })}
    </>
  );
};

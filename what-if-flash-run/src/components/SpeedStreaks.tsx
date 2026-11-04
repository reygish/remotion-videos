import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp, rand} from '../lib/math';

/** Horizontal white light streaks whipping across a band of the screen for `dur` frames from `at`. */
export const SpeedStreaks: React.FC<{at: number; top: number; height: number; dur?: number; count?: number; color?: string}> = ({
  at,
  top,
  height,
  dur = 24,
  count = 16,
  color = 'white',
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const env = interpolate(t, [0, 3, dur * 0.6, dur], [0, 1, 0.8, 0], clamp);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: env}}>
      {Array.from({length: count}, (_, i) => {
        const len = 180 + rand(i + 1) * 420;
        const speed = 90 + rand(i + 7) * 90;
        const x = -len + ((t * speed + rand(i + 3) * 1400) % (1080 + len * 2)) - len * 0.5;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: top + rand(i + 11) * height,
              left: x,
              width: len,
              height: 4 + rand(i + 5) * 6,
              borderRadius: 6,
              background: `linear-gradient(90deg, ${color}00, ${color})`,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

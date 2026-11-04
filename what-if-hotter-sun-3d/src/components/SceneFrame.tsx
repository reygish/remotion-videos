import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/math';

/** Wraps a scene with a fade in/out and a slow camera push-in. */
export const SceneFrame: React.FC<{
  duration: number;
  bg: string;
  children: React.ReactNode;
}> = ({duration, bg, children}) => {
  const f = useCurrentFrame();
  const fade = interpolate(f, [0, 8, duration - 8, duration], [0, 1, 1, 0], clamp);
  const zoom = interpolate(f, [0, duration], [1, 1.07]);
  return (
    <AbsoluteFill style={{background: bg, opacity: fade, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

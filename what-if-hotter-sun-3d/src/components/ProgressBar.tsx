import React from 'react';
import {useCurrentFrame} from 'remotion';
import {TOTAL_FRAMES} from '../config/scenes';

/** Thin yellow bar across the top showing playback progress. */
export const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 10,
        width: `${(f / TOTAL_FRAMES) * 100}%`,
        background: '#FFE14D',
      }}
    />
  );
};

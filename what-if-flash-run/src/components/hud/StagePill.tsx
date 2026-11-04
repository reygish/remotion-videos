import React from 'react';
import {interpolate} from 'remotion';
import {FONT} from '../../config/theme';
import {INK} from '../../lib/palette';

/** Solid stage label pill (WALKING, SOUND BARRIER, ...); `pop` 0..1 animates each stage change. */
export const StagePill: React.FC<{label: string; color: string; pop: number}> = ({label, color, pop}) => (
  <div
    style={{
      position: 'absolute',
      top: 20,
      right: 30,
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: 26,
      letterSpacing: 3,
      color: INK,
      background: color,
      borderRadius: 999,
      padding: '8px 22px',
      whiteSpace: 'nowrap',
      boxShadow: `0 0 ${interpolate(pop, [0, 1], [50, 18])}px ${color}`,
      transform: `scale(${interpolate(pop, [0, 1], [1.35, 1])})`,
      transformOrigin: 'right center',
    }}
  >
    {label}
  </div>
);

import React from 'react';
import {INK} from '../lib/palette';

const PARTS = [
  'M22 100 Q22 90 34 90 L150 90 Q182 92 190 100 Q182 108 150 110 L34 110 Q22 110 22 100 Z',
  'M120 93 L74 22 L56 22 L82 93 Z',
  'M120 107 L74 178 L56 178 L82 107 Z',
  'M44 93 L28 60 L17 60 L24 93 Z',
  'M44 107 L28 140 L17 140 L24 107 Z',
];

/** Simple airliner silhouette (top view, nose pointing right) with a dark outline. */
export const PlaneIcon: React.FC<{size?: number; color?: string}> = ({size = 200, color = 'white'}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
    <g fill={INK} stroke={INK} strokeWidth={14} strokeLinejoin="round">
      {PARTS.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
    <g fill={color}>
      {PARTS.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  </svg>
);

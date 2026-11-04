import React from 'react';
import {rand} from '../lib/math';

const BLOCKS = [
  {x: 0, w: 210, h: 520},
  {x: 190, w: 160, h: 380},
  {x: 700, w: 170, h: 430},
  {x: 850, w: 230, h: 560},
];

/**
 * Soviet-style apartment blocks along the bottom of the frame. `lit` (0-1)
 * switches their windows on one by one.
 */
export const Skyline: React.FC<{lit: number; color?: string; top?: number}> = ({lit, color = '#2b2440', top = 1180}) => (
  <svg width={1080} height={740} viewBox="0 0 1080 740" style={{position: 'absolute', top, left: 0}}>
    {BLOCKS.map((b, bi) => {
      const cols = Math.floor((b.w - 30) / 34);
      const rows = Math.floor((b.h - 40) / 46);
      return (
        <g key={bi}>
          <rect x={b.x} y={740 - b.h} width={b.w} height={b.h} fill={color} />
          {Array.from({length: cols * rows}).map((_, i) => {
            const on = rand(bi * 100 + i) < lit;
            return (
              <rect
                key={i}
                x={b.x + 20 + (i % cols) * 34}
                y={740 - b.h + 26 + Math.floor(i / cols) * 46}
                width={20}
                height={26}
                fill={on ? '#ffd98a' : '#3d3556'}
              />
            );
          })}
        </g>
      );
    })}
  </svg>
);

import React from 'react';

/** Simple SVG fish facing left; `flip` mirrors it horizontally. */
export const Fish: React.FC<{x: number; y: number; flip?: boolean; color: string}> = ({x, y, flip, color}) => (
  <svg
    width={220}
    height={120}
    viewBox="0 0 110 60"
    style={{position: 'absolute', left: x, top: y, transform: flip ? 'scaleX(-1)' : undefined}}
  >
    <path d="M10 30 Q45 0 85 30 Q45 60 10 30 Z" fill={color} />
    <path d="M85 30 L108 12 L102 30 L108 48 Z" fill={color} />
    <circle cx={26} cy={26} r={4} fill="white" />
    <circle cx={25} cy={26} r={2} fill="black" />
  </svg>
);

import React from 'react';

/** Radiation trefoil warning sign. */
export const RadiationSign: React.FC<{size?: number; color?: string; bg?: string}> = ({
  size = 300,
  color = '#111',
  bg = '#ffc233',
}) => {
  const blade = (rot: number) => (
    <path
      key={rot}
      d="M30 15.36 A40 40 0 0 1 70 15.36 L55 41.34 A10 10 0 0 0 45 41.34 Z"
      fill={color}
      transform={`rotate(${rot} 50 50)`}
    />
  );
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={48} fill={bg} />
      {[0, 120, 240].map(blade)}
      <circle cx={50} cy={50} r={6} fill={color} />
    </svg>
  );
};

import React from 'react';
import {FONT} from '../config/theme';

/**
 * Map of the exclusion zone: a 30 km circle around the plant. `revive` (0-1)
 * turns the hazard zone into green farmland dotted with houses.
 */
export const ZoneMap: React.FC<{size?: number; revive: number}> = ({size = 760, revive}) => {
  const fields = Array.from({length: 7}).map((_, i) => i);
  return (
    <svg width={size} height={size} viewBox="0 0 400 400">
      <defs>
        <pattern id="zone-hazard" width={20} height={20} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={20} height={20} fill="#3a2f0a" />
          <rect width={10} height={20} fill="#ffc233" opacity={0.55} />
        </pattern>
        <clipPath id="zone-clip">
          <circle cx={200} cy={200} r={150} />
        </clipPath>
      </defs>
      <rect x={10} y={10} width={380} height={380} rx={30} fill="#1d2a22" />
      {/* river */}
      <path d="M150 10 Q180 120 170 200 Q160 300 230 390" stroke="#3d7ea6" strokeWidth={10} fill="none" />
      <g clipPath="url(#zone-clip)">
        <circle cx={200} cy={200} r={150} fill="url(#zone-hazard)" opacity={1 - revive} />
        <g opacity={revive}>
          <circle cx={200} cy={200} r={150} fill="#7cc46b" />
          {fields.map((i) => (
            <rect
              key={i}
              x={40 + (i % 3) * 110}
              y={50 + Math.floor(i / 3) * 105}
              width={95}
              height={90}
              fill={['#a8d672', '#e5c95a', '#5fae5a', '#c8e28a'][i % 4]}
              transform={`rotate(${(i % 2 ? 1 : -1) * 6} 200 200)`}
            />
          ))}
          {[
            [130, 120],
            [270, 150],
            [240, 280],
            [120, 260],
            [300, 240],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x - 12} y={y - 6} width={24} height={18} fill="#fff6e0" />
              <path d={`M${x - 16} ${y - 6} L${x} ${y - 20} L${x + 16} ${y - 6} Z`} fill="#c2452d" />
            </g>
          ))}
        </g>
      </g>
      <circle cx={200} cy={200} r={150} fill="none" stroke={revive > 0.5 ? '#eaffd0' : '#ffc233'} strokeWidth={5} strokeDasharray="14 10" />
      {/* plant marker */}
      <circle cx={205} cy={195} r={11} fill="#ffffff" stroke="#1d2a22" strokeWidth={4} />
      <line x1={205} y1={195} x2={355} y2={195} stroke="white" strokeWidth={2} opacity={0.7} />
      <text x={290} y={186} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={18} fill="white">
        30 km
      </text>
    </svg>
  );
};

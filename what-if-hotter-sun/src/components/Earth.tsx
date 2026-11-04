import React from 'react';
import {useCurrentFrame} from 'remotion';

const CONTINENTS = [
  'M-62 -42 Q-32 -64 -10 -38 Q2 -12 -24 2 Q-40 22 -56 6 Q-78 -16 -62 -42 Z',
  'M18 -26 Q46 -40 62 -12 Q72 18 52 44 Q36 62 24 36 Q12 8 18 -26 Z',
  'M-34 38 Q-10 32 0 54 Q-14 72 -38 62 Q-50 50 -34 38 Z',
];

/**
 * Spinning Earth with polar ice caps.
 * `ice` (0-1) sizes the caps, `sea` (0-1) floods the land,
 * `venus` (0-1) smothers it in a hot, yellow Venus-like haze.
 */
export const Earth: React.FC<{size?: number; ice?: number; sea?: number; venus?: number}> = ({
  size = 480,
  ice = 1,
  sea = 0,
  venus = 0,
}) => {
  const f = useCurrentFrame();
  const shift = (f * 0.6) % 200;
  const land = 1 - sea * 0.3;
  return (
    <svg width={size} height={size} viewBox="-110 -110 220 220" style={{overflow: 'visible'}}>
      <defs>
        <clipPath id="earth-clip">
          <circle r={90} />
        </clipPath>
        <radialGradient id="earth-ocean" cx="38%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#4FB3FF" />
          <stop offset="100%" stopColor="#0B3C8C" />
        </radialGradient>
        <radialGradient id="earth-shade" cx="35%" cy="32%" r="80%">
          <stop offset="55%" stopColor="black" stopOpacity={0} />
          <stop offset="100%" stopColor="black" stopOpacity={0.55} />
        </radialGradient>
        <radialGradient id="earth-venus" cx="40%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#FFF0B8" />
          <stop offset="55%" stopColor="#E8B04A" />
          <stop offset="100%" stopColor="#8A5A12" />
        </radialGradient>
      </defs>
      {/* atmosphere */}
      <circle r={102} fill="none" stroke={venus > 0.5 ? '#FFC45A' : '#7FD3FF'} strokeWidth={10} opacity={0.35 + venus * 0.3} />
      <g clipPath="url(#earth-clip)">
        <circle r={90} fill="url(#earth-ocean)" />
        {[-200, 0].map((base) => (
          <g key={base} transform={`translate(${base + shift} 0)`}>
            {CONTINENTS.map((d, i) => (
              <path key={i} d={d} fill="#3FAE5A" transform={`scale(${land})`} />
            ))}
          </g>
        ))}
        {/* ice caps */}
        <ellipse cx={0} cy={-90} rx={70 * ice} ry={26 * ice} fill="#F4FBFF" />
        <ellipse cx={0} cy={90} rx={62 * ice} ry={22 * ice} fill="#F4FBFF" />
        {/* Venus haze */}
        <g opacity={venus}>
          <circle r={90} fill="url(#earth-venus)" />
          {[-50, -20, 10, 40].map((y, i) => (
            <path
              key={y}
              d={`M-100 ${y} Q-40 ${y - 14 + Math.sin(f / 15 + i) * 6} 0 ${y} T100 ${y}`}
              stroke="#FFF3C9"
              strokeWidth={9}
              fill="none"
              opacity={0.35}
            />
          ))}
        </g>
        <circle r={90} fill="url(#earth-shade)" />
      </g>
    </svg>
  );
};

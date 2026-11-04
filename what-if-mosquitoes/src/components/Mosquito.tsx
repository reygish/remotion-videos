import React from 'react';
import {useCurrentFrame} from 'remotion';

/** SVG mosquito with flapping wings. `seed` offsets the flap phase. */
export const Mosquito: React.FC<{size?: number; seed?: number}> = ({size = 200, seed = 0}) => {
  const f = useCurrentFrame();
  const flap = 0.35 + Math.abs(Math.sin((f + seed * 3) * 2.2)) * 0.65;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
      {/* legs */}
      {[-1, 1].map((side) =>
        [0, 1, 2].map((i) => (
          <polyline
            key={`${side}-${i}`}
            points={`${100 + side * 6},${92 + i * 8} ${100 + side * (40 + i * 10)},${110 + i * 14} ${
              100 + side * (60 + i * 18)
            },${170 + i * 6}`}
            fill="none"
            stroke="#2b2b2b"
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))
      )}
      {/* wings */}
      <g style={{transformOrigin: '100px 80px', transform: `scaleY(${flap})`}}>
        <ellipse cx={60} cy={58} rx={46} ry={16} fill="rgba(210,235,255,0.55)" stroke="rgba(255,255,255,0.8)" strokeWidth={2} transform="rotate(-25 60 58)" />
        <ellipse cx={140} cy={58} rx={46} ry={16} fill="rgba(210,235,255,0.55)" stroke="rgba(255,255,255,0.8)" strokeWidth={2} transform="rotate(25 140 58)" />
      </g>
      {/* abdomen */}
      <g transform="rotate(8 100 100)">
        <ellipse cx={100} cy={128} rx={11} ry={42} fill="#3a3a3a" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={89} y={98 + i * 13} width={22} height={4} rx={2} fill="#d8d8d8" opacity={0.8} />
        ))}
      </g>
      {/* thorax + head */}
      <ellipse cx={100} cy={82} rx={15} ry={18} fill="#2e2e2e" />
      <circle cx={100} cy={56} r={11} fill="#262626" />
      <circle cx={95} cy={53} r={4} fill="#c0392b" />
      <circle cx={105} cy={53} r={4} fill="#c0392b" />
      {/* proboscis + antennae */}
      <line x1={100} y1={64} x2={100} y2={8} stroke="#1e1e1e" strokeWidth={3} strokeLinecap="round" />
      <path d="M96 48 Q80 30 74 18" stroke="#1e1e1e" strokeWidth={2} fill="none" />
      <path d="M104 48 Q120 30 126 18" stroke="#1e1e1e" strokeWidth={2} fill="none" />
    </svg>
  );
};

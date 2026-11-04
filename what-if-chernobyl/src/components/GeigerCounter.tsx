import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT} from '../config/theme';

/** Handheld Geiger counter whose needle jitters around `level` (0-1). */
export const GeigerCounter: React.FC<{size?: number; level: number}> = ({size = 360, level}) => {
  const f = useCurrentFrame();
  const jitter = (Math.sin(f * 1.7) + Math.sin(f * 3.1) * 0.6) * 4 * level;
  const angle = -60 + level * 110 + jitter;
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 250 200">
      {/* body */}
      <rect x={10} y={20} width={230} height={170} rx={22} fill="#e8c21a" />
      <rect x={10} y={150} width={230} height={40} rx={0} fill="#c9a40f" />
      <rect x={10} y={168} width={230} height={22} rx={22} fill="#c9a40f" />
      {/* handle */}
      <path d="M60 22 Q60 -4 125 -4 Q190 -4 190 22" stroke="#2b2b2b" strokeWidth={12} fill="none" />
      {/* dial */}
      <rect x={35} y={40} width={180} height={100} rx={12} fill="#f4f1e6" stroke="#2b2b2b" strokeWidth={4} />
      <path d="M60 125 A65 65 0 0 1 190 125" stroke="#2b2b2b" strokeWidth={3} fill="none" />
      <path d="M163 72 A65 65 0 0 1 190 125" stroke="#d63a2f" strokeWidth={8} fill="none" />
      {Array.from({length: 9}).map((_, i) => {
        const a = ((-150 + i * 15 + 0) * Math.PI) / 180;
        const a2 = ((-150 + i * 15) * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={125 + Math.cos(a) * 65}
            y1={125 + Math.sin(a) * 65}
            x2={125 + Math.cos(a2) * 55}
            y2={125 + Math.sin(a2) * 55}
            stroke="#2b2b2b"
            strokeWidth={3}
          />
        );
      })}
      <line
        x1={125}
        y1={125}
        x2={125}
        y2={68}
        stroke="#d63a2f"
        strokeWidth={4}
        strokeLinecap="round"
        transform={`rotate(${angle} 125 125)`}
      />
      <circle cx={125} cy={125} r={7} fill="#2b2b2b" />
      <text x={125} y={172} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={20} fill="#2b2b2b">
        mR/h
      </text>
      {/* status lamp */}
      <circle cx={210} cy={170} r={8} fill={level > 0.6 && f % 6 < 3 ? '#ff3b2f' : '#6b1a14'} />
    </svg>
  );
};

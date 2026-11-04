import React from 'react';
import {useCurrentFrame} from 'remotion';

export type AnimalKind = 'wolf' | 'lynx' | 'horse';

/**
 * Walking animal silhouette facing right (wolf, lynx or Przewalski's horse).
 * Legs swing with the frame; `seed` offsets the gait.
 */
export const Animal: React.FC<{kind: AnimalKind; size?: number; color?: string; seed?: number}> = ({
  kind,
  size = 300,
  color = '#1a120a',
  seed = 0,
}) => {
  const f = useCurrentFrame();
  const swing = (phase: number) => Math.sin((f + seed * 7) / 5 + phase) * 14;
  const leg = (x: number, top: number, len: number, w: number, phase: number) => (
    <rect key={`${x}-${phase}`} x={x - w / 2} y={top} width={w} height={len} rx={w / 2} fill={color} transform={`rotate(${swing(phase)} ${x} ${top})`} />
  );
  const bob = Math.abs(Math.sin((f + seed * 7) / 5)) * 2;
  if (kind === 'wolf') {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
        <g transform={`translate(0 ${-bob})`}>
          {leg(62, 66, 46, 9, 0)}
          {leg(74, 66, 46, 9, Math.PI)}
          {leg(132, 64, 48, 9, Math.PI)}
          {leg(144, 64, 48, 9, 0)}
          <path d="M40 58 Q10 70 4 96 Q22 84 48 74 Z" fill={color} />
          <path d="M45 52 Q60 36 110 40 Q140 36 152 46 L160 72 Q120 82 60 78 Q42 72 45 52 Z" fill={color} />
          <path d="M148 52 L160 26 L166 34 L172 22 L178 36 L196 50 L192 56 L172 58 L160 70 Z" fill={color} />
        </g>
      </svg>
    );
  }
  if (kind === 'lynx') {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
        <g transform={`translate(0 ${-bob})`}>
          {leg(66, 64, 50, 11, 0)}
          {leg(80, 64, 50, 11, Math.PI)}
          {leg(128, 62, 52, 11, Math.PI)}
          {leg(142, 62, 52, 11, 0)}
          <path d="M50 50 Q40 44 38 36 Q48 40 56 48 Z" fill={color} />
          <path d="M50 54 Q62 40 100 42 Q135 38 150 48 L154 72 Q120 82 66 80 Q48 74 50 54 Z" fill={color} />
          <path d="M142 50 Q146 30 166 30 Q184 32 186 48 Q184 62 162 66 Q146 64 142 50 Z" fill={color} />
          <path d="M150 34 L150 12 L158 30 Z M172 32 L178 10 L180 34 Z" fill={color} />
          <path d="M160 64 L156 76 L168 66 Z" fill={color} />
        </g>
      </svg>
    );
  }
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
      <g transform={`translate(0 ${-bob})`}>
        {leg(58, 62, 52, 10, 0)}
        {leg(72, 62, 52, 10, Math.PI)}
        {leg(126, 62, 52, 10, Math.PI)}
        {leg(140, 62, 52, 10, 0)}
        <path d="M44 46 Q24 56 22 92 Q34 74 46 62 Z" fill={color} />
        <path d="M40 48 Q50 30 100 32 Q140 30 148 40 L150 70 Q110 80 56 76 Q38 70 40 48 Z" fill={color} />
        <path d="M134 44 Q144 20 162 8 Q172 4 182 14 L196 34 Q198 42 190 44 L176 40 Q162 46 150 62 Z" fill={color} />
        {/* upright mane */}
        <path d="M136 38 Q146 14 164 4 L168 10 Q152 22 144 44 Z" fill="#3b2410" opacity={0.6} />
      </g>
    </svg>
  );
};

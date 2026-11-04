import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rand} from '../lib/math';

/**
 * Glowing, pulsing sun: soft corona, rotating rays, looping flares on the limb
 * and shimmering granulation. `heat` (0-1) makes it whiter and brighter.
 */
export const Sun: React.FC<{size?: number; heat?: number; seed?: number}> = ({size = 600, heat = 0, seed = 0}) => {
  const f = useCurrentFrame();
  const id = `sun-${seed}`;
  const pulse = 1 + Math.sin(f / 9 + seed) * 0.025;
  const glow = 1 + Math.sin(f / 13 + seed) * 0.06;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      {/* corona glow */}
      <div
        style={{
          position: 'absolute',
          inset: -size * 0.45,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,190,60,${0.55 + heat * 0.35}) 0%, rgba(255,110,10,${0.28 + heat * 0.2}) 30%, rgba(255,80,0,0.08) 50%, transparent 68%)`,
          transform: `scale(${glow})`,
        }}
      />
      <svg width={size} height={size} viewBox="-150 -150 300 300" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <radialGradient id={`${id}-core`} cx="42%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#FFFDF0" />
            <stop offset="40%" stopColor="#FFE066" />
            <stop offset="80%" stopColor="#FF9A1F" />
            <stop offset="100%" stopColor="#E8530A" />
          </radialGradient>
        </defs>
        {/* rays */}
        <g transform={`rotate(${f * 0.35 + seed * 20})`}>
          {Array.from({length: 18}).map((_, i) => {
            const len = 124 + 16 * Math.sin(f / 6 + i * 1.7);
            return <polygon key={i} points={`-7,-96 7,-96 0,-${len}`} transform={`rotate(${i * 20})`} fill="#FFB52E" opacity={0.5} />;
          })}
        </g>
        {/* flares: loops rising off the limb */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = rand(seed + i * 3.1) * 360;
          const h = (16 + rand(seed + i + 10) * 20) * (0.55 + 0.45 * Math.sin(f / 10 + i * 2));
          return (
            <path
              key={i}
              d={`M -14 -97 Q 0 ${-97 - h * 2} 14 -97`}
              transform={`rotate(${angle})`}
              fill="none"
              stroke="#FF6A1A"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={0.9}
            />
          );
        })}
        <circle r={100 * pulse} fill={`url(#${id}-core)`} />
        {/* granulation */}
        {Array.from({length: 30}).map((_, i) => {
          const r = Math.sqrt(rand(i + seed * 3)) * 82;
          const a = rand(i + seed * 3 + 40) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={Math.cos(a) * r}
              cy={Math.sin(a) * r}
              r={5 + rand(i + 77) * 9}
              fill="#FFF6C2"
              opacity={0.12 + 0.1 * Math.sin(f / 8 + i)}
            />
          );
        })}
        <circle r={100 * pulse} fill="white" opacity={heat * 0.35} />
      </svg>
    </div>
  );
};

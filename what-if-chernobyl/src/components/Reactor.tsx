import React from 'react';
import {useCurrentFrame} from 'remotion';

/**
 * Stylised nuclear power-plant block with its striped vent stack.
 * `glow` (0-1) lights the core window; `blast` (0-1) blows the roof off and
 * raises a burning plume. `hot` tints the core from calm cyan to fiery orange.
 */
export const Reactor: React.FC<{width?: number; glow?: number; blast?: number; hot?: number}> = ({
  width = 900,
  glow = 0.6,
  blast = 0,
  hot = 0,
}) => {
  const f = useCurrentFrame();
  const flicker = 0.85 + Math.sin(f / 3) * 0.08 + Math.sin(f / 7.3) * 0.07;
  const core = hot > 0.5 ? '#ff7a1a' : '#5cf2ff';
  const roofPieces = [
    {x: 110, w: 80, dx: -90, rot: -40},
    {x: 190, w: 90, dx: -20, rot: 25},
    {x: 280, w: 70, dx: 30, rot: -15},
    {x: 350, w: 80, dx: 100, rot: 50},
  ];
  return (
    <svg width={width} height={(width * 460) / 600} viewBox="0 -40 600 460" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="reactor-plume" cx="50%" cy="85%" r="70%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="30%" stopColor="#ff9a3c" />
          <stop offset="70%" stopColor="#c2271b" stopOpacity={0.6} />
          <stop offset="100%" stopColor="#c2271b" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="reactor-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={core} stopOpacity={0.9} />
          <stop offset="100%" stopColor={core} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* burning plume */}
      {blast > 0 && (
        <ellipse
          cx={270}
          cy={150 - blast * 140}
          rx={60 + blast * 170}
          ry={40 + blast * 220}
          fill="url(#reactor-plume)"
          opacity={Math.min(1, blast * 1.4) * flicker}
        />
      )}
      {/* vent stack */}
      <path d="M440 150 L450 -20 L478 -20 L488 150 Z" fill="#e9e4dc" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${442 + i * 1} ${120 - i * 40} L${443 + i * 1} ${100 - i * 40} L${485 - i * 1} ${100 - i * 40} L${486 - i * 1} ${120 - i * 40} Z`} fill="#d23b2f" />
      ))}
      {/* turbine hall */}
      <rect x={0} y={290} width={600} height={110} fill="#262d3f" />
      {Array.from({length: 18}).map((_, i) => (
        <rect key={i} x={14 + i * 33} y={320} width={18} height={14} fill="#ffd27a" opacity={0.25 + ((i * 7) % 5) * 0.12} />
      ))}
      {/* reactor block */}
      <rect x={110} y={150} width={320} height={250} fill="#323b52" />
      {Array.from({length: 9}).map((_, i) => (
        <rect key={i} x={124 + i * 34} y={160} width={6} height={240} fill="#2a3245" />
      ))}
      {/* core glow window */}
      <ellipse cx={270} cy={190} rx={150} ry={60} fill="url(#reactor-halo)" opacity={glow * flicker} />
      <rect x={180} y={176} width={180} height={22} rx={6} fill={core} opacity={0.35 + glow * 0.65 * flicker} />
      {/* roof (blows apart) */}
      {roofPieces.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={136}
          width={p.w}
          height={18}
          fill="#4a5470"
          transform={`translate(${p.dx * blast} ${-260 * blast + 120 * blast * blast}) rotate(${p.rot * blast} ${p.x + p.w / 2} 145)`}
          opacity={1 - Math.max(0, blast - 0.85) * 6}
        />
      ))}
      {/* ground */}
      <rect x={-200} y={400} width={1000} height={20} fill="#151a26" />
    </svg>
  );
};

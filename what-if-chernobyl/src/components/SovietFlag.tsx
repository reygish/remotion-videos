import React from 'react';
import {useCurrentFrame} from 'remotion';

const W = 600;
const H = 400;
/** Zigzag crack down the middle of the flag. */
const CRACK = [[310, 0], [290, 70], [325, 140], [280, 210], [320, 280], [295, 340], [305, 400]];
const crackPath = CRACK.map(([x, y]) => `${x} ${y}`).join(' L');
/** Five-pointed star outline above the hammer and sickle. */
const STAR = Array.from({length: 10})
  .map((_, i) => {
    const r = i % 2 ? 7 : 17;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    return `${(115 + Math.cos(a) * r).toFixed(1)},${(42 + Math.sin(a) * r).toFixed(1)}`;
  })
  .join(' ');

/**
 * Waving red Soviet flag (star, hammer and sickle). `split` (0-1) cracks it in two and pulls
 * the halves apart; `heal` (0-1) glows the crack closed again.
 */
export const SovietFlag: React.FC<{width?: number; split: number; heal: number}> = ({width = 820, split, heal}) => {
  const f = useCurrentFrame();
  const wave = (x: number) => Math.sin(x / 90 - f / 8) * 14 * (x / W);
  const edge = (y0: number) =>
    Array.from({length: 13})
      .map((_, i) => {
        const x = (i / 12) * W;
        return `${x.toFixed(0)} ${(y0 + wave(x)).toFixed(1)}`;
      })
      .join(' L');
  const body = `M${edge(0)} L${edge(H).split(' L').reverse().join(' L')} Z`;
  const gap = split * (1 - heal);
  const half = (side: -1 | 1) => (
    <g
      clipPath={`url(#flag-${side < 0 ? 'left' : 'right'})`}
      transform={`translate(${side * gap * 45} ${gap * 18}) rotate(${side * gap * 4} 300 200)`}
    >
      <path d={body} fill="#c8102e" />
      <path d={body} fill="url(#flag-shade)" />
      <g transform={`translate(0 ${wave(110)})`} stroke="#ffd24a" fill="none">
        <polygon points={STAR} strokeWidth={4} strokeLinejoin="round" />
        {/* sickle */}
        <path d="M95 145 A40 40 0 1 1 150 90" strokeWidth={11} strokeLinecap="round" />
        <line x1={95} y1={145} x2={80} y2={165} strokeWidth={12} strokeLinecap="round" />
        {/* hammer */}
        <line x1={88} y1={92} x2={145} y2={150} strokeWidth={11} strokeLinecap="round" />
        <line x1={101} y1={79} x2={75} y2={105} strokeWidth={16} />
      </g>
    </g>
  );
  return (
    <svg width={width} height={(width * 460) / 640} viewBox="-20 -30 640 460" style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="flag-shade" x1="0" x2="1">
          {Array.from({length: 7}).map((_, i) => (
            <stop key={i} offset={i / 6} stopColor="black" stopOpacity={0.12 + Math.sin(i * 1.4 - f / 8) * 0.12} />
          ))}
        </linearGradient>
        <clipPath id="flag-left">
          <path d={`M-40 -40 L${crackPath} L-40 440 Z`} />
        </clipPath>
        <clipPath id="flag-right">
          <path d={`M640 -40 L${crackPath} L640 440 Z`} />
        </clipPath>
      </defs>
      {/* pole */}
      <rect x={-18} y={-30} width={12} height={470} rx={6} fill="#c9c9c9" />
      {half(-1)}
      {half(1)}
      {heal > 0 && (
        <path d={`M${crackPath}`} stroke="#ffd24a" strokeWidth={8} fill="none" opacity={heal * (1 - Math.max(0, heal - 0.8) * 5)} style={{filter: 'drop-shadow(0 0 12px #ffd24a)'}} />
      )}
    </svg>
  );
};

import React from 'react';

const GONDOLAS = 12;

/** The Pripyat-style Ferris wheel with yellow gondolas. `angle` rotates the wheel (degrees). */
export const FerrisWheel: React.FC<{size?: number; angle: number; lights?: number}> = ({
  size = 640,
  angle,
  lights = 1,
}) => {
  const cx = 200;
  const cy = 200;
  const r = 165;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 400 460" style={{overflow: 'visible'}}>
      {/* A-frame legs */}
      <path d="M200 200 L120 455 M200 200 L280 455 M200 200 L150 455 M200 200 L250 455" stroke="#e9e4dc" strokeWidth={8} />
      <g transform={`rotate(${angle} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e9e4dc" strokeWidth={6} />
        <circle cx={cx} cy={cy} r={r - 18} fill="none" stroke="#e9e4dc" strokeWidth={3} />
        {Array.from({length: GONDOLAS}).map((_, i) => {
          const a = (i / GONDOLAS) * Math.PI * 2;
          return (
            <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="#e9e4dc" strokeWidth={3} />
          );
        })}
        {/* rim lights */}
        {Array.from({length: 36}).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={4} fill="#fff4b0" opacity={lights} />;
        })}
      </g>
      {/* gondolas hang upright while the wheel turns */}
      {Array.from({length: GONDOLAS}).map((_, i) => {
        const a = (i / GONDOLAS) * Math.PI * 2 + (angle * Math.PI) / 180;
        const gx = cx + Math.cos(a) * r;
        const gy = cy + Math.sin(a) * r;
        return (
          <g key={i}>
            <line x1={gx} y1={gy} x2={gx} y2={gy + 12} stroke="#e9e4dc" strokeWidth={3} />
            <rect x={gx - 16} y={gy + 10} width={32} height={30} rx={8} fill="#ffcc1a" stroke="#b8860b" strokeWidth={2} />
            <rect x={gx - 10} y={gy + 15} width={20} height={9} rx={3} fill="#5a4210" opacity={0.6} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={16} fill="#e9e4dc" />
    </svg>
  );
};

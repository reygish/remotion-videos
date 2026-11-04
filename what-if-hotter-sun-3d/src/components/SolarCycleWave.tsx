import React from 'react';
import {useCurrentFrame} from 'remotion';

/**
 * Sine wave of the Sun's 11-year brightness cycle. `progress` (0-1) draws it
 * left to right; `amp` is half the peak-to-trough height in pixels.
 */
export const SolarCycleWave: React.FC<{
  width: number;
  height: number;
  amp: number;
  progress: number;
  color?: string;
  cycles?: number;
}> = ({width, height, amp, progress, color = '#4FF0D0', cycles = 2.5}) => {
  const f = useCurrentFrame();
  const mid = height / 2;
  const points = Array.from({length: 121}, (_, i) => {
    const x = (i / 120) * width;
    const y = mid - Math.sin((i / 120) * cycles * Math.PI * 2 + f / 40) * amp;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{overflow: 'visible'}}>
      <line x1={0} y1={mid} x2={width} y2={mid} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeDasharray="12 12" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
        style={{filter: `drop-shadow(0 0 14px ${color})`}}
      />
    </svg>
  );
};

import React from 'react';

/** Glass thermometer; `level` (0-1) sets how high the liquid reaches. */
export const Thermometer: React.FC<{level: number; height?: number; color?: string}> = ({
  level,
  height = 800,
  color = '#FF5A2E',
}) => {
  const tubeTop = 30;
  const tubeBottom = height - 150;
  const bulbY = height - 90;
  const fillTop = tubeBottom - (tubeBottom - tubeTop - 20) * Math.max(0, Math.min(1, level));
  return (
    <svg width={200} height={height} viewBox={`0 0 200 ${height}`}>
      {/* ticks */}
      {Array.from({length: 11}).map((_, i) => {
        const y = tubeBottom - ((tubeBottom - tubeTop - 20) * i) / 10;
        return <rect key={i} x={140} y={y - 2} width={i % 5 === 0 ? 44 : 26} height={5} rx={2} fill="rgba(255,255,255,0.55)" />;
      })}
      {/* glass */}
      <rect x={60} y={tubeTop} width={70} height={tubeBottom - tubeTop + 40} rx={35} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.7)" strokeWidth={6} />
      <circle cx={95} cy={bulbY} r={78} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.7)" strokeWidth={6} />
      {/* liquid */}
      <rect x={76} y={fillTop} width={38} height={tubeBottom - fillTop + 40} rx={19} fill={color} />
      <circle cx={95} cy={bulbY} r={60} fill={color} />
      <circle cx={75} cy={bulbY - 20} r={14} fill="rgba(255,255,255,0.45)" />
    </svg>
  );
};

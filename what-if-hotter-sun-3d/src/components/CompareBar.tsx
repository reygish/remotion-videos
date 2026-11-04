import React from 'react';
import {FONT} from '../config/theme';

/** Labeled horizontal bar: `fraction` (0-1) of the full width, grown by `progress` (0-1). */
export const CompareBar: React.FC<{
  label: string;
  value: string;
  fraction: number;
  progress: number;
  color: string;
  width?: number;
}> = ({label, value, fraction, progress, color, width = 880}) => (
  <div style={{width, opacity: Math.min(1, progress * 3)}}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 38,
        color: 'white',
        marginBottom: 10,
      }}
    >
      <span>{label}</span>
      <span style={{color}}>{value}</span>
    </div>
    <div style={{height: 44, borderRadius: 22, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
      <div
        style={{
          width: `${Math.max(fraction * progress * 100, progress > 0 ? 2 : 0)}%`,
          height: '100%',
          borderRadius: 22,
          background: color,
          boxShadow: `0 0 24px ${color}`,
        }}
      />
    </div>
  </div>
);

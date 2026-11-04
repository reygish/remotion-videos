import React from 'react';
import {FONT} from '../config/theme';

/** Rounded label pill; `scale` lets scenes pop it in with a spring. */
export const Chip: React.FC<{children: React.ReactNode; color: string; scale?: number; size?: number; solid?: boolean}> = ({
  children,
  color,
  scale = 1,
  size = 42,
  solid = false,
}) => (
  <div
    style={{
      display: 'inline-block',
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      color: solid ? '#140800' : 'white',
      background: solid ? color : `${color}33`,
      border: `4px solid ${color}`,
      borderRadius: 60,
      padding: '12px 32px',
      transform: `scale(${scale})`,
      opacity: Math.min(1, scale * 1.5),
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);

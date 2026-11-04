import React from 'react';
import {FONT} from '../config/theme';

/** Huge glowing number centered across the frame at `top`. */
export const BigStat: React.FC<{
  children: React.ReactNode;
  top: number;
  color: string;
  size?: number;
  opacity?: number;
  scale?: number;
}> = ({children, top, color, size = 190, opacity = 1, scale = 1}) => (
  <div
    style={{
      position: 'absolute',
      top,
      width: '100%',
      textAlign: 'center',
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: -5,
      color,
      opacity,
      transform: `scale(${scale})`,
      textShadow: `0 0 60px ${color}99`,
      fontVariantNumeric: 'tabular-nums',
    }}
  >
    {children}
  </div>
);

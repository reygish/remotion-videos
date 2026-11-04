import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';

/** Big springy title text near the top of a scene. */
export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  top?: number;
  size?: number;
  color?: string;
}> = ({children, delay = 0, top = 230, size = 96, color = 'white'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 14}});
  return (
    <div
      style={{
        position: 'absolute',
        top,
        width: '100%',
        textAlign: 'center',
        padding: '0 60px',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: -2,
        color,
        opacity: s,
        transform: `translateY(${(1 - s) * 60}px)`,
        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {children}
    </div>
  );
};

import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';

// TikTok-style captions: 3 words at a time, active word highlighted
export const Caption: React.FC<{text: string; start?: number; end: number}> = ({
  text,
  start = 6,
  end,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  if (f < start || f > end + 10) return null;
  const per = (end - start) / words.length;
  const idx = Math.min(words.length - 1, Math.floor((f - start) / per));
  const chunkStart = Math.floor(idx / 3) * 3;
  const chunk = words.slice(chunkStart, chunkStart + 3);
  const pop = spring({frame: f - (start + chunkStart * per), fps, config: {damping: 12, mass: 0.6}});
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 330,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        columnGap: 38,
        rowGap: 6,
        padding: '0 60px',
        transform: `scale(${0.8 + pop * 0.2})`,
      }}
    >
      {chunk.map((w, i) => {
        const active = chunkStart + i === idx;
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 84,
              textTransform: 'uppercase',
              color: active ? '#FFE14D' : 'white',
              WebkitTextStroke: '10px black',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 0 rgba(0,0,0,0.55)',
              transform: active ? 'scale(1.12)' : 'none',
              display: 'inline-block',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

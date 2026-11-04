import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SceneKey} from '../config/scenes';
import {hasCaptions, sceneWords} from '../lib/voiceover';

const CHUNK = 3;

/**
 * TikTok-style captions synced to the narration: 3 words at a time, with the
 * word being spoken highlighted.
 */
export const Caption: React.FC<{scene: SceneKey}> = ({scene}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = sceneWords(scene);
  if (!hasCaptions(scene) || words.length === 0) return null;
  if (f < words[0].start || f > words[words.length - 1].end + 10) return null;
  let idx = words.findIndex((w) => f < w.end);
  if (idx === -1) idx = words.length - 1;
  const chunkStart = Math.floor(idx / CHUNK) * CHUNK;
  const chunk = words.slice(chunkStart, chunkStart + CHUNK).map((w) => w.text);
  const pop = spring({frame: f - words[chunkStart].start, fps, config: {damping: 12, mass: 0.6}});
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 330,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        columnGap: 48,
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
              transform: active ? 'scale(1.08)' : 'none',
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

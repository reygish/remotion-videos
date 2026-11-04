import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Reactor} from '../components/Reactor';
import {Stars} from '../components/Stars';

/** The night of the accident: the date, a safety test that fails, and reactor No. 4 exploding. */
export const Night: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Test chip on "safety", turns red on "wrong", explosion on "exploded".
  const testAt = cue('night', 'safety');
  const wrongAt = cue('night', 'wrong');
  const boomAt = cue('night', 'exploded');
  const chip = spring({frame: f - testAt, fps, config: {damping: 12}});
  const failed = f >= wrongAt;
  const blast = interpolate(f, [boomAt, boomAt + 30], [0, 1], clamp);
  const flash = interpolate(f, [boomAt, boomAt + 3, boomAt + 18], [0, 0.85, 0], clamp);
  const shake = f >= boomAt && f < boomAt + 20 ? Math.sin(f * 9) * (20 - (f - boomAt)) : 0;
  const clock = spring({frame: f - 14, fps, config: {damping: 14}});
  return (
    <SceneFrame duration={SCENES.night} bg="linear-gradient(#090c22 0%, #1a1036 60%, #2a0f1e 100%)">
      <Stars count={80} height={900} opacity={1 - blast * 0.6} />
      <Headline top={190} size={92} color="#ffd9b0">
        <span style={{color: '#ff7a1a'}}>26 APRIL 1986</span>
        <br />
        REACTOR No. 4
      </Headline>
      <div
        style={{
          position: 'absolute',
          top: 440,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 46,
        }}
      >
        <div style={{opacity: clock, color: 'white', border: '3px solid rgba(255,255,255,0.5)', borderRadius: 50, padding: '10px 30px'}}>
          01:23 AM
        </div>
        <div
          style={{
            transform: `scale(${chip})`,
            color: failed ? 'white' : '#0b1a10',
            background: failed ? '#e0301e' : '#7dff9a',
            borderRadius: 50,
            padding: '10px 30px',
          }}
        >
          {failed ? 'TEST FAILED' : 'SAFETY TEST'}
        </div>
      </div>
      <div style={{position: 'absolute', top: 700, left: 110, transform: `translateX(${shake}px)`}}>
        <Reactor width={860} glow={failed ? 1 : 0.5} hot={failed ? 1 : 0} blast={blast} />
      </div>
      <AbsoluteFill style={{background: '#fff6e0', opacity: flash}} />
    </SceneFrame>
  );
};

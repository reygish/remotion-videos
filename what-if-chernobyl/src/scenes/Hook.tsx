import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Reactor} from '../components/Reactor';
import {RadiationSign} from '../components/RadiationSign';
import {Stars} from '../components/Stars';

/** Opening hook: title over a calm plant at night; the radiation sign rewinds away on "never". */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rewindAt = cue('hook', 'never');
  const appear = spring({frame: f - 4, fps, config: {damping: 12}});
  const rewind = interpolate(f, [rewindAt, rewindAt + 22], [0, 1], clamp);
  const chip = spring({frame: f - rewindAt - 6, fps, config: {damping: 10}});
  return (
    <SceneFrame duration={SCENES.hook} bg="radial-gradient(circle at 50% 45%, #1b2a4a 0%, #05070f 75%)">
      <Stars count={60} height={1200} />
      <div style={{position: 'absolute', top: 1190, left: 90}}>
        <Reactor width={900} glow={0.5 + rewind * 0.5} />
      </div>
      <Headline top={190} size={120}>
        WHAT IF
        <br />
        <span style={{color: '#ffc233'}}>CHERNOBYL</span>
        <br />
        NEVER HAPPENED?
      </Headline>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 30}}>
        <div
          style={{
            transform: `scale(${appear * (1 - rewind)}) rotate(${f * 2 - rewind * 540}deg)`,
            filter: 'drop-shadow(0 0 40px rgba(255,194,51,0.55))',
          }}
        >
          <RadiationSign size={360} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 30}}>
        <div
          style={{
            transform: `scale(${chip})`,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 64,
            color: '#05070f',
            background: '#5cf2ff',
            padding: '16px 40px',
            borderRadius: 18,
            boxShadow: '0 0 50px rgba(92,242,255,0.6)',
          }}
        >
          ◀◀ REWIND TO 1986
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

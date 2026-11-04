import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../config/scenes';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Sun} from '../components/Sun';
import {Starfield} from '../components/Starfield';
import {Chip} from '../components/Chip';

/** Opening hook: the title over a blazing sun, with a "+1°C" badge slamming on "degree". */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const badgeAt = cue('hook', 'degree');
  const sunIn = spring({frame: f, fps, config: {damping: 16}});
  const badge = spring({frame: f - badgeAt, fps, config: {damping: 9, mass: 0.8}});
  return (
    <SceneFrame duration={SCENES.hook} bg="radial-gradient(circle at 50% 62%, #4a1a02 0%, #1a0700 45%, #060200 100%)">
      <Starfield count={60} seed={1} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 420}}>
        <div style={{transform: `scale(${sunIn})`}}>
          <Sun size={560} heat={badge * 0.7} seed={1} />
        </div>
      </AbsoluteFill>
      <Headline top={180} size={112}>
        WHAT IF
        <br />
        THE <span style={{color: '#FFB020'}}>SUN</span> WAS
        <br />
        ONE DEGREE
        <br />
        HOTTER?
      </Headline>
      <div style={{position: 'absolute', left: 640, top: 1420, transform: `rotate(${(1 - badge) * -30 - 6}deg)`}}>
        <Chip color="#FFB020" scale={badge} size={96} solid>
          +1°C
        </Chip>
      </div>
    </SceneFrame>
  );
};

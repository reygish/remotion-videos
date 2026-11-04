import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cue} from '../lib/voiceover';
import {CYAN} from '../lib/palette';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';

/** Orbital speed: "7.9 KM/S", "faster than you can fall", then "YOU'RE IN ORBIT" as Earth drops away. */
export const Orbit: React.FC = () => {
  const speedAt = cue('orbit', '7.9');
  const perAt = cue('orbit', 'per');
  const fasterAt = cue('orbit', 'faster');
  const youreAt = cue('orbit', "You're");
  const orbitAt = cue('orbit', 'orbit');
  return (
    <AbsoluteFill>
      <Stamp at={speedAt} out={youreAt - 4} top={200} size={170}>
        7.9 <span style={{color: CYAN, fontSize: 96, WebkitTextStroke: '10px #04101C'}}>KM/S</span>
      </Stamp>
      <StatPill at={perAt} out={fasterAt - 4} top={395}>
        ORBITAL VELOCITY
      </StatPill>
      <StatPill at={fasterAt} out={youreAt - 4} top={395}>
        FASTER THAN YOU CAN FALL
      </StatPill>
      <Stamp at={youreAt} top={190} size={100}>
        YOU&apos;RE IN
      </Stamp>
      <Stamp at={orbitAt} top={295} size={210} color={CYAN} glow={CYAN} from={2.4}>
        ORBIT
      </Stamp>
    </AbsoluteFill>
  );
};

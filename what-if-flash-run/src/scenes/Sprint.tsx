import React from 'react';
import {AbsoluteFill} from 'remotion';
import {cue} from '../lib/voiceover';
import {CYAN, ORANGE} from '../lib/palette';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';

/** Usain Bolt's top speed on "Bolt's", then the still-huge trip time on "three". */
export const Sprint: React.FC = () => {
  const boltAt = cue('sprint', "Bolt's");
  const threeAt = cue('sprint', 'three');
  return (
    <AbsoluteFill>
      <StatPill at={boltAt - 4} top={190} size={44}>
        USAIN BOLT · TOP SPEED
      </StatPill>
      <Stamp at={boltAt + 2} top={300} size={170}>
        44.7 <span style={{color: CYAN, fontSize: 96, WebkitTextStroke: '10px #04101C'}}>KM/H</span>
      </Stamp>
      <Stamp at={threeAt} top={510} size={130} color={ORANGE}>
        3.7 DAYS
      </Stamp>
      <StatPill at={threeAt + 6} top={660} size={38} color={ORANGE}>
        TO NEW YORK
      </StatPill>
    </AbsoluteFill>
  );
};

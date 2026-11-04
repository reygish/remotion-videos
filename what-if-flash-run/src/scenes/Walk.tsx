import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {cue} from '../lib/voiceover';
import {clamp} from '../lib/math';
import {commas} from '../lib/format';
import {CYAN, ORANGE} from '../lib/palette';
import {DISTANCE_KM} from '../config/run';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';

/** Walking pace: the straight-line distance counts up on "kilometers", then "33 DAYS" on "33". */
export const Walk: React.FC = () => {
  const f = useCurrentFrame();
  const kmAt = cue('walk', 'kilometers');
  const lineAt = cue('walk', 'straight');
  const daysAt = cue('walk', '33');
  const km = interpolate(f, [kmAt, kmAt + 20], [0, DISTANCE_KM], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Stamp at={kmAt} top={190} size={170}>
        {commas(km)} <span style={{color: CYAN, fontSize: 110, WebkitTextStroke: '11px #04101C'}}>KM</span>
      </Stamp>
      <StatPill at={lineAt} top={385} size={40}>
        IN A STRAIGHT LINE
      </StatPill>
      <Stamp at={daysAt} top={500} size={130} color={ORANGE}>
        33 DAYS
      </Stamp>
      <StatPill at={daysAt + 6} top={650} size={38} color={ORANGE}>
        WALKING NONSTOP
      </StatPill>
    </AbsoluteFill>
  );
};

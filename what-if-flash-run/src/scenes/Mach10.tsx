import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {cue} from '../lib/voiceover';
import {clamp} from '../lib/math';
import {commas} from '../lib/format';
import {HEAT, ORANGE} from '../lib/palette';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';
import {HeatVignette} from '../components/HeatVignette';

/** Mach 10: plasma heat builds at the screen edges on "heats", ≈5,800 °C (≈6,050 K) = the Sun's surface, then "19 MIN". */
export const Mach10: React.FC = () => {
  const f = useCurrentFrame();
  const machAt = cue('mach10', 'Mach');
  const slamsAt = cue('mach10', 'slams');
  const heatsAt = cue('mach10', 'heats');
  const tempAt = cue('mach10', '6,000');
  const sunAt = cue('mach10', 'Sun');
  const minAt = cue('mach10', 'Nineteen');
  const surviveAt = cue('mach10', 'survive');
  const heat = interpolate(f, [machAt, slamsAt, heatsAt, heatsAt + 24, minAt, minAt + 30], [0.12, 0.28, 0.5, 1, 1, 0.75], clamp);
  const temp = interpolate(f, [tempAt, tempAt + 16], [1000, 5800], clamp);
  return (
    <AbsoluteFill>
      <HeatVignette intensity={heat} />
      <Stamp at={machAt} out={tempAt - 4} top={200} size={170}>
        MACH 10
      </Stamp>
      <StatPill at={slamsAt} out={tempAt - 4} top={400} color={ORANGE}>
        THE AIR SLAMS TOGETHER
      </StatPill>
      <Stamp at={tempAt} out={minAt - 4} top={190} size={170} color={HEAT} glow={ORANGE}>
        ≈{commas(temp)} °C
      </Stamp>
      <StatPill at={sunAt} out={minAt - 4} top={390} color={ORANGE}>
        = SURFACE OF THE SUN
      </StatPill>
      <Stamp at={minAt} top={190} size={190}>
        19 MIN
      </Stamp>
      <StatPill at={surviveAt} top={400} color={ORANGE}>
        …IF YOU SURVIVE
      </StatPill>
    </AbsoluteFill>
  );
};

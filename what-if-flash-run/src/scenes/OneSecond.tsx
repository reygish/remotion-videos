import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {cue} from '../lib/voiceover';
import {shake} from '../lib/shake';
import {CYAN, HEAT, ORANGE} from '../lib/palette';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';
import {FlashOverlay} from '../components/FlashOverlay';
import {SpeedStreaks} from '../components/SpeedStreaks';

/** The full Flash run in one second: absurd Mach, crushing g, then the stop flash and "10× HIROSHIMA". */
export const OneSecond: React.FC = () => {
  const f = useCurrentFrame();
  const oneAt = cue('onesecond', 'one');
  const secondAt = cue('onesecond', 'second');
  const machAt = cue('onesecond', '11,000');
  const lightAt = cue('onesecond', 'speed');
  const gAt = cue('onesecond', '250,000');
  const releaseAt = cue('onesecond', 'release');
  const tenAt = cue('onesecond', '10');
  const jolt = shake(f, releaseAt, 34, 24);
  return (
    <AbsoluteFill>
      <SpeedStreaks at={oneAt} top={150} height={1300} dur={40} count={22} />
      <AbsoluteFill style={{transform: `translate(${jolt.x}px, ${jolt.y}px)`}}>
        <Stamp at={oneAt} out={machAt - 4} top={200} size={160}>
          1 SECOND
        </Stamp>
        <StatPill at={secondAt + 4} out={machAt - 4} top={385}>
          3,936 KM PER SECOND
        </StatPill>
        <Stamp at={machAt - 2} out={gAt - 4} top={180} size={100}>
          MACH
        </Stamp>
        <Stamp at={machAt} out={gAt - 4} top={278} size={200} color={CYAN} glow={CYAN} from={2.4}>
          11,474
        </Stamp>
        <StatPill at={lightAt} out={gAt - 4} top={500}>
          1.3% OF LIGHT SPEED
        </StatPill>
        <Stamp at={gAt} out={releaseAt - 4} top={200} size={170} color={ORANGE} glow={ORANGE}>
          250,000 g
        </Stamp>
        <StatPill at={gAt + 6} out={releaseAt - 4} top={390} color={ORANGE}>
          HUGGING EARTH&apos;S CURVE
        </StatPill>
        <Stamp at={tenAt} top={170} size={220} color={HEAT} glow={ORANGE} from={2.6}>
          10×
        </Stamp>
        <Stamp at={tenAt + 6} top={400} size={120}>
          HIROSHIMA
        </Stamp>
      </AbsoluteFill>
      <FlashOverlay at={releaseAt} peak={0.85} hold={2} fade={10} />
    </AbsoluteFill>
  );
};

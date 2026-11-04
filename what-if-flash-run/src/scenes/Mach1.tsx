import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {cue} from '../lib/voiceover';
import {shakeAll} from '../lib/shake';
import {CYAN} from '../lib/palette';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';
import {ShockRing} from '../components/ShockRing';
import {BoomBurst} from '../components/BoomBurst';

/** Mach 1: speed stat, "SOUND BARRIER" with a shock ring + shake on "barrier", BOOM bursts on "boom", "3 HOURS" on "three". */
export const Mach1: React.FC = () => {
  const f = useCurrentFrame();
  const speedAt = cue('mach1', '1,235');
  const soundAt = cue('mach1', 'sound');
  const barrierAt = cue('mach1', 'barrier');
  const boomAt = cue('mach1', 'boom');
  const threeAt = cue('mach1', 'three');
  const jolt = shakeAll(f, [
    {at: barrierAt, amp: 34, dur: 22},
    {at: boomAt, amp: 20, dur: 16},
  ]);
  return (
    <AbsoluteFill>
      <ShockRing at={barrierAt} cx={540} cy={880} />
      <AbsoluteFill style={{transform: `translate(${jolt.x}px, ${jolt.y}px)`}}>
        <Stamp at={speedAt} out={soundAt - 4} top={200} size={160}>
          1,235 <span style={{color: CYAN, fontSize: 90, WebkitTextStroke: '9px #04101C'}}>KM/H</span>
        </Stamp>
        <StatPill at={speedAt + 10} out={soundAt - 4} top={385}>
          = MACH 1
        </StatPill>
        <Stamp at={soundAt} out={threeAt - 6} top={180} size={150}>
          SOUND
        </Stamp>
        <Stamp at={barrierAt} out={threeAt - 6} top={330} size={150} color={CYAN} glow={CYAN} from={2.4}>
          BARRIER
        </Stamp>
        <Stamp at={threeAt} top={200} size={170}>
          3 HOURS
        </Stamp>
        <StatPill at={threeAt + 6} top={390}>
          TO NEW YORK
        </StatPill>
      </AbsoluteFill>
      <BoomBurst at={boomAt} x={540} y={900} />
      <BoomBurst at={boomAt + 9} x={250} y={1170} size={0.45} tilt={10} />
      <BoomBurst at={boomAt + 15} x={840} y={700} size={0.4} tilt={-14} />
    </AbsoluteFill>
  );
};

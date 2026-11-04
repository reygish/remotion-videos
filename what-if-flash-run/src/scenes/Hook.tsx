import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {cue} from '../lib/voiceover';
import {shake} from '../lib/shake';
import {CYAN} from '../lib/palette';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';
import {SpeedStreaks} from '../components/SpeedStreaks';
import {FlashOverlay} from '../components/FlashOverlay';

/** Title card: "WHAT IF YOU RAN / LIKE THE / FLASH?" slams in word by word, then the route subtitle. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const whatAt = cue('hook', 'What');
  const likeAt = cue('hook', 'like');
  const flashAt = cue('hook', 'Flash');
  const losAt = cue('hook', 'Los');
  const jolt = shake(f, flashAt, 30, 18);
  return (
    <AbsoluteFill>
      <SpeedStreaks at={flashAt - 2} top={380} height={300} dur={22} />
      <AbsoluteFill style={{transform: `translate(${jolt.x}px, ${jolt.y}px)`}}>
        <Stamp at={whatAt} top={190} size={92}>
          WHAT IF YOU RAN
        </Stamp>
        <Stamp at={likeAt} top={298} size={92}>
          LIKE THE
        </Stamp>
        <Stamp at={flashAt} top={398} size={230} color={CYAN} glow={CYAN} from={2.6}>
          FLASH?
        </Stamp>
        <StatPill at={losAt} top={672} size={46}>
          LOS ANGELES → NEW YORK
        </StatPill>
      </AbsoluteFill>
      <FlashOverlay at={flashAt} peak={0.35} hold={1} fade={8} />
    </AbsoluteFill>
  );
};

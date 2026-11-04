import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {cue} from '../lib/voiceover';
import {CYAN} from '../lib/palette';
import {Stamp} from '../components/Stamp';
import {StatPill} from '../components/StatPill';
import {PlaneIcon} from '../components/PlaneIcon';

/** End card: the punchline (take a plane, with an SVG plane flying in), "5 HOURS", then the follow button. */
export const Ending: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fastestAt = cue('ending', 'fastest');
  const takeAt = cue('ending', 'Take');
  const fiveAt = cue('ending', 'Five');
  const followAt = cue('ending', 'Follow');
  const fly = spring({frame: f - takeAt + 4, fps, config: {damping: 14}});
  const follow = spring({frame: f - followAt, fps, config: {damping: 9}});
  const bob = Math.sin(f / 9) * 6;
  return (
    <AbsoluteFill>
      <StatPill at={fastestAt} out={takeAt - 6} top={220} size={46}>
        FASTEST WAY TO NEW YORK?
      </StatPill>
      {f >= takeAt - 4 && (
        <div
          style={{
            position: 'absolute',
            top: 160 + bob,
            left: interpolate(fly, [0, 1], [-260, 540 - 110]),
            transform: `rotate(${interpolate(fly, [0, 1], [-14, -6])}deg)`,
            filter: `drop-shadow(0 0 24px ${CYAN})`,
          }}
        >
          <PlaneIcon size={220} />
        </div>
      )}
      <Stamp at={takeAt} top={395} size={106}>
        TAKE A PLANE
      </Stamp>
      <Stamp at={fiveAt} top={530} size={150} color={CYAN} glow={CYAN}>
        5 HOURS
      </Stamp>
      {f >= followAt && (
        <AbsoluteFill style={{transformOrigin: '540px 1340px', transform: `scale(${1 + Math.sin(f / 6) * 0.03 * follow}) rotate(-2deg)`}}>
          <StatPill at={followAt} top={1290} size={50} color={CYAN} solid>
            FOLLOW FOR MORE WHAT-IFS
          </StatPill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

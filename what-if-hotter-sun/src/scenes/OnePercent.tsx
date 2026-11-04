import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {BigStat} from '../components/BigStat';
import {Chip} from '../components/Chip';
import {CompareBar} from '../components/CompareBar';
import {Earth} from '../components/Earth';

const ORANGE = '#FF8A3D';

/** 1% hotter: +4% output, a climate push dwarfing ours, and Earth's ice caps shrinking as seas rise. */
export const OnePercent: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // +58 °C on "hotter", +4% counts on "Output"→"4", push bars on "push"/"several times", effects from "Several degrees".
  const hotterAt = cue('onepercent', 'hotter');
  const outFrom = cue('onepercent', 'Output');
  const outTo = cue('onepercent', '4');
  const pushAt = cue('onepercent', 'push');
  const manyAt = cue('onepercent', 'several', 0);
  const severalAt = cue('onepercent', 'several', 1);
  const meltAt = cue('onepercent', 'melting');
  const seasAt = cue('onepercent', 'rising');
  const plus58 = spring({frame: f - hotterAt, fps, config: {damping: 12}});
  const out = interpolate(f, [outFrom, outTo + 6], [0, 4], {...clamp, easing: Easing.out(Easing.cubic)});
  const outIn = spring({frame: f - outFrom, fps, config: {damping: 14}});
  const bars = interpolate(f, [severalAt - 12, severalAt], [1, 0], clamp);
  const pop = (at: number) => spring({frame: f - at, fps, config: {damping: 11}});
  const ice = interpolate(f, [meltAt - 10, seasAt + 30], [1, 0.25], clamp);
  const sea = interpolate(f, [seasAt - 5, seasAt + 30], [0, 1], clamp);
  return (
    <SceneFrame duration={SCENES.onepercent} bg="linear-gradient(#081a33 0%, #1d1430 50%, #401607 100%)">
      <Headline top={190} size={130}>
        <span style={{color: ORANGE}}>1%</span> HOTTER?
      </Headline>
      <div style={{position: 'absolute', top: 350, width: '100%', textAlign: 'center'}}>
        <Chip color={ORANGE} scale={plus58} size={44}>
          ≈ +58°C
        </Chip>
      </div>
      <BigStat top={460} color="#FFB36B" size={190} opacity={outIn} scale={0.7 + outIn * 0.3}>
        +{out.toFixed(0)}%
      </BigStat>
      <div style={{position: 'absolute', top: 655, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 44, color: 'white', opacity: outIn}}>
        more energy from the Sun
      </div>
      {/* the climate push compared with ours, swapped for the consequences on "Several" */}
      <div style={{position: 'absolute', top: 750, left: 100, display: 'flex', flexDirection: 'column', gap: 18, opacity: bars}}>
        <CompareBar label="Humans' push so far" value="1×" fraction={0.28} progress={interpolate(f, [pushAt, pushAt + 15], [0, 1], clamp)} color="#FF4D6A" />
        <CompareBar label="A 1% hotter Sun" value="~3.5×" fraction={1} progress={interpolate(f, [manyAt, manyAt + 25], [0, 1], clamp)} color={ORANGE} />
      </div>
      <div style={{position: 'absolute', top: 770, width: '100%', display: 'flex', justifyContent: 'center', gap: 18}}>
        <Chip color="#FF5A3D" scale={pop(severalAt)} size={38} solid>
          SEVERAL °C
        </Chip>
        <Chip color="#9AE6FF" scale={pop(meltAt)} size={38}>
          ICE MELTS
        </Chip>
        <Chip color="#4FA8FF" scale={pop(seasAt)} size={38}>
          SEAS RISE
        </Chip>
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 270}}>
        <div style={{opacity: 1 - bars, transform: `scale(${0.8 + 0.2 * (1 - bars)})`}}>
          <Earth size={440} ice={ice} sea={sea} />
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

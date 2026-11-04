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
import {Earth} from '../components/Earth';
import {Steam} from '../components/Steam';

const SULFUR = '#FFD84D';

/** 10% hotter: +46% output; Earth turns into a hazy Venus and steam boils off. */
export const TenPercent: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // +46% counts from "soars" to "46", Venus haze from "runaway", steam on "boil".
  const outFrom = cue('tenpercent', 'soars');
  const outTo = cue('tenpercent', '46');
  const runawayAt = cue('tenpercent', 'runaway');
  const venusAt = cue('tenpercent', 'Venus');
  const boilAt = cue('tenpercent', 'boil');
  const out = interpolate(f, [outFrom, outTo + 10], [0, 46], {...clamp, easing: Easing.out(Easing.cubic)});
  const outIn = spring({frame: f - outFrom, fps, config: {damping: 14}});
  const venus = interpolate(f, [runawayAt, venusAt + 20], [0, 1], clamp);
  const steam = interpolate(f, [boilAt - 10, boilAt + 15], [0, 1], clamp);
  const shake = Math.sin(f * 1.7) * 4 * steam;
  return (
    <SceneFrame duration={SCENES.tenpercent} bg="radial-gradient(circle at 50% 60%, #6b4a0e 0%, #2a1a05 55%, #0e0802 100%)">
      <Headline top={190} size={130}>
        <span style={{color: SULFUR}}>10%</span> HOTTER?
      </Headline>
      <BigStat top={380} color={SULFUR} size={190} opacity={outIn} scale={0.7 + outIn * 0.3}>
        +{Math.round(out)}%
      </BigStat>
      <div style={{position: 'absolute', top: 580, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 44, color: 'white', opacity: outIn}}>
        more energy from the Sun
      </div>
      <div style={{position: 'absolute', top: 680, width: '100%', display: 'flex', justifyContent: 'center', gap: 18}}>
        <Chip color="#FF7A2E" scale={spring({frame: f - runawayAt, fps, config: {damping: 11}})} size={38} solid>
          RUNAWAY GREENHOUSE
        </Chip>
        <Chip color={SULFUR} scale={spring({frame: f - venusAt, fps, config: {damping: 11}})} size={38}>
          LIKE VENUS
        </Chip>
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: 220}}>
        <div style={{transform: `translateX(${shake}px)`}}>
          <Earth size={460} ice={1 - venus} venus={venus} sea={venus * 0.4} />
        </div>
      </AbsoluteFill>
      <Steam x={340} y={890} width={400} amount={steam} rise={120} seed={3} />
    </SceneFrame>
  );
};

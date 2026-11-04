import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {BigStat} from '../components/BigStat';
import {Chip} from '../components/Chip';
import {Sun} from '../components/Sun';
import {Starfield} from '../components/Starfield';
import {Steam} from '../components/Steam';

const GOLD = '#FFB020';
const AXIS_X = 150;
const AXIS_W = 760;
const AXIS_Y = 1000;

/** The twist: the Sun brightens over a billion-year timeline, oceans steam, then the end card. */
export const Ending: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // +1% lands on "100" million; the run to +10% spans "billion"→"brighter"; oceans steam on "oceans";
  // end card on "So", follow button on "Follow".
  const hundredAt = cue('ending', '100');
  const millionAt = cue('ending', 'million');
  const billionAt = cue('ending', 'billion');
  const brighterAt = cue('ending', 'brighter');
  const oceansAt = cue('ending', 'oceans');
  const endAt = cue('ending', 'So');
  const followAt = cue('ending', 'Follow');
  const t =
    f < billionAt
      ? interpolate(f, [hundredAt, millionAt + 8], [0, 0.1], clamp)
      : interpolate(f, [billionAt, brighterAt + 10], [0.1, 1], clamp);
  const timeline = spring({frame: f - 10, fps, config: {damping: 16}});
  const oceans = spring({frame: f - oceansAt, fps, config: {damping: 12}});
  const end = spring({frame: f - endAt, fps, config: {damping: 13}});
  const follow = spring({frame: f - followAt, fps, config: {damping: 10}});
  const sunX = AXIS_X + t * AXIS_W;
  const yearsLabel = f < billionAt ? 'every 100 million years' : 'in about a billion years';
  return (
    <SceneFrame duration={SCENES.ending} bg="radial-gradient(circle at 50% 38%, #3a1450 0%, #14061e 65%, #070209 100%)">
      <Starfield count={70} seed={9} />
      <div style={{opacity: 1 - end}}>
        <Headline top={190} size={96}>
          THE SUN IS
          <br />
          <span style={{color: GOLD}}>BRIGHTENING</span>
        </Headline>
        <BigStat top={450} color={GOLD} size={170} opacity={timeline}>
          +{Math.round(t * 10)}%
        </BigStat>
        <div style={{position: 'absolute', top: 630, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 46, color: '#E6CCFF', opacity: timeline}}>
          brighter {yearsLabel}
        </div>
        {/* timeline */}
        <div style={{position: 'absolute', top: 730 - t * 40, left: sunX - (180 + t * 60) / 2, opacity: timeline}}>
          <Sun size={180 + t * 60} heat={t} seed={4} />
        </div>
        <div style={{position: 'absolute', top: AXIS_Y, left: AXIS_X, width: AXIS_W * timeline, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.6)'}} />
        {[
          {at: 0, label: 'NOW', above: false},
          {at: 0.1, label: '100M', above: true},
          {at: 1, label: '1B YEARS', above: false},
        ].map(({at, label, above}) => (
          <div
            key={label}
            style={{
              position: 'absolute',
              top: above ? AXIS_Y - 92 : AXIS_Y - 10,
              display: 'flex',
              flexDirection: above ? 'column-reverse' : 'column',
              left: AXIS_X + at * AXIS_W - 150,
              width: 300,
              textAlign: 'center',
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 34,
              color: 'white',
              opacity: timeline,
            }}
          >
            <div style={{width: 8, height: 30, margin: above ? '12px auto 0' : '0 auto 12px', background: 'white', borderRadius: 4}} />
            {label}
          </div>
        ))}
        {/* oceans start to evaporate */}
        <svg width={1080} height={150} viewBox="0 0 1080 150" style={{position: 'absolute', top: 1190, opacity: oceans}}>
          <defs>
            <linearGradient id="ending-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5EB0FF" />
              <stop offset="100%" stopColor="#123E8C" />
            </linearGradient>
          </defs>
          <path
            d={`M100 ${40 + oceans * 40} ${Array.from({length: 11})
              .map((_, i) => `Q ${100 + i * 80 + 40} ${40 + oceans * 40 + Math.sin(f / 7 + i) * 22} ${100 + (i + 1) * 80} ${40 + oceans * 40}`)
              .join(' ')} L980 150 Q540 130 100 150 Z`}
            fill="url(#ending-sea)"
          />
        </svg>
        <Steam x={140} y={1250} width={800} amount={oceans} rise={70} seed={5} />
        <div style={{position: 'absolute', top: 1100, width: '100%', textAlign: 'center'}}>
          <Chip color="#5EB0FF" scale={oceans} size={40}>
            OCEANS START TO EVAPORATE
          </Chip>
        </div>
      </div>
      {/* end card */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', top: -60}}>
        <div style={{transform: `scale(${end})`, opacity: end, textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: 'white'}}>
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: 20}}>
            <Sun size={260} seed={2} />
          </div>
          <div style={{fontSize: 110, letterSpacing: -3, lineHeight: 1.05}}>ONE DEGREE?</div>
          <div style={{fontSize: 110, letterSpacing: -3, lineHeight: 1.05, color: GOLD}}>
            BARELY
            <br />
            NOTICEABLE
          </div>
          <div
            style={{
              marginTop: 50,
              display: 'inline-block',
              fontSize: 54,
              background: GOLD,
              color: '#140800',
              padding: '18px 40px',
              borderRadius: 20,
              opacity: follow,
              transform: `rotate(-2deg) scale(${follow * (1 + Math.sin(f / 6) * 0.03)})`,
            }}
          >
            FOLLOW FOR MORE WHAT-IFS
          </div>
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

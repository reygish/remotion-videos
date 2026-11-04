import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp, rand} from '../lib/math';
import {project} from '../lib/geo';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {WorldMap} from '../components/WorldMap';

/** Rough locations of regions with nuclear plants (longitude, latitude). */
const PLANTS: [number, number][] = [
  [-80, 35], [-88, 41], [-75, 41], [-120, 36], [-79, 44], [2, 47], [5, 44], [0, 49], [-1, 52], [9, 50],
  [16, 59], [25, 61], [-4, 40], [30, 51], [36, 55], [35, 48], [139, 37], [130, 34], [129, 36], [74, 20],
];
/** Extra plants that might have been built in the alternate timeline. */
const EXTRA: [number, number][] = [
  [-97, 31], [-105, 40], [-90, 33], [12, 44], [10, 46], [21, 52], [26, 45], [45, 55], [60, 56], [115, 30],
  [118, 38], [77, 28], [-46, -23], [28, -26], [151, -33], [-70, -33], [53, 33], [32, 39], [-100, 22], [105, 15],
];
const ITALY = project(12.5, 42.5);

/** Nuclear fear: plants glow on a world map, Italy votes out, extra reactors pop in and coal shrinks. */
export const Nuclear: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const italyAt = cue('nuclear', 'Italy');
  const moreAt = cue('nuclear', 'more');
  const coalAt = cue('nuclear', 'coal');
  const italyCard = spring({frame: f - italyAt, fps, config: {damping: 12}});
  const moreCard = spring({frame: f - moreAt, fps, config: {damping: 12}});
  const coalShow = interpolate(f, [coalAt - 10, coalAt + 5], [0, 1], clamp);
  const coal = interpolate(f, [coalAt + 5, coalAt + 40], [1, 0.62], clamp);
  const pulse = (i: number) => 0.75 + Math.sin(f / 6 + i) * 0.25;
  return (
    <SceneFrame duration={SCENES.nuclear} bg="radial-gradient(circle at 50% 40%, #0d2c57 0%, #020814 75%)">
      <Headline top={190} size={84}>
        THE WORLD FEARED
        <br />
        <span style={{color: '#3ff0ff'}}>NUCLEAR POWER</span>
      </Headline>
      <div style={{position: 'absolute', top: 470, left: 40}}>
        <WorldMap width={1000}>
          {PLANTS.map(([lon, lat], i) => {
            const [x, y] = project(lon, lat);
            const s = interpolate(f, [8 + i * 2, 18 + i * 2], [0, 1], clamp);
            return <circle key={i} cx={x} cy={y} r={9 * s} fill="#3ff0ff" opacity={pulse(i)} />;
          })}
          {EXTRA.map(([lon, lat], i) => {
            const [x, y] = project(lon, lat);
            const s = spring({frame: f - moreAt - rand(i) * 20, fps, config: {damping: 10}});
            return <circle key={i} cx={x} cy={y} r={11 * s} fill="#7dff9a" opacity={pulse(i + 3)} style={{filter: 'drop-shadow(0 0 6px #7dff9a)'}} />;
          })}
          {/* Italy marker */}
          <circle cx={ITALY[0]} cy={ITALY[1]} r={14 * italyCard} fill="none" stroke="#ff5a4a" strokeWidth={5} />
          <circle cx={ITALY[0]} cy={ITALY[1]} r={30 * italyCard} fill="none" stroke="#ff5a4a" strokeWidth={3} opacity={0.5} />
        </WorldMap>
      </div>
      {/* Italy card, then the "more reactors" card */}
      <div
        style={{
          position: 'absolute',
          top: 900,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 46,
        }}
      >
        {f < moreAt ? (
          <div style={{transform: `scale(${italyCard})`, background: '#ff5a4a', color: 'white', borderRadius: 24, padding: '16px 34px'}}>
            ITALY 1987: VOTES TO QUIT NUCLEAR
          </div>
        ) : (
          <div style={{transform: `scale(${moreCard})`, background: '#7dff9a', color: '#04140a', borderRadius: 24, padding: '16px 34px'}}>
            + MORE REACTORS IN THE 80s &amp; 90s?
          </div>
        )}
      </div>
      {/* coal bar */}
      <div style={{position: 'absolute', top: 1060, left: 110, width: 860, opacity: coalShow, fontFamily: FONT}}>
        <div style={{fontWeight: 800, fontSize: 44, color: 'white', marginBottom: 16}}>Fossil fuels burned</div>
        <div style={{height: 64, background: 'rgba(255,255,255,0.1)', borderRadius: 32, overflow: 'hidden'}}>
          <div style={{width: `${coal * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6b6b6b, #a39a8f)', borderRadius: 32}} />
        </div>
        <div style={{fontWeight: 700, fontSize: 38, color: '#9fd8ff', marginTop: 14}}>Maybe less CO₂. Nobody knows for sure.</div>
      </div>
    </SceneFrame>
  );
};

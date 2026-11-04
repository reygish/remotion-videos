import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../config/theme';
import {SCENES} from '../config/scenes';
import {clamp} from '../lib/math';
import {cue} from '../lib/voiceover';
import {SceneFrame} from '../components/SceneFrame';
import {Headline} from '../components/Headline';
import {Counter} from '../components/Counter';
import {FerrisWheel} from '../components/FerrisWheel';
import {Skyline} from '../components/Skyline';
import {ZoneMap} from '../components/ZoneMap';

/** Alternate timeline: Pripyat at sunrise with its Ferris wheel turning, then the zone turns to farmland. */
export const Pripyat: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Windows light up on "living"; the map takes over on "exclusion" and turns green on "farmland".
  const livingAt = cue('pripyat', 'living');
  const zoneAt = cue('pripyat', 'exclusion');
  const farmAt = cue('pripyat', 'farmland');
  const lit = interpolate(f, [livingAt - 20, livingAt + 20], [0.1, 0.9], clamp);
  const toMap = interpolate(f, [zoneAt - 6, zoneAt + 10], [0, 1], clamp);
  const map = spring({frame: f - zoneAt, fps, config: {damping: 13}});
  const revive = interpolate(f, [farmAt - 4, farmAt + 24], [0, 1], clamp);
  return (
    <SceneFrame duration={SCENES.pripyat} bg="linear-gradient(#24477a 0%, #7a5aa0 38%, #f0896a 68%, #ffcf8a 100%)">
      {/* sun */}
      <div
        style={{
          position: 'absolute',
          left: 380,
          top: 1180 - interpolate(f, [0, SCENES.pripyat], [0, 120]),
          width: 320,
          height: 320,
          borderRadius: 160,
          background: 'radial-gradient(circle, #fff3c4 0%, #ffd27a 55%, rgba(255,210,122,0) 72%)',
        }}
      />
      {/* the living city */}
      <AbsoluteFill style={{opacity: 1 - toMap}}>
        <div style={{position: 'absolute', top: 460, left: 230}}>
          <FerrisWheel size={620} angle={f * 0.7} lights={0.4 + lit * 0.6} />
        </div>
        <Skyline lit={lit} />
        <div style={{opacity: 1 - toMap}}>
          <Headline top={190} size={100}>
            PRIPYAT,
            <br />
            <span style={{color: '#ffe066'}}>STILL ALIVE</span>
          </Headline>
        </div>
      </AbsoluteFill>
      {/* the exclusion zone becomes farmland */}
      <AbsoluteFill style={{opacity: toMap}}>
        <Headline top={190} size={92} delay={zoneAt}>
          THE ZONE?
          <br />
          <span style={{color: revive > 0.5 ? '#c8ff8a' : '#ffc233'}}>{revive > 0.5 ? 'FARMLAND' : 'OFF LIMITS'}</span>
        </Headline>
        <div style={{position: 'absolute', top: 440, width: '100%', display: 'flex', justifyContent: 'center'}}>
          <div style={{transform: `scale(${map})`}}>
            <ZoneMap size={660} revive={revive} />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 1120,
            width: '100%',
            textAlign: 'center',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 84,
            color: 'white',
            textShadow: '0 6px 24px rgba(0,0,0,0.45)',
            opacity: map,
          }}
        >
          ≈ <Counter value={2600} from={zoneAt} to={zoneAt + 25} /> km²
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};

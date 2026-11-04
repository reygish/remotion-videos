import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CameraRig} from '../CameraRig';
import {SceneFog} from '../SceneFog';
import {Sky} from '../ground/Sky';
import {SpeedStreaks} from '../effects/SpeedStreaks';
import {ShockRing} from '../effects/ShockRing';
import {ShockSphere} from '../effects/ShockSphere';
import {BEATS, CITY_START} from '../beats';
import {mix, smooth} from '../../lib/timeline';
import {cityPalette} from './cityPalette';
import {CitySkyline} from './CitySkyline';
import {CityWater} from './CityWater';
import {Promenade} from './Promenade';
import {ApproachBlocks} from './ApproachBlocks';
import {Airplane} from './Airplane';
import {Contrail} from './Contrail';

const APPROACH = 4200;
const STOP = BEATS.stopping + 8;

/** Camera distance from the stopping point: a hard deceleration that lands on "stopping". */
const approachAt = (f: number) => {
  const t = Math.min(1, Math.max(0, (f - CITY_START) / (STOP - CITY_START)));
  return APPROACH * Math.pow(1 - t, 3.2);
};

/** Arrival in New York at dusk, the release flash + shockwave, then a calm sunset with a plane passing. */
export const CityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / 30;
  const look = cityPalette(frame);
  const z = approachAt(frame);
  const motion = approachAt(frame - 1) - z;

  // Shockwave on "release": a hemisphere of light and a dust ring racing outward.
  const tr = frame - BEATS.release;
  const shockR = tr < 0 ? 0 : 3800 * (1 - Math.exp(-tr / 45)) + 5;
  const shockA = tr < 0 ? 0 : smooth(-1, 2, tr) * (1 - smooth(30, 115, tr));
  const shake = 0.02 * Math.exp(-Math.max(0, tr) / 12) * (tr >= 0 ? 1 : 0) + 0.004 * smooth(30, 0, frame - STOP) ;

  // Calm ending: breathing sway and a slow push in.
  const calm = smooth(BEATS.ending - 30, BEATS.ending + 30, frame);
  const sway = Math.sin(time * 1.1) * 0.004;
  const pitch = 0.075 + sway + shake * Math.sin(frame * 2.7);
  const yaw = 0.02 * Math.sin(time * 0.4) * calm + shake * Math.sin(frame * 3.3 + 1);
  const fov = mix(70, 64, smooth(STOP, BEATS.end, frame)) + Math.min(30, motion / 20);

  // Airliner crossing left → right, mid-frame on "plane".
  const planeX = mix(-560, 600, (frame - (BEATS.plane - 110)) / 230);
  const planeOn = frame > BEATS.ending - 40;

  return (
    <>
      <CameraRig position={[0, 1.7 + Math.sin(time * 1.3) * 0.01, z]} pitch={pitch} yaw={yaw} roll={shake * Math.sin(frame * 2.1)} fov={fov} far={20000} />
      <SceneFog color={look.fog} density={look.fogDensity} />
      <hemisphereLight args={[look.zenith.clone().lerp(look.horizon, 0.5), look.facade, 1.2]} />
      <directionalLight position={[look.sunDir.x * 1000, look.sunDir.y * 1000 + 200, look.sunDir.z * 1000]} color={look.sun} intensity={1.6} />
      <Sky zenith={look.zenith} horizon={look.horizon} sunColor={look.sun} sunDir={look.sunDir} sunSize={0.0012} band={0.45} glow={1.4} position={[0, 1.7, z]} />
      <Promenade />
      <CityWater look={look} time={time} />
      <CitySkyline look={look} />
      {z > 1 && <ApproachBlocks look={look} motion={motion} />}
      <SpeedStreaks dist={-z} motion={motion} opacity={Math.min(1, motion / 60)} color="#ffe2b0" eyeY={1.7} />
      <ShockSphere radius={shockR} opacity={shockA * 0.45} time={time} color="#fff3e0" />
      <ShockRing radius={shockR * 0.97} height={30 + shockR * 0.06} opacity={Math.min(1, shockA * 1.4)} time={time} color="#fff0d8" y={-6} />
      {planeOn && (
        <>
          <Airplane position={[planeX, 430, -1300]} frame={frame} />
          <Contrail length={Math.max(1, planeX + 900)} color="#ffd9c4" opacity={0.45} position={[planeX - 60, 430, -1300]} />
        </>
      )}
    </>
  );
};

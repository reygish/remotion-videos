import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CameraRig} from '../CameraRig';
import {SceneFog} from '../SceneFog';
import {worldAt} from '../speedProfile';
import {BEATS} from '../beats';
import {smooth} from '../../lib/timeline';
import {skyPalette} from './skyPalette';
import {Sky} from './Sky';
import {Ground} from './Ground';
import {RoadSign} from './RoadSign';
import {TelephonePoles} from './TelephonePoles';
import {Cacti} from './Cacti';
import {Rocks} from './Rocks';
import {Mountains} from './Mountains';
import {FarmTrees} from './FarmTrees';
import {TownBuildings} from './TownBuildings';
import {WaterTowers} from './WaterTowers';
import {SpeedStreaks} from '../effects/SpeedStreaks';
import {VaporCone} from '../effects/VaporCone';
import {ShockRing} from '../effects/ShockRing';
import {Stars} from '../effects/Stars';

/** Shock ring timeline: grows fast, then fades. */
const ring = (frame: number, start: number, maxR: number, maxH: number, life: number) => {
  const t = frame - start;
  if (t < 0 || t > life) return {radius: 0, height: 0, opacity: 0};
  return {radius: maxR * (1 - Math.exp(-t / (life * 0.3))) + 3, height: maxH * (0.3 + 0.7 * (t / life)), opacity: 1 - smooth(life * 0.3, life, t)};
};

/** First-person run across the USA: desert dawn → farmland → Mach-10 heat → climb toward orbit. */
export const GroundScene: React.FC = () => {
  const frame = useCurrentFrame();
  const w = worldAt(frame);
  const look = skyPalette(w);
  const sun = look.sunDir.clone().multiplyScalar(1000);
  const cam = {x: w.x, y: w.y, pitch: w.pitch, yaw: w.yaw};

  // Sonic boom on "barrier": the vapour cone flashes, then slides back past us.
  const tb = frame - BEATS.barrier;
  const vapour = 0.85 * smooth(-3, 1, tb) * (1 - smooth(10, 34, tb));
  const boom = ring(frame, BEATS.barrier, 900, 60, 60);
  const townBoom = ring(frame, BEATS.boom, 500, 35, 45);
  const streaks = 0.35 * smooth(120, 343, w.speed) + 0.55 * smooth(800, 2400, w.speed);
  const streakColor = w.heat > 0.3 ? '#ffb27a' : '#ffffff';
  const sink = smooth(BEATS.barrier, BEATS.pass + 20, frame);

  return (
    <>
      <CameraRig position={[w.x, w.y, 0]} pitch={w.pitch} yaw={w.yaw} roll={w.roll} fov={w.fov} far={120000} />
      <SceneFog color={look.fog} density={look.fogDensity} />
      <hemisphereLight args={[look.zenith.clone().lerp(look.horizon, 0.6), look.ground, 1.3]} />
      <directionalLight position={[sun.x, sun.y, sun.z]} color={look.sun} intensity={1.8} />
      <Sky
        zenith={look.zenith}
        horizon={look.horizon}
        sunColor={look.sun}
        sunDir={look.sunDir}
        band={0.55 - 0.35 * w.space}
        dip={Math.sin(Math.acos(1 / (1 + (w.y - 1.7) * w.curve)))}
        glow={1 - 0.8 * w.day}
        position={[0, w.y, 0]}
      />
      <Stars opacity={smooth(0.4, 0.9, w.space)} radius={90} position={[0, w.y, 0]} minElevation={0.02} />
      <Ground w={w} look={look} />
      <Mountains sink={sink} />
      <RoadSign dist={w.dist} />
      <TelephonePoles dist={w.dist} speed={w.speed} />
      <Cacti dist={w.dist} speed={w.speed} />
      <Rocks dist={w.dist} speed={w.speed} />
      <FarmTrees dist={w.dist} speed={w.speed} />
      <TownBuildings dist={w.dist} speed={w.speed} />
      <WaterTowers dist={w.dist} speed={w.speed} />
      <ShockRing {...boom} time={frame / 30} color="#e6d6bb" />
      <ShockRing {...townBoom} time={frame / 30} color="#e6d6bb" />
      <SpeedStreaks dist={w.dist} motion={w.motion} opacity={streaks * (1 - w.space)} color={streakColor} eyeY={w.y} />
      <VaporCone opacity={vapour} slide={6 * smooth(6, 34, tb)} time={frame / 30} color="#ffffff" camera={cam} />
      <VaporCone opacity={0.6 * w.heat} slide={0.8} time={frame / 30} color="#ff8a3a" front={0} rear={1} camera={cam} />
    </>
  );
};

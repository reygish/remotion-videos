import React from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {CameraRig} from '../CameraRig';
import {Sky} from '../ground/Sky';
import {BEATS, CITY_START} from '../beats';
import {smooth} from '../../lib/timeline';
import {TunnelStreaks} from './TunnelStreaks';

const AHEAD = new THREE.Vector3(0, 0, -1);
const wobble = (t: number, s: number) => Math.sin(t * 2.3 + s) * 0.6 + Math.sin(t * 5.9 + s * 3.1) * 0.4;

/** "In one second": an absurd-speed streak tunnel, bending with the Earth's curve, crushing g-forces. */
export const TunnelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - BEATS.one;
  const time = frame / 30;
  const dist = t * 260;
  const bend = smooth(BEATS.hugging - 10, BEATS.hugging + 30, frame) * (1 - smooth(BEATS.crush + 40, CITY_START, frame));
  const crush = smooth(BEATS.crush - 5, BEATS.crush + 10, frame) * (1 - smooth(BEATS.crush + 40, CITY_START, frame));
  const shake = 0.004 + 0.02 * crush;
  const arrive = smooth(CITY_START - 25, CITY_START, frame);
  return (
    <>
      <CameraRig
        position={[0, 0, 0]}
        pitch={-0.08 * bend + shake * wobble(time * 13, 1)}
        yaw={shake * wobble(time * 11, 2)}
        roll={t * 0.004 + shake * wobble(time * 9, 3)}
        fov={100 + 10 * crush - 30 * arrive}
        near={0.1}
        far={5000}
      />
      <Sky
        zenith={new THREE.Color('#020108')}
        horizon={new THREE.Color('#1b1450').lerp(new THREE.Color('#5a1f10'), crush)}
        sunColor={new THREE.Color('#cfe8ff')}
        sunDir={AHEAD}
        sunSize={0.0025 + 0.012 * arrive}
        band={0.6}
        glow={1.2 + 9 * arrive}
      />
      <TunnelStreaks dist={dist} length={90 + 60 * crush} bend={bend} spin={time * 0.3} opacity={1} />
    </>
  );
};

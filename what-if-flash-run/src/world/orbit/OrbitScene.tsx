import React from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {CameraRig} from '../CameraRig';
import {Stars} from '../effects/Stars';
import {BEATS, ORBIT_FADE} from '../beats';
import {logMix, mix, smooth} from '../../lib/timeline';
import {EarthTextures, OrbitEarth} from './OrbitEarth';

const FOV = 62;
const SUN = new THREE.Vector3(-0.35, 0.7, -0.62).normalize();

/** Pitch (radians) that puts the horizon `y` px below the top of the 1920-px frame, from altitude `h` (Earth radii). */
const pitchForHorizon = (h: number, y: number) => {
  const dip = Math.acos(1 / (1 + h));
  const below = Math.atan(((y - 960) / 960) * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
  return -(dip - below);
};

/** "You're in orbit": the Earth's limb, a thin blue atmosphere and black space, climbing as we go. */
export const OrbitScene: React.FC<{textures: EarthTextures}> = ({textures}) => {
  const frame = useCurrentFrame();
  const t = smooth(ORBIT_FADE.from, BEATS.one + 10, frame);
  const h = logMix(0.03, 0.3, t);
  const horizonY = mix(1450, 1100, smooth(ORBIT_FADE.from, ORBIT_FADE.to + 50, frame));
  const pitch = pitchForHorizon(h, horizonY);
  const travel = (frame - ORBIT_FADE.from) * 0.0009;
  const camY = 1 + h;
  return (
    <>
      <CameraRig position={[0, camY, 0]} pitch={pitch} yaw={0} roll={mix(0.06, 0.02, t)} fov={FOV} near={0.0005} far={60} />
      <Stars opacity={1} radius={30} position={[0, camY, 0]} count={2600} size={2.4} />
      <OrbitEarth textures={textures} sunDir={SUN} travel={travel} />
    </>
  );
};

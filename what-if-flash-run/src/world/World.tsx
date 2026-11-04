import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useTexture} from '../lib/useTexture';
import {smooth} from '../lib/timeline';
import {BEATS, CITY_START, ORBIT_FADE} from './beats';
import {GroundScene} from './ground/GroundScene';
import {OrbitScene} from './orbit/OrbitScene';
import {TunnelScene} from './tunnel/TunnelScene';
import {CityScene} from './city/CityScene';
import {WorldFlash} from './WorldFlash';

const W = 1080;
const H = 1920;

/** One full-screen 3D canvas. Several are mounted only while cross-fading. */
const Layer: React.FC<{opacity?: number; children: React.ReactNode}> = ({opacity = 1, children}) => (
  <AbsoluteFill style={{opacity}}>
    <ThreeCanvas width={W} height={H} gl={{antialias: true}} camera={{fov: 80, near: 0.5, far: 1000}}>
      {children}
    </ThreeCanvas>
  </AbsoluteFill>
);

/**
 * The continuous first-person 3D world behind the overlays (uses the GLOBAL frame):
 * ground run → orbit (cross-fade on "leave") → streak tunnel ("one second") → New York (on "stopping").
 */
export const World: React.FC = () => {
  const frame = useCurrentFrame();
  // Textures load before any canvas mounts: a canvas only redraws when the frame changes.
  const day = useTexture('textures/earth_atmos_2048.jpg');
  const spec = useTexture('textures/earth_specular_2048.jpg');
  const clouds = useTexture('textures/earth_clouds_1024.png');
  if (!day || !spec || !clouds) return <AbsoluteFill style={{background: 'black'}} />;
  const showGround = frame < ORBIT_FADE.to;
  const showOrbit = frame >= ORBIT_FADE.from && frame < BEATS.one;
  const showTunnel = frame >= BEATS.one && frame < CITY_START;
  const showCity = frame >= CITY_START;
  return (
    <AbsoluteFill style={{background: 'black'}}>
      {showGround && (
        <Layer>
          <GroundScene />
        </Layer>
      )}
      {showOrbit && (
        <Layer opacity={smooth(ORBIT_FADE.from, ORBIT_FADE.to, frame)}>
          <OrbitScene textures={{day, spec, clouds}} />
        </Layer>
      )}
      {showTunnel && (
        <Layer>
          <TunnelScene />
        </Layer>
      )}
      {showCity && (
        <Layer>
          <CityScene />
        </Layer>
      )}
      <WorldFlash />
    </AbsoluteFill>
  );
};

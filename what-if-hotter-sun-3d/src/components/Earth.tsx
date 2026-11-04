import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame} from 'remotion';
import {EarthSurface} from './three/EarthSurface';
import {EarthClouds} from './three/EarthClouds';
import {EarthAtmosphere} from './three/EarthAtmosphere';
import {SUN_DIRECTION} from './three/lighting';
import {useTexture} from '../lib/useTexture';

/** Canvas size relative to the globe, leaving room for the atmosphere glow. */
const EXTENT = 1.4;
const DISTANCE = EXTENT / Math.tan((15 * Math.PI) / 180);

/**
 * 3D Earth with real textures, clouds and an atmosphere, lit from the upper left.
 * `ice` (0-1) sizes the polar caps, `sea` (0-1) floods low land,
 * `venus` (0-1) turns it into a hot, cloud-choked Venus.
 */
export const Earth: React.FC<{size?: number; ice?: number; sea?: number; venus?: number}> = ({
  size = 440,
  ice = 1,
  sea = 0,
  venus = 0,
}) => {
  const frame = useCurrentFrame();
  // Textures load before the 3D canvas mounts: the canvas only redraws when the frame changes.
  const day = useTexture('textures/earth_atmos_2048.jpg');
  const spec = useTexture('textures/earth_specular_2048.jpg');
  const venusMap = useTexture('textures/venus_atmosphere_2k.jpg');
  const clouds = useTexture('textures/earth_clouds_1024.png');
  const spin = 3.6 + frame * 0.006;
  const canvas = Math.round(size * EXTENT);
  const offset = (canvas - size) / 2;
  const sun = SUN_DIRECTION.clone().multiplyScalar(10);
  if (!day || !spec || !venusMap || !clouds) return <div style={{width: size, height: size}} />;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <div style={{position: 'absolute', left: -offset, top: -offset}}>
        <ThreeCanvas width={canvas} height={canvas} camera={{fov: 30, position: [0, 0, DISTANCE]}}>
          <ambientLight intensity={0.15} />
          <directionalLight position={[sun.x, sun.y, sun.z]} intensity={2.2} />
          <group rotation={[0.2, 0, 0.1]}>
            <EarthSurface day={day} spec={spec} venusMap={venusMap} ice={ice} sea={sea} venus={venus} spin={spin} />
            <EarthClouds clouds={clouds} spin={spin} opacity={0.85 * (1 - venus)} />
          </group>
          <EarthAtmosphere venus={venus} />
        </ThreeCanvas>
      </div>
    </div>
  );
};

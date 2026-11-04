import React, {useMemo} from 'react';
import * as THREE from 'three';
import {SKY_FRAGMENT, SKY_VERTEX} from '../../shaders/sky';
import {toDisplay} from '../../lib/color';

/**
 * Sky dome drawn behind everything (depth at the far plane), centred on the camera.
 * `band` sharpens the horizon glow (thin atmosphere from high up); `dip` lowers the horizon.
 */
export const Sky: React.FC<{
  zenith: THREE.Color;
  horizon: THREE.Color;
  sunColor: THREE.Color;
  sunDir: THREE.Vector3;
  sunSize?: number;
  band?: number;
  dip?: number;
  /** Broad haze around the sun (strong at dawn). */
  glow?: number;
  position?: [number, number, number];
}> = ({zenith, horizon, sunColor, sunDir, sunSize = 0.0006, band = 0.55, dip = 0, glow = 1, position = [0, 0, 0]}) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERTEX,
        fragmentShader: SKY_FRAGMENT,
        uniforms: {
          uZenith: {value: new THREE.Color()},
          uHorizon: {value: new THREE.Color()},
          uSunColor: {value: new THREE.Color()},
          uSunDir: {value: new THREE.Vector3()},
          uSunSize: {value: 0},
          uBand: {value: 0},
          uDip: {value: 0},
          uGlow: {value: 1},
        },
        side: THREE.BackSide,
        depthWrite: false,
      }),
    []
  );
  const u = material.uniforms;
  toDisplay(u.uZenith.value, zenith);
  toDisplay(u.uHorizon.value, horizon);
  toDisplay(u.uSunColor.value, sunColor);
  u.uSunDir.value.copy(sunDir);
  u.uSunSize.value = sunSize;
  u.uBand.value = band;
  u.uDip.value = dip;
  u.uGlow.value = glow;
  return (
    <mesh material={material} position={position} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[100, 32, 16]} />
    </mesh>
  );
};

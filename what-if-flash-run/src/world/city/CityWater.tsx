import React, {useMemo} from 'react';
import * as THREE from 'three';
import {WATER_FRAGMENT, WATER_VERTEX} from '../../shaders/water';
import {toDisplay} from '../../lib/color';
import {CityLook} from './cityPalette';

/** The river between the promenade and the skyline, reflecting the dusk sky and city lights. */
export const CityWater: React.FC<{look: CityLook; time: number}> = ({look, time}) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: WATER_VERTEX,
        fragmentShader: WATER_FRAGMENT,
        uniforms: {
          uDeep: {value: new THREE.Color()},
          uSky: {value: new THREE.Color()},
          uSun: {value: new THREE.Color()},
          uSunDir: {value: new THREE.Vector3()},
          uFogColor: {value: new THREE.Color()},
          uFogDensity: {value: 0},
          uTime: {value: 0},
        },
      }),
    []
  );
  const u = material.uniforms;
  toDisplay(u.uDeep.value, look.zenith.clone().multiplyScalar(0.6));
  toDisplay(u.uSky.value, look.horizon.clone().lerp(look.zenith, 0.35));
  toDisplay(u.uSun.value, look.sun);
  u.uSunDir.value.copy(look.sunDir);
  toDisplay(u.uFogColor.value, look.fog);
  u.uFogDensity.value = look.fogDensity;
  u.uTime.value = time;
  return (
    <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, -433]}>
      <planeGeometry args={[6000, 860]} />
    </mesh>
  );
};

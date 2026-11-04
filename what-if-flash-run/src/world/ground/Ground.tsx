import React, {useMemo} from 'react';
import * as THREE from 'three';
import {GROUND_FRAGMENT, GROUND_VERTEX} from '../../shaders/ground';
import {makeDiscGeometry} from '../../lib/discGeometry';
import {WorldState, BIOME_RANGE} from '../speedProfile';
import {SkyLook} from './skyPalette';
import {toDisplay} from '../../lib/color';

/** The ground and highway under the runner: a huge disc around the camera with a procedural, scrolling surface. */
export const Ground: React.FC<{w: WorldState; look: SkyLook}> = ({w, look}) => {
  const geometry = useMemo(() => makeDiscGeometry(60000, 46, 72), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: GROUND_VERTEX,
        fragmentShader: GROUND_FRAGMENT,
        side: THREE.DoubleSide,
        uniforms: {
          uDist: {value: 0},
          uScroll: {value: 0},
          uStretch: {value: 1},
          uMotion: {value: 0},
          uBiome: {value: new THREE.Vector2(...BIOME_RANGE)},
          uFogColor: {value: new THREE.Color()},
          uFogDensity: {value: 0},
          uSunColor: {value: new THREE.Color()},
          uSkyColor: {value: new THREE.Color()},
          uSunElev: {value: 0},
          uHeat: {value: 0},
          uCurve: {value: 0},
        },
      }),
    []
  );
  const u = material.uniforms;
  u.uDist.value = w.dist;
  u.uScroll.value = w.scroll;
  u.uStretch.value = w.stretch;
  u.uMotion.value = w.motion;
  toDisplay(u.uFogColor.value, look.fog);
  u.uFogDensity.value = look.fogDensity;
  toDisplay(u.uSunColor.value, look.sun);
  toDisplay(u.uSkyColor.value, look.zenith.clone().lerp(look.horizon, 0.6));
  u.uSunElev.value = look.sunDir.y;
  u.uHeat.value = w.heat;
  u.uCurve.value = w.curve;
  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
};

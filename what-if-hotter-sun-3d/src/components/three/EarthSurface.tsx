import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {EARTH_FRAGMENT, EARTH_VERTEX} from '../../shaders/earth';
import {SUN_DIRECTION} from './lighting';

/** Earth's textured globe: sunlit day side, ocean glints, melting ice, rising seas, Venus blend. */
export const EarthSurface: React.FC<{
  day: THREE.Texture;
  spec: THREE.Texture;
  venusMap: THREE.Texture;
  ice: number;
  sea: number;
  venus: number;
  spin: number;
}> = ({day, spec, venusMap, ice, sea, venus, spin}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: EARTH_VERTEX,
        fragmentShader: EARTH_FRAGMENT,
        uniforms: {
          uDay: {value: null},
          uSpec: {value: null},
          uVenusMap: {value: null},
          uSunDir: {value: SUN_DIRECTION.clone()},
          uIce: {value: 1},
          uSea: {value: 0},
          uVenus: {value: 0},
          uTime: {value: 0},
        },
      }),
    []
  );
  material.uniforms.uDay.value = day;
  material.uniforms.uSpec.value = spec;
  material.uniforms.uVenusMap.value = venusMap;
  material.uniforms.uIce.value = ice;
  material.uniforms.uSea.value = sea;
  material.uniforms.uVenus.value = venus;
  material.uniforms.uTime.value = frame / fps;
  return (
    <mesh material={material} rotation={[0, spin, 0]}>
      <sphereGeometry args={[1, 96, 96]} />
    </mesh>
  );
};

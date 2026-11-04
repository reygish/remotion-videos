import React, {useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

/** Exp² fog shared by the built-in materials; custom shaders get the same values as uniforms. */
export const SceneFog: React.FC<{color: THREE.Color; density: number}> = ({color, density}) => {
  const scene = useThree((s) => s.scene);
  const fog = useMemo(() => new THREE.FogExp2(0xffffff, 0), []);
  fog.color.copy(color);
  fog.density = density;
  scene.fog = fog;
  return null;
};

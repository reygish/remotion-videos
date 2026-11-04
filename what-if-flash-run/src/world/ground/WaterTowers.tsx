import React, {useMemo} from 'react';
import * as THREE from 'three';
import {hideFrom, makeInstanced, setInstance} from '../../lib/instancing';
import {rand} from '../../lib/math';
import {smooth} from '../../lib/timeline';
import {waterTowerGeometry} from './houseGeometry';
import {townAt, townsBetween} from './towns';

/** One water tower per town: the small-town landmark you see from the highway. */
export const WaterTowers: React.FC<{dist: number; speed: number}> = ({dist, speed}) => {
  const mesh = useMemo(
    () => makeInstanced(waterTowerGeometry(), new THREE.MeshLambertMaterial({vertexColors: true, flatShading: true}), 3),
    []
  );
  const show = 1 - smooth(1200, 2000, speed);
  let n = 0;
  if (show > 0) {
    for (const k of townsBetween(dist - 300, dist + 5000).slice(0, 3)) {
      const side = rand(k * 3.1) < 0.5 ? -1 : 1;
      setInstance(mesh, n++, side * (45 + rand(k) * 40), 0, -(townAt(k) - dist + 40), 1, show, 1);
    }
  }
  hideFrom(mesh, n);
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

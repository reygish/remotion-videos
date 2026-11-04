import React, {useMemo} from 'react';
import * as THREE from 'three';
import {hideFrom, makeInstanced, setInstance} from '../../lib/instancing';
import {trackSlot} from '../../lib/track';
import {rand} from '../../lib/math';
import {smooth} from '../../lib/timeline';
import {biomeAt} from '../speedProfile';

const COUNT = 70;
const WINDOW = 1600;

/** Red desert boulders, half-buried, flat-shaded. */
export const Rocks: React.FC<{dist: number; speed: number}> = ({dist, speed}) => {
  const mesh = useMemo(
    () =>
      makeInstanced(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshLambertMaterial({color: '#b0694a', flatShading: true}), COUNT),
    []
  );
  const show = 1 - smooth(500, 900, speed);
  if (show <= 0) return null;
  for (let i = 0; i < COUNT; i++) {
    const {ahead, k} = trackSlot(dist, rand(i * 6.1 + 1) * WINDOW, WINDOW, 40);
    const r = rand(i * 1.9 + k * 3.3);
    const side = rand(i * 8.7 + k * 1.7) < 0.5 ? -1 : 1;
    const x = side * (9 + r * r * 320);
    const desert = biomeAt(dist + ahead) < 0.45 + 0.3 * rand(i * 2.9);
    const size = (0.8 + Math.pow(rand(i * 4.3 + k), 3) * 6) * show * (desert ? 1 : 0);
    setInstance(mesh, i, x, size * 0.15, -ahead, size * 1.3, size * 0.7, size, rand(i + k) * 6.28, rand(i * 3.1) * 0.5);
  }
  hideFrom(mesh, COUNT);
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

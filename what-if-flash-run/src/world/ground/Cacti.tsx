import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {hideFrom, makeInstanced, setInstance} from '../../lib/instancing';
import {trackSlot} from '../../lib/track';
import {rand} from '../../lib/math';
import {smooth} from '../../lib/timeline';
import {biomeAt} from '../speedProfile';

const COUNT = 90;
const WINDOW = 1400;

const cactusGeometry = () => {
  const cyl = (r: number, h: number) => new THREE.CylinderGeometry(r * 0.85, r, h, 6);
  return mergeGeometries([
    cyl(0.36, 5).translate(0, 2.5, 0),
    cyl(0.24, 1.3).rotateZ(Math.PI / 2).translate(-0.85, 2.0, 0),
    cyl(0.24, 1.9).translate(-1.4, 2.8, 0),
    cyl(0.22, 1.1).rotateZ(Math.PI / 2).translate(0.75, 2.8, 0),
    cyl(0.22, 1.5).translate(1.25, 3.5, 0),
  ]);
};

/** Saguaro cacti scattered along the desert stretch. */
export const Cacti: React.FC<{dist: number; speed: number}> = ({dist, speed}) => {
  const mesh = useMemo(
    () => makeInstanced(cactusGeometry(), new THREE.MeshLambertMaterial({color: '#4d7a3c', flatShading: true}), COUNT),
    []
  );
  const show = 1 - smooth(500, 900, speed);
  if (show <= 0) return null;
  for (let i = 0; i < COUNT; i++) {
    const {ahead, k} = trackSlot(dist, rand(i * 3.7) * WINDOW, WINDOW, 40);
    const r = rand(i * 11.3 + k * 7.1);
    const side = rand(i * 5.9 + k * 2.3) < 0.5 ? -1 : 1;
    const x = side * (10 + r * r * 260);
    const desert = biomeAt(dist + ahead) < 0.5 + 0.4 * rand(i * 9.1) - 0.2;
    const s = (0.7 + rand(i * 2.1 + k) * 0.7) * show * (desert ? 1 : 0);
    setInstance(mesh, i, x, 0, -ahead, s, s, s, rand(i * 4.4 + k) * 6.28);
  }
  hideFrom(mesh, COUNT);
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

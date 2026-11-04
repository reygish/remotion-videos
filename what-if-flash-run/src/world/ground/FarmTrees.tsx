import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {hideFrom, makeInstanced, setInstance} from '../../lib/instancing';
import {trackSlot} from '../../lib/track';
import {rand} from '../../lib/math';
import {smooth} from '../../lib/timeline';
import {biomeAt} from '../speedProfile';

const COUNT = 110;
const WINDOW = 1600;

const treeGeometry = () => {
  const trunk = new THREE.CylinderGeometry(0.25, 0.35, 3, 5).translate(0, 1.5, 0);
  const crown = new THREE.IcosahedronGeometry(2.6, 0).scale(1, 1.25, 1).translate(0, 5.2, 0);
  const color = (g: THREE.BufferGeometry, c: [number, number, number]) => {
    const n = g.getAttribute('position').count;
    g.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({length: n}, () => c).flat(), 3));
    return g;
  };
  return mergeGeometries([color(trunk.toNonIndexed(), [0.45, 0.32, 0.22]), color(crown, [1, 1, 1])]);
};

/** Farmland trees: windbreak rows and clumps between the fields. */
export const FarmTrees: React.FC<{dist: number; speed: number}> = ({dist, speed}) => {
  const mesh = useMemo(() => {
    const m = makeInstanced(treeGeometry(), new THREE.MeshLambertMaterial({vertexColors: true, flatShading: true}), COUNT);
    const c = new THREE.Color();
    for (let i = 0; i < COUNT; i++) m.setColorAt(i, c.setHSL(0.24 + rand(i * 2.2) * 0.08, 0.45, 0.24 + rand(i * 5.5) * 0.1));
    return m;
  }, []);
  const show = 1 - smooth(600, 1000, speed);
  if (show <= 0) return null;
  for (let i = 0; i < COUNT; i++) {
    // Trees come in rows of 6 (windbreaks), each row at a random spot.
    const row = Math.floor(i / 6);
    const {ahead: rowAhead, k} = trackSlot(dist, rand(row * 4.1) * WINDOW, WINDOW, 40);
    const side = rand(row * 7.7 + k) < 0.5 ? -1 : 1;
    const x0 = side * (16 + Math.pow(rand(row * 3.3 + k * 1.1), 2) * 300);
    const along = rand(row * 9.9 + k) < 0.5;
    const j = i % 6;
    const x = along ? x0 : x0 + side * j * 7;
    const ahead = along ? rowAhead + j * 8 : rowAhead;
    const farm = biomeAt(dist + ahead) > 0.55;
    const s = (0.8 + rand(i * 1.3 + k) * 0.6) * show * (farm ? 1 : 0);
    setInstance(mesh, i, x, 0, -ahead, s, s, s, rand(i) * 6);
  }
  hideFrom(mesh, COUNT);
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

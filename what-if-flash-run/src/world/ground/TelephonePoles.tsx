import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {hideFrom, makeInstanced, setInstance} from '../../lib/instancing';
import {trackSlot} from '../../lib/track';
import {smooth} from '../../lib/timeline';

const SPACING = 48;
const COUNT = 30;
const X = -11;
const TOP = 9;

const poleGeometry = () => {
  const pole = new THREE.CylinderGeometry(0.12, 0.17, TOP, 5).translate(0, TOP / 2, 0);
  const arm = new THREE.BoxGeometry(2.6, 0.16, 0.16).translate(0, TOP - 0.6, 0);
  return mergeGeometries([pole, arm]);
};

/** Wooden telephone poles along the left of the road, with three wires. They vanish at Mach-10 speeds. */
export const TelephonePoles: React.FC<{dist: number; speed: number}> = ({dist, speed}) => {
  const mesh = useMemo(() => makeInstanced(poleGeometry(), new THREE.MeshLambertMaterial({color: '#5b4330', flatShading: true}), COUNT), []);
  const wires = useMemo(() => {
    const pts: number[] = [];
    for (const dx of [-1.15, 1.15]) pts.push(X + dx, TOP - 0.5, 20, X + dx, TOP - 0.5, -SPACING * COUNT);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  const show = 1 - smooth(500, 900, speed);
  if (show <= 0) return null;
  for (let i = 0; i < COUNT; i++) {
    const {ahead} = trackSlot(dist, i * SPACING, SPACING * COUNT, 30);
    setInstance(mesh, i, X, 0, -ahead, 1, show, 1);
  }
  hideFrom(mesh, COUNT);
  mesh.instanceMatrix.needsUpdate = true;
  return (
    <>
      <primitive object={mesh} />
      <lineSegments geometry={wires}>
        <lineBasicMaterial color="#2a2522" transparent opacity={0.8 * show} />
      </lineSegments>
    </>
  );
};

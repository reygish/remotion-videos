import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const paint = (g: THREE.BufferGeometry, c: [number, number, number]) => {
  const n = g.getAttribute('position').count;
  g.setAttribute('color', new THREE.Float32BufferAttribute(Array.from({length: n}, () => c).flat(), 3));
  return g;
};

/** 1×1×1 house with a darker gable roof (vertex colours; walls tinted per instance). */
export const houseGeometry = () => {
  const walls = new THREE.BoxGeometry(1, 0.7, 1).translate(0, 0.35, 0).toNonIndexed();
  const roof = new THREE.CylinderGeometry(0.62, 0.62, 1.08, 3, 1).rotateX(Math.PI / 2).rotateZ(Math.PI / 2);
  roof.scale(1.05, 0.55, 1).translate(0, 0.86, 0);
  return mergeGeometries([paint(walls, [1, 1, 1]), paint(roof.toNonIndexed(), [0.42, 0.3, 0.3])]);
};

/** Small-town water tower: tank on four legs, about 30 m tall. */
export const waterTowerGeometry = () => {
  const parts: THREE.BufferGeometry[] = [];
  for (const [x, z] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]]) {
    parts.push(paint(new THREE.CylinderGeometry(0.25, 0.3, 22, 4).translate(x, 11, z).toNonIndexed(), [0.6, 0.6, 0.62]));
  }
  parts.push(paint(new THREE.CylinderGeometry(5, 5, 7, 12).translate(0, 25, 0).toNonIndexed(), [0.92, 0.93, 0.95]));
  parts.push(paint(new THREE.ConeGeometry(5.3, 2.5, 12).translate(0, 29.7, 0).toNonIndexed(), [0.75, 0.76, 0.8]));
  return mergeGeometries(parts);
};

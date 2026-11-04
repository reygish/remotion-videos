import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeInstanced, setInstance} from '../../lib/instancing';
import {rand} from '../../lib/math';
import {makeWindowMaterial, updateWindowMaterial} from './windowMaterial';
import {CityLook} from './cityPalette';

const COUNT = 160;

/** City blocks lining the final approach; stretched by `motion` (metres per frame) as we blast past. */
export const ApproachBlocks: React.FC<{look: CityLook; motion: number}> = ({look, motion}) => {
  const {mesh, material} = useMemo(() => {
    const mat = makeWindowMaterial();
    return {mesh: makeInstanced(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), mat, COUNT), material: mat};
  }, []);
  updateWindowMaterial(material, look);
  for (let i = 0; i < COUNT; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const z = 40 + (i / COUNT) * 4300 + rand(i * 3.1) * 20;
    const w = 20 + rand(i * 5.5) * 25;
    const d = 22 + rand(i * 6.6) * 20;
    const x = side * (16 + rand(i * 7.7) * 30 + w / 2);
    setInstance(mesh, i, x, 0, z, w, 14 + Math.pow(rand(i * 8.8), 2) * 90, d + motion * 0.8);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

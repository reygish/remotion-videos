import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeInstanced, setInstance} from '../../lib/instancing';
import {buildSkyline} from './skylineLayout';
import {makeWindowMaterial, updateWindowMaterial} from './windowMaterial';
import {CityLook} from './cityPalette';

/** The skyline across the river: hundreds of instanced towers with lit windows, in one draw call. */
export const CitySkyline: React.FC<{look: CityLook}> = ({look}) => {
  const {mesh, material, spires} = useMemo(() => {
    const {boxes, spires: sp} = buildSkyline();
    const mat = makeWindowMaterial();
    const m = makeInstanced(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), mat, boxes.length);
    boxes.forEach((b, i) => setInstance(m, i, b.x, b.y, b.z, b.w, b.h, b.d));
    m.instanceMatrix.needsUpdate = true;
    const spireMesh = makeInstanced(new THREE.ConeGeometry(1, 1, 6).translate(0, 0.5, 0), new THREE.MeshLambertMaterial({color: '#8d8fa6'}), sp.length);
    sp.forEach((s, i) => setInstance(spireMesh, i, s.x, s.y, s.z, 2.4, s.h, 2.4));
    spireMesh.instanceMatrix.needsUpdate = true;
    return {mesh: m, material: mat, spires: spireMesh};
  }, []);
  updateWindowMaterial(material, look);
  return (
    <>
      <primitive object={mesh} />
      <primitive object={spires} />
    </>
  );
};

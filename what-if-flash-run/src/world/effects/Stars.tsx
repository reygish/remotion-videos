import React, {useMemo} from 'react';
import * as THREE from 'three';
import {rand} from '../../lib/math';

/** Star field on a sphere of `radius` around `position`; `minElevation` keeps stars above the horizon. */
export const Stars: React.FC<{
  opacity: number;
  radius: number;
  position?: [number, number, number];
  minElevation?: number;
  count?: number;
  size?: number;
}> = ({opacity, radius, position = [0, 0, 0], minElevation = -1, count = 1800, size = 2.2}) => {
  const geometry = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    for (let i = 0; pos.length < count * 3 && i < count * 4; i++) {
      const u = rand(i * 1.31 + 0.1) * 2 - 1;
      const t = rand(i * 2.71 + 0.3) * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      if (u < minElevation) continue;
      pos.push(s * Math.cos(t) * radius, u * radius, s * Math.sin(t) * radius);
      const b = 0.35 + Math.pow(rand(i * 7.77), 3) * 0.65;
      const warm = rand(i * 3.9);
      col.push(b * (0.9 + warm * 0.1), b * 0.95, b * (1.05 - warm * 0.15));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    return g;
  }, [count, radius, minElevation]);
  if (opacity <= 0.01) return null;
  return (
    <points geometry={geometry} position={position} renderOrder={-9} frustumCulled={false}>
      <pointsMaterial size={size} sizeAttenuation={false} vertexColors transparent opacity={opacity} depthWrite={false} fog={false} />
    </points>
  );
};

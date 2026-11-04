import React, {useMemo} from 'react';
import * as THREE from 'three';

/** Paving slabs: light stone squares with darker joints, drawn once into a repeating texture. */
const drawPaving = () => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#4a3f44';
  ctx.fillRect(0, 0, 256, 256);
  const tones = ['#b9a69e', '#c4b1a6', '#ad9a93', '#bfaaa0'];
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 2; x++) {
      ctx.fillStyle = tones[y * 2 + x];
      ctx.fillRect(x * 128 + 3, y * 128 + 3, 122, 122);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(110, 20);
  tex.anisotropy = 8;
  return tex;
};

/** Stone paving on the promenade around the viewer (the long approach road beyond it stays plain). */
export const Paving: React.FC = () => {
  const texture = useMemo(drawPaving, []);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5]}>
      <planeGeometry args={[120, 22]} />
      <meshLambertMaterial map={texture} emissive="#2a1e22" />
    </mesh>
  );
};

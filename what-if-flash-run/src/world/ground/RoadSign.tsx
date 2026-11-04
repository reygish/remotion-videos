import React, {useMemo} from 'react';
import * as THREE from 'three';
import {DISTANCE_KM} from '../../config/run';

/** Where the gantry stands, metres along the road from the start. */
const SIGN_AT = 30;
const W = 8;
const H = 4;
const BOTTOM = 5.6;
const SPAN = 15;

const drawSign = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0f6e3e';
  ctx.fillRect(0, 0, 1024, 512);
  ctx.strokeStyle = '#f4f4ef';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.roundRect(22, 22, 980, 468, 34);
  ctx.stroke();
  ctx.fillStyle = '#f4f4ef';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '800 160px Inter, "DejaVu Sans", sans-serif';
  ctx.fillText('NEW YORK', 512, 180);
  ctx.font = '700 136px Inter, "DejaVu Sans", sans-serif';
  ctx.fillText(`${DISTANCE_KM.toLocaleString('en-US')} km`, 512, 362);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
};

/** Overhead highway gantry with a big green sign "NEW YORK 3,936 km"; we run under it while sprinting. */
export const RoadSign: React.FC<{dist: number}> = ({dist}) => {
  const texture = useMemo(drawSign, []);
  const z = -(SIGN_AT - dist);
  if (z > 30) return null;
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0.6, BOTTOM + H / 2, 0.16]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={texture} color="#e6e6de" toneMapped={false} />
      </mesh>
      <mesh position={[0.6, BOTTOM + H / 2, 0]}>
        <boxGeometry args={[W + 0.12, H + 0.12, 0.25]} />
        <meshLambertMaterial color="#7e858b" />
      </mesh>
      {[BOTTOM + 0.9, BOTTOM + H - 0.9].map((y) => (
        <mesh key={y} position={[0, y, -0.35]}>
          <boxGeometry args={[SPAN, 0.22, 0.22]} />
          <meshLambertMaterial color="#8a9096" />
        </mesh>
      ))}
      {[-SPAN / 2, SPAN / 2].map((x) => (
        <mesh key={x} position={[x, (BOTTOM + H) / 2, -0.35]}>
          <boxGeometry args={[0.4, BOTTOM + H, 0.4]} />
          <meshLambertMaterial color="#7a8086" />
        </mesh>
      ))}
    </group>
  );
};

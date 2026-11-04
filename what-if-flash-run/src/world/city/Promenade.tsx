import React, {useMemo} from 'react';
import * as THREE from 'three';
import {makeInstanced, setInstance} from '../../lib/instancing';
import {Paving} from './Paving';

const POSTS = 40;

/** Raised waterfront promenade: paved ground under the viewer, a railing over the embankment, the far island's ground. */
export const Promenade: React.FC = () => {
  const posts = useMemo(() => {
    const m = makeInstanced(new THREE.BoxGeometry(0.12, 1.1, 0.12).translate(0, 0.55, 0), new THREE.MeshLambertMaterial({color: '#3a3a44'}), POSTS);
    for (let i = 0; i < POSTS; i++) setInstance(m, i, (i - POSTS / 2) * 2.2, 0, -5.6, 1, 1, 1);
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, []);
  return (
    <>
      {/* Paved promenade and approach, from far behind us to the water. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2497]}>
        <planeGeometry args={[400, 5006]} />
        <meshLambertMaterial color="#b49c92" emissive="#3c2b2e" />
      </mesh>
      {/* Embankment wall down to the water. */}
      <mesh position={[0, -3, -6.2]}>
        <boxGeometry args={[400, 6, 0.4]} />
        <meshLambertMaterial color="#4a4250" />
      </mesh>
      {/* The island across the river. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -2900]}>
        <planeGeometry args={[8000, 4100]} />
        <meshLambertMaterial color="#2c2a3c" />
      </mesh>
      <Paving />
      <primitive object={posts} />
      {[0.55, 1.08].map((y) => (
        <mesh key={y} position={[0, y, -5.6]}>
          <boxGeometry args={[POSTS * 2.2, 0.07, 0.07]} />
          <meshLambertMaterial color="#454552" />
        </mesh>
      ))}
    </>
  );
};

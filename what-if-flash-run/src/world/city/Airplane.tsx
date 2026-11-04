import React, {useMemo} from 'react';
import * as THREE from 'three';
import {mergeGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/** Low-poly airliner, nose toward +x, about 60 m long (scaled up a little so it reads at a distance). */
const planeGeometry = () => {
  const fuselage = new THREE.CylinderGeometry(2.6, 2.2, 56, 10).rotateZ(Math.PI / 2);
  const nose = new THREE.ConeGeometry(2.6, 7, 10).rotateZ(-Math.PI / 2).translate(31.5, 0, 0);
  const wing = new THREE.BoxGeometry(9, 0.6, 52).translate(2, -1, 0);
  const tailFin = new THREE.BoxGeometry(7, 10, 0.6).translate(-24, 5.5, 0);
  const stab = new THREE.BoxGeometry(5, 0.5, 18).translate(-25, 1, 0);
  const engine = (z: number) => new THREE.CylinderGeometry(1.5, 1.5, 6, 8).rotateZ(Math.PI / 2).translate(4, -2.8, z);
  return mergeGeometries([fuselage, nose, wing, tailFin, stab, engine(-9), engine(9)].map((g) => (g.index ? g.toNonIndexed() : g)));
};

/** A passenger jet crossing the sunset sky, with blinking navigation lights. */
export const Airplane: React.FC<{position: [number, number, number]; frame: number}> = ({position, frame}) => {
  const geometry = useMemo(planeGeometry, []);
  const blink = frame % 30 < 4;
  return (
    <group position={position} rotation={[0.05, 0.12, 0.03]} scale={2}>
      <mesh geometry={geometry}>
        <meshLambertMaterial color="#e9e6ee" flatShading />
      </mesh>
      <mesh position={[2, -1, 27]}>
        <sphereGeometry args={[1.4, 6, 4]} />
        <meshBasicMaterial color="#ff3b30" fog={false} />
      </mesh>
      <mesh position={[2, -1, -27]}>
        <sphereGeometry args={[1.4, 6, 4]} />
        <meshBasicMaterial color="#3bff6a" fog={false} />
      </mesh>
      {blink && (
        <mesh position={[0, 3, 0]}>
          <sphereGeometry args={[2, 6, 4]} />
          <meshBasicMaterial color="#ffffff" fog={false} />
        </mesh>
      )}
    </group>
  );
};

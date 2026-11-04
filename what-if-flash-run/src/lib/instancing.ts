import * as THREE from 'three';

const dummy = new THREE.Object3D();

/** Creates an InstancedMesh that is never frustum-culled (instances move every frame). */
export const makeInstanced = (geometry: THREE.BufferGeometry, material: THREE.Material, count: number) => {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  return mesh;
};

/** Sets one instance's transform. A zero scale hides it. */
export const setInstance = (
  mesh: THREE.InstancedMesh,
  i: number,
  x: number,
  y: number,
  z: number,
  sx: number,
  sy: number,
  sz: number,
  rotY = 0,
  rotX = 0,
  rotZ = 0
) => {
  dummy.position.set(x, y, z);
  dummy.rotation.set(rotX, rotY, rotZ);
  dummy.scale.set(sx, sy, sz);
  dummy.updateMatrix();
  mesh.setMatrixAt(i, dummy.matrix);
};

/** Hides every instance from `from` on. */
export const hideFrom = (mesh: THREE.InstancedMesh, from: number) => {
  for (let i = from; i < mesh.count; i++) setInstance(mesh, i, 0, -1e4, 0, 0, 0, 0);
};

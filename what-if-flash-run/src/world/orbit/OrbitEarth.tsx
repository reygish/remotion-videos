import React, {useMemo} from 'react';
import * as THREE from 'three';
import {EARTH_FRAGMENT, EARTH_VERTEX} from '../../shaders/earth';
import {ATMOSPHERE_FRAGMENT, ATMOSPHERE_VERTEX} from '../../shaders/atmosphere';

export type EarthTextures = {day: THREE.Texture; spec: THREE.Texture; clouds: THREE.Texture};

/** Radians: puts the central USA (38°N, 95°W) on top of the globe (+y) with east pointing to -z. */
const baseOrientation = () => {
  const lat = THREE.MathUtils.degToRad(38);
  const u = (-95 + 180) / 360;
  const phi = u * Math.PI * 2;
  const theta = Math.PI / 2 - lat;
  // three.js SphereGeometry: x = -cos(phi) sin(theta), y = cos(theta), z = sin(phi) sin(theta)
  const up = new THREE.Vector3(-Math.cos(phi) * Math.sin(theta), Math.cos(theta), Math.sin(phi) * Math.sin(theta));
  // East = direction of increasing longitude (increasing phi).
  const east = new THREE.Vector3(Math.sin(phi), 0, Math.cos(phi)).normalize();
  const row1 = up.clone().cross(east.clone().negate());
  const m = new THREE.Matrix4().set(
    row1.x, row1.y, row1.z, 0,
    up.x, up.y, up.z, 0,
    -east.x, -east.y, -east.z, 0,
    0, 0, 0, 1
  );
  return new THREE.Quaternion().setFromRotationMatrix(m);
};

/**
 * Textured Earth (radius 1) with clouds and a thin blue atmosphere.
 * `travel` (radians) rolls the globe under the viewer, as if flying east.
 */
export const OrbitEarth: React.FC<{textures: EarthTextures; sunDir: THREE.Vector3; travel: number}> = ({textures, sunDir, travel}) => {
  const surface = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: EARTH_VERTEX,
        fragmentShader: EARTH_FRAGMENT,
        uniforms: {uDay: {value: null}, uSpec: {value: null}, uClouds: {value: null}, uSunDir: {value: new THREE.Vector3()}},
      }),
    []
  );
  const atmosphere = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ATMOSPHERE_VERTEX,
        fragmentShader: ATMOSPHERE_FRAGMENT,
        uniforms: {uColor: {value: new THREE.Color(0.25, 0.55, 1.0)}, uSunDir: {value: new THREE.Vector3()}, uScale: {value: 0.006}},
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );
  const base = useMemo(baseOrientation, []);
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), travel).multiply(base);
  surface.uniforms.uDay.value = textures.day;
  surface.uniforms.uSpec.value = textures.spec;
  surface.uniforms.uClouds.value = textures.clouds;
  surface.uniforms.uSunDir.value.copy(sunDir);
  atmosphere.uniforms.uSunDir.value.copy(sunDir);
  return (
    <>
      <mesh material={surface} quaternion={q}>
        <sphereGeometry args={[1, 256, 128]} />
      </mesh>
      <mesh material={atmosphere} scale={1.08} renderOrder={5}>
        <sphereGeometry args={[1, 48, 24]} />
      </mesh>
    </>
  );
};

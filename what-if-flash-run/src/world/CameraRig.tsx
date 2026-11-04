import React from 'react';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

export type CameraPose = {
  position: [number, number, number];
  /** Radians: pitch (look up +), yaw (look left +), roll. */
  pitch: number;
  yaw: number;
  roll?: number;
  /** Vertical field of view, degrees. */
  fov: number;
  near?: number;
  far?: number;
};

/**
 * Applies a pose to the canvas camera during render, before R3F draws the frame
 * (Remotion's ThreeCanvas renders right after React commits).
 */
export const CameraRig: React.FC<CameraPose> = ({position, pitch, yaw, roll = 0, fov, near = 0.5, far = 100000}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...position);
  camera.rotation.set(pitch, yaw, roll, 'YXZ');
  camera.fov = fov;
  camera.near = near;
  camera.far = far;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  return null;
};

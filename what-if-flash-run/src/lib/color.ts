import * as THREE from 'three';

/**
 * Copies a (linear, colour-managed) THREE.Color into `target` as display/sRGB
 * values. Our custom shaders work directly in display space, like the textures.
 */
export const toDisplay = (target: THREE.Color, c: THREE.Color): THREE.Color => target.copy(c).convertLinearToSRGB();

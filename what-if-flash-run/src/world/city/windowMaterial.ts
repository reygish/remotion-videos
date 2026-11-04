import * as THREE from 'three';
import {WINDOWS_FRAGMENT, WINDOWS_VERTEX} from '../../shaders/windows';
import {toDisplay} from '../../lib/color';
import {CityLook} from './cityPalette';

/** Shader material for instanced towers with lit windows. */
export const makeWindowMaterial = () =>
  new THREE.ShaderMaterial({
    vertexShader: WINDOWS_VERTEX,
    fragmentShader: WINDOWS_FRAGMENT,
    uniforms: {
      uSunDir: {value: new THREE.Vector3()},
      uRim: {value: new THREE.Color()},
      uFacade: {value: new THREE.Color()},
      uSkyRefl: {value: new THREE.Color()},
      uFogColor: {value: new THREE.Color()},
      uFogDensity: {value: 0},
      uLit: {value: 0.4},
    },
  });

/** Pushes the current light/fog look into a window material. */
export const updateWindowMaterial = (m: THREE.ShaderMaterial, look: CityLook) => {
  const u = m.uniforms;
  u.uSunDir.value.copy(look.sunDir);
  toDisplay(u.uRim.value, look.rim);
  toDisplay(u.uFacade.value, look.facade);
  toDisplay(u.uSkyRefl.value, look.horizon.clone().lerp(look.zenith, 0.5));
  toDisplay(u.uFogColor.value, look.fog);
  u.uFogDensity.value = look.fogDensity;
  u.uLit.value = look.lit;
};

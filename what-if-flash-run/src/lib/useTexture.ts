import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import * as THREE from 'three';

const cache = new Map<string, Promise<THREE.Texture>>();

// Textures are sampled as-is (no colour-space conversion): the custom shaders
// write display colours directly, so the image's pixel values are what we want.
const load = (file: string) => {
  if (!cache.has(file)) {
    cache.set(
      file,
      new THREE.TextureLoader().loadAsync(staticFile(file)).then((tex) => {
        tex.anisotropy = 4;
        return tex;
      })
    );
  }
  return cache.get(file)!;
};

/**
 * Loads a texture from public/ and holds the render until it is ready.
 */
export const useTexture = (file: string): THREE.Texture | null => {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  const [handle] = useState(() => delayRender(`Loading texture ${file}`));
  useEffect(() => {
    load(file)
      .then((t) => {
        setTex(t);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [file, handle]);
  return tex;
};

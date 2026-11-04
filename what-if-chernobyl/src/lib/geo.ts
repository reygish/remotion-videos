/** Map size used by components/WorldMap.tsx (equirectangular). */
export const MAP_W = 1000;
export const MAP_H = 500;

/** Equirectangular projection of [longitude, latitude] into the 1000×500 map. */
export const project = (lon: number, lat: number): [number, number] => [
  ((lon + 180) / 360) * MAP_W,
  ((90 - lat) / 180) * MAP_H,
];

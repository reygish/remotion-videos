/** Deterministic pseudo-random number in [0, 1) for a given seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Clamp options for interpolate(): hold the edge values outside the input range. */
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

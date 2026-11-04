import {rand} from '../../lib/math';

export type Box = {x: number; z: number; w: number; d: number; y: number; h: number};
export type Spire = {x: number; z: number; y: number; h: number};

const bump = (x: number, z: number, cx: number, cz: number, rx: number, rz: number) =>
  Math.exp(-(((x - cx) / rx) ** 2) - ((z - cz) / rz) ** 2);

/**
 * A Manhattan-like island across the river: a grid of blocks with two tall
 * clusters (downtown, right; midtown, left/behind), setback tiers and spires.
 * Only what the camera can see is generated.
 */
export const buildSkyline = () => {
  const boxes: Box[] = [];
  const spires: Spire[] = [];
  const tower = (x: number, z: number, w: number, d: number, h: number, seed: number) => {
    boxes.push({x, z, w, d, y: 0, h});
    if (h > 150) {
      const h2 = h * (0.18 + rand(seed * 3.3) * 0.12);
      boxes.push({x, z, w: w * 0.72, d: d * 0.72, y: h, h: h2});
      if (h > 240) {
        const h3 = h * 0.1;
        boxes.push({x, z, w: w * 0.45, d: d * 0.45, y: h + h2, h: h3});
        if (rand(seed * 7.1) < 0.5) spires.push({x, z, y: h + h2 + h3, h: h * 0.12});
      }
    }
  };
  let i = 0;
  for (let z = -900; z > -3400; z -= 68) {
    for (let x = -1500; x < 1500; x += 58) {
      i++;
      if (Math.abs(x) > 0.42 * -z + 200) continue;
      if (rand(i * 1.7) < 0.14) continue;
      const jx = x + (rand(i * 2.9) - 0.5) * 14;
      const jz = z + (rand(i * 4.3) - 0.5) * 14;
      const c = bump(jx, jz, 230, -1180, 330, 230) * 300 + bump(jx, jz, -320, -2150, 460, 420) * 290 + bump(jx, jz, 700, -2600, 400, 400) * 120;
      const h = 22 + rand(i * 5.1) * 45 + c * (0.35 + 0.65 * Math.sqrt(rand(i * 6.7)));
      tower(jx, jz, 24 + rand(i * 8.1) * 22, 24 + rand(i * 9.3) * 22, h, i);
    }
  }
  // Hero towers: a slim supertall downtown and a tall midtown tower with a spire.
  tower(140, -1150, 46, 46, 330, 999);
  spires.push({x: 140, z: -1150, y: 330 + 330 * 0.25 + 33, h: 75});
  tower(-260, -2050, 40, 52, 300, 555);
  spires.push({x: -260, z: -2050, y: 300 + 300 * 0.24 + 30, h: 60});
  return {boxes, spires};
};

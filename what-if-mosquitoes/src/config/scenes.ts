/** Scene lengths in frames (30 fps). Edit these to re-time the video. */
export const SCENES = {
  hook: 120,
  deadly: 210,
  saved: 180,
  pond: 240,
  arctic: 210,
  flower: 180,
  verdict: 270,
};
export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);

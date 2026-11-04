# Remotion videos

Short vertical videos (1080×1920, 30 fps) built with [Remotion](https://www.remotion.dev). Each folder is a self-contained video project.

| Folder | Video | Length |
|---|---|---|
| [`what-if-mosquitoes/`](what-if-mosquitoes) | What if mosquitoes didn't exist? | 63s, Kokoro voiceover |
| [`what-if-chernobyl/`](what-if-chernobyl) | What if Chernobyl never happened? | 65s, Kokoro voiceover |
| [`what-if-hotter-sun/`](what-if-hotter-sun) | What if the Sun was one degree hotter? | 65s, Kokoro voiceover |
| [`what-if-hotter-sun-3d/`](what-if-hotter-sun-3d) | What if the Sun was one degree hotter? (3D) | 65s, Three.js 3D Sun and Earth |
| [`what-if-flash-run/`](what-if-flash-run) | What if you ran like the Flash from LA to New York? | 80s, first-person 3D run with HUD |

## Working on a video

```bash
cd what-if-mosquitoes
npm install
npm run studio   # live preview
npm run render   # writes out/<name>.mp4
```

## Adding a new video

Copy an existing folder as a starting point, rename it, then edit its `src/scenes/` and `src/config/scenes.ts`. Add a row to the table above.

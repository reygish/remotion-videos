# Remotion videos

Short vertical videos (1080×1920, 30 fps) built with [Remotion](https://www.remotion.dev). Each folder is a self-contained video project.

| Folder | Video | Length |
|---|---|---|
| [`what-if-mosquitoes/`](what-if-mosquitoes) | What if mosquitoes didn't exist? | 47s |

## Working on a video

```bash
cd what-if-mosquitoes
npm install
npm run studio   # live preview
npm run render   # writes out/<name>.mp4
```

## Adding a new video

Copy an existing folder as a starting point, rename it, then edit its `src/scenes/` and `src/config/scenes.ts`. Add a row to the table above.

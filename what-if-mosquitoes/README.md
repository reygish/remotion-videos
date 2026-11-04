# What if mosquitoes didn't exist?

A 47-second vertical (1080×1920, 30 fps) short video built with [Remotion](https://www.remotion.dev).

## Commands

| Command | What it does |
|---|---|
| `npm run studio` | Opens the live preview in your browser |
| `npm run render` | Renders `out/what-if-mosquitoes.mp4` |
| `npm run typecheck` | Type-checks the project |

The `render` script points at this cloud container's Chromium. On your own machine, drop the `--browser-executable` flag.

## Layout

```
src/
├── index.ts               Entry point (registers the root)
├── Root.tsx               Declares the composition (size, fps, length)
├── WhatIfMosquitoes.tsx   The timeline: scene order + progress bar
├── config/
│   ├── scenes.ts          Scene durations in frames ← re-time the video here
│   └── theme.ts           Font
├── lib/
│   └── math.ts            rand() and clamp helpers
├── components/            Reusable building blocks
│   ├── SceneFrame.tsx     Fade in/out + slow zoom wrapper
│   ├── Headline.tsx       Big title text
│   ├── Caption.tsx        Word-by-word TikTok-style captions
│   ├── ProgressBar.tsx    Top progress bar
│   ├── Mosquito.tsx       Animated SVG mosquito
│   ├── Person.tsx         Person icon (Saved scene)
│   └── Fish.tsx           Fish (Pond scene)
└── scenes/                One file per scene, in play order
    ├── Hook.tsx           Title + swarm + "no" stamp
    ├── Deadly.tsx         600,000 counter + disease pills
    ├── Saved.tsx          Grid of people lighting up
    ├── Pond.tsx           Larvae vanish, hungry fish
    ├── Arctic.tsx         Migrating birds, fading swarm
    ├── Flower.tsx         Orchid loses its pollinator
    └── Verdict.tsx        Species bar + end card
```

## Making changes

- **Change wording:** edit the `Headline` and `Caption` text in the scene file.
- **Re-time:** change the numbers in `config/scenes.ts`. Caption `end` values are in frames relative to the scene.
- **Add a scene:** create `src/scenes/MyScene.tsx`, add its duration to `config/scenes.ts`, and add it to `TIMELINE` in `WhatIfMosquitoes.tsx`.

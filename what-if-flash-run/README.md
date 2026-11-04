# What if you ran like the Flash from LA to New York?

An 80-second vertical (1080×1920, 30 fps) first-person "3D sandbox" run, built with [Remotion](https://www.remotion.dev) and [Three.js](https://threejs.org) (via [`@remotion/three`](https://www.remotion.dev/docs/three)), narrated with [Kokoro](https://github.com/hexgrad/kokoro) text-to-speech.

You run from Los Angeles toward New York, speeding up stage by stage: walking, Usain Bolt, the sound barrier, Mach 10, orbital speed, and finally the whole trip in one second. A game-style HUD tracks your speed, Mach number and ETA.

## Commands

| Command | What it does |
|---|---|
| `npm run studio` | Opens the live preview in your browser |
| `npm run render` | Renders `out/what-if-flash-run.mp4` (uses `--gl=angle` for WebGL) |
| `npm run typecheck` | Type-checks the project |

Requires Node.js 18+. Remotion downloads its own headless browser and ffmpeg on first render. 3D rendering needs WebGL: `--gl=angle` uses your GPU. On a machine without one (e.g. a cloud server), render with `--gl=swangle` instead (software rendering, much slower).

## How it's layered

`src/WhatIfFlashRun.tsx` stacks four layers, back to front:

1. **World** (`src/world/`): one continuous first-person 3D scene for the whole video, driven by the global frame.
2. **Scene overlays** (`src/scenes/`): transparent titles, stats and 2D effects for each stage.
3. **HUD** (`src/components/Hud.tsx`, `src/components/hud/`): speed, Mach, ETA and the route bar.
4. **Captions, narration and progress bar.**

## Layout

```
src/
├── index.ts, Root.tsx     Entry point and composition (id: WhatIfFlashRun)
├── WhatIfFlashRun.tsx     The layer stack + scene order
├── config/
│   ├── scenes.ts          Scene lengths (stretch to fit narration) and SCENE_START frames
│   ├── run.ts             The physics: speed, Mach, ETA per stage (with sources of each number)
│   ├── voiceover.json     GENERATED: narration clip lengths + word timings
│   └── theme.ts           Font
├── lib/                   math helpers, cue(scene, word), texture loading
├── world/                 The 3D run (camera rig, speed profile, environment pieces)
├── shaders/               GLSL for the 3D world
├── components/            Captions, headlines, HUD and other 2D building blocks
└── scenes/                One transparent overlay per stage, in play order
voiceover/                 script.json (narration text), generate.py (Kokoro TTS)
public/voiceover/          Generated narration clips (one mp3 per scene)
public/textures/           Texture maps used by the 3D world
```

## The numbers

| Stage | Speed | LA → NYC (3,936 km straight line) |
|---|---|---|
| Walking | 5 km/h | 33 days nonstop |
| Usain Bolt's top speed | 44.7 km/h | 3.7 days |
| Speed of sound (Mach 1) | 1,235 km/h | 3 h 11 min |
| Mach 10 | 12,350 km/h | 19 min. Air ahead of you compresses to ~6,000 K, about the Sun's surface temperature |
| Orbital speed | 7.9 km/s | 8 min. The ground curves away as fast as you fall: you're in orbit |
| "Flash" | 3,936 km/s | 1 s. That's Mach ~11,500 (1.3% of light speed); following Earth's curve takes v²/R ≈ 248,000 g; an 80 kg runner carries ½mv² ≈ 6.2×10¹⁴ J ≈ 148 kt of TNT ≈ 10 Hiroshima bombs (15 kt) |
| Plane | ~800 km/h | ~5 h |

## Voiceover

Edit `voiceover/script.json`, then regenerate (Python 3.10–3.12 and ffmpeg; the model downloads from Hugging Face on first run):

```bash
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r voiceover/requirements.txt
python voiceover/generate.py
```

Scene lengths, captions, HUD and word-cued animations update automatically on the next render.

## Note

"The Flash" is a DC Comics character, mentioned here only as a reference for the hypothetical. The video does not depict the character, costume or emblem.

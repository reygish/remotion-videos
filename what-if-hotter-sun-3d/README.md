# What if the Sun was one degree hotter? (3D)

The 3D version of [`what-if-hotter-sun`](../what-if-hotter-sun): same script and narration, but the Sun and Earth are real 3D objects rendered with [Three.js](https://threejs.org) through [`@remotion/three`](https://www.remotion.dev/docs/three).

A 65-second vertical (1080×1920, 30 fps) short video built with [Remotion](https://www.remotion.dev), narrated with [Kokoro](https://github.com/hexgrad/kokoro) text-to-speech.

The twist: one degree barely matters (+0.07% sunlight, less than the Sun's own 11-year cycle), but one percent or ten percent hotter would be a very different story.

## Commands

| Command | What it does |
|---|---|
| `npm run studio` | Opens the live preview in your browser |
| `npm run render` | Renders `out/what-if-hotter-sun-3d.mp4` (uses `--gl=angle` for WebGL) |
| `npm run typecheck` | Type-checks the project |

Requires Node.js 18+. Remotion downloads its own headless browser and ffmpeg on first render.

3D rendering needs WebGL. `--gl=angle` uses your GPU. On a machine without one (e.g. a cloud server), render with `--gl=swangle` instead (software rendering, slower).

## Layout

```
src/
├── index.ts               Entry point (registers the root)
├── Root.tsx               Declares the composition (size, fps, length)
├── WhatIfHotterSun.tsx    The timeline (composition id: WhatIfHotterSun3D): scene order + progress bar
├── config/
│   ├── scenes.ts          Minimum scene lengths; final lengths stretch to fit the narration
│   ├── voiceover.json     GENERATED: narration clip lengths + word timings
│   └── theme.ts           Font
├── lib/
│   ├── math.ts            rand() and clamp helpers
│   ├── useTexture.ts      Loads an image from public/ as a Three.js texture (holds the render until ready)
│   └── voiceover.ts       sceneWords() and cue(scene, word) for syncing to narration
├── components/            Reusable building blocks
│   ├── SceneFrame.tsx     Fade in/out + slow zoom wrapper
│   ├── Headline.tsx       Big title text
│   ├── Caption.tsx        Word-by-word captions synced to the narration
│   ├── Voiceover.tsx      Plays a scene's narration clip
│   ├── ProgressBar.tsx    Top progress bar
│   ├── Sun.tsx            3D Sun: canvas wrapper around SunBody + SunCorona
│   ├── SunHorizon.tsx     3D close-up of the Sun's curved surface (Surface scene)
│   ├── Thermometer.tsx    Glass thermometer with a fill level
│   ├── Earth.tsx          3D Earth: loads textures, then draws surface + clouds + atmosphere
│   ├── SolarCycleWave.tsx Self-drawing sine wave of the 11-year solar cycle
│   ├── Starfield.tsx      Twinkling background stars
│   ├── Steam.tsx          Rising steam wisps
│   ├── BigStat.tsx        Huge glowing number
│   ├── Chip.tsx           Rounded label pill
│   ├── CompareBar.tsx     Labeled comparison bar
│   └── three/             Meshes that live inside a 3D canvas
│       ├── SunBody.tsx        Sphere with animated granulation shader
│       ├── SunCorona.tsx      Glowing corona with flowing streamers
│       ├── EarthSurface.tsx   Textured, sunlit globe; melting ice, rising seas, Venus blend
│       ├── EarthClouds.tsx    Drifting cloud layer
│       ├── EarthAtmosphere.tsx Blue (or Venus-yellow) halo
│       └── lighting.ts        Shared sunlight direction
├── shaders/               GLSL shader source (noise, sun, corona, earth, atmosphere)
└── scenes/                One file per scene, in play order
    ├── Hook.tsx           Title over a blazing sun + "+1°C" badge
    ├── Surface.tsx        Thermometer climbs to 5,500 °C; +1° = 0.017%
    ├── Energy.tsx         E = σT⁴, +0.07% more sunlight
    ├── Cycle.tsx          Solar-cycle wave vs the 1° change; +0.1 °C vs humans' 1.2 °C
    ├── OnePercent.tsx     1% hotter: +4% output, ice melts, seas rise
    ├── TenPercent.tsx     10% hotter: +46% output, Earth turns into Venus
    └── Ending.tsx         Billion-year brightening timeline + end card
```

Outside `src/`:

```
voiceover/
├── script.json            Narration text per scene, voice and speed ← edit the words here
├── generate.py            Kokoro TTS → public/voiceover/*.mp3 + src/config/voiceover.json
└── requirements.txt
public/voiceover/          Generated narration clips (one mp3 per scene)
public/textures/           Earth and Venus texture maps (credits below)
```

## The numbers

| Claim | Basis |
|---|---|
| Surface ≈ 5,500 °C (5,772 K); +1° ≈ 0.017% | 1 / 5,772 |
| Output +0.07% | Stefan–Boltzmann, energy ∝ T⁴: 1.00017⁴ ≈ 1.0007 |
| Smaller than the solar cycle | The 11-year cycle swings total solar output by about 0.1% |
| Earth warms ≈ 0.1 °C | vs ≈ 1.2 °C of human-caused warming so far |
| 1% hotter (≈ +58 °C) → +4% output | 1.01⁴ ≈ 1.04; several degrees of warming |
| 10% hotter → +46% output | 1.1⁴ ≈ 1.46; could trigger a runaway greenhouse |
| The Sun brightens ≈ 1% per 100 million years | ≈ 10% brighter in a billion years, when the oceans are expected to start evaporating |

## Voiceover

1. Edit `voiceover/script.json`. Voices: `af_heart` (default), `af_bella`, `am_michael`, `am_onyx`, `bm_george`, and more. The first letter picks the accent (`a` American, `b` British).
2. Regenerate. This needs **Python 3.10 to 3.12** (kokoro doesn't support 3.13 yet) and ffmpeg. The model downloads from Hugging Face on first run.
   ```bash
   python3.12 -m venv .venv && source .venv/bin/activate
   pip install -r voiceover/requirements.txt
   python voiceover/generate.py
   ```
3. `npm run render`. Scene lengths, captions and word-cued animations update automatically.

Kokoro returns the exact start and end of every spoken word, so captions are timed to the audio.

## Making changes

- **Change narration/captions:** edit `voiceover/script.json` and regenerate. On-screen titles are the `Headline` text in each scene file.
- **Sync an animation to a word:** `cue('scene', 'word')` returns the frame that word is spoken. If you reword the script, check that every cued word is still spoken (a missing word throws an error naming it).
- **Re-time:** scenes last as long as their narration; raise a scene's minimum in `config/scenes.ts` to hold it longer.
- **Add a scene:** create `src/scenes/MyScene.tsx`, add it to `MIN_FRAMES` in `config/scenes.ts`, `SCENE_COMPONENTS` in `WhatIfHotterSun.tsx`, and `voiceover/script.json`, then regenerate the voiceover.

## Texture credits

- `earth_atmos_2048.jpg`, `earth_clouds_1024.png`, `earth_specular_2048.jpg`: from the [three.js examples](https://github.com/mrdoob/three.js/tree/r160/examples/textures/planets) (MIT), based on NASA imagery.
- `venus_atmosphere_2k.jpg`: [Solar System Scope](https://www.solarsystemscope.com/textures/), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credit "Solar System Scope" when you publish the video.
- The Sun has no texture: its surface and corona are generated by the shaders in `src/shaders/`.


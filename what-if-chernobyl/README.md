# What if the Chernobyl disaster never happened?

A 65-second vertical (1080×1920, 30 fps) short video built with [Remotion](https://www.remotion.dev), narrated with [Kokoro](https://github.com/hexgrad/kokoro) text-to-speech.

## Commands

| Command | What it does |
|---|---|
| `npm run studio` | Opens the live preview in your browser |
| `npm run render` | Renders `out/what-if-chernobyl.mp4` |
| `npm run typecheck` | Type-checks the project |

Requires Node.js 18+. Remotion downloads its own headless browser and ffmpeg on first render.

## Layout

```
src/
├── index.ts               Entry point (registers the root)
├── Root.tsx               Declares the composition (size, fps, length)
├── WhatIfChernobyl.tsx    The timeline: scene order + progress bar
├── config/
│   ├── scenes.ts          Minimum scene lengths; final lengths stretch to fit the narration
│   ├── voiceover.json     GENERATED: narration clip lengths + word timings
│   └── theme.ts           Font
├── lib/
│   ├── math.ts            rand() and clamp helpers
│   ├── geo.ts             project(lon, lat) for the world map
│   └── voiceover.ts       sceneWords() and cue(scene, word) for syncing to narration
├── components/            Reusable building blocks
│   ├── SceneFrame.tsx     Fade in/out + slow zoom wrapper
│   ├── Headline.tsx       Big title text
│   ├── Caption.tsx        Word-by-word captions synced to the narration
│   ├── Voiceover.tsx      Plays a scene's narration clip
│   ├── ProgressBar.tsx    Top progress bar
│   ├── Counter.tsx        Number that counts up between two frames
│   ├── Stars.tsx          Twinkling night sky
│   ├── Reactor.tsx        Power-plant block with glowing core + explosion
│   ├── RadiationSign.tsx  Radiation trefoil
│   ├── GeigerCounter.tsx  Geiger counter with a jittering needle
│   ├── FerrisWheel.tsx    Pripyat Ferris wheel with yellow gondolas
│   ├── Skyline.tsx        Apartment blocks whose windows light up
│   ├── ZoneMap.tsx        30 km exclusion zone turning into farmland
│   ├── WorldMap.tsx       Dotted world map (Nuclear scene)
│   ├── SovietFlag.tsx     Waving flag that cracks and heals
│   └── Animal.tsx         Wolf, lynx and Przewalski's horse silhouettes
└── scenes/                One file per scene, in play order
    ├── Hook.tsx           Title + radiation sign rewinding to 1986
    ├── Night.tsx          26 April 1986: failed safety test, reactor No. 4 explodes
    ├── Toll.tsx           Geiger counter + 31 / 49,000 / 350,000 counters
    ├── Pripyat.tsx        Living city with Ferris wheel, then the zone as farmland
    ├── Nuclear.tsx        World map of reactors, Italy 1987, fossil-fuel bar
    ├── Soviet.tsx         Gorbachev quote, flag cracks then heals
    └── Wildlife.tsx       Wolves, lynx and horses in the zone + end card
```

Outside `src/`:

```
voiceover/
├── script.json            Narration text per scene, voice and speed ← edit the words here
├── generate.py            Kokoro TTS → public/voiceover/*.mp3 + src/config/voiceover.json
└── requirements.txt
public/voiceover/          Generated narration clips (one mp3 per scene)
```

## Voiceover

1. Edit `voiceover/script.json`. This video uses `am_michael` at speed 1.05. Other voices: `af_heart`, `af_bella`, `am_onyx`, `bm_george`, and more. The first letter picks the accent (`a` American, `b` British).
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
- **Sync an animation to a word:** `cue('scene', 'word')` returns the frame that word is spoken.
- **Re-time:** scenes last as long as their narration; raise a scene's minimum in `config/scenes.ts` to hold it longer.
- **Add a scene:** create `src/scenes/MyScene.tsx`, add it to `MIN_FRAMES` in `config/scenes.ts`, `SCENE_COMPONENTS` in `WhatIfChernobyl.tsx`, and `voiceover/script.json`, then regenerate the voiceover.

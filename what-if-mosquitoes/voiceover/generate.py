"""Generate the voiceover with Kokoro (ONNX) and write caption timings.

Reads   voiceover/script.json
Writes  public/voiceover/<scene>.mp3   one audio clip per scene
        src/config/voiceover.json      clip lengths + per-word timings (seconds)

Usage:
    pip install -r voiceover/requirements.txt
    python voiceover/generate.py --models /path/to/kokoro-model-dir

The model dir must contain kokoro-v1.0.onnx and voices-v1.0.bin from
https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
"""
import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "voiceover" / "script.json"
AUDIO_DIR = ROOT / "public" / "voiceover"
TIMINGS = ROOT / "src" / "config" / "voiceover.json"

# Silence inserted after each sentence, by its final punctuation (seconds).
PAUSE_AFTER = {"?": 0.35, "!": 0.3, ".": 0.28, "…": 0.4}
SILENCE_DB = 0.01  # amplitude below which audio counts as silence


def split_sentences(text: str) -> list[str]:
    """Split on sentence-ending punctuation, keeping '...' with its sentence."""
    parts = re.findall(r".+?(?:\.\.\.|[.?!]|$)(?=\s|$)", text)
    return [p.strip() for p in parts if p.strip()]


def word_weight(word: str) -> float:
    """Rough spoken length of a word: letters/digits, plus a pause for punctuation."""
    core = re.sub(r"[^\w]", "", word)
    weight = len(core) + 2
    if any(ch.isdigit() for ch in core):
        weight += len(core) * 2  # numbers are read out as several words
    if word.endswith((",", ";", ":")):
        weight += 3
    if word.endswith("..."):
        weight += 5
    return weight


def speech_bounds(audio: np.ndarray, sr: int) -> tuple[float, float]:
    """Start/end (s) of the audible part of a clip."""
    loud = np.flatnonzero(np.abs(audio) > SILENCE_DB)
    if loud.size == 0:
        return 0.0, len(audio) / sr
    return loud[0] / sr, loud[-1] / sr


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--models", required=True, help="dir with kokoro-v1.0.onnx + voices-v1.0.bin")
    args = parser.parse_args()
    models = Path(args.models)

    config = json.loads(SCRIPT.read_text())
    kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    timings: dict = {"voice": config["voice"], "scenes": {}}
    for key, scene in config["scenes"].items():
        chunks: list[np.ndarray] = []
        words: list[dict] = []
        cursor = 0.0
        sr = 24000
        for sentence in split_sentences(scene["text"]):
            audio, sr = kokoro.create(sentence, voice=config["voice"], speed=config["speed"], lang="en-us")
            start, end = speech_bounds(audio, sr)
            tokens = sentence.split()
            weights = [word_weight(t) for t in tokens]
            total = sum(weights)
            t = cursor + start
            for token, w in zip(tokens, weights):
                dur = (end - start) * w / total
                words.append({"text": token, "start": round(t, 3), "end": round(t + dur, 3)})
                t += dur
            pause = PAUSE_AFTER.get(sentence[-1], 0.2)
            chunks += [audio, np.zeros(int(pause * sr), dtype=np.float32)]
            cursor += len(audio) / sr + pause

        clip = np.concatenate(chunks[:-1])  # drop the trailing pause
        with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
            sf.write(wav.name, clip, sr)
            subprocess.run(
                ["ffmpeg", "-loglevel", "error", "-y", "-i", wav.name, "-b:a", "128k", str(AUDIO_DIR / f"{key}.mp3")],
                check=True,
            )
        timings["scenes"][key] = {
            "duration": round(len(clip) / sr, 3),
            "captions": scene.get("captions", True),
            "words": words,
        }
        print(f"{key:8s} {len(clip) / sr:5.2f}s  {len(words)} words")

    TIMINGS.write_text(json.dumps(timings, indent=2) + "\n")
    print(f"wrote {TIMINGS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

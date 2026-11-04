"""Generate the voiceover with Kokoro and write caption timings.

Reads   voiceover/script.json
Writes  public/voiceover/<scene>.mp3   one audio clip per scene
        src/config/voiceover.json      clip lengths + per-word timings (seconds)

Requires Python 3.10-3.12 and ffmpeg. The Kokoro-82M model is downloaded from
Hugging Face on first run.

Usage:
    pip install -r voiceover/requirements.txt
    python voiceover/generate.py
"""
import json
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "voiceover" / "script.json"
AUDIO_DIR = ROOT / "public" / "voiceover"
TIMINGS = ROOT / "src" / "config" / "voiceover.json"
SAMPLE_RATE = 24000


def timed_words(tokens, offset: float) -> list[dict]:
    """Turn Kokoro tokens into caption words, gluing punctuation onto the word before it."""
    words: list[dict] = []
    for tok in tokens:
        is_punct = not any(ch.isalnum() for ch in tok.text)
        if is_punct and words:
            words[-1]["text"] += tok.text
            continue
        if tok.start_ts is None or tok.end_ts is None:
            # Rare: no timing for this token. Place it right after the previous word.
            prev_end = words[-1]["end"] if words else offset
            words.append({"text": tok.text, "start": prev_end, "end": prev_end + 0.25})
            continue
        words.append({
            "text": tok.text,
            "start": round(offset + tok.start_ts, 3),
            "end": round(offset + tok.end_ts, 3),
        })
    return words


def main() -> None:
    config = json.loads(SCRIPT.read_text())
    voice, speed = config["voice"], config["speed"]
    # lang_code 'a' = American English, 'b' = British English (match the voice prefix).
    pipeline = KPipeline(lang_code=voice[0], repo_id="hexgrad/Kokoro-82M")
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    timings: dict = {"voice": voice, "scenes": {}}
    for key, scene in config["scenes"].items():
        chunks: list[np.ndarray] = []
        words: list[dict] = []
        offset = 0.0
        # Kokoro may split long text into several segments; timestamps are per segment.
        for result in pipeline(scene["text"], voice=voice, speed=speed):
            audio = result.audio.cpu().numpy() if hasattr(result.audio, "cpu") else np.asarray(result.audio)
            words += timed_words(result.tokens, offset)
            chunks.append(audio)
            offset += len(audio) / SAMPLE_RATE

        clip = np.concatenate(chunks)
        with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
            sf.write(wav.name, clip, SAMPLE_RATE)
            subprocess.run(
                ["ffmpeg", "-loglevel", "error", "-y", "-i", wav.name, "-b:a", "128k", str(AUDIO_DIR / f"{key}.mp3")],
                check=True,
            )
        timings["scenes"][key] = {
            "duration": round(len(clip) / SAMPLE_RATE, 3),
            "captions": scene.get("captions", True),
            "words": words,
        }
        print(f"{key:8s} {len(clip) / SAMPLE_RATE:5.2f}s  {len(words)} words")

    TIMINGS.write_text(json.dumps(timings, indent=2) + "\n")
    print(f"wrote {TIMINGS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

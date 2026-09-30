"""Synthesize sentences with VieNeu-TTS v3 Turbo (ONNX on CPU), one WAV per sentence.

Driven by video/tts/local.ts. Reads one JSON job from stdin:
  {"voice": "Hải Đăng", "items": [{"text": "...", "out": "/abs/path.wav", "temperature": 0.8}]}
and prints one JSON line per written file: {"out": ..., "seconds": ...}.
The model loads once per job, so a whole video is one process.
"""
import json
import sys

from vieneu import Vieneu


def main() -> None:
    job = json.load(sys.stdin)
    tts = Vieneu()
    voice = job["voice"]
    if tts.resolve_voice_name(voice) is None:
        raise SystemExit(f"Unknown VieNeu voice: {voice}")
    for item in job["items"]:
        audio = tts.infer(item["text"], voice=voice, temperature=item["temperature"])
        tts.save(audio, item["out"])
        print(json.dumps({"out": item["out"], "seconds": len(audio) / tts.sample_rate}), flush=True)


if __name__ == "__main__":
    main()

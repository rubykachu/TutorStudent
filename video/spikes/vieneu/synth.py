"""Synthesize the spike test lines with VieNeu-TTS v3 Turbo (ONNX/CPU) and time each run.

Usage: HF_HOME=./.hf .venv/bin/python synth.py [voice ...]
Writes out/<voice-slug>_<line-id>.wav and prints a JSON line per synthesis
(load time, synth time, audio duration, real-time factor).
"""
import json
import sys
import time
import unicodedata
from pathlib import Path

from vieneu import Vieneu

LINES = {
    "math": "Luỹ thừa bậc n của a là tích của n thừa số bằng nhau, mỗi thừa số bằng a.",
    "fox": "Con cáo nói: Nếu bạn cảm hoá mình, tụi mình sẽ cần đến nhau. "
           "Bạn đối với mình sẽ là duy nhất trên đời.",
}
OUT = Path(__file__).parent / "out"


def slug(name: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", name.replace("đ", "d").replace("Đ", "D"))
    ascii_name = ascii_name.encode("ascii", "ignore").decode()
    return "-".join(ascii_name.lower().split())


def main() -> None:
    OUT.mkdir(exist_ok=True)
    t0 = time.perf_counter()
    tts = Vieneu()
    load_s = time.perf_counter() - t0
    print(json.dumps({"event": "loaded", "backend": getattr(tts, "backend", "?"), "load_s": round(load_s, 2)}))
    print(json.dumps({"event": "voices", "voices": [label for label, _ in tts.list_preset_voices()]},
                     ensure_ascii=False))

    voices = sys.argv[1:] or [None]
    # Warm-up so the first timed run does not include graph initialisation.
    tts.infer("Xin chào.", voice=voices[0])
    for voice in voices:
        for line_id, text in LINES.items():
            t = time.perf_counter()
            audio = tts.infer(text, voice=voice)
            synth_s = time.perf_counter() - t
            dur = len(audio) / tts.sample_rate
            path = OUT / f"{slug(voice or 'default')}_{line_id}.wav"
            tts.save(audio, str(path))
            print(json.dumps({"event": "synth", "voice": voice, "line": line_id, "synth_s": round(synth_s, 2),
                              "audio_s": round(dur, 2), "rtf": round(synth_s / dur, 3), "file": str(path)},
                             ensure_ascii=False))


if __name__ == "__main__":
    main()

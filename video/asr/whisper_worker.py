"""Transcribe Vietnamese speech with mlx-whisper, with word timestamps.

Driven by video/asr/whisper.ts. Reads one JSON job from stdin:
  {"model": "mlx-community/whisper-large-v3-turbo", "files": ["/abs/a.wav", ...]}
and prints one JSON line per file:
  {"file": ..., "text": "...", "words": [{"word": "...", "start": 0.12, "end": 0.40}]}
No initial prompt is given: the transcript must show what the voice really
said, so it can be checked against the script.
"""
import json
import sys

import mlx_whisper


def main() -> None:
    job = json.load(sys.stdin)
    for path in job["files"]:
        result = mlx_whisper.transcribe(
            path,
            path_or_hf_repo=job["model"],
            language="vi",
            temperature=0.0,
            word_timestamps=True,
            condition_on_previous_text=False,
        )
        words = [
            {"word": w["word"].strip(), "start": round(w["start"], 3), "end": round(w["end"], 3)}
            for seg in result["segments"]
            for w in seg.get("words", [])
            if w["word"].strip()
        ]
        print(json.dumps({"file": path, "text": result["text"].strip(), "words": words}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    main()

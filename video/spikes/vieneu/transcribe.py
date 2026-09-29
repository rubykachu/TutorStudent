"""Transcribe WAV files back to text with mlx-whisper (Vietnamese) to check TTS pronunciation.

Usage: HF_HOME=./.hf .venv/bin/python transcribe.py out/*.wav
"""
import json
import sys

import mlx_whisper

MODEL = "mlx-community/whisper-large-v3-turbo"

for path in sys.argv[1:]:
    result = mlx_whisper.transcribe(path, path_or_hf_repo=MODEL, language="vi", temperature=0.0)
    print(json.dumps({"file": path, "text": result["text"].strip()}, ensure_ascii=False))

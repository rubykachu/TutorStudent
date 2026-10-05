"""Synthesize sentences with OmniVoice (PyTorch, MPS fp16), one WAV per sentence.

Driven by video/tts/omnivoice.ts. Long-running: the model loads once, on the
first job, and serves every job of a build. Reads one JSON job per stdin line:
  {"model": "k2-fsa/OmniVoice", "revision": "<sha>",
   "ref": {"audio": "/abs/ref.flac", "text": "transcript of the reference"},
   "items": [{"text": "...", "out": "/abs/path.wav"}]}
prints one JSON line per written file:
  {"out": ..., "seconds": <audio length>, "synthSeconds": <time spent>, "seed": <int>}
then {"done": true}. Exits when stdin closes. The voice is cloned from the
reference; its clone prompt is made once per reference and reused.
"""
import json
import random
import sys
import time

import soundfile as sf
import torch
from omnivoice import OmniVoice


def main() -> None:
    model = None
    prompts = {}
    for line in sys.stdin:
        if not line.strip():
            continue
        job = json.loads(line)
        if model is None:
            model = OmniVoice.from_pretrained(
                job["model"], revision=job["revision"], device_map="mps", dtype=torch.float16
            )
        ref = job["ref"]
        if ref["audio"] not in prompts:
            prompts[ref["audio"]] = model.create_voice_clone_prompt(
                ref_audio=ref["audio"], ref_text=ref["text"]
            )
        for item in job["items"]:
            # A fresh seed per take, so a sentence synthesized again after a
            # failed check comes out different.
            seed = random.randrange(2**31)
            torch.manual_seed(seed)
            start = time.perf_counter()
            audio = model.generate(
                text=item["text"], language="vi", voice_clone_prompt=prompts[ref["audio"]]
            )[0]
            torch.mps.synchronize()
            spent = time.perf_counter() - start
            sf.write(item["out"], audio, model.sampling_rate)
            print(
                json.dumps(
                    {
                        "out": item["out"],
                        "seconds": len(audio) / model.sampling_rate,
                        "synthSeconds": spent,
                        "seed": seed,
                    }
                ),
                flush=True,
            )
        print(json.dumps({"done": True}), flush=True)


if __name__ == "__main__":
    main()

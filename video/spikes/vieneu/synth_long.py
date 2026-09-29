"""Time VieNeu-TTS v3 Turbo on a ~70 s grade-6 lesson paragraph (long-form RTF + stability).

Usage: HF_HOME=./.hf .venv/bin/python synth_long.py "<voice>"
"""
import json
import sys
import time
from pathlib import Path

from vieneu import Vieneu

from synth import OUT, slug

PARAGRAPH = (
    "Hôm nay chúng ta cùng tìm hiểu về luỹ thừa với số mũ tự nhiên. "
    "Luỹ thừa bậc n của a là tích của n thừa số bằng nhau, mỗi thừa số bằng a. "
    "Ta viết a mũ n, trong đó a gọi là cơ số, còn n gọi là số mũ. "
    "Ví dụ, hai mũ ba bằng hai nhân hai nhân hai, tức là bằng tám. "
    "Ba mũ hai còn được đọc là ba bình phương, và bằng chín. "
    "Năm mũ ba còn được đọc là năm lập phương, và bằng một trăm hai mươi lăm. "
    "Quy ước: a mũ một bằng chính a, và a mũ không bằng một, với a khác không. "
    "Khi nhân hai luỹ thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ. "
    "Khi chia hai luỹ thừa cùng cơ số, ta giữ nguyên cơ số và trừ các số mũ. "
    "Bây giờ, em hãy thử tính hai mũ năm nhé. Đáp án là ba mươi hai. "
    "Chúc mừng em, em đã hiểu bài rồi đấy!"
)

voice = sys.argv[1] if len(sys.argv) > 1 else None
tts = Vieneu()
tts.infer("Xin chào.", voice=voice)
t = time.perf_counter()
audio = tts.infer(PARAGRAPH, voice=voice)
synth_s = time.perf_counter() - t
dur = len(audio) / tts.sample_rate
path = OUT / f"{slug(voice or 'default')}_lesson.wav"
tts.save(audio, str(path))
print(json.dumps({"voice": voice, "synth_s": round(synth_s, 2), "audio_s": round(dur, 2),
                  "rtf": round(synth_s / dur, 3), "file": str(path)}, ensure_ascii=False))

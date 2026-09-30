import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { type AsrWord, transcribe } from "../asr/whisper";
import {
  MATCH_THRESHOLD,
  MAX_REGENERATIONS,
  TEMPO,
  WHISPER_MODEL,
} from "../config";
import type { TtsEngine, VoiceInfo } from "../tts/types";
import { probeDuration, slowSentence } from "./audio";
import type { VideoScript } from "./script";
import { matchRate } from "./text";

// One narrated sentence: its audio (trimmed and slowed), what Whisper heard
// in it and how closely that matches the script.
export type SentenceTake = {
  sceneId: string;
  text: string;
  spoken: string;
  file: string;
  duration: number;
  transcript: string;
  matchRate: number;
  // Syntheses it took, first try included.
  attempts: number;
  // Word times inside the sentence file.
  words: AsrWord[];
};

type Line = { sceneId: string; text: string; spoken: string; key: string };

// Takes are cached by everything that changes the audio, so editing one
// sentence of a script re-synthesizes only that sentence.
function cacheKey(voice: VoiceInfo, spoken: string): string {
  return createHash("sha256")
    .update(JSON.stringify([voice, spoken, TEMPO, WHISPER_MODEL]))
    .digest("hex")
    .slice(0, 16);
}

// Synthesizes every sentence, checks each against the script with Whisper and
// synthesizes a mismatching sentence again, up to MAX_REGENERATIONS times,
// keeping its best take. Sentences still below MATCH_THRESHOLD come back
// flagged for a human to listen to.
export async function narrate(
  script: VideoScript,
  engine: TtsEngine,
  audioDir: string,
): Promise<SentenceTake[]> {
  mkdirSync(audioDir, { recursive: true });
  const voice = engine.voice(script.voice);
  const lines: Line[] = script.scenes.flatMap((scene) =>
    scene.sentences.map((s) => {
      const spoken = s.say ?? s.text;
      return {
        sceneId: scene.id,
        text: s.text,
        spoken,
        key: cacheKey(voice, spoken),
      };
    }),
  );
  const takeFile = (line: Line) => path.join(audioDir, `${line.key}.json`);
  const best = new Map<string, SentenceTake>();
  for (const line of lines) {
    if (existsSync(takeFile(line))) {
      const take: SentenceTake = JSON.parse(
        readFileSync(takeFile(line), "utf8"),
      );
      // Scored again, so a change to the normalisation reaches cached takes.
      best.set(line.key, {
        ...take,
        matchRate: matchRate(line.spoken, take.transcript),
      });
    }
  }

  let pending = [
    ...new Map(
      lines.filter((l) => !best.has(l.key)).map((l) => [l.key, l]),
    ).values(),
  ];
  for (
    let attempt = 1;
    pending.length > 0 && attempt <= MAX_REGENERATIONS + 1;
    attempt++
  ) {
    console.log(
      `video: synthesizing ${pending.length} sentence(s), take ${attempt}`,
    );
    const raw = (l: Line) =>
      path.join(audioDir, `${l.key}.take${attempt}.raw.wav`);
    const slow = (l: Line) =>
      path.join(audioDir, `${l.key}.take${attempt}.wav`);
    await engine.synthesize(
      script.voice,
      pending.map((l) => ({ text: l.spoken, out: raw(l) })),
    );
    for (const l of pending) slowSentence(raw(l), slow(l));
    const heard = await transcribe(pending.map(slow));
    for (const l of pending) {
      const transcript = heard.get(slow(l));
      if (!transcript) throw new Error(`No transcript for ${slow(l)}`);
      const rate = matchRate(l.spoken, transcript.text);
      const previous = best.get(l.key);
      if (!previous || rate > previous.matchRate) {
        best.set(l.key, {
          sceneId: l.sceneId,
          text: l.text,
          spoken: l.spoken,
          file: slow(l),
          duration: probeDuration(slow(l)),
          transcript: transcript.text,
          matchRate: rate,
          attempts: attempt,
          words: transcript.words,
        });
      } else if (previous) {
        previous.attempts = attempt;
      }
    }
    pending = pending.filter(
      (l) => (best.get(l.key)?.matchRate ?? 0) < MATCH_THRESHOLD,
    );
  }

  return lines.map((line) => {
    const take = best.get(line.key);
    if (!take) throw new Error(`No take for "${line.spoken}"`);
    const final = path.join(audioDir, `${line.key}.wav`);
    if (take.file !== final) {
      copyFileSync(take.file, final);
      take.file = final;
      writeFileSync(takeFile(line), `${JSON.stringify(take, null, 2)}\n`);
    }
    // The same sentence may sit in two scenes; each keeps its own scene.
    return { ...take, sceneId: line.sceneId, text: line.text };
  });
}

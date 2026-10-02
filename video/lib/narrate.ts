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
import { cutSegment, probeDuration, slowSentence } from "./audio";
import type { VideoScript } from "./script";
import { sentenceCuts } from "./split";
import { matchRate, spokenText } from "./text";

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
export function cacheKey(
  voice: VoiceInfo,
  spoken: string,
  tempo: number = TEMPO,
): string {
  return createHash("sha256")
    .update(JSON.stringify([voice, spoken, tempo, WHISPER_MODEL]))
    .digest("hex")
    .slice(0, 16);
}

type Raw = (line: Line) => string;

// Speaks all of `lines` in one request, one paragraph each, and cuts the take
// into one raw file per line at the pauses Whisper's word times show. The
// whole take is kept in `audioDir`, so a run that stops later does not ask
// the voice again. False when the take cannot be told apart into the lines;
// the caller then speaks them one by one.
async function speakWhole(
  engine: TtsEngine,
  voiceName: string,
  voice: VoiceInfo,
  lines: readonly Line[],
  raw: Raw,
  audioDir: string,
): Promise<boolean> {
  const text = lines.map((l) => l.spoken).join("\n\n");
  const key = createHash("sha256")
    .update(JSON.stringify([voice, text]))
    .digest("hex")
    .slice(0, 16);
  const whole = path.join(audioDir, `whole-${key}.wav`);
  if (!existsSync(whole)) {
    await engine.synthesize(voiceName, [{ text, out: whole }]);
  }
  const transcript = (await transcribe([whole])).get(whole);
  if (!transcript) throw new Error(`No transcript for ${whole}`);
  const duration = probeDuration(whole);
  const cuts = sentenceCuts(
    lines.map((l) => l.spoken),
    transcript.words,
    duration,
  );
  if (!cuts) {
    console.warn(
      "video: could not tell the whole take into sentences; speaking them one by one",
    );
    return false;
  }
  const bounds = [0, ...cuts, duration];
  lines.forEach((l, i) => {
    cutSegment(whole, bounds[i] as number, bounds[i + 1] as number, raw(l));
  });
  return true;
}

// Synthesizes every sentence, checks each against the script with Whisper and
// synthesizes a mismatching sentence again, up to MAX_REGENERATIONS times,
// keeping its best take. Sentences still below MATCH_THRESHOLD come back
// flagged for a human to listen to. An engine that can speak a whole narration
// at once (`speaksWhole`) does the first round in one request, so fewer
// requests are spent and the sentences share one delivery; only sentences that
// fail the check are spoken again, one by one, in the same voice.
export async function narrate(
  script: VideoScript,
  engine: TtsEngine,
  voiceName: string,
  audioDir: string,
): Promise<SentenceTake[]> {
  mkdirSync(audioDir, { recursive: true });
  const voice = engine.voice(voiceName);
  const lines: Line[] = script.scenes.flatMap((scene) =>
    scene.sentences.map((s) => {
      const spoken = spokenText(s.text, s.say);
      return {
        sceneId: scene.id,
        text: s.text,
        spoken,
        key: cacheKey(voice, spoken, engine.tempo),
      };
    }),
  );
  const takeFile = (line: Line) => path.join(audioDir, `${line.key}.json`);
  // Keeps a take in the cache, so a run that stops later keeps what is done.
  const persist = (line: Line, take: SentenceTake) => {
    const final = path.join(audioDir, `${line.key}.wav`);
    if (take.file !== final) {
      copyFileSync(take.file, final);
      take.file = final;
      writeFileSync(takeFile(line), `${JSON.stringify(take, null, 2)}\n`);
    }
  };
  const best = new Map<string, SentenceTake>();
  for (const line of lines) {
    if (existsSync(takeFile(line))) {
      const take: SentenceTake = JSON.parse(
        readFileSync(takeFile(line), "utf8"),
      );
      // Scored again, so a change to the normalisation reaches cached takes.
      // The file is resolved here, not read from the cache entry, so a cache
      // restored on another machine or path still finds its audio.
      best.set(line.key, {
        ...take,
        file: path.join(audioDir, `${line.key}.wav`),
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
    const raw: Raw = (l) =>
      path.join(audioDir, `${l.key}.take${attempt}.raw.wav`);
    const slow = (l: Line) =>
      path.join(audioDir, `${l.key}.take${attempt}.wav`);
    const whole =
      attempt === 1 &&
      engine.speaksWhole === true &&
      pending.length > 1 &&
      (await speakWhole(engine, voiceName, voice, pending, raw, audioDir));
    if (!whole) {
      await engine.synthesize(
        voiceName,
        pending.map((l) => ({ text: l.spoken, out: raw(l) })),
      );
    }
    for (const l of pending) slowSentence(raw(l), slow(l), engine.tempo);
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
    for (const l of pending) {
      const take = best.get(l.key);
      if (take && take.matchRate >= MATCH_THRESHOLD) persist(l, take);
    }
    pending = pending.filter(
      (l) => (best.get(l.key)?.matchRate ?? 0) < MATCH_THRESHOLD,
    );
  }

  return lines.map((line) => {
    const take = best.get(line.key);
    if (!take) throw new Error(`No take for "${line.spoken}"`);
    persist(line, take);
    // The same sentence may sit in two scenes; each keeps its own scene.
    return { ...take, sceneId: line.sceneId, text: line.text };
  });
}

import { writeFileSync } from "node:fs";
import { GEMINI_TEMPO } from "../config";
import {
  KeyPool,
  type RawResponse,
  readKeys,
  sendWithKeys,
} from "./gemini-keys";
import type { TtsEngine } from "./types";

// Gemini text-to-speech over its REST API, written as a WAV file: the one
// client of the narration build and of the shared-sounds build. Requests go
// out with the keys of gemini-keys.ts in turn; when every key is rate limited
// the request waits, and when every key is out of quota it throws
// GeminiQuotaError.

export const GEMINI_TTS_MODEL = "gemini-3.1-flash-tts-preview";

const API = "https://generativelanguage.googleapis.com/v1beta/models";

let pool: KeyPool | undefined;
function keyPool(): KeyPool {
  pool ??= new KeyPool(readKeys());
  return pool;
}

type InlineAudio = { mimeType: string; data: string };

// Raw 16-bit PCM (`audio/L16;rate=24000`) wrapped in a WAV header.
function pcmToWav(pcm: Buffer, rate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0, "ascii");
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8, "ascii");
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36, "ascii");
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function post(
  key: string,
  model: string,
  voice: string,
  text: string,
): Promise<RawResponse> {
  const response = await fetch(`${API}/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
        },
      },
    }),
  });
  return { status: response.status, body: await response.text() };
}

// Speaks `text` with the prebuilt `voice` of `model` into the WAV file `out`.
// The text is sent alone: a style instruction in the prompt gets read aloud.
// Every call is a new take.
export async function synthesizeGemini(
  engine: { model: string; voice: string },
  text: string,
  out: string,
): Promise<void> {
  const body = await sendWithKeys(keyPool(), (key) =>
    post(key, engine.model, engine.voice, text),
  );
  const audio = JSON.parse(body).candidates?.[0]?.content?.parts?.[0]
    ?.inlineData as InlineAudio | undefined;
  if (!audio) throw new Error(`Gemini returned no audio for "${text}"`);
  const bytes = Buffer.from(audio.data, "base64");
  const type = audio.mimeType.toLowerCase();
  if (type.startsWith("audio/wav")) {
    writeFileSync(out, bytes);
    return;
  }
  const rate = type.match(/rate=(\d+)/)?.[1];
  if (!type.startsWith("audio/l16") || !rate) {
    throw new Error(`Unexpected Gemini audio type ${audio.mimeType}`);
  }
  writeFileSync(out, pcmToWav(bytes, Number(rate)));
}

// A number of four or more digits is sent with its thousands grouped by
// spaces ("4376" and "4.376" as "4 376"), which the voice reads as one number.
// Only the request changes: captions and the transcript check keep the text
// of the lesson.
export function geminiText(text: string): string {
  return text.replace(/\d[\d.]*\d|\d/g, (number) => {
    const digits = number.replace(/\./g, "");
    if (digits.length < 4 || !/^(\d{1,3}(\.\d{3})+|\d+)$/.test(number)) {
      return number;
    }
    return digits.replace(/\B(?=(\d{3})+$)/g, " ");
  });
}

export const geminiEngine: TtsEngine = {
  tempo: GEMINI_TEMPO,
  voice: (voiceName) => ({
    engine: "gemini",
    voiceName,
    model: GEMINI_TTS_MODEL,
  }),
  // The whole narration may be spoken in one request (video/lib/narrate.ts).
  speaksWhole: true,
  async synthesize(voiceName, requests) {
    for (const request of requests) {
      await synthesizeGemini(
        { model: GEMINI_TTS_MODEL, voice: voiceName },
        geminiText(request.text),
        request.out,
      );
    }
  },
};

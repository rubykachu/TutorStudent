import { readFileSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { VoiceEngine } from "./sound-spec";

// Gemini text-to-speech over its REST API, written as a WAV file. The API
// key comes from GEMINI_API_KEY, else from ~/.config/gemini/api_key. A
// request over the per-minute limit waits as long as the API asks and tries
// again; the daily limit, or any other failure, stops the build.

const API = "https://generativelanguage.googleapis.com/v1beta/models";
const KEY_FILE = path.join(os.homedir(), ".config", "gemini", "api_key");
const MAX_RATE_LIMIT_WAITS = 10;

function apiKey(): string {
  const fromEnv = process.env.GEMINI_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  try {
    return readFileSync(KEY_FILE, "utf8").trim();
  } catch {
    throw new Error(`No Gemini API key: set GEMINI_API_KEY or ${KEY_FILE}`);
  }
}

type InlineAudio = { mimeType: string; data: string };

// Seconds the API asks to wait before retrying, from its error body.
function retryAfterS(body: string): number | undefined {
  const match = body.match(/"retryDelay":\s*"(\d+(?:\.\d+)?)s"/);
  return match ? Number(match[1]) : undefined;
}

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

async function request(
  engine: VoiceEngine,
  text: string,
): Promise<InlineAudio> {
  const key = apiKey();
  for (let wait = 0; ; wait++) {
    const response = await fetch(`${API}/${engine.model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: engine.voice } },
          },
        },
      }),
    });
    const body = await response.text();
    if (response.ok) {
      const audio = JSON.parse(body).candidates?.[0]?.content?.parts?.[0]
        ?.inlineData as InlineAudio | undefined;
      if (!audio) throw new Error(`Gemini returned no audio for "${text}"`);
      return audio;
    }
    const delay = retryAfterS(body);
    if (
      response.status === 429 &&
      delay !== undefined &&
      !body.includes("PerDay") &&
      wait < MAX_RATE_LIMIT_WAITS
    ) {
      console.log(`sounds: Gemini rate limit, waiting ${Math.ceil(delay)}s`);
      await new Promise((resolve) => setTimeout(resolve, (delay + 1) * 1000));
      continue;
    }
    throw new Error(
      `Gemini TTS failed (${response.status}) for "${text}":\n${body.slice(0, 1000)}`,
    );
  }
}

// Speaks `text` into the WAV file `out`. Every call is a new take.
export async function synthesizeGemini(
  engine: VoiceEngine,
  text: string,
  out: string,
): Promise<void> {
  const audio = await request(engine, text);
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

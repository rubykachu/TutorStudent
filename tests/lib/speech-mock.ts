import { vi } from "vitest";

// A scripted stand-in for the Web Speech API: utterances queue up in
// `spoken` and a test moves the voice along with `startNext` / `endCurrent`.

export type FakeUtterance = {
  text: string;
  voice: SpeechSynthesisVoice | null;
  lang: string;
  rate: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

export function fakeVoice(
  name: string,
  lang: string,
  localService = true,
): SpeechSynthesisVoice {
  return {
    name,
    lang,
    localService,
    default: false,
    voiceURI: name,
  } as SpeechSynthesisVoice;
}

export function installSpeech(voices: SpeechSynthesisVoice[]) {
  const spoken: FakeUtterance[] = [];
  let playing = -1;
  const listeners = new Set<() => void>();
  const synth = {
    getVoices: () => voices,
    speak: vi.fn((u: FakeUtterance) => {
      spoken.push(u);
    }),
    cancel: vi.fn(() => {
      spoken.length = 0;
      playing = -1;
    }),
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  };
  class Utterance implements FakeUtterance {
    voice: SpeechSynthesisVoice | null = null;
    lang = "";
    rate = 1;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(public text: string) {}
  }
  vi.stubGlobal("speechSynthesis", synth);
  vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
  return {
    synth,
    spoken,
    startNext() {
      playing += 1;
      spoken[playing]?.onstart?.();
    },
    endCurrent() {
      spoken[playing]?.onend?.();
    },
    setVoices(next: SpeechSynthesisVoice[]) {
      voices = next;
      for (const fn of listeners) fn();
    },
  };
}

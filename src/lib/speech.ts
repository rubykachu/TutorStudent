import { useEffect, useState } from "react";
import { sentences } from "@/content/lint/text";

// Reading lesson text aloud with the browser's own voices (Web Speech API):
// free, offline once the system voice is installed, and no audio files to
// ship. iPad and iPhone carry the Vietnamese voice "Linh"; other systems may
// have another Vietnamese voice or none, in which case nothing is offered.
//
// Each sentence is its own utterance, so the sentence being read is known
// from the utterance that starts, on every browser. Word boundary events
// would allow finer tracking, but Safari does not fire them reliably for
// Vietnamese voices.

// A little slower than the voice's default, for a grade-6 child following
// the text with their eyes.
export const READ_ALOUD_RATE = 0.9;

const PREFERRED_VOICE = /\blinh\b/i;
const HIGH_QUALITY_VOICE = /enhanced|premium|natural|neural/i;

export function isVietnamese(voice: Pick<SpeechSynthesisVoice, "lang">) {
  return voice.lang.replace("_", "-").toLowerCase().startsWith("vi");
}

function voiceRank(voice: SpeechSynthesisVoice): number {
  if (PREFERRED_VOICE.test(voice.name)) return 0;
  if (HIGH_QUALITY_VOICE.test(voice.name)) return 1;
  if (voice.localService) return 2;
  return 3;
}

// The best Vietnamese voice on this device, or null when it has none.
export function pickVietnameseVoice(
  voices: readonly SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const candidates = voices.filter(isVietnamese);
  candidates.sort((a, b) => voiceRank(a) - voiceRank(b));
  return candidates[0] ?? null;
}

function synth(): SpeechSynthesis | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }
  return window.speechSynthesis;
}

// Text split into the sentences read (and highlighted) one at a time.
export function speechSentences(text: string): string[] {
  return sentences(text);
}

export type ReadAloudOptions = {
  voice: SpeechSynthesisVoice;
  // The index of the sentence being read, then null once reading ends or
  // is stopped.
  onSentence: (index: number | null) => void;
};

type Reading = { stop: () => void };

// Only one text is read at a time across the app.
let current: Reading | null = null;

export function stopReading(): void {
  current?.stop();
}

// Reads `parts` in order, one utterance each; returns the reading's stop.
export function readAloud(
  parts: readonly string[],
  { voice, onSentence }: ReadAloudOptions,
): () => void {
  const speech = synth();
  stopReading();
  if (!speech || parts.length === 0) {
    onSentence(null);
    return () => undefined;
  }
  let active = true;
  const reading: Reading = {
    stop: () => {
      if (!active) return;
      active = false;
      if (current === reading) current = null;
      speech.cancel();
      onSentence(null);
    },
  };
  current = reading;
  parts.forEach((part, index) => {
    const utterance = new SpeechSynthesisUtterance(part);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = READ_ALOUD_RATE;
    utterance.onstart = () => {
      if (active) onSentence(index);
    };
    const finish = () => {
      if (!active || index !== parts.length - 1) return;
      active = false;
      if (current === reading) current = null;
      onSentence(null);
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    speech.speak(utterance);
  });
  return reading.stop;
}

// Leaving the page (closing the tab, backgrounding the app) stops reading;
// in-app navigation stops it through the unmounting button.
if (typeof window !== "undefined") {
  window.addEventListener("pagehide", stopReading);
}

// The device's Vietnamese voice: undefined while voices are still loading
// (browsers fill the list asynchronously), null when there is none.
export function useVietnameseVoice(): SpeechSynthesisVoice | null | undefined {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null | undefined>(
    undefined,
  );
  useEffect(() => {
    const speech = synth();
    if (!speech) {
      setVoice(null);
      return;
    }
    const update = () => {
      const voices = speech.getVoices();
      // An empty list means "not loaded yet" until `voiceschanged` says so.
      if (voices.length > 0) setVoice(pickVietnameseVoice(voices));
    };
    const onChange = () => {
      update();
      setVoice((found) => (found === undefined ? null : found));
    };
    update();
    speech.addEventListener("voiceschanged", onChange);
    return () => speech.removeEventListener("voiceschanged", onChange);
  }, []);
  return voice;
}

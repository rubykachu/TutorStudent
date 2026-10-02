// Value lists shared by the Dexie store and the synced doc schemas. This file
// imports nothing, so server code can use it without pulling in Dexie.

// `skipped`: the child chose "Bỏ qua" (in a check, practice or review
// question); it is logged but never rated.
export const ATTEMPT_CONTEXTS = [
  "practice",
  "check",
  "review",
  "skipped",
] as const;
export type AttemptContext = (typeof ATTEMPT_CONTEXTS)[number];

// A section is worked through in this order: explanation blocks, comprehension
// checks, practice exercises, then the closing recap.
export const SECTION_PHASES = ["blocks", "check", "practice", "recap"] as const;
export type SectionPhase = (typeof SECTION_PHASES)[number];

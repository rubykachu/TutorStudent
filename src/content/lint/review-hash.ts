import { createHash } from "node:crypto";
import type { Lesson } from "@/schema/content";
import { type Finding, findingCollector, type LintInput } from "./types";

// Publication gate: a published lesson carries the hash of the content that
// passed review. Any later edit changes the hash and blocks the build until
// the lesson is reviewed again.
//
// Generated media metadata is not reviewed content: `overview.narration`
// (audio and caption paths, the voice that read it) is rewritten whenever the
// narration is built again, with the reviewed text unchanged, so it is left
// out of the hash. Changing the overview text still changes the hash.

// JSON with sorted keys and NFC strings, so formatting, key order and
// Unicode composition never change the hash.
function canonicalJson(value: unknown): string {
  if (typeof value === "string") return JSON.stringify(value.normalize("NFC"));
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, child]) => child !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, child]) => `${JSON.stringify(key)}:${canonicalJson(child)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

export function computeReviewedHash(lesson: Lesson): string {
  const { status: _status, reviewedHash: _hash, ...content } = lesson;
  if (content.overview) {
    const { narration: _narration, ...overview } = content.overview;
    content.overview = overview;
  }
  return createHash("sha256").update(canonicalJson(content)).digest("hex");
}

export function lintReviewHash(input: LintInput): Finding[] {
  const { findings, report } = findingCollector(input.file, "review-hash");
  const { lesson } = input;
  const current = computeReviewedHash(lesson);
  if (lesson.status === "published" && lesson.reviewedHash === undefined) {
    report(
      ["status"],
      "Published lesson has no reviewedHash; run lesson-review",
    );
  } else if (
    lesson.reviewedHash !== undefined &&
    lesson.reviewedHash !== current
  ) {
    report(
      ["reviewedHash"],
      "Lesson changed after its review; run lesson-review again",
      lesson.status === "published" ? "error" : "warning",
    );
  }
  return findings;
}

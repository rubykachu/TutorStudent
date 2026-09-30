import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { PROJECTS_DIR } from "../config";
import { VOICE_IDS, type VoiceId, type VoiceSpec, voiceSpec } from "../voices";

// `video/projects/<lessonId>/media.json`: the settings every piece of media
// of one lesson shares. The voice is declared here once; the overview
// narration (`pnpm narration:build`) and every video (`pnpm video:build`)
// read it, so one lesson cannot mix voices.

export const LessonMediaSchema = z
  .object({
    voice: z.enum(VOICE_IDS),
    // Videos built before the opening-line rule (see `openingIssues`); each
    // is left as it is until it is rebuilt with an opening sentence.
    openingExempt: z.array(z.string()).optional(),
  })
  .strict();

export type LessonMedia = z.infer<typeof LessonMediaSchema>;

export function lessonMediaFile(lessonId: string): string {
  return path.join(PROJECTS_DIR, lessonId, "media.json");
}

export function readLessonMedia(lessonId: string): LessonMedia {
  const file = lessonMediaFile(lessonId);
  if (!existsSync(file)) {
    throw new Error(
      `${path.relative(process.cwd(), file)} is missing: declare the lesson's voice, e.g. {"voice": "hai-dang"} (allowed: ${VOICE_IDS.join(", ")})`,
    );
  }
  const parsed = LessonMediaSchema.safeParse(
    JSON.parse(readFileSync(file, "utf8")),
  );
  if (!parsed.success) {
    throw new Error(
      `${path.relative(process.cwd(), file)}: ${parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"} ${i.message}`).join("; ")}`,
    );
  }
  return parsed.data;
}

export function lessonVoice(lessonId: string): {
  id: VoiceId;
  spec: VoiceSpec;
} {
  const { voice } = readLessonMedia(lessonId);
  return { id: voice, spec: voiceSpec(voice) };
}

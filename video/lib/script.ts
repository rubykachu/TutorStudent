import { readFileSync } from "node:fs";
import { z } from "zod";
import { LocalIdSchema } from "@/schema/content";
import { TTS_ENGINES } from "../tts";

// `video/projects/<lessonId>/<name>/script.json`: what the narrator says,
// scene by scene, and which scenes explain which cards. The voice is not
// here: it is the lesson's (video/lib/lesson-media.ts).

const SentenceSchema = z.object({
  // Shown in the captions exactly as written; numbers may be digits.
  text: z.string().trim().min(1),
  // Respelling for the voice when `text` reads badly aloud. It must have the
  // same number of words, since caption words take their timing from it.
  say: z.string().trim().min(1).optional(),
  // States a rule or definition: `text` must be a note or caption of the
  // lesson word for word (video/lib/verbatim.ts).
  rule: z.literal(true).optional(),
  // Cites the reading passage: the part in quotation marks (or all of
  // `text`) must be in the lesson's source-passage.txt.
  quote: z.literal(true).optional(),
  // The greeting that opens the video; only the first sentence of the first
  // scene (see `openingIssues` in video/lib/consistency.ts).
  opening: z.literal(true).optional(),
  // Silence the build leaves after the sentence (at least PAUSE.think or
  // PAUSE.ask): "think" after a key reveal, "ask" after a question the child
  // should try before the answer shows.
  pause: z.enum(["think", "ask"]).optional(),
  // The player stops after this sentence until the child presses "Tiếp".
  checkpoint: z.literal(true).optional(),
});

const SceneSchema = z.object({
  // Composition key, e.g. "s01-ban-co".
  id: LocalIdSchema,
  sentences: z.array(SentenceSchema).min(1),
});

export const VideoScriptSchema = z
  .object({
    title: z.string().trim().min(1),
    engine: z.enum(TTS_ENGINES),
    // The poster frame is taken this far (0–1) into this scene.
    poster: z.object({ scene: LocalIdSchema, at: z.number().min(0).max(1) }),
    scenes: z.array(SceneSchema).min(1),
    // A clip spans whole scenes, `from` to `to` inclusive.
    clips: z.array(
      z.object({
        id: LocalIdSchema,
        from: LocalIdSchema,
        to: LocalIdSchema,
        cardIds: z.array(z.string()).min(1),
      }),
    ),
  })
  .strict()
  .superRefine((script, ctx) => {
    const order = new Map(script.scenes.map((s, i) => [s.id, i]));
    if (order.size !== script.scenes.length) {
      ctx.addIssue({ code: "custom", message: "Scene ids must be unique" });
    }
    const known = (id: string, path: (string | number)[]) => {
      if (!order.has(id)) {
        ctx.addIssue({
          code: "custom",
          path,
          message: `Unknown scene "${id}"`,
        });
      }
    };
    known(script.poster.scene, ["poster", "scene"]);
    script.clips.forEach((clip, i) => {
      known(clip.from, ["clips", i, "from"]);
      known(clip.to, ["clips", i, "to"]);
      if ((order.get(clip.from) ?? 0) > (order.get(clip.to) ?? 0)) {
        ctx.addIssue({
          code: "custom",
          path: ["clips", i],
          message: "A clip must start at or before the scene it ends at",
        });
      }
    });
    script.scenes.forEach((scene, i) => {
      scene.sentences.forEach((sentence, j) => {
        if (!sentence.say) return;
        const count = (t: string) => t.split(/\s+/).length;
        if (count(sentence.say) !== count(sentence.text)) {
          ctx.addIssue({
            code: "custom",
            path: ["scenes", i, "sentences", j, "say"],
            message: "`say` must have as many words as `text`",
          });
        }
      });
    });
  });

export type Pause = NonNullable<z.infer<typeof SentenceSchema>["pause"]>;
export type VideoScript = z.infer<typeof VideoScriptSchema>;

export function readScript(file: string): VideoScript {
  return VideoScriptSchema.parse(JSON.parse(readFileSync(file, "utf8")));
}

import { readFileSync } from "node:fs";
import { z } from "zod";
import { LocalIdSchema } from "@/schema/content";
import { TTS_ENGINES } from "../tts";

// `video/projects/<lessonId>/<name>/script.json`: what the narrator says,
// scene by scene, and which scenes explain which cards.

const SentenceSchema = z.object({
  // Shown in the captions exactly as written; numbers may be digits.
  text: z.string().trim().min(1),
  // Respelling for the voice when `text` reads badly aloud. It must have the
  // same number of words, since caption words take their timing from it.
  say: z.string().trim().min(1).optional(),
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
    voice: z.string().trim().min(1),
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

export type VideoScript = z.infer<typeof VideoScriptSchema>;

export function readScript(file: string): VideoScript {
  return VideoScriptSchema.parse(JSON.parse(readFileSync(file, "utf8")));
}

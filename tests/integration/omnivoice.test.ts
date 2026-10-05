// @vitest-environment node
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  HF_HOME,
  MATCH_THRESHOLD,
  OMNI_PYTHON_BIN,
  OMNIVOICE_MODEL,
  PYTHON_BIN,
} from "../../video/config";
import { narrate } from "../../video/lib/narrate";
import { VideoScriptSchema } from "../../video/lib/script";
import { omnivoiceEngine } from "../../video/tts/omnivoice";

// One sentence through the real narration step with OmniVoice: synthesis on
// the GPU, slowing, the Whisper check and the take cache, in a temporary
// folder (no lesson, no media). It loads a 3 GB model and keeps the GPU busy
// for about a minute, so it runs only through `pnpm test:omni`, which sets
// the flag below, and only when both Python environments and the model are
// set up (`pnpm video:setup-omni`); otherwise it is skipped.
const flagged = process.env.VIDEO_OMNI_SMOKE === "1";
const modelDir = path.join(
  HF_HOME,
  "hub",
  `models--${OMNIVOICE_MODEL.replace("/", "--")}`,
);
const ready =
  flagged &&
  existsSync(OMNI_PYTHON_BIN) &&
  existsSync(PYTHON_BIN) &&
  existsSync(modelDir);

const dir = mkdtempSync(path.join(tmpdir(), "omnivoice-smoke-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe.skipIf(!ready)("OmniVoice through the narration step", () => {
  it("reads a sentence without final punctuation in full, then reuses the take", async () => {
    const script = VideoScriptSchema.parse({
      title: "smoke",
      engine: "omnivoice",
      poster: { scene: "s1", at: 0 },
      scenes: [
        {
          id: "s1",
          sentences: [{ text: "Chào bạn, hôm nay ta học số nguyên dương" }],
        },
      ],
      clips: [],
    });
    const [take] = await narrate(script, omnivoiceEngine, "Hải Đăng", dir);
    expect(take?.matchRate).toBeGreaterThanOrEqual(MATCH_THRESHOLD);
    expect(take?.duration).toBeGreaterThan(1);
    const [again] = await narrate(script, omnivoiceEngine, "Hải Đăng", dir);
    expect(again?.file).toBe(take?.file);
    expect(again?.transcript).toBe(take?.transcript);
  }, 600_000);
});

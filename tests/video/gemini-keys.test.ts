// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { geminiText } from "../../video/tts/gemini";
import {
  type Clock,
  GeminiQuotaError,
  KeyPool,
  type RawResponse,
  readKeys,
  retryAfterS,
  sendWithKeys,
} from "../../video/tts/gemini-keys";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(path.join(os.tmpdir(), "gemini-keys-"));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

function fakeClock(): Clock & { slept: number[]; t: number } {
  const clock = {
    t: 0,
    slept: [] as number[],
    now: () => clock.t,
    sleep: async (ms: number) => {
      clock.slept.push(ms);
      clock.t += ms;
    },
  };
  return clock;
}

const OK: RawResponse = { status: 200, body: "{}" };
const limited = (delay: string): RawResponse => ({
  status: 429,
  body: `{"error":{"details":[{"retryDelay":"${delay}"}]}}`,
});
const DAILY: RawResponse = {
  status: 429,
  body: '{"error":{"message":"GenerateRequestsPerDayPerProjectPerModel"}}',
};

describe("readKeys", () => {
  it("reads every api_key* file, in numeric order, so a third key just works", () => {
    writeFileSync(path.join(dir, "api_key_10"), "k10\n");
    writeFileSync(path.join(dir, "api_key_2"), "k2\n");
    writeFileSync(path.join(dir, "api_key"), "k1\n");
    writeFileSync(path.join(dir, "api_key.bak"), "no");
    writeFileSync(path.join(dir, "notes"), "no");
    expect(readKeys({}, dir)).toEqual(["k1", "k2", "k10"]);
  });
  it("lets GEMINI_API_KEY win", () => {
    writeFileSync(path.join(dir, "api_key"), "k1");
    expect(readKeys({ GEMINI_API_KEY: " env " }, dir)).toEqual(["env"]);
  });
  it("names where to put keys when there are none", () => {
    expect(() => readKeys({}, dir)).toThrow(/No Gemini API key/);
    expect(() => readKeys({}, path.join(dir, "missing"))).toThrow(
      /No Gemini API key/,
    );
  });
});

describe("KeyPool and sendWithKeys", () => {
  it("takes the keys in turn, one per request", async () => {
    const used: string[] = [];
    const pool = new KeyPool(["a", "b"], fakeClock());
    for (let i = 0; i < 4; i++) {
      await sendWithKeys(
        pool,
        async (k) => {
          used.push(k);
          return OK;
        },
        {
          log: () => {},
        },
      );
    }
    expect(used).toEqual(["a", "b", "a", "b"]);
  });

  it("on a rate limit retries at once with the other key and rests the first", async () => {
    const clock = fakeClock();
    const pool = new KeyPool(["a", "b"], clock);
    const used: string[] = [];
    const send = async (k: string) => {
      used.push(k);
      return k === "a" && used.length === 1 ? limited("30s") : OK;
    };
    await sendWithKeys(pool, send, { clock, log: () => {} });
    expect(used).toEqual(["a", "b"]);
    expect(clock.slept).toEqual([]);
    // "a" rests 31 s; until then every request goes to "b".
    await sendWithKeys(pool, send, { clock, log: () => {} });
    await sendWithKeys(pool, send, { clock, log: () => {} });
    expect(used).toEqual(["a", "b", "b", "b"]);
    clock.t += 31_000;
    await sendWithKeys(pool, send, { clock, log: () => {} });
    expect(used.at(-1)).toBe("a");
  });

  it("waits for the first key to be free when every key is rate limited", async () => {
    const clock = fakeClock();
    const pool = new KeyPool(["a", "b"], clock);
    const answers = [limited("10s"), limited("20s"), OK];
    await sendWithKeys(pool, async () => answers.shift() as RawResponse, {
      clock,
      log: () => {},
    });
    expect(clock.slept).toEqual([11_000]);
  });

  it("backs off with doubling waits when the API gives no delay", () => {
    const clock = fakeClock();
    const pool = new KeyPool(["a"], clock);
    const bare = { status: 429, body: "{}" };
    pool.limited(0, bare.body);
    expect(pool.waitMs()).toBe(6000);
    clock.t += 6000;
    pool.limited(0, bare.body);
    expect(pool.waitMs()).toBe(11_000);
  });

  it("stops with GeminiQuotaError when every key hit its daily quota", async () => {
    const clock = fakeClock();
    const pool = new KeyPool(["a", "b"], clock);
    const calls: string[] = [];
    await expect(
      sendWithKeys(
        pool,
        async (k) => {
          calls.push(k);
          return DAILY;
        },
        {
          clock,
          log: () => {},
        },
      ),
    ).rejects.toBeInstanceOf(GeminiQuotaError);
    expect(calls).toEqual(["a", "b"]);
    expect(clock.slept).toEqual([]);
    // The keys stay out for the rest of the run.
    await expect(
      sendWithKeys(pool, async () => OK, { clock, log: () => {} }),
    ).rejects.toBeInstanceOf(GeminiQuotaError);
  });

  it("gives up after a few waits when the keys never recover", async () => {
    const clock = fakeClock();
    const pool = new KeyPool(["a"], clock);
    await expect(
      sendWithKeys(pool, async () => limited("5s"), { clock, log: () => {} }),
    ).rejects.toBeInstanceOf(GeminiQuotaError);
    expect(clock.slept.length).toBe(3);
  });

  it("does not rotate on other errors, and retries a server error", async () => {
    const clock = fakeClock();
    const pool = new KeyPool(["a", "b"], clock);
    await expect(
      sendWithKeys(pool, async () => ({ status: 400, body: "bad" }), {
        clock,
        log: () => {},
      }),
    ).rejects.toThrow(/failed \(400\)/);
    const answers: RawResponse[] = [{ status: 503, body: "busy" }, OK];
    const body = await sendWithKeys(
      pool,
      async () => answers.shift() as RawResponse,
      { clock, log: () => {} },
    );
    expect(body).toBe("{}");
    expect(clock.slept).toEqual([2000]);
  });

  it("reads the retry delay from the error body", () => {
    expect(retryAfterS(limited("12.5s").body)).toBe(12.5);
    expect(retryAfterS("{}")).toBeUndefined();
  });
});

describe("geminiText", () => {
  it("groups the thousands of a long number by spaces", () => {
    expect(geminiText("Tính 4376 + 1250000.")).toBe("Tính 4 376 + 1 250 000.");
    expect(geminiText("Có 4.376 hạt")).toBe("Có 4 376 hạt");
  });
  it("leaves short numbers, decimals and words alone", () => {
    expect(geminiText("Có 376 hạt, 3.5 kg, 12.3456")).toBe(
      "Có 376 hạt, 3.5 kg, 12.3456",
    );
  });
});

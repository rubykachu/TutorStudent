// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { CACHE_PREFIX, REVISION_PARAM } from "@/offline/config";
import { createCore, runPool } from "@/offline/sw-core";

const ORIGIN = "https://app.example";

class FakeCache {
  readonly store = new Map<string, Response>();
  async match(key: string | Request) {
    const hit = this.store.get(typeof key === "string" ? key : key.url);
    return hit?.clone();
  }
  async put(key: string | Request, response: Response) {
    this.store.set(typeof key === "string" ? key : key.url, response.clone());
  }
  async keys() {
    return [...this.store.keys()].map((url) => new Request(url));
  }
}

class FakeCaches {
  readonly byName = new Map<string, FakeCache>();
  async open(name: string) {
    let cache = this.byName.get(name);
    if (!cache) {
      cache = new FakeCache();
      this.byName.set(name, cache);
    }
    return cache;
  }
  async keys() {
    return [...this.byName.keys()];
  }
  async delete(name: string) {
    return this.byName.delete(name);
  }
}

function reply(
  body: string,
  options: { status?: number; url?: string; redirected?: boolean } = {},
): Response {
  const response = new Response(body, { status: options.status ?? 200 });
  Object.defineProperty(response, "url", { value: options.url ?? "" });
  Object.defineProperty(response, "redirected", {
    value: options.redirected ?? false,
  });
  return response;
}

const entries = [
  { url: "/", revision: "B1" },
  { url: "/lessons/a", revision: "B1" },
  { url: "/content/a.json", revision: "h1" },
  { url: "/_next/static/chunks/x.js", revision: null },
  { url: "/sounds/tap.m4a?v=abc", revision: null },
];

type Network = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

function setup(
  options: {
    buildId?: string;
    network?: Network;
    wait?: (ms: number) => Promise<void>;
    caches?: FakeCaches;
    entries?: typeof entries;
  } = {},
) {
  const caches = options.caches ?? new FakeCaches();
  const calls: { url: string; init?: RequestInit }[] = [];
  const network: Network =
    options.network ??
    (async (input) => {
      const url = typeof input === "string" ? input : (input as Request).url;
      return reply(`body of ${url}`, { url });
    });
  const fetchFn = vi.fn(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      calls.push({ url, init });
      return network(input, init);
    },
  );
  const core = createCore({
    buildId: options.buildId ?? "B1",
    entries: options.entries ?? entries,
    mediaBaseUrl: "",
    origin: ORIGIN,
    caches: caches as unknown as CacheStorage,
    fetch: fetchFn as unknown as typeof fetch,
    wait: options.wait ?? (() => new Promise(() => {})),
  });
  return { core, caches, calls, fetchFn };
}

function navigate(path: string): Request {
  // `new Request` refuses mode "navigate", so the mode is set on a plain
  // object that behaves like the request the worker receives.
  const request = new Request(`${ORIGIN}${path}`);
  return Object.defineProperty(request, "mode", { value: "navigate" });
}

describe("install", () => {
  it("stores every entry under its revision key with reload fetches", async () => {
    const { core, caches, calls } = setup();
    await core.install();
    const cache = caches.byName.get(`${CACHE_PREFIX}B1`) as FakeCache;
    expect([...cache.store.keys()].sort()).toEqual(
      [
        `${ORIGIN}/?${REVISION_PARAM}=B1`,
        `${ORIGIN}/lessons/a?${REVISION_PARAM}=B1`,
        `${ORIGIN}/content/a.json?${REVISION_PARAM}=h1`,
        `${ORIGIN}/_next/static/chunks/x.js`,
        `${ORIGIN}/sounds/tap.m4a?v=abc`,
      ].sort(),
    );
    expect(calls).toHaveLength(entries.length);
    for (const call of calls) expect(call.init?.cache).toBe("reload");
    expect(await core.status()).toEqual({
      state: "ready",
      cached: entries.length,
      total: entries.length,
    });
  });

  it("copies an unchanged entry from the previous build and fetches the rest", async () => {
    const caches = new FakeCaches();
    const old = setup({ caches, buildId: "B0" });
    await old.core.install();
    const next = setup({
      caches,
      buildId: "B1",
      entries: entries.map((e) =>
        e.url === "/content/a.json" ? { ...e, revision: "h2" } : e,
      ),
    });
    await next.core.install();
    // Both lists give the pages the same revision, so only the lesson file
    // whose revision changed is downloaded.
    expect(next.calls.map((c) => c.url)).toEqual([`${ORIGIN}/content/a.json`]);
  });

  it.each([
    ["a 401", () => reply("no", { status: 401, url: `${ORIGIN}/lessons/a` })],
    [
      "a redirect to the unlock page",
      () =>
        reply("unlock", {
          url: `${ORIGIN}/unlock?next=%2Flessons%2Fa`,
          redirected: true,
        }),
    ],
    ["a 500", () => reply("x", { status: 500, url: `${ORIGIN}/lessons/a` })],
  ])(
    "fails and keeps no cache when one entry answers %s",
    async (_name, bad) => {
      const caches = new FakeCaches();
      const previous = await caches.open(`${CACHE_PREFIX}B0`);
      await previous.put(`${ORIGIN}/keep`, new Response("kept"));
      const { core } = setup({
        caches,
        network: async (input) => {
          const url =
            typeof input === "string" ? input : (input as Request).url;
          return url.endsWith("/lessons/a") ? bad() : reply("ok", { url });
        },
      });
      await expect(core.install()).rejects.toThrow("/lessons/a");
      expect(caches.byName.has(`${CACHE_PREFIX}B1`)).toBe(false);
      expect(caches.byName.has(`${CACHE_PREFIX}B0`)).toBe(true);
      expect((await core.status()).state).toBe("failed");
    },
  );

  it("fails when the network is down", async () => {
    const { core, caches } = setup({
      network: async () => {
        throw new TypeError("Failed to fetch");
      },
    });
    await expect(core.install()).rejects.toThrow("Failed to fetch");
    expect(caches.byName.has(`${CACHE_PREFIX}B1`)).toBe(false);
  });

  it("reports progress while installing", async () => {
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const { core } = setup({
      network: async (input) => {
        await gate;
        const url = typeof input === "string" ? input : (input as Request).url;
        return reply("ok", { url });
      },
    });
    const installing = core.install();
    await vi.waitFor(async () =>
      expect((await core.status()).state).toBe("installing"),
    );
    expect((await core.status()).total).toBe(entries.length);
    release();
    await installing;
    expect((await core.status()).state).toBe("ready");
  });
});

describe("status", () => {
  it("reads a finished install from the cache after the worker restarted", async () => {
    const caches = new FakeCaches();
    await setup({ caches }).core.install();
    const restarted = setup({ caches });
    expect((await restarted.core.status()).state).toBe("ready");
  });

  it("says incomplete for a cache that holds fewer entries", async () => {
    const caches = new FakeCaches();
    const cache = await caches.open(`${CACHE_PREFIX}B1`);
    await cache.put(`${ORIGIN}/`, new Response("x"));
    expect((await setup({ caches }).core.status()).state).toBe("incomplete");
  });
});

describe("activate", () => {
  it("deletes the caches of other builds and nothing else", async () => {
    const caches = new FakeCaches();
    await caches.open(`${CACHE_PREFIX}B0`);
    await caches.open(`${CACHE_PREFIX}B1`);
    await caches.open("some-other-cache");
    await setup({ caches }).core.activate();
    expect(await caches.keys()).toEqual([
      `${CACHE_PREFIX}B1`,
      "some-other-cache",
    ]);
  });
});

describe("respond", () => {
  async function installed(
    network?: Network,
    wait?: (ms: number) => Promise<void>,
  ) {
    const caches = new FakeCaches();
    await setup({ caches }).core.install();
    const live = setup({ caches, network, wait });
    return { ...live, caches };
  }

  it("leaves media, api, unlock, range, rsc and cross-origin requests to the browser", async () => {
    const { core } = await installed();
    for (const request of [
      new Request(`${ORIGIN}/api/sync`),
      new Request(`${ORIGIN}/media/video/a.mp4`),
      new Request(`${ORIGIN}/media/video/a.vtt`),
      new Request(`${ORIGIN}/unlock?next=%2F`),
      new Request(`${ORIGIN}/sounds/tap.m4a?v=abc`, {
        headers: { Range: "bytes=0-" },
      }),
      new Request(`${ORIGIN}/lessons/a`, { headers: { RSC: "1" } }),
      new Request("https://media.example.com/v.mp4"),
      new Request(`${ORIGIN}/api/sync`, { method: "POST", body: "{}" }),
    ]) {
      expect(core.respond(request), request.url).toBeNull();
    }
  });

  it("answers a precached chunk or sound from the cache without the network", async () => {
    const { core, fetchFn } = await installed();
    const chunk = await core.respond(
      new Request(`${ORIGIN}/_next/static/chunks/x.js`),
    );
    expect(await chunk?.text()).toBe(
      `body of ${ORIGIN}/_next/static/chunks/x.js`,
    );
    const sound = await core.respond(
      new Request(`${ORIGIN}/sounds/tap.m4a?v=abc`),
    );
    expect(sound?.status).toBe(200);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("passes a song and an unknown file to the browser", async () => {
    const { core } = await installed();
    expect(
      core.respond(new Request(`${ORIGIN}/sounds/song.m4a?v=zzz`)),
    ).toBeNull();
    expect(core.respond(new Request(`${ORIGIN}/other/file.png`))).toBeNull();
  });

  it("returns the network answer of a navigation untouched and stores nothing", async () => {
    for (const answer of [
      reply("page", { url: `${ORIGIN}/lessons/a` }),
      reply("", { status: 401, url: `${ORIGIN}/lessons/a` }),
      reply("unlock", { url: `${ORIGIN}/unlock`, redirected: true }),
    ]) {
      const { core, caches, fetchFn } = await installed(async () => answer);
      const before = (
        await (caches.byName.get(`${CACHE_PREFIX}B1`) as FakeCache).keys()
      ).length;
      const got = await core.respond(navigate("/lessons/a?x=1"));
      expect(got).toBe(answer);
      expect(fetchFn.mock.calls[0]?.[1]).toMatchObject({ cache: "no-cache" });
      const after = (
        await (caches.byName.get(`${CACHE_PREFIX}B1`) as FakeCache).keys()
      ).length;
      expect(after).toBe(before);
    }
  });

  it("falls back to the precached page of the same path, ignoring the query, when the network fails", async () => {
    const { core } = await installed(async () => {
      throw new TypeError("offline");
    });
    const got = await core.respond(navigate("/lessons/a?intro=1#top"));
    expect(await got?.text()).toBe(`body of ${ORIGIN}/lessons/a`);
  });

  it("answers a network error for a page that is not precached", async () => {
    const { core } = await installed(async () => {
      throw new TypeError("offline");
    });
    const got = await core.respond(navigate("/lessons/unknown"));
    expect(got?.type).toBe("error");
  });

  it("falls back to the precached page after the timeout when the network hangs", async () => {
    const { core } = await installed(
      () => new Promise(() => {}),
      async () => {},
    );
    const got = await core.respond(navigate("/lessons/a"));
    expect(await got?.text()).toBe(`body of ${ORIGIN}/lessons/a`);
  });

  it("keeps waiting for the network after the timeout when no page is precached", async () => {
    let answer: (response: Response) => void = () => {};
    const slow = new Promise<Response>((resolve) => {
      answer = resolve;
    });
    const { core } = await installed(
      () => slow,
      async () => {},
    );
    const pending = core.respond(navigate("/lessons/unknown"));
    answer(reply("late"));
    expect(await (await pending)?.text()).toBe("late");
  });

  it("answers lesson files network first and from the cache only on a network error", async () => {
    const online = await installed(async () =>
      reply("fresh", { url: `${ORIGIN}/content/a.json` }),
    );
    const fresh = await online.core.respond(
      new Request(`${ORIGIN}/content/a.json`),
    );
    expect(await fresh?.text()).toBe("fresh");
    expect(online.fetchFn.mock.calls[0]?.[1]).toMatchObject({
      cache: "no-cache",
    });

    const offline = await installed(async () => {
      throw new TypeError("offline");
    });
    const cached = await offline.core.respond(
      new Request(`${ORIGIN}/content/a.json`),
    );
    expect(await cached?.text()).toBe(`body of ${ORIGIN}/content/a.json`);
    const missing = await offline.core.respond(
      new Request(`${ORIGIN}/content/zzz.json`),
    );
    expect(missing?.type).toBe("error");
  });

  it("never waits on a timer for a lesson file", async () => {
    let answer: (response: Response) => void = () => {};
    const slow = new Promise<Response>((resolve) => {
      answer = resolve;
    });
    const { core } = await installed(
      () => slow,
      async () => {},
    );
    const pending = core.respond(new Request(`${ORIGIN}/content/a.json`));
    answer(reply("slow but new"));
    expect(await (await pending)?.text()).toBe("slow but new");
  });
});

describe("runPool", () => {
  it("runs every item with at most `limit` at a time", async () => {
    let running = 0;
    let peak = 0;
    await runPool(3, [1, 2, 3, 4, 5, 6, 7], async () => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 1));
      running--;
    });
    expect(peak).toBeLessThanOrEqual(3);
  });

  it("rejects with the first failure and stops starting new work", async () => {
    const started: number[] = [];
    await expect(
      runPool(1, [1, 2, 3], async (n) => {
        started.push(n);
        if (n === 2) throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(started).toEqual([1, 2]);
  });
});

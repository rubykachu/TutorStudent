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
  async has(name: string) {
    return this.byName.has(name);
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
  { url: "/lessons/a?_rsc", revision: "B1" },
  { url: "/offline", revision: "B1" },
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
        `${ORIGIN}/lessons/a?_rsc&${REVISION_PARAM}=B1`,
        `${ORIGIN}/offline?${REVISION_PARAM}=B1`,
        `${ORIGIN}/content/a.json?${REVISION_PARAM}=h1`,
        `${ORIGIN}/_next/static/chunks/x.js`,
        `${ORIGIN}/sounds/tap.m4a?v=abc`,
      ].sort(),
    );
    expect(calls).toHaveLength(entries.length);
    for (const call of calls) expect(call.init?.cache).toBe("reload");
    // Only a flight is asked for with the RSC header.
    const withHeaders = calls.filter((c) => c.init?.headers !== undefined);
    expect(withHeaders.map((c) => c.url)).toEqual([`${ORIGIN}/lessons/a?_rsc`]);
    expect(withHeaders[0]?.init?.headers).toEqual({ rsc: "1" });
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

  it("fails when a newer build deleted its cache before the install ended", async () => {
    const caches = new FakeCaches();
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const { core } = setup({
      caches,
      network: async (input) => {
        await gate;
        const url = typeof input === "string" ? input : (input as Request).url;
        return reply("ok", { url });
      },
    });
    const installing = core.install();
    // Build B2 takes over while B1 still installs, and deletes B1's cache.
    await vi.waitFor(() =>
      expect(caches.byName.has(`${CACHE_PREFIX}B1`)).toBe(true),
    );
    await setup({ caches, buildId: "B2" }).core.activate();
    release();
    await expect(installing).rejects.toThrow("deleted during the install");
    expect((await core.status()).state).toBe("failed");
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

  it("leaves media, api, unlock, a media range, an RSC prefetch and cross-origin requests to the browser", async () => {
    const { core } = await installed();
    for (const request of [
      new Request(`${ORIGIN}/api/sync`),
      new Request(`${ORIGIN}/media/video/a.mp4`),
      new Request(`${ORIGIN}/media/video/a.vtt`),
      new Request(`${ORIGIN}/unlock?next=%2F`),
      new Request(`${ORIGIN}/media/narration/a/overview.m4a`, {
        headers: { Range: "bytes=0-" },
      }),
      new Request(`${ORIGIN}/sounds/song.m4a?v=zzz`, {
        headers: { Range: "bytes=0-" },
      }),
      new Request(`${ORIGIN}/lessons/a?_rsc=x`, {
        headers: {
          RSC: "1",
          "Next-Router-Prefetch": "1",
          "Next-Router-Segment-Prefetch": "/_tree",
        },
      }),
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

  it("finds a build file that carries Next's deployment id parameter", async () => {
    const { core, fetchFn } = await installed();
    const chunk = await core.respond(
      new Request(`${ORIGIN}/_next/static/chunks/x.js?dpl=dpl_abc`),
    );
    expect(await chunk?.text()).toBe(
      `body of ${ORIGIN}/_next/static/chunks/x.js`,
    );
    const sound = await core.respond(
      new Request(`${ORIGIN}/sounds/tap.m4a?v=abc&dpl=dpl_abc`),
    );
    expect(sound?.status).toBe(200);
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("fetches a navigation as it came when the engine refuses to copy it with an init", async () => {
    // Not a real Request, so `new Request(it, init)` throws, as an engine
    // that refuses to copy a navigation request would.
    const request = {
      url: `${ORIGIN}/lessons/a`,
      method: "GET",
      mode: "navigate",
      headers: new Headers(),
    } as unknown as Request;
    const answer = reply("page", { url: `${ORIGIN}/lessons/a` });
    const { core, fetchFn } = await installed(async () => answer);
    expect(await core.respond(request)).toBe(answer);
    expect(fetchFn).toHaveBeenCalledOnce();
    expect(fetchFn.mock.calls[0]?.[0]).toBe(request);
    expect(fetchFn.mock.calls[0]?.[1]).toBeUndefined();
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

  it("answers the offline page for a page that is not precached", async () => {
    const { core } = await installed(async () => {
      throw new TypeError("offline");
    });
    const got = await core.respond(navigate("/lessons/unknown?intro=1"));
    expect(await got?.text()).toBe(`body of ${ORIGIN}/offline`);
  });

  it("answers a network error for an unknown page when no offline page is stored", async () => {
    const caches = new FakeCaches();
    const without = entries.filter((e) => e.url !== "/offline");
    await setup({ caches, entries: without }).core.install();
    const { core } = setup({
      caches,
      entries: without,
      network: async () => {
        throw new TypeError("offline");
      },
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

  it("waits 10 s for a lesson file, then answers from the precache", async () => {
    const waits: number[] = [];
    const { core } = await installed(
      () => new Promise(() => {}),
      async (ms) => {
        waits.push(ms);
      },
    );
    const got = await core.respond(new Request(`${ORIGIN}/content/a.json`));
    expect(waits).toEqual([10_000]);
    expect(await got?.text()).toBe(`body of ${ORIGIN}/content/a.json`);
  });

  it("returns a lesson file that arrives before the timeout, not the precached copy", async () => {
    const { core } = await installed(
      async () => reply("fresh", { url: `${ORIGIN}/content/a.json` }),
      () => new Promise(() => {}),
    );
    const got = await core.respond(new Request(`${ORIGIN}/content/a.json`));
    expect(await got?.text()).toBe("fresh");
  });

  it("keeps waiting for a lesson file after the timeout when it is not precached", async () => {
    let answer: (response: Response) => void = () => {};
    const slow = new Promise<Response>((resolve) => {
      answer = resolve;
    });
    const { core } = await installed(
      () => slow,
      async () => {},
    );
    const pending = core.respond(new Request(`${ORIGIN}/content/zzz.json`));
    answer(reply("late"));
    expect(await (await pending)?.text()).toBe("late");
  });
});

describe("respond to an RSC navigation fetch", () => {
  async function installed(
    network?: Network,
    wait?: (ms: number) => Promise<void>,
  ) {
    const caches = new FakeCaches();
    await setup({
      caches,
      network: async (input) => {
        const url = typeof input === "string" ? input : (input as Request).url;
        const response = new Response(`flight of ${url}`, {
          headers: { "content-type": "text/x-component", vary: "rsc" },
        });
        Object.defineProperty(response, "url", { value: url });
        return response;
      },
    }).core.install();
    return setup({ caches, network, wait });
  }

  function flightRequest(path: string): Request {
    return new Request(`${ORIGIN}${path}`, {
      headers: { RSC: "1", "Next-Router-State-Tree": "%5B%5D" },
    });
  }

  it("returns the network answer untouched while online", async () => {
    const answer = reply("fresh flight", { url: `${ORIGIN}/lessons/a` });
    const { core, fetchFn } = await installed(async () => answer);
    const got = await core.respond(flightRequest("/lessons/a?_rsc=h1"));
    expect(got).toBe(answer);
    expect(fetchFn.mock.calls[0]?.[1]).toMatchObject({ cache: "no-cache" });
  });

  it("answers the precached flight as text/x-component offline, whatever the _rsc hash or deployment id", async () => {
    const { core } = await installed(async () => {
      throw new TypeError("offline");
    });
    for (const path of [
      "/lessons/a?_rsc=h1",
      "/lessons/a?_rsc=other",
      "/lessons/a?_rsc=h1&dpl=dpl_1",
    ]) {
      const got = await core.respond(flightRequest(path));
      expect(got?.status, path).toBe(200);
      expect(got?.headers.get("content-type"), path).toBe("text/x-component");
      expect(await got?.text(), path).toBe(
        `flight of ${ORIGIN}/lessons/a?_rsc`,
      );
    }
  });

  it("sets the RSC content type on a stored flight that lacks it", async () => {
    const caches = new FakeCaches();
    await setup({ caches }).core.install();
    const { core } = setup({
      caches,
      network: async () => {
        throw new TypeError("offline");
      },
    });
    const got = await core.respond(flightRequest("/lessons/a?_rsc=h1"));
    expect(got?.headers.get("content-type")).toBe("text/x-component");
  });

  it("answers the precached flight after the page timeout when the network hangs", async () => {
    const waits: number[] = [];
    const { core } = await installed(
      () => new Promise(() => {}),
      async (ms) => {
        waits.push(ms);
      },
    );
    const got = await core.respond(flightRequest("/lessons/a?_rsc=h1"));
    expect(waits).toEqual([3_000]);
    expect(got?.headers.get("content-type")).toBe("text/x-component");
  });

  it("answers a network error for a page whose flight is not precached, never the offline page", async () => {
    const { core } = await installed(async () => {
      throw new TypeError("offline");
    });
    const got = await core.respond(flightRequest("/lessons/unknown?_rsc=h1"));
    expect(got?.type).toBe("error");
  });
});

describe("respond to a Range request", () => {
  const BYTES = "0123456789";

  async function installed(network?: Network) {
    const caches = new FakeCaches();
    await setup({
      caches,
      network: async (input) => {
        const url = typeof input === "string" ? input : (input as Request).url;
        const response = new Response(BYTES, {
          headers: { "content-type": "audio/mp4" },
        });
        Object.defineProperty(response, "url", { value: url });
        return response;
      },
    }).core.install();
    return setup({ caches, network });
  }

  function ranged(range: string, path = "/sounds/tap.m4a?v=abc"): Request {
    return new Request(`${ORIGIN}${path}`, { headers: { Range: range } });
  }

  it("answers a 206 slice of a precached sound without the network", async () => {
    const { core, fetchFn } = await installed();
    const got = await core.respond(ranged("bytes=2-5"));
    expect(got?.status).toBe(206);
    expect(got?.headers.get("content-range")).toBe("bytes 2-5/10");
    expect(got?.headers.get("content-length")).toBe("4");
    expect(got?.headers.get("content-type")).toBe("audio/mp4");
    expect(got?.headers.get("accept-ranges")).toBe("bytes");
    expect(await got?.text()).toBe("2345");
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("answers the probe Safari sends first, an open range and a suffix", async () => {
    const { core } = await installed();
    const probe = await core.respond(ranged("bytes=0-1"));
    expect(probe?.headers.get("content-range")).toBe("bytes 0-1/10");
    expect(await probe?.text()).toBe("01");
    const open = await core.respond(ranged("bytes=0-"));
    expect(await open?.text()).toBe(BYTES);
    expect(open?.status).toBe(206);
    const suffix = await core.respond(ranged("bytes=-3"));
    expect(await suffix?.text()).toBe("789");
  });

  it("finds the sound under its deployment id parameter too", async () => {
    const { core } = await installed();
    const got = await core.respond(
      ranged("bytes=0-1", "/sounds/tap.m4a?v=abc&dpl=dpl_1"),
    );
    expect(got?.status).toBe(206);
  });

  it("answers 416 past the end and the whole file for a range it does not slice", async () => {
    const { core } = await installed();
    const past = await core.respond(ranged("bytes=50-"));
    expect(past?.status).toBe(416);
    expect(past?.headers.get("content-range")).toBe("bytes */10");
    const several = await core.respond(ranged("bytes=0-1,4-5"));
    expect(several?.status).toBe(200);
    expect(await several?.text()).toBe(BYTES);
  });

  it("goes to the network for a listed sound the cache does not hold yet", async () => {
    const answer = reply("from network");
    const { core, fetchFn } = setup({ network: async () => answer });
    expect(await core.respond(ranged("bytes=0-1"))).toBe(answer);
    expect(fetchFn).toHaveBeenCalledOnce();
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

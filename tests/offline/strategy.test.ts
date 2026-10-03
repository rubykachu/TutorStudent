import { describe, expect, it } from "vitest";
import {
  CONTENT_TIMEOUT_SECONDS,
  FLIGHT_FETCH_HEADERS,
  fetchInit,
  flightEntryPath,
  flightLookupPath,
  isFlightEntry,
  navigationFallbackPath,
  networkTimeoutSeconds,
  PAGE_TIMEOUT_SECONDS,
  parseRange,
  precacheLookupPath,
  type RouteRequest,
  routeFor,
  storable,
} from "@/offline/strategy";

const ORIGIN = "https://app.example";
const PRECACHED = new Set([
  "/_next/static/chunks/a.js",
  "/sounds/tap.m4a?v=0123456789ab",
  "/brand/icon-192.png",
]);

function req(
  path: string,
  options: {
    mode?: string;
    headers?: Record<string, string>;
    method?: string;
    mediaBaseUrl?: string;
  } = {},
): RouteRequest {
  const headers = new Map(
    Object.entries(options.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]),
  );
  return {
    url: path.startsWith("http") ? path : `${ORIGIN}${path}`,
    mode: options.mode ?? "cors",
    method: options.method,
    headers: { get: (name) => headers.get(name.toLowerCase()) ?? null },
    origin: ORIGIN,
    mediaBaseUrl: options.mediaBaseUrl,
    isPrecached: (url) => PRECACHED.has(url.pathname + url.search),
  };
}

describe("routeFor", () => {
  it("passes a cross-origin media URL through", () => {
    expect(
      routeFor(
        req("https://media.example.com/video/a.mp4", {
          mediaBaseUrl: "https://media.example.com",
        }),
      ),
    ).toBe("passthrough");
  });

  it("passes any cross-origin request through, even a navigation", () => {
    expect(
      routeFor(req("https://other.example/page", { mode: "navigate" })),
    ).toBe("passthrough");
  });

  it("passes a same-origin media path and any .vtt through", () => {
    expect(routeFor(req("/media/video/a/v.mp4"))).toBe("passthrough");
    expect(routeFor(req("/media/video/a/v.vtt"))).toBe("passthrough");
    expect(routeFor(req("/captions/x.vtt"))).toBe("passthrough");
    expect(
      routeFor(req("/bucket/v.mp4", { mediaBaseUrl: `${ORIGIN}/bucket` })),
    ).toBe("passthrough");
  });

  it("passes /api through", () => {
    expect(routeFor(req("/api/sync"))).toBe("passthrough");
    expect(routeFor(req("/api/session"))).toBe("passthrough");
    expect(routeFor(req("/api/sync", { method: "POST" }))).toBe("passthrough");
  });

  it("passes /unlock through, also as a navigation", () => {
    expect(routeFor(req("/unlock?next=%2F", { mode: "navigate" }))).toBe(
      "passthrough",
    );
  });

  it("answers an RSC navigation fetch from the network first, then its flight", () => {
    expect(routeFor(req("/lessons/a", { headers: { RSC: "1" } }))).toBe(
      "flight-network-first",
    );
    expect(routeFor(req("/lessons/a?_rsc=abc"))).toBe("flight-network-first");
    expect(
      routeFor(
        req("/lessons/a?_rsc=abc", {
          headers: { RSC: "1", "Next-Router-State-Tree": "%5B%5D" },
        }),
      ),
    ).toBe("flight-network-first");
  });

  it("passes RSC prefetches through: they ask for a part of a page", () => {
    expect(
      routeFor(
        req("/lessons/a?_rsc=abc", {
          headers: { RSC: "1", "Next-Router-Prefetch": "1" },
        }),
      ),
    ).toBe("passthrough");
    expect(
      routeFor(
        req("/lessons/a?_rsc=abc", {
          headers: {
            RSC: "1",
            "Next-Router-Prefetch": "1",
            "Next-Router-Segment-Prefetch": "/_tree",
          },
        }),
      ),
    ).toBe("passthrough");
  });

  it("keeps passing an RSC request to /api, /media and /unlock through", () => {
    for (const path of ["/api/sync", "/media/v.mp4", "/unlock"]) {
      expect(routeFor(req(path, { headers: { RSC: "1" } })), path).toBe(
        "passthrough",
      );
    }
  });

  it("answers a navigation, with a query, network first", () => {
    expect(routeFor(req("/lessons/a", { mode: "navigate" }))).toBe(
      "network-first",
    );
    expect(routeFor(req("/lessons/a?intro=1", { mode: "navigate" }))).toBe(
      "network-first",
    );
  });

  it("answers /content json network first", () => {
    expect(routeFor(req("/content/x.json"))).toBe("network-first");
    expect(routeFor(req("/content/x.tips.json"))).toBe("network-first");
  });

  it("answers a build chunk, a short sound and an icon precache first", () => {
    expect(routeFor(req("/_next/static/chunks/a.js"))).toBe("precache-first");
    expect(routeFor(req("/sounds/tap.m4a?v=0123456789ab"))).toBe(
      "precache-first",
    );
    expect(routeFor(req("/brand/icon-192.png"))).toBe("precache-first");
  });

  it("passes a song through: it is not in the precache", () => {
    expect(routeFor(req("/sounds/song.m4a?v=ffffffffffff"))).toBe(
      "passthrough",
    );
  });

  it("slices a Range request for a precached sound from the precache", () => {
    expect(
      routeFor(
        req("/sounds/tap.m4a?v=0123456789ab", {
          headers: { Range: "bytes=0-" },
        }),
      ),
    ).toBe("precache-range");
  });

  it("passes a Range request through for a song or a media file", () => {
    for (const path of [
      "/sounds/song.m4a?v=ffffffffffff",
      "/media/video/a/v.mp4",
      "/media/narration/a/overview.m4a",
    ]) {
      expect(
        routeFor(req(path, { headers: { Range: "bytes=0-" } })),
        path,
      ).toBe("passthrough");
    }
  });

  it("passes an unknown path through", () => {
    expect(routeFor(req("/something/else.png"))).toBe("passthrough");
  });
});

describe("fetchInit", () => {
  it("revalidates network-first fetches and reloads at install", () => {
    expect(fetchInit("network-first")).toEqual({ cache: "no-cache" });
    expect(fetchInit("install")).toEqual({ cache: "reload" });
  });
});

describe("storable", () => {
  const url = `${ORIGIN}/lessons/a`;
  const ok = { status: 200, redirected: false, type: "basic", url };

  it("accepts a plain 200 for the requested URL", () => {
    expect(storable(ok, url)).toBe(true);
  });

  it.each([301, 302, 307, 401, 404, 500])("rejects status %i", (status) => {
    expect(storable({ ...ok, status }, url)).toBe(false);
  });

  it("rejects a redirected, an opaque and a different final URL", () => {
    expect(storable({ ...ok, redirected: true }, url)).toBe(false);
    expect(storable({ ...ok, type: "opaque" }, url)).toBe(false);
    expect(storable({ ...ok, type: "opaqueredirect" }, url)).toBe(false);
    expect(storable({ ...ok, url: `${ORIGIN}/unlock?next=%2F` }, url)).toBe(
      false,
    );
    expect(storable({ ...ok, url: "" }, url)).toBe(false);
  });
});

describe("precacheLookupPath", () => {
  it("keeps the path and query but drops Next's deployment id parameter", () => {
    const at = (path: string) =>
      precacheLookupPath(new URL(`${ORIGIN}${path}`));
    expect(at("/_next/static/chunks/x.js")).toBe("/_next/static/chunks/x.js");
    expect(at("/_next/static/chunks/x.js?dpl=dpl_1")).toBe(
      "/_next/static/chunks/x.js",
    );
    expect(at("/sounds/tap.m4a?v=abc&dpl=dpl_1")).toBe("/sounds/tap.m4a?v=abc");
    expect(at("/sounds/tap.m4a?dpl=dpl_1&v=abc")).toBe("/sounds/tap.m4a?v=abc");
    expect(at("/sounds/tap.m4a?v=abc")).toBe("/sounds/tap.m4a?v=abc");
  });
});

describe("navigation fallback", () => {
  it("ignores the query and the hash", () => {
    expect(navigationFallbackPath(`${ORIGIN}/lessons/a?intro=1#x`)).toBe(
      "/lessons/a",
    );
  });

  it("waits 3 seconds for a page", () => {
    expect(PAGE_TIMEOUT_SECONDS).toBe(3);
  });

  it("waits 10 seconds for a lesson file, longer than a page", () => {
    expect(CONTENT_TIMEOUT_SECONDS).toBe(10);
    expect(networkTimeoutSeconds("navigate")).toBe(PAGE_TIMEOUT_SECONDS);
    expect(networkTimeoutSeconds("cors")).toBe(CONTENT_TIMEOUT_SECONDS);
  });
});

describe("flight entries", () => {
  it("name a page's flight by its path with a bare _rsc", () => {
    expect(flightEntryPath("/lessons/a")).toBe("/lessons/a?_rsc");
    expect(flightEntryPath("/")).toBe("/?_rsc");
    expect(isFlightEntry("/lessons/a?_rsc")).toBe(true);
    expect(isFlightEntry("/lessons/a")).toBe(false);
    expect(isFlightEntry("/sounds/tap.m4a?v=abc")).toBe(false);
  });

  it("look a request up by its path, whatever its _rsc hash, deployment id or query", () => {
    const at = (path: string) => flightLookupPath(new URL(`${ORIGIN}${path}`));
    expect(at("/lessons/a?_rsc=1x2y3z")).toBe("/lessons/a?_rsc");
    expect(at("/lessons/a?intro=1&_rsc=abc&dpl=dpl_1")).toBe("/lessons/a?_rsc");
    expect(at("/?_rsc=abc")).toBe("/?_rsc");
  });

  it("are fetched at install with only the RSC header", () => {
    expect(FLIGHT_FETCH_HEADERS).toEqual({ rsc: "1" });
  });
});

describe("parseRange", () => {
  it("reads a start and an end, both inclusive", () => {
    expect(parseRange("bytes=0-1", 100)).toEqual({ start: 0, end: 1 });
    expect(parseRange("bytes=10-", 100)).toEqual({ start: 10, end: 99 });
    expect(parseRange("bytes=90-500", 100)).toEqual({ start: 90, end: 99 });
  });

  it("reads a suffix as the last bytes", () => {
    expect(parseRange("bytes=-10", 100)).toEqual({ start: 90, end: 99 });
    expect(parseRange("bytes=-500", 100)).toEqual({ start: 0, end: 99 });
  });

  it("says unsatisfiable for a start past the end or an empty suffix", () => {
    expect(parseRange("bytes=100-", 100)).toBe("unsatisfiable");
    expect(parseRange("bytes=-0", 100)).toBe("unsatisfiable");
  });

  it("gives up (whole file) on several ranges, another unit or nonsense", () => {
    expect(parseRange("bytes=0-1,5-6", 100)).toBeNull();
    expect(parseRange("items=0-1", 100)).toBeNull();
    expect(parseRange("bytes=-", 100)).toBeNull();
    expect(parseRange("bytes=5-1", 100)).toBeNull();
  });
});

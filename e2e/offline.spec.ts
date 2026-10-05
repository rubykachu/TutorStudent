import { readFileSync } from "node:fs";
import path from "node:path";
import {
  type Browser,
  type BrowserContext,
  expect,
  type Page,
  test,
} from "@playwright/test";
import { BRAND_PUBLIC_PATHS } from "../src/lib/brand";
import { WORKER_PATH } from "../src/offline/config";
import {
  answerRight,
  createProfile,
  currentExercise,
  finishSection,
  openFixtureLesson,
} from "./flows";
import { SILENCE_MEDIA_SCRIPT } from "./silence";
import {
  e2eFamilyCode,
  OFFLINE_BASE_URL,
  OFFLINE_FAMILY_ID,
  TARGET_DEVICES,
} from "./targets";

// The offline E2E: a production build of HEAD served by the lab, the family
// code gate on, media from the local `/media`, no sync store. One device
// (a Chromium context with the iPad's viewport) installs the service worker
// once, then walks the scenarios in order. Run with `pnpm test:e2e:offline`.
test.describe.configure({ mode: "serial" });

const BASE = process.env.OFFLINE_LAB_URL ?? OFFLINE_BASE_URL;
const soundManifest = JSON.parse(
  readFileSync(path.join(process.cwd(), "public/sounds/manifest.json"), "utf8"),
) as { entries: { file: string; music?: true }[] };
const PIN = "2468";
const SECTION = "fixture.section.phep-nhan";
const MISSED_EXERCISE = "fixture.ex.dem-cham";
const BANNER = "Có bài mới, tải lại";
const { browserName: _webkit, ...IPAD } = TARGET_DEVICES.ipad;

// Everything the app is allowed to talk to: this server, and data/blob/about
// URLs. Anything else (the media bucket, a font host) fails the run.
function isLocal(url: string): boolean {
  return (
    url.startsWith(BASE) ||
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("about:")
  );
}

let context: BrowserContext;
let page: Page;
const strays: string[] = [];

// Sees the page's requests and the service worker's too (`context.on`), and
// every response URL, not only what `context.route` would catch.
function watchNetwork(target: BrowserContext) {
  target.on("request", (request) => {
    if (!isLocal(request.url())) strays.push(`request ${request.url()}`);
  });
  target.on("response", (response) => {
    if (!isLocal(response.url())) strays.push(`response ${response.url()}`);
  });
}

async function newDevice(browser: Browser): Promise<BrowserContext> {
  const created = await browser.newContext({ ...IPAD, baseURL: BASE });
  await created.addInitScript(SILENCE_MEDIA_SCRIPT);
  watchNetwork(created);
  return created;
}

async function unlock(target: BrowserContext) {
  const response = await target.request.post("/api/session", {
    data: { code: await e2eFamilyCode(OFFLINE_FAMILY_ID) },
    headers: { origin: BASE },
  });
  expect(response.status()).toBe(200);
}

async function setPinAndReadLine(target: Page): Promise<string> {
  await target.goto("/parent");
  const pin = target.getByLabel("PIN mới");
  if (await pin.isVisible().catch(() => false)) {
    await pin.fill(PIN);
    await target.getByRole("button", { name: "Tiếp tục" }).click();
    await target.getByLabel("Nhập lại PIN để xác nhận").fill(PIN);
    await target.getByRole("button", { name: "Lưu PIN" }).click();
  }
  await expect(
    target.getByRole("heading", { level: 1, name: "Trang phụ huynh" }),
  ).toBeVisible();
  return (await target.locator("[data-offline-status]").innerText()).trim();
}

// The dashboard polls the worker until the line says it is ready.
async function waitUntilReady(target: Page) {
  await expect(target.locator('[data-offline-status="ready"]')).toBeVisible({
    timeout: 90_000,
  });
}

const cacheKeys = (target: Page) =>
  target.evaluate(async () => {
    const out: string[] = [];
    for (const name of await caches.keys()) {
      for (const request of await (await caches.open(name)).keys()) {
        out.push(request.url.replace(location.origin, ""));
      }
    }
    return out;
  });

const attemptCount = (target: Page) =>
  target.evaluate(
    () =>
      new Promise<number>((resolve, reject) => {
        const open = indexedDB.open("tutor");
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const count = db
            .transaction("attempts")
            .objectStore("attempts")
            .count();
          count.onsuccess = () => {
            db.close();
            resolve(count.result);
          };
          count.onerror = () => reject(count.error);
        };
      }),
  );

type MediaLesson = { id: string; subject: string; section: string };

type LessonJson = {
  id: string;
  sections: { id: string; blocks: { type: string }[] }[];
  overview?: { narration?: unknown };
};

// A real lesson with a recorded narration and a video at the start of a
// section, whose media files this checkout has (the lab links `public/media`).
async function findMediaLesson(
  target: BrowserContext,
): Promise<MediaLesson | null> {
  const index = (await (
    await target.request.get("/content/index.json")
  ).json()) as {
    subjects: { id: string; visible?: boolean }[];
    lessons: { id: string; subject: string }[];
  };
  // Only a subject home shows is reachable by tapping.
  const shown = new Set(
    index.subjects.filter((s) => s.visible !== false).map((s) => s.id),
  );
  for (const { id, subject } of index.lessons) {
    if (id === "fixture" || !shown.has(subject)) continue;
    const lesson = (await (
      await target.request.get(`/content/${id}.json`)
    ).json()) as LessonJson;
    const section = lesson.sections.find((s) => s.blocks[0]?.type === "video");
    if (!lesson.overview?.narration || !section) continue;
    const probe = await target.request.head(
      `/media/narration/${id}/overview.m4a`,
    );
    if (probe.ok()) return { id, subject, section: section.id };
  }
  return null;
}

// A new tab is a new launch: home first asks who learns today, and the
// child's tap opens home.
async function pickChild(cold: Page) {
  await expect(cold).toHaveURL(/\/profiles$/);
  await cold.getByRole("button", { name: "Bé Na" }).tap();
  await expect(
    cold.getByRole("heading", { level: 1, name: "Chào Bé Na!", exact: true }),
  ).toBeVisible();
}

let media: MediaLesson | null = null;

test.beforeAll(async ({ browser }) => {
  context = await newDevice(browser);
  page = await context.newPage();
  await unlock(context);
  media = await findMediaLesson(context);
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  // Study the fixture lesson online, so its review and tips have something to
  // show and the review button exists.
  await openFixtureLesson(page);
  await page.locator(`[data-section="${SECTION}"]`).tap();
  await finishSection(page, MISSED_EXERCISE);
  await page.getByRole("link", { name: "Về bài" }).tap();
  // The parent line is how the owner knows a device is ready: wait for it.
  expect(await setPinAndReadLine(page)).toContain("Dùng khi không có mạng");
  await waitUntilReady(page);
});

test.afterEach(() => {
  expect(strays, "requests that left this machine").toEqual([]);
});

test.afterAll(async () => {
  await context.close();
});

test("1 opens home, a subject, lessons, sections, tips and review offline from a cold start", async () => {
  await context.setOffline(true);
  // A new tab has no state: a cold start. Its first load is a navigation the
  // worker answers; every later screen is reached by tapping.
  const cold = await context.newPage();
  const failed: string[] = [];
  cold.on("requestfailed", (request) => {
    if (request.url().includes("/_next/static/")) failed.push(request.url());
  });
  await cold.goto("/");
  await pickChild(cold);

  // A subject, then a lesson that was never opened online.
  const subject = media?.subject ?? "math";
  await cold.locator(`[data-subject="${subject}"]`).first().tap();
  await expect(cold).toHaveURL(new RegExp(`/subjects/${subject}$`));
  const target = media?.id
    ? cold.locator(`[data-lesson="${media.id}"]`)
    : cold.locator("[data-lesson]:not([data-lesson=fixture])").first();
  await target.tap();
  await expect(cold).toHaveURL(/\/lessons\/[^/]+(\?.*)?$/);
  const overview = cold.locator("[data-lesson-overview]");
  const sections = cold.locator("[data-section]").first();
  await expect(overview.or(sections)).toBeVisible();
  if (await overview.isVisible()) {
    await cold.locator("[data-overview-browse]").tap();
  }
  await sections.tap();
  await expect(cold).toHaveURL(/\/sections\//);
  await expect(cold.locator("[data-section-step]")).toBeVisible();

  // The fixture lesson: its tips page (a formula, so the KaTeX font loads
  // from the precache) and the review page.
  await cold.goto("/");
  await expect(
    cold.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();
  await cold.goto("/lessons/fixture");
  await expect(cold.locator("[data-tips-open]")).toBeVisible();
  await cold.locator("[data-tips-open]").tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture\/tips$/);
  await expect(cold.locator("[data-tip-formula] .katex").first()).toBeVisible();
  const katexLoaded = await cold.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some(
      (face) => face.family.startsWith("KaTeX") && face.status === "loaded",
    );
  });
  expect(katexLoaded).toBe(true);
  await cold.locator("[data-tips-back]").tap();
  await cold.getByRole("link", { name: /Ôn bài này/ }).tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture\/review$/);
  await expect(currentExercise(cold)).toBeVisible();

  // A short sound answers from the precache.
  const soundUrl = (await cacheKeys(cold)).find((k) =>
    k.startsWith("/sounds/"),
  );
  expect(soundUrl).toBeDefined();
  const status = await cold.evaluate(
    async (url) => (await fetch(url as string)).status,
    soundUrl?.replace(/\?__rev=.*$/, ""),
  );
  expect(status).toBe(200);
  expect(failed).toEqual([]);
  await cold.close();
  await context.setOffline(false);
});

test("2 keeps answers given offline and leaves /api/sync alone", async () => {
  const before = await attemptCount(page);
  await page.goto("/lessons/fixture");
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("link", { name: /Ôn bài này/ }).tap();
  await expect(currentExercise(page)).toBeVisible();
  await answerRight(page);
  expect(await attemptCount(page)).toBeGreaterThan(before);

  // The sync request has no answer offline: the worker did not make one up.
  const offlineAnswer = await page.evaluate(async () => {
    try {
      return (await fetch("/api/sync?doc=profile")).status;
    } catch {
      return "network error";
    }
  });
  expect(offlineAnswer).toBe("network error");

  // An offline reload keeps the answers (Dexie).
  const kept = await attemptCount(page);
  await page.goto("/lessons/fixture");
  expect(await attemptCount(page)).toBe(kept);

  // Back online the request reaches the server and the worker stays out of it.
  await context.setOffline(false);
  const [response] = await Promise.all([
    page.waitForResponse((r) => new URL(r.url()).pathname === "/api/sync"),
    page.evaluate(() => fetch("/api/sync?doc=profile").then((r) => r.status)),
  ]);
  expect(response.fromServiceWorker()).toBe(false);
});

test("3 video and narration say they need the network offline, and load again online", async () => {
  test.skip(!media, "no lesson with media files on this machine");
  const { id, section } = media as MediaLesson;
  // Offline, by the app's own links: the lesson overview and its narration.
  await page.goto(`/lessons/${id}?intro=1`);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("[data-lesson-overview]")).toBeVisible();
  await expect(page.getByText("Cần mạng để nghe đọc bài")).toBeVisible();
  await expect(page.locator("[data-overview-narration]")).toContainText(
    "Cần mạng để nghe đọc bài",
  );
  await expect(page.locator('[role="progressbar"]')).toHaveCount(0);

  await page.goto(`/lessons/${id}/sections/${encodeURIComponent(section)}`);
  await expect(page.getByText("Cần mạng để xem video")).toBeVisible();
  await expect(page.locator('[role="progressbar"]')).toHaveCount(0);
  await expect(page.getByText(/\d+%/)).toHaveCount(0);

  // Online again the state clears and the video downloads on a tap.
  await context.setOffline(false);
  await expect(page.getByText("Cần mạng để xem video")).toHaveCount(0, {
    timeout: 20_000,
  });
  await page.locator("[data-video-play]").tap();
  await expect(page.locator("video")).toHaveAttribute("src", /^blob:/, {
    timeout: 30_000,
  });

  // The narration plays online too (its file is fetched into memory).
  await page.goto(`/lessons/${id}?intro=1`);
  await page.getByRole("button", { name: "Nghe giới thiệu" }).tap();
  await expect(page.locator("[data-overview-audio]")).toHaveAttribute(
    "src",
    /^blob:/,
    { timeout: 30_000 },
  );
});

test("4 stores no media, no caption, no song and nothing that must not be kept", async () => {
  const keys = await cacheKeys(page);
  expect(keys.length).toBeGreaterThan(100);
  const songs = soundManifest.entries
    .filter((entry) => entry.music)
    .map((entry) => entry.file);
  expect(songs.length).toBeGreaterThan(0);
  for (const key of keys) {
    expect(key, key).not.toMatch(/^\/(media|api|unlock|dev)(\/|$|\?)/);
    expect(key, key).not.toMatch(/\.vtt(\?|$)/);
    expect(key, key).not.toContain(WORKER_PATH);
    for (const song of songs) expect(key, key).not.toContain(song);
    expect(key, key).not.toContain("/brand/share.png");
  }
  // Every entry is a plain answer: none was a redirect (the unlock page).
  const redirected = await page.evaluate(async () => {
    const bad: string[] = [];
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      for (const request of await cache.keys()) {
        const response = await cache.match(request);
        if (!response || response.redirected || response.status !== 200) {
          bad.push(request.url);
        }
      }
    }
    return bad;
  });
  expect(redirected).toEqual([]);
  // The brand files are there, the share image is not.
  for (const path of BRAND_PUBLIC_PATHS.filter(
    (p) => p !== "/brand/share.png",
  )) {
    expect(
      keys.some((k) => k === path || k.startsWith(`${path}?`)),
      path,
    ).toBe(true);
  }
  // Only the app's own database lives in IndexedDB.
  const databases = await page.evaluate(async () =>
    (await indexedDB.databases()).map((d) => d.name),
  );
  expect(databases).toEqual(["tutor"]);
});

// Watches one page for the signs of a full page load: `pagehide` (counted in
// sessionStorage, which outlives the document) and a marker on `window`,
// which a new document no longer has.
const WATCH_DOCUMENT_SCRIPT = `(() => {
  addEventListener("pagehide", () => {
    const n = Number(sessionStorage.getItem("__pagehides") || "0");
    sessionStorage.setItem("__pagehides", String(n + 1));
  });
})();`;

// Records what the shared Web Audio context does: decodes that worked or
// failed, and each clip started with when it ended.
const WATCH_AUDIO_SCRIPT = `(() => {
  const log = { contexts: [], decoded: 0, decodeFailed: 0, clips: [] };
  window.__audio = log;
  const Native = window.AudioContext;
  if (!Native) return;
  window.AudioContext = class extends Native {
    constructor(...args) {
      super(...args);
      log.contexts.push(this);
    }
  };
  const decode = Native.prototype.decodeAudioData;
  Native.prototype.decodeAudioData = function (...args) {
    return decode.apply(this, args).then(
      (buffer) => { log.decoded++; return buffer; },
      (error) => { log.decodeFailed++; throw error; },
    );
  };
  const start = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (...args) {
    const clip = {
      duration: this.buffer ? this.buffer.duration : 0,
      startedAt: performance.now(),
      endedAt: null,
    };
    log.clips.push(clip);
    this.addEventListener("ended", () => { clip.endedAt = performance.now(); });
    return start.apply(this, args);
  };
})();`;

const SAME_DOCUMENT = "same-document";

async function markDocument(target: Page) {
  await target.evaluate((mark) => {
    (window as unknown as { __doc?: string }).__doc = mark;
  }, SAME_DOCUMENT);
}

// The page is still the document `markDocument` marked, and no page was
// unloaded since the watch began.
async function expectSameDocument(target: Page, step: string) {
  const state = await target.evaluate(() => ({
    doc: (window as unknown as { __doc?: string }).__doc ?? null,
    pagehides: Number(sessionStorage.getItem("__pagehides") || "0"),
  }));
  expect(state, step).toEqual({ doc: SAME_DOCUMENT, pagehides: 0 });
}

// A new tab opened offline: nothing was prefetched, so every in-app tap
// below needs the worker to answer the router's RSC fetch.
async function coldOfflinePage(path: string): Promise<Page> {
  const cold = await context.newPage();
  await cold.addInitScript(WATCH_DOCUMENT_SCRIPT);
  await cold.addInitScript(WATCH_AUDIO_SCRIPT);
  await cold.goto(path);
  return cold;
}

test("5 offline, in-app taps stay in the same document: Học tiếp, X, Mẹo hay, back, the subject and a lesson card", async () => {
  await context.setOffline(true);
  const cold = await coldOfflinePage("/lessons/fixture?intro=1");
  await expect(cold.locator("[data-lesson-overview]")).toBeVisible();
  await markDocument(cold);

  await cold.locator("[data-overview-start]").tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture\/sections\/[^/]+$/);
  await expect(cold.locator("[data-section-step]")).toBeVisible();
  await expectSameDocument(cold, "Học tiếp");

  await cold.getByLabel("Về trang bài").tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture$/);
  await expect(cold.locator("[data-tips-open]")).toBeVisible();
  await expectSameDocument(cold, "X");

  await cold.locator("[data-tips-open]").tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture\/tips$/);
  await expect(cold.locator("[data-tips-back]")).toBeVisible();
  await expectSameDocument(cold, "Mẹo hay");

  await cold.locator("[data-tips-back]").tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture$/);
  await expectSameDocument(cold, "back from Mẹo hay");

  await cold.locator('a[href="/subjects/math"]').first().tap();
  await expect(cold).toHaveURL(/\/subjects\/math$/);
  await expect(cold.locator('[data-lesson="fixture"]')).toBeVisible();
  await expectSameDocument(cold, "back to the subject");

  await cold.locator('[data-lesson="fixture"]').tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture$/);
  await expect(cold.locator("[data-tips-open]")).toBeVisible();
  await expectSameDocument(cold, "a lesson card");

  await cold.close();
  await context.setOffline(false);
});

test("6 offline, the goodbye clip of X plays to its end and the page stays", async () => {
  await context.setOffline(true);
  const cold = await coldOfflinePage(
    `/lessons/fixture/sections/${encodeURIComponent(SECTION)}`,
  );
  await expect(cold.locator("[data-section-step]")).toBeVisible();
  await markDocument(cold);
  // The first tap creates the audio context; the clips decode after it.
  await cold.locator("h1, h2").first().tap();
  await expect
    .poll(() =>
      cold.evaluate(
        () =>
          (window as unknown as { __audio: { decoded: number } }).__audio
            .decoded,
      ),
    )
    .toBeGreaterThan(0);

  await cold.getByLabel("Về trang bài").tap();
  await expect(cold).toHaveURL(/\/lessons\/fixture$/);
  type Clip = { duration: number; startedAt: number; endedAt: number | null };
  const clipOf = () =>
    cold.evaluate(() => {
      const log = (
        window as unknown as {
          __audio: { clips: Clip[] };
        }
      ).__audio;
      // The lesson page is an outer screen, so a background music track
      // (20 s or more) starts there too; the goodbye clip is the short one.
      return log.clips.filter((c) => c.duration < 10).at(-1) ?? null;
    });
  await expect
    .poll(async () => (await clipOf())?.endedAt ?? null)
    .not.toBeNull();
  // The background music plays offline too, from the worker's store.
  await expect
    .poll(() =>
      cold.evaluate(() =>
        (
          window as unknown as { __audio: { clips: Clip[] } }
        ).__audio.clips.some((c) => c.duration >= 10),
      ),
    )
    .toBe(true);
  const clip = (await clipOf()) as Clip;
  expect(clip.duration).toBeGreaterThan(0.2);
  // It ended by itself, not cut off: it ran at least about its length.
  expect(((clip.endedAt as number) - clip.startedAt) / 1000).toBeGreaterThan(
    clip.duration * 0.9,
  );
  const audio = await cold.evaluate(() => {
    const log = (
      window as unknown as {
        __audio: {
          contexts: AudioContext[];
          decoded: number;
          decodeFailed: number;
        };
      }
    ).__audio;
    return {
      contexts: log.contexts.map((c) => c.state),
      decodeFailed: log.decodeFailed,
    };
  });
  expect(audio.contexts).toEqual(["running"]);
  expect(audio.decodeFailed).toBe(0);
  await expectSameDocument(cold, "after the goodbye clip");
  await cold.close();
  await context.setOffline(false);
});

test("7 offline, a page that is not stored shows the offline page, and Quay lại goes back", async () => {
  await context.setOffline(true);
  const cold = await coldOfflinePage("/");
  await pickChild(cold);
  await cold.goto("/lessons/a-lesson-this-build-does-not-have");
  await expect(cold.locator("[data-offline-page]")).toBeVisible();
  await expect(
    cold.getByRole("heading", { level: 1, name: "Cần mạng để mở trang này" }),
  ).toBeVisible();
  await expect(cold).toHaveURL(/\/lessons\/a-lesson-this-build-does-not-have$/);
  await cold.getByRole("button", { name: "Quay lại" }).tap();
  await expect(cold).toHaveURL(new RegExp(`^${BASE}/$`));
  await expect(
    cold.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();
  await cold.close();
  await context.setOffline(false);
});

test("8 offline, a Range request for a short sound gets a 206 slice from the worker", async () => {
  await context.setOffline(true);
  const cold = await coldOfflinePage("/");
  await pickChild(cold);
  const key = (await cacheKeys(cold)).find((k) => k.startsWith("/sounds/"));
  expect(key).toBeDefined();
  const url = (key as string).replace(/[?&]__rev=.*$/, "");
  const [response, answer] = await Promise.all([
    cold.waitForResponse(
      (r) =>
        r.url().endsWith(url) && r.request().headers().range === "bytes=0-1",
    ),
    cold.evaluate(async (soundUrl) => {
      const r = await fetch(soundUrl, { headers: { Range: "bytes=0-1" } });
      return {
        status: r.status,
        range: r.headers.get("content-range"),
        bytes: (await r.arrayBuffer()).byteLength,
      };
    }, url),
  ]);
  expect(response.fromServiceWorker()).toBe(true);
  expect(answer.status).toBe(206);
  expect(answer.range).toMatch(/^bytes 0-1\/\d+$/);
  expect(answer.bytes).toBe(2);
  // The audio element (the fallback for a clip Web Audio could not decode)
  // loads it too.
  const element = await cold.evaluate(
    (soundUrl) =>
      new Promise<string>((resolve) => {
        const audio = new Audio();
        audio.preload = "auto";
        const timer = setTimeout(() => resolve("timeout"), 10_000);
        for (const event of ["canplaythrough", "error"]) {
          audio.addEventListener(event, () => {
            clearTimeout(timer);
            resolve(event);
          });
        }
        audio.src = soundUrl;
        audio.load();
      }),
    url,
  );
  expect(element).toBe("canplaythrough");
  await cold.close();
  await context.setOffline(false);
});

test("9 online, a device without the cookie goes to the unlock page; a device never unlocked has no worker", async ({
  browser,
}) => {
  await context.clearCookies();
  await page.goto("/");
  await expect(page).toHaveURL(/\/unlock\?next=%2F$/);
  await expect(
    page.getByLabel("Nhập mã của gia đình để vào học"),
  ).toBeVisible();
  // The script itself is fetched without the cookie (an update check).
  expect((await context.request.get(WORKER_PATH)).status()).toBe(200);
  await unlock(context);

  const stranger = await newDevice(browser);
  const visitor = await stranger.newPage();
  await visitor.goto("/unlock");
  await expect(
    visitor.getByLabel("Nhập mã của gia đình để vào học"),
  ).toBeVisible();
  await visitor.waitForTimeout(2000);
  expect(
    await visitor.evaluate(
      async () => (await navigator.serviceWorker.getRegistrations()).length,
    ),
  ).toBe(0);
  expect(await visitor.evaluate(async () => (await caches.keys()).length)).toBe(
    0,
  );
  await stranger.close();
});

test("10 a changed worker waits, the banner offers it outside a lesson, and a tap puts the new one in charge", async () => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();
  // A cache of a build that no longer exists must be gone after the update.
  await page.evaluate(() => caches.open("offline-an-old-build"));
  await page.evaluate(() => {
    (window as unknown as { __loaded: boolean }).__loaded = true;
  });

  // Another script URL for the same scope is how a browser sees a changed
  // worker (Playwright cannot serve a changed script to Chromium's update
  // check): a new worker installs and waits.
  await page.evaluate(() =>
    navigator.serviceWorker.register("/sw.js?changed=1", {
      scope: "/",
      updateViaCache: "none",
    }),
  );
  const banner = page.getByRole("button", { name: BANNER });
  await expect(banner).toBeVisible({ timeout: 60_000 });

  // Inside a lesson player the banner stays away; leaving shows it again.
  await page.locator("[data-subject]").first().tap();
  await page.locator("[data-lesson]").first().tap();
  const sections = page.locator("[data-section]").first();
  const overview = page.locator("[data-lesson-overview]");
  await expect(overview.or(sections)).toBeVisible();
  if (await overview.isVisible()) {
    await page.locator("[data-overview-browse]").tap();
  }
  await sections.tap();
  await expect(page).toHaveURL(/\/sections\//);
  await expect(page.locator("[data-section-step]")).toBeVisible();
  await expect(page.getByRole("button", { name: BANNER })).toHaveCount(0);
  // Back to the lesson page by the browser's history, a client-side move.
  await page.goBack();
  await expect(page.getByRole("button", { name: BANNER })).toBeVisible();
  await page.goBack();
  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();

  // The tap activates the waiting worker and the page reloads under it.
  await Promise.all([
    page.waitForEvent("load"),
    page.getByRole("button", { name: BANNER }).tap(),
  ]);
  expect(
    await page.evaluate(
      () => (window as unknown as { __loaded?: boolean }).__loaded ?? false,
    ),
    "the page reloaded",
  ).toBe(false);
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: BANNER })).toHaveCount(0);
  expect(
    (await page.evaluate(() => caches.keys())).every((name) =>
      name.startsWith("offline-20"),
    ),
  ).toBe(true);
  expect(await page.evaluate(() => caches.keys())).not.toContain(
    "offline-an-old-build",
  );
});

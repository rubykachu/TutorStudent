import { expect, type Page } from "@playwright/test";
import {
  patchFixtureLesson,
  serveDemoVideo,
  withDemoVideo,
  withNarration,
} from "./fixture-routes";
import { createProfile } from "./flows";
import { test } from "./test";

// iOS Safari lets a page start media only from inside a tap, tied to the
// element that was asked to play. Playwright cannot make a real browser lose
// that right (its desktop engines allow the muted play the suite uses, and
// activation does not expire on a schedule a test can hit), so this stub
// models the rule: `play()` on an element is accepted inside a click, and it
// unlocks the element; outside a click it is accepted only on an unlocked
// element and otherwise rejected after an await, as iOS does. What the specs
// prove is the app's side of it: the tap asks the element to play, the file
// is swapped into that same element, and a refusal brings the play button
// back.
const IOS_GESTURE_MODEL = `(() => {
  const log = [];
  window.__playLog = log;
  window.__forgetUnlock = false;
  let inClick = false;
  const unlocked = new WeakSet();
  const ids = new WeakMap();
  window.addEventListener("click", () => { inClick = true; }, { capture: true });
  // Runs after the app's own click handlers (React listens lower down).
  window.addEventListener("click", () => { inClick = false; });
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    if (!ids.has(this)) ids.set(this, ids.size + 1);
    const entry = {
      element: ids.get(this),
      inClick,
      unlocked: unlocked.has(this),
      src: this.getAttribute("src") || "",
      refused: false,
    };
    log.push(entry);
    if (inClick) {
      if (window.__forgetUnlock) unlocked.delete(this);
      else unlocked.add(this);
      return play.call(this);
    }
    if (unlocked.has(this)) return play.call(this);
    entry.refused = true;
    return new Promise((_, reject) =>
      setTimeout(() => reject(new DOMException("not allowed", "NotAllowedError")), 0),
    );
  };
})();`;

type PlayEntry = {
  element: number;
  inClick: boolean;
  unlocked: boolean;
  src: string;
  refused: boolean;
};

const playLog = (page: Page) =>
  page.evaluate(
    () => (window as unknown as { __playLog: PlayEntry[] }).__playLog,
  );

// Holds a media file's response until the spec releases it, so a tap lands
// while the download is still running.
async function holdDownload(page: Page, glob: string) {
  let release: () => void = () => undefined;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(glob, async (route) => {
    await gate;
    await route.fallback();
  });
  return release;
}

async function openFixtureLesson(page: Page, path: string) {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto(path);
}

test.describe("media tapped before its download ends (iOS gesture model)", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(IOS_GESTURE_MODEL);
  });

  test("overview narration downloads as the screen opens, then plays on the tapped element", async ({
    page,
  }) => {
    await withNarration(page, "WEBVTT\n");
    const release = await holdDownload(
      page,
      "**/media/narration/fixture/overview.m4a",
    );
    await openFixtureLesson(page, "/lessons/fixture");

    // Nobody tapped: the percentage is already in the player.
    const label = page.locator("[data-narration-label]");
    await expect(label).toContainText("Đang tải");
    await expect(
      page.getByRole("button", { name: "Nghe giới thiệu" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Nghe giới thiệu" }).tap();
    await expect(label).toContainText("Đang tải");
    release();
    const player = page.locator("[data-overview-narration]");
    await expect(player).toHaveAttribute("data-overview-narration", "playing");

    const log = await playLog(page);
    const unlock = log.find((entry) => entry.inClick);
    const real = log.find((entry) => entry.src.startsWith("blob:"));
    expect(unlock?.src).toMatch(/^data:audio\/wav/);
    // The real file played outside any click, on the element the tap unlocked.
    expect(real?.inClick).toBe(false);
    expect(real?.unlocked).toBe(true);
    expect(real?.element).toBe(unlock?.element);
    expect(log.some((entry) => entry.refused)).toBe(false);
  });

  test("overview narration: a refused play brings the button back with no error, and the next tap plays", async ({
    page,
  }) => {
    await withNarration(page, "WEBVTT\n");
    const release = await holdDownload(
      page,
      "**/media/narration/fixture/overview.m4a",
    );
    await openFixtureLesson(page, "/lessons/fixture");
    // iOS refuses the element anyway.
    await page.evaluate(() => {
      (window as unknown as { __forgetUnlock: boolean }).__forgetUnlock = true;
    });
    await page.getByRole("button", { name: "Nghe giới thiệu" }).tap();
    release();

    const player = page.locator("[data-overview-narration]");
    await expect
      .poll(async () => (await playLog(page)).some((e) => e.refused))
      .toBe(true);
    await expect(player).toHaveAttribute("data-overview-narration", "paused");
    await expect(
      page.getByRole("button", { name: "Nghe giới thiệu" }),
    ).toBeVisible();
    await expect(page.getByRole("alert")).toHaveCount(0);

    // The file is in memory: the second tap plays inside the tap.
    await page.getByRole("button", { name: "Nghe giới thiệu" }).tap();
    await expect(player).toHaveAttribute("data-overview-narration", "playing");
  });

  test("lesson video downloads as the screen opens, then plays on the tapped element", async ({
    page,
  }) => {
    await patchFixtureLesson(page, withDemoVideo("fixture.card.nhan-lap"));
    await serveDemoVideo(page);
    const release = await holdDownload(
      page,
      "**/media/video/fixture/gioi-thieu.mp4",
    );
    await openFixtureLesson(
      page,
      "/lessons/fixture/sections/fixture.section.phep-nhan",
    );

    await page.locator("[data-video-play]").tap();
    await expect(page.locator("[data-media-loading]")).toBeVisible();
    release();
    await expect
      .poll(
        () =>
          page
            .locator("video")
            .evaluate(
              (v: HTMLVideoElement) => !v.paused && v.currentTime > 0.3,
            ),
        { timeout: 15_000 },
      )
      .toBe(true);

    const log = await playLog(page);
    const unlock = log.find((entry) => entry.inClick);
    const real = log.find((entry) => entry.src.startsWith("blob:"));
    expect(unlock?.src).toMatch(/^data:audio\/wav/);
    expect(real?.inClick).toBe(false);
    expect(real?.unlocked).toBe(true);
    expect(real?.element).toBe(unlock?.element);
    expect(log.some((entry) => entry.refused)).toBe(false);
    await expect(page.locator("[data-video-play]")).toHaveCount(0);
  });
});

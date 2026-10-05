import { expect, type Page } from "@playwright/test";
import { createProfile, openFixtureLesson } from "./flows";
import { test } from "./test";

const SECTION = "fixture.section.phep-nhan";

// Records the Web Audio buffer sources the page starts and stops, so a spec
// can tell when a long one (a background music track; every other clip is a
// few seconds at most) is playing. Test side only: the app is not changed.
const TRACK_SOURCES_SCRIPT = `(() => {
  if (typeof AudioBufferSourceNode === "undefined") return;
  const proto = AudioBufferSourceNode.prototype;
  const start = proto.start;
  const stop = proto.stop;
  const playing = new Set();
  window.__longSources = { started: 0, playing };
  proto.start = function (...args) {
    if (this.buffer && this.buffer.duration > 10) {
      window.__longSources.started++;
      playing.add(this);
      this.addEventListener("ended", () => playing.delete(this));
    }
    return start.apply(this, args);
  };
  proto.stop = function (...args) {
    playing.delete(this);
    return stop.apply(this, args);
  };
})();`;

type LongSources = { started: number; playing: number };

function longSources(page: Page): Promise<LongSources> {
  return page.evaluate(() => {
    const state = (
      window as unknown as {
        __longSources?: { started: number; playing: Set<unknown> };
      }
    ).__longSources;
    return { started: state?.started ?? 0, playing: state?.playing.size ?? 0 };
  });
}

test.beforeEach(async ({ context }) => {
  await context.addInitScript(TRACK_SOURCES_SCRIPT);
});

test("background music plays on home after a tap and stops in a section", async ({
  page,
}) => {
  await page.goto("/profiles");
  // Nothing plays before the first tap.
  expect((await longSources(page)).started).toBe(0);
  await createProfile(page, "Bé Mi", "Cáo");

  // Home, after the taps of making the profile: a track is playing.
  await expect
    .poll(async () => (await longSources(page)).playing)
    .toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: "Nhạc nền" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  // The lesson page's list of parts is an outer screen: still playing.
  await openFixtureLesson(page);
  await expect
    .poll(async () => (await longSources(page)).playing)
    .toBeGreaterThan(0);

  // A section is a learning screen: the music stops.
  await page.locator(`[data-section="${SECTION}"]`).tap();
  await expect(page).toHaveURL(new RegExp(`/sections/${SECTION}$`));
  await expect.poll(async () => (await longSources(page)).playing).toBe(0);

  // Back on the lesson page's list of parts, it plays again.
  await page.getByRole("link", { name: "Về trang bài" }).tap();
  await expect
    .poll(async () => (await longSources(page)).playing)
    .toBeGreaterThan(0);
});

test("the home music switch turns the music off and on", async ({ page }) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Bo", "Cáo");
  await expect
    .poll(async () => (await longSources(page)).playing)
    .toBeGreaterThan(0);
  const toggle = page.getByRole("button", { name: "Nhạc nền" });
  await toggle.tap();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect.poll(async () => (await longSources(page)).playing).toBe(0);
  await toggle.tap();
  await expect
    .poll(async () => (await longSources(page)).playing)
    .toBeGreaterThan(0);
});

const OWL_INVITE = "Chạm vào tớ nào!";

test("a new launch asks who learns today; tapping the child starts the music; a reload stays home", async ({
  context,
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Mi", "Cáo");

  // A new tab is a new launch: the picker shows although the child is
  // remembered, and nothing plays yet.
  const launch = await context.newPage();
  await launch.goto("/");
  await expect(launch).toHaveURL(/\/profiles$/);
  await expect(
    launch.getByRole("heading", { level: 1, name: "Chào Bé Mi! Học thôi nào" }),
  ).toBeVisible();
  expect((await longSources(launch)).started).toBe(0);

  await launch.getByRole("button", { name: "Bé Mi" }).tap();
  await expect(
    launch.getByRole("heading", { level: 1, name: "Chào Bé Mi!", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () => (await longSources(launch)).playing)
    .toBeGreaterThan(0);
  // Audio is unlocked: the owl does not ask for a tap.
  await expect(launch.getByText(OWL_INVITE)).toHaveCount(0);

  // A reload in the same tab skips the picker; audio is locked again, so the
  // owl asks for a tap, and that tap starts the music.
  await launch.reload();
  await expect(launch).toHaveURL(/\/$/);
  await expect(
    launch.getByRole("heading", { level: 1, name: "Chào Bé Mi!", exact: true }),
  ).toBeVisible();
  await expect(launch.getByText(OWL_INVITE)).toBeVisible();
  expect((await longSources(launch)).started).toBe(0);
  await launch.getByRole("button", { name: "Chạm vào bạn cú" }).tap();
  await expect
    .poll(async () => (await longSources(launch)).playing)
    .toBeGreaterThan(0);
  await expect(launch.getByText(OWL_INVITE)).toHaveCount(0);
});

test("a link into a lesson opens it on a new launch, and home then skips the picker", async ({
  context,
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Mi", "Cáo");

  const launch = await context.newPage();
  await openFixtureLesson(launch);
  await expect(launch).toHaveURL(/\/lessons\/fixture/);
  await launch.goto("/");
  await expect(
    launch.getByRole("heading", { level: 1, name: "Chào Bé Mi!", exact: true }),
  ).toBeVisible();
  await expect(launch).toHaveURL(/\/$/);
});

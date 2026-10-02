import { expect, type Page } from "@playwright/test";
import {
  DEMO_VIDEO_SECONDS,
  patchFixtureLesson,
  serveDemoVideo,
  withDemoVideo,
} from "./fixture-routes";
import { createProfile } from "./flows";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";
import { test } from "./test";

const SECTION = "fixture.section.phep-nhan";

const playhead = (page: Page) =>
  page.locator("video").evaluate((video: HTMLVideoElement) => ({
    time: video.currentTime,
    paused: video.paused,
    ended: video.ended,
  }));

test("a video plays straight through: it never pauses by itself and its captions stay off the picture", async ({
  page,
}) => {
  await patchFixtureLesson(page, withDemoVideo("fixture.card.nhan-lap"));
  await serveDemoVideo(page);
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto(`/lessons/fixture/sections/${SECTION}`);

  const video = page.locator("video");
  const caption = page.locator("[data-video-caption]");
  await page.locator("[data-video-play]").tap();
  await expect(caption).toContainText("Một", { timeout: 15_000 });

  // The picture is clear of any overlay, and the caption never covers the
  // picture on a phone (it sits in the strip under it).
  const phone = (page.viewportSize()?.width ?? 0) < 768;
  const pictureBox = await video.boundingBox();
  const captionBox = await caption.boundingBox();
  if (phone && pictureBox && captionBox) {
    expect(captionBox.y).toBeGreaterThanOrEqual(
      pictureBox.y + pictureBox.height - 1,
    );
  }
  await expect(page.locator("[data-video-checkpoint]")).toHaveCount(0);
  await expect(page.locator("[data-video-checkpoint-veil]")).toHaveCount(0);
  await expectTouchTargets(page);
  await expectNoHorizontalScroll(page);

  // Sampled across the whole video: it is playing until it ends.
  const end = DEMO_VIDEO_SECONDS - 0.5;
  let last = await playhead(page);
  while (!last.ended && last.time < end) {
    expect(last.paused).toBe(false);
    await page.waitForTimeout(250);
    last = await playhead(page);
  }
  await expect
    .poll(async () => (await playhead(page)).time, { timeout: 15_000 })
    .toBeGreaterThan(end);
  await expect(page.locator("[data-video-checkpoint]")).toHaveCount(0);
});

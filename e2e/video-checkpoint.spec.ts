import { expect, type Page } from "@playwright/test";
import {
  DEMO_CHECKPOINTS,
  patchFixtureLesson,
  serveDemoVideo,
  withCheckpointVideo,
} from "./fixture-routes";
import { createProfile } from "./flows";
import {
  expectControlsApart,
  expectNoHorizontalScroll,
  expectTouchTargets,
} from "./layout";
import { test } from "./test";

const SECTION = "fixture.section.phep-nhan";

const playhead = (page: Page) =>
  page.locator("video").evaluate((video: HTMLVideoElement) => ({
    time: video.currentTime,
    paused: video.paused,
  }));

test("a video waits at each checkpoint until the child goes on or looks again", async ({
  page,
}) => {
  await patchFixtureLesson(page, withCheckpointVideo("fixture.card.nhan-lap"));
  await serveDemoVideo(page);
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto(`/lessons/fixture/sections/${SECTION}`);

  const overlay = page.locator("[data-video-checkpoint]");
  await expect(overlay).toHaveCount(0);
  await page.locator("[data-video-play]").tap();

  // The first stop: paused where the checkpoint says, with both choices.
  await expect(overlay).toBeVisible({ timeout: 15_000 });
  await expect(overlay).toContainText("Đoạn 1/2");
  const first = DEMO_CHECKPOINTS[0]?.at ?? 0;
  const stopped = await playhead(page);
  expect(stopped.paused).toBe(true);
  expect(stopped.time).toBeCloseTo(first, 0);
  await expectTouchTargets(page);
  await expectNoHorizontalScroll(page);
  await expectControlsApart(page);

  // "Xem lại đoạn này" goes back to the start of the part and stops again.
  await overlay.locator("[data-checkpoint-replay]").tap();
  await expect(overlay).toHaveCount(0);
  await expect
    .poll(async () => (await playhead(page)).time)
    .toBeLessThan(first);
  await expect(overlay).toBeVisible({ timeout: 15_000 });
  await expect(overlay).toContainText("Đoạn 1/2");

  // "Tiếp" plays on to the next stop, then to the end.
  await overlay.locator("[data-checkpoint-continue]").tap();
  await expect(overlay).toContainText("Đoạn 2/2", { timeout: 15_000 });
  await overlay.locator("[data-checkpoint-continue]").tap();
  await expect(overlay).toHaveCount(0);
  await expect
    .poll(async () => (await playhead(page)).time, { timeout: 15_000 })
    .toBeGreaterThan(9);
  await expect(overlay).toHaveCount(0);
});

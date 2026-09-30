import { expect, type Page } from "@playwright/test";
import { patchFixtureLesson, withVideo } from "./fixture-routes";
import {
  answerWrongOnce,
  createProfile,
  finishSection,
  openFixtureLesson,
} from "./flows";
import { expectControlsApart } from "./layout";
import { test } from "./test";

// No two controls touch, and nothing touches the sticky bottom bar, on the
// screens a child moves through: home, subject, lesson, every explanation
// screen (a lesson video with its caption toggle among them) and a review
// recap with its optional video clip, closed and open.

const MISSED_CARD = "fixture.card.nhan-lap";
const MISSED_EXERCISE = "fixture.ex.dem-cham";

async function walkBlocks(page: Page) {
  const step = page.locator("[data-section-step]");
  const stepper = page.locator("[data-section-stepper]");
  while ((await step.getAttribute("data-section-step")) === "block") {
    await expectControlsApart(page);
    const current = await stepper.getAttribute("data-current");
    await page.getByRole("button", { name: "Tiếp" }).tap();
    await expect(stepper).not.toHaveAttribute("data-current", current ?? "");
  }
}

test("controls keep their distance on every screen of a lesson", async ({
  page,
}) => {
  await patchFixtureLesson(page, withVideo(MISSED_CARD));
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await expectControlsApart(page);
  await page.goto("/subjects/math");
  await expectControlsApart(page);
  await openFixtureLesson(page);
  await expectControlsApart(page);

  await page.locator('[data-section="fixture.section.phep-nhan"]').tap();
  await expect(page.locator('[data-block="video"]')).toBeVisible();
  await walkBlocks(page);
  await page.goto("/lessons/fixture/sections/fixture.section.phep-nhan");
  await finishSection(page, MISSED_EXERCISE);
  await expectControlsApart(page);

  await page.goto("/lessons/fixture");
  await page.getByRole("link", { name: /Ôn bài này/ }).tap();
  await answerWrongOnce(page);
  const recap = page.locator('[data-review-step="recap"]');
  await expect(recap).toBeVisible();
  await expectControlsApart(page);
  await page.getByRole("button", { name: "Xem lại đoạn video" }).tap();
  await expect(recap.locator('[data-card-clip="open"]')).toBeVisible();
  await expectControlsApart(page);
});

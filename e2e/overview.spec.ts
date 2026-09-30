import { expect, test } from "@playwright/test";
import { withNarration, withVietnameseVoice } from "./fixture-routes";
import { createProfile, FIXTURE_LESSON_TITLE } from "./flows";
import {
  expectControlsApart,
  expectNoHorizontalScroll,
  expectTouchTargets,
} from "./layout";

const FIRST_SECTION = "fixture.section.phep-nhan";

test("a new lesson opens on its overview, then starts the first section", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.locator("[data-continue]").tap();

  const overview = page.locator("[data-lesson-overview]");
  await expect(page).toHaveURL(/\/lessons\/fixture$/);
  await expect(overview).toBeVisible();
  await expect(
    overview.getByRole("heading", { level: 1, name: FIXTURE_LESSON_TITLE }),
  ).toBeVisible();
  await expect(overview.locator('[data-overview-part="hook"]')).toContainText(
    "Mẹ mua hai túi kẹo",
  );
  await expect(overview.locator("[data-overview-goal]")).toHaveCount(3);
  await expect(overview.locator('[data-overview-part="why"]')).toBeVisible();
  await expectTouchTargets(page);
  await expectNoHorizontalScroll(page);
  await expectControlsApart(page);

  await page.getByRole("button", { name: "Bắt đầu học" }).tap();
  await expect(page).toHaveURL(new RegExp(`/sections/${FIRST_SECTION}$`));

  // Seen once: the lesson page lists the sections, and the overview stays
  // one tap away.
  await page.goto("/lessons/fixture");
  await expect(page.locator(`[data-section="${FIRST_SECTION}"]`)).toBeVisible();
  await expect(overview).toHaveCount(0);
  await expectControlsApart(page);
  await page.getByRole("button", { name: "Giới thiệu bài" }).tap();
  await expect(overview).toBeVisible();
  await expect(page.getByRole("button", { name: "Học tiếp" })).toBeVisible();

  // Home now goes straight into the section.
  await page.goto("/");
  await expect(page.locator("[data-continue]")).toHaveAttribute(
    "href",
    `/lessons/fixture/sections/${FIRST_SECTION}`,
  );
});

test("the overview and lesson notes can be read aloud by the device voice", async ({
  page,
}) => {
  await withVietnameseVoice(page);
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto("/lessons/fixture");
  const read = page.getByRole("button", { name: "Nghe đọc" });
  await expect(read).toBeVisible();
  await read.tap();
  await expect(
    page.locator("[data-lesson-overview] [data-reading]"),
  ).toHaveCount(1);
  expect(
    await page.evaluate(() => (window as { __spoken?: string[] }).__spoken),
  ).toContain("Phép nhân giúp bạn đếm đồ vật thật nhanh mỗi ngày.");

  await page.getByRole("button", { name: "Bắt đầu học" }).tap();
  // The first screen of the section is a note.
  await expect(
    page.locator('[data-block="note"]').getByRole("button", {
      name: "Nghe đọc",
    }),
  ).toBeVisible();
  await expectControlsApart(page);
});

test("a recorded narration plays only on request and replaces the device voice", async ({
  page,
}) => {
  await withVietnameseVoice(page);
  await withNarration(
    page,
    "WEBVTT\n\n1\n00:00:00.500 --> 00:00:03.000\nMẹ <00:00:00.800>mua\n",
  );
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto("/lessons/fixture");
  const player = page.locator("[data-overview-narration]");
  await expect(player).toHaveAttribute("data-overview-narration", "paused");
  await expect(page.getByRole("button", { name: "Nghe đọc" })).toHaveCount(0);
  expect(
    await page
      .locator("[data-overview-audio]")
      .evaluate((audio: HTMLAudioElement) => audio.paused),
  ).toBe(true);
  await expectControlsApart(page);
  await page.getByRole("button", { name: "Nghe giới thiệu" }).tap();
  await expect(player).toHaveAttribute("data-overview-narration", "playing");
});

import { expect } from "@playwright/test";
import { createProfile, openFixtureLesson } from "./flows";
import { expectControlsApart, expectNoHorizontalScroll } from "./layout";
import { test } from "./test";

const SECTION = "fixture.section.doc-hieu";
// The fixture has one tip in its second section and two in its tips file.
const TIP_COUNT = 3;

test("a tip is a screen of its section, labelled as a tip", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto(`/lessons/fixture/sections/${SECTION}`);
  const stepper = page.locator("[data-section-stepper]");
  // The tip is the third block of the section.
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: "Tiếp" }).tap();
  }
  await expect(stepper).toHaveAttribute("data-current", "2");
  const tip = page.locator("[data-block=tip]");
  await expect(tip).toBeVisible();
  await expect(tip).toContainText("Mẹo hiểu nhanh");
  await expectNoHorizontalScroll(page);
  await expectControlsApart(page);
  await page.getByRole("button", { name: "Tiếp" }).tap();
  await expect(stepper).toHaveAttribute("data-current", "3");
});

test("the lesson's Mẹo hay page lists its section tip and its tips file", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await openFixtureLesson(page);
  await expectControlsApart(page);
  await page.locator("[data-tips-open]").tap();
  // The first visit compiles the page in the dev server.
  await expect(page).toHaveURL(/\/lessons\/fixture\/tips$/, {
    timeout: 30_000,
  });
  await expect(
    page.getByRole("heading", { level: 1, name: "Mẹo hay" }),
  ).toBeVisible();
  const cards = page.locator("[data-tips-list] [data-block=tip]");
  await expect(cards).toHaveCount(TIP_COUNT);
  await expect(cards.nth(0)).toHaveAttribute("data-tip-kind", "hiểu nhanh");
  await expect(cards.nth(1)).toHaveAttribute("data-tip-kind", "hiểu nhanh");
  await expect(cards.nth(2)).toHaveAttribute("data-tip-kind", "tránh sai");
  await expect(cards.nth(1).locator("[data-tip-formula] .katex")).toBeVisible();
  await expectNoHorizontalScroll(page);
  await page.locator("[data-tips-back]").tap();
  await expect(page).toHaveURL(/\/lessons\/fixture$/);
});

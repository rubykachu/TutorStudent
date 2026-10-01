import { expect } from "@playwright/test";
import { createProfile } from "./flows";
import { expectNoHorizontalScroll } from "./layout";
import { test } from "./test";

const SECTION = "fixture.section.phep-nhan";
const READING = "fixture.section.doc-hieu";

test("every screen says whether it teaches or asks, and visited dots jump back", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto(`/lessons/fixture/sections/${SECTION}`);
  const stepper = page.locator("[data-section-stepper]");
  // An exercise in progress stays mounted, hidden, behind an earlier screen.
  const badge = page.locator("[data-screen-kind]:visible");

  await expect(badge).toHaveText("Lý thuyết");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Phần 1: ",
  );
  // Only the first screen has been visited.
  await expect(page.locator("[data-step-dot]")).toHaveCount(1);

  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Tiếp" }).tap();
  }
  await expect(badge).toHaveAttribute("data-screen-kind", "check");
  await expect(badge).toHaveText("Bài tập · Kiểm tra nhanh");
  await expect(page.locator("[data-step-dot]")).toHaveCount(4);

  // A dot of a visited screen jumps back to it; the dot of the screen
  // reached returns.
  await page.getByRole("button", { name: "Lý thuyết 2" }).tap();
  await expect(stepper).toHaveAttribute("data-current", "1");
  await expect(badge).toHaveText("Lý thuyết");
  await page.getByRole("button", { name: "Câu 1" }).tap();
  await expect(stepper).toHaveAttribute("data-current", "3");
  await expect(badge).toHaveText("Bài tập · Kiểm tra nhanh");
  await expectNoHorizontalScroll(page);
  for (const dot of await page.locator("[data-step-dot]").all()) {
    expect((await dot.boundingBox())?.height).toBeGreaterThanOrEqual(47.5);
  }
});

test("Bỏ qua moves past an exercise without answering it", async ({ page }) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto(`/lessons/fixture/sections/${SECTION}`);
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Tiếp" }).tap();
  }
  const exercise = page.locator("[data-section-step=exercise]");
  await expect(exercise).toHaveAttribute("data-context", "check");
  await page.getByRole("button", { name: "Bỏ qua" }).tap();
  // The answer shows first, with "Tiếp" alone in the bar; it then moves on.
  await expect(page.getByRole("button", { name: "Bỏ qua" })).toHaveCount(0);
  await page.getByRole("button", { name: "Tiếp", exact: true }).tap();
  await expect(exercise).toHaveAttribute("data-context", "practice");
  await expect(page.locator("[data-section-stepper]")).toHaveAttribute(
    "data-current",
    "4",
  );
});

test("placing a word in a blank never moves the sentence", async ({ page }) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto(`/lessons/fixture/sections/${READING}`);
  // The passage, its note and the section's tip come before the exercise.
  for (let i = 0; i < 3; i++) {
    await page.getByRole("button", { name: "Tiếp" }).tap();
  }
  const exercise = page.locator('[data-exercise="fixture.ex.dien-tu"]');
  const blank = exercise.locator("[data-blank]");
  const sentence = exercise.locator("[data-answer-area] p");
  await expect(blank).toBeVisible();
  const before = {
    blank: await blank.boundingBox(),
    sentence: await sentence.boundingBox(),
  };
  // The blank is as wide as the widest word of the bank from the start.
  const widest = Math.max(
    ...(await exercise
      .locator("[data-chip]")
      .evaluateAll((chips) =>
        chips.map((chip) => chip.getBoundingClientRect().width),
      )),
  );
  expect(before.blank?.width).toBeGreaterThanOrEqual(widest - 1);

  for (const word of ["Minh", "Lan"]) {
    await exercise.locator(`[data-chip="${word}"]`).tap();
    await blank.tap();
    await expect(blank).toContainText(word);
    const after = {
      blank: await blank.boundingBox(),
      sentence: await sentence.boundingBox(),
    };
    expect(after).toEqual(before);
  }
});

test("a sticker opens a sheet with how to earn it and a link to its lesson", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.locator("[data-sticker-open]").first().tap();
  const sheet = page.locator("[data-sticker-sheet]");
  await expect(sheet).toBeVisible();
  await expect(sheet.locator("[data-sticker-progress]")).toHaveText(
    "Xong 0/2 phần",
  );
  await expect(sheet.locator("[data-sticker-how]")).toContainText(
    "Học xong bài",
  );
  await expect(sheet.getByRole("link", { name: "Mở bài học" })).toHaveAttribute(
    "href",
    "/lessons/fixture",
  );
  await expectNoHorizontalScroll(page);
  await sheet.getByRole("button", { name: "Đóng" }).tap();
  await expect(sheet).toHaveCount(0);
});

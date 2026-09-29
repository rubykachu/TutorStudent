import { expect, type Locator, type Page, test } from "@playwright/test";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";

// /dev/exercises renders every fixture exercise whose type has an answer
// component inside the real ExerciseFrame.

function exercise(page: Page, id: string): Locator {
  return page.locator(`[data-exercise="${id}"]`);
}

async function expectAccepted(card: Locator) {
  await expect(card.locator("section")).toHaveAttribute(
    "data-phase",
    "correct",
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto("/dev/exercises");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bài tập");
});

test("a choice exercise is answered correctly by touch", async ({ page }) => {
  const card = exercise(page, "fixture.ex.chon-phep-nhan");
  await card.locator('[data-option="a"]').tap();
  await card.getByRole("button", { name: "Kiểm tra" }).tap();
  await expectAccepted(card);
});

test("a numeric exercise is answered correctly on the number pad", async ({
  page,
}) => {
  const card = exercise(page, "fixture.ex.dem-cham");
  await card.getByRole("button", { name: "6", exact: true }).tap();
  await expect(card.locator('[data-slot="value"]')).toHaveText("6");
  await card.getByRole("button", { name: "Kiểm tra" }).tap();
  await expectAccepted(card);
});

test("a power is entered with the mũ key", async ({ page }) => {
  const card = exercise(page, "fixture.ex.viet-luy-thua");
  await card.getByRole("button", { name: "2", exact: true }).tap();
  await card.getByRole("button", { name: "Số mũ" }).tap();
  await card.getByRole("button", { name: "3", exact: true }).tap();
  await card.getByRole("button", { name: "Kiểm tra" }).tap();
  await expectAccepted(card);
});

test("every touch target is at least 48px and nothing scrolls sideways", async ({
  page,
}) => {
  // Types without an answer component yet are listed, not rendered.
  await expect(page.getByText("chưa có giao diện").first()).toBeVisible();
  await expectTouchTargets(page);
  await expectNoHorizontalScroll(page);
});

import { expect, type Page, test } from "@playwright/test";
import {
  answerRight,
  answerWrongOnce,
  createProfile,
  currentExercise,
  exerciseId,
  finishSection,
} from "./flows";
import { expectNoHorizontalScroll } from "./layout";

const MISSED_CARD = "fixture.card.nhan-lap";
const MISSED_EXERCISE = "fixture.ex.dem-cham";
// The only exercise of the powers card outside the section practice.
const BANK_EXERCISE = "fixture.ex.chon-luy-thua";

// The recap follows a missed question only and waits for "Tiếp".
async function closeRecap(page: Page) {
  const recap = page.locator('[data-review-step="recap"]');
  await expect(recap).toBeVisible();
  await expectNoHorizontalScroll(page);
  await page.getByRole("button", { name: "Tiếp" }).tap();
  await expect(recap).toHaveCount(0);
}

async function expectNoRecap(page: Page) {
  await expect(page.locator('[data-review-step="recap"]')).toHaveCount(0);
}

test("review asks the missed card first and again at the end", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto("/lessons/fixture");
  await expect(page.locator("[data-review-button]")).toHaveCount(0);
  await page.locator('[data-section="fixture.section.phep-nhan"]').tap();
  await finishSection(page, MISSED_EXERCISE);
  await page.getByRole("link", { name: "Về bài" }).tap();

  const reviewButton = page.getByRole("link", { name: /Ôn bài này/ });
  await reviewButton.tap();
  const item = currentExercise(page);
  await expect(item).toHaveAttribute("data-card", MISSED_CARD);
  await expect(item).not.toHaveAttribute("data-reask");
  // Review picks one of the card's exercises at random; the answers below
  // cover each of them.
  const firstAsk = await exerciseId(page);
  await expectNoHorizontalScroll(page);

  await answerWrongOnce(page);
  await closeRecap(page);

  // The other opened card is asked with its bank exercise, not the practice
  // just done; answered right, it moves on without a recap.
  await expect(item).not.toHaveAttribute("data-card", MISSED_CARD);
  expect(await exerciseId(page)).toBe(BANK_EXERCISE);
  await answerRight(page);
  await expectNoRecap(page);

  // The missed card comes back last, with another of its exercises.
  await expect(item).toHaveAttribute("data-card", MISSED_CARD);
  await expect(item).toHaveAttribute("data-reask", "true");
  expect(await exerciseId(page)).not.toBe(firstAsk);
  await answerRight(page);
  await expectNoRecap(page);

  await expect(
    page.getByRole("heading", { name: "Ôn xong 3 câu!" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Về bài" }).tap();

  // Review can start again right away.
  await reviewButton.tap();
  await expect(item).toHaveAttribute("data-card", MISSED_CARD);
  await answerRight(page);
  await expectNoRecap(page);
  await expect(item).not.toHaveAttribute("data-card", MISSED_CARD);
});

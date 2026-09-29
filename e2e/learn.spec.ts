import { expect, type Page, test } from "@playwright/test";
import {
  answerRight,
  answersFor,
  check,
  createProfile,
  currentExercise,
  exerciseId,
} from "./flows";
import { expectNoHorizontalScroll } from "./layout";

const SECTION = "fixture.section.phep-nhan";
// Answered wrong three times, then retyped after the answer is shown.
const MISSED_EXERCISE = "fixture.ex.dem-cham";

async function stepKind(page: Page) {
  const step = page.locator("[data-section-step]");
  await expect(step).toHaveCount(1);
  return step.getAttribute("data-section-step");
}

async function missThreeTimesThenRetype(page: Page) {
  const exercise = currentExercise(page);
  const answers = answersFor(MISSED_EXERCISE);
  const frame = exercise.locator("section[data-phase]");
  await answers.wrong?.(exercise);
  for (const phase of ["wrong1", "wrong2", "wrong3"]) {
    await check(exercise);
    await expect(frame).toHaveAttribute("data-phase", phase);
  }
  await exercise.getByRole("button", { name: "Tự làm lại" }).tap();
  await expect(frame).toHaveAttribute("data-phase", "retype");
  await answerRight(page);
}

test("a child learns a section, resuming where they left off", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto("/lessons/fixture");
  const sectionLink = page.locator(`[data-section="${SECTION}"]`);
  await expect(sectionLink).toHaveAttribute("data-state", "not_started");
  await expectNoHorizontalScroll(page);

  await sectionLink.tap();
  await expect(page).toHaveURL(new RegExp(`/sections/${SECTION}$`));
  const stepper = page.locator("[data-section-stepper]");
  await expect(stepper).toHaveAttribute("data-current", "0");
  await page.getByRole("button", { name: "Tiếp" }).tap();
  await expect(stepper).toHaveAttribute("data-current", "1");

  // Leaving and coming back opens the same block, and the lesson page
  // already shows the section as started.
  await page.getByRole("link", { name: "Về trang bài" }).tap();
  await expect(sectionLink).toHaveAttribute("data-state", "in_progress");
  await sectionLink.tap();
  await expect(stepper).toHaveAttribute("data-current", "1");

  let missed = false;
  for (;;) {
    const kind = await stepKind(page);
    if (kind === "block") {
      await page.getByRole("button", { name: "Tiếp" }).tap();
    } else if (kind === "exercise") {
      await expectNoHorizontalScroll(page);
      if ((await exerciseId(page)) === MISSED_EXERCISE) {
        await missThreeTimesThenRetype(page);
        missed = true;
      } else {
        await answerRight(page);
      }
    } else {
      break;
    }
  }
  expect(missed).toBe(true);

  expect(await stepKind(page)).toBe("recap");
  await page.getByRole("button", { name: "Xong phần" }).tap();
  await expect(
    page.getByRole("heading", { name: "Xong phần này!" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Về bài" }).tap();
  await expect(sectionLink).toHaveAttribute("data-state", "done");
});

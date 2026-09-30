import { expect, type Locator, type Page } from "@playwright/test";
import { expectNoHorizontalScroll } from "./layout";

// Steps several specs share. The dev server runs with CONTENT_INCLUDE_FIXTURE=1,
// so the fixture lesson is served at /lessons/fixture.

export const FIXTURE_LESSON_TITLE = "Bài mẫu: phép nhân và đọc hiểu";

export async function createProfile(page: Page, name: string, avatar: string) {
  await page.getByLabel("Bạn tên là gì?").fill(name);
  await page.getByText(avatar, { exact: true }).click();
  await page.getByRole("button", { name: "Bắt đầu học" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: `Chào ${name}!` }),
  ).toBeVisible();
}

// The fixture lesson's page with its list of sections. A child who has not
// seen the lesson's overview meets it first; this passes it by its
// "Xem các phần của bài" button.
export async function openFixtureLesson(page: Page) {
  await page.goto("/lessons/fixture");
  const overview = page.locator("[data-lesson-overview]");
  const sections = page.locator("[data-section]").first();
  await expect(overview.or(sections)).toBeVisible();
  if (await overview.isVisible()) {
    await page.locator("[data-overview-browse]").tap();
  }
  await expect(sections).toBeVisible();
}

// The exercise currently on screen in the section player or a review.
export function currentExercise(page: Page): Locator {
  return page.locator("[data-exercise]");
}

export async function check(exercise: Locator) {
  await exercise.getByRole("button", { name: "Kiểm tra" }).tap();
}

export async function pad(exercise: Locator, keys: string[]) {
  for (const key of keys) {
    await exercise.locator(`[data-pad-key="${key}"]`).tap();
  }
}

// Taps order cards until they read `ids` top to bottom: picking a card and
// then the card at its target place moves it there.
export async function sortItems(exercise: Locator, ids: string[]) {
  for (const [position, id] of ids.entries()) {
    const current = await exercise
      .locator("[data-item]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-item")));
    if (current[position] === id) continue;
    await exercise.locator(`[data-item="${id}"]`).tap();
    await exercise.locator(`[data-item="${current[position]}"]`).tap();
  }
}

// Pairs match items by tapping the left item, then its right partner.
export async function pairItems(
  exercise: Locator,
  pairs: [left: string, right: string][],
) {
  for (const [left, right] of pairs) {
    await exercise.locator(`[data-side="left"][data-item="${left}"]`).tap();
    await exercise.locator(`[data-side="right"][data-item="${right}"]`).tap();
  }
}

async function tapTimes(exercise: Locator, name: string, times: number) {
  const button = exercise.getByRole("button", { name });
  // The visual loads on first use.
  await button.waitFor();
  for (let i = 0; i < times; i++) await button.tap();
}

type Answerer = (exercise: Locator) => Promise<void>;

// Known answers of the fixture exercises: `right` enters the correct answer
// into an empty answer area, `wrong` a wrong one, and `fix` turns that wrong
// answer into the right one. Only exercises the E2E flows reach are listed.
export const FIXTURE_ANSWERS: Record<
  string,
  { right: Answerer; wrong?: Answerer; fix?: Answerer }
> = {
  "fixture.ex.cham-hinh-tron": {
    right: (ex) => ex.locator('[data-region="circle"]').tap(),
  },
  "fixture.ex.ghep-phep-nhan": {
    right: (ex) =>
      pairItems(ex, [
        ["hai-nhan-ba", "sau"],
        ["bon-nhan-hai", "tam"],
      ]),
    wrong: (ex) =>
      pairItems(ex, [
        ["hai-nhan-ba", "tam"],
        ["bon-nhan-hai", "sau"],
      ]),
    // Pairing an item again moves it to its new partner.
    fix: (ex) =>
      pairItems(ex, [
        ["hai-nhan-ba", "sau"],
        ["bon-nhan-hai", "tam"],
      ]),
  },
  "fixture.ex.tao-sau-cham": {
    right: (ex) => tapTimes(ex, "Thêm một chấm", 6),
    wrong: (ex) => tapTimes(ex, "Thêm một chấm", 5),
    fix: (ex) => tapTimes(ex, "Thêm một chấm", 1),
  },
  "fixture.ex.xep-hinh-vuong": {
    // A 3 × 3 square in the top-left corner of the 5 × 5 board.
    right: async (ex) => {
      for (const cell of [0, 1, 2, 5, 6, 7, 10, 11, 12]) {
        await ex.locator(`[data-cell="${cell}"]`).tap();
      }
    },
  },
  "fixture.ex.cham-cau": {
    right: (ex) => ex.locator('[data-sentence="s2"]').tap(),
  },
  "fixture.ex.chon-y-chinh": {
    right: (ex) => ex.locator('[data-option="a"]').tap(),
  },
  "fixture.ex.dem-cham": {
    right: (ex) => pad(ex, ["6"]),
    wrong: (ex) => pad(ex, ["9"]),
    fix: (ex) => pad(ex, ["backspace", "6"]),
  },
  "fixture.ex.viet-luy-thua": {
    right: (ex) => pad(ex, ["2", "power", "3"]),
  },
  "fixture.ex.sap-xep": {
    right: (ex) => sortItems(ex, ["mot", "hai", "ba"]),
  },
  "fixture.ex.chon-luy-thua": {
    right: async (ex) => {
      await ex.locator('[data-option="a"]').tap();
      await ex.locator('[data-option="b"]').tap();
    },
  },
};

export async function exerciseId(page: Page): Promise<string> {
  const id = await currentExercise(page).getAttribute("data-exercise");
  if (!id) throw new Error("No exercise on screen");
  return id;
}

export function answersFor(id: string) {
  const answers = FIXTURE_ANSWERS[id];
  if (!answers) throw new Error(`No E2E answers for exercise "${id}"`);
  return answers;
}

async function acceptAndContinue(page: Page, exercise: Locator, id: string) {
  await check(exercise);
  await expect(exercise.locator("section[data-phase]")).toHaveAttribute(
    "data-phase",
    "correct",
  );
  await exercise.getByRole("button", { name: "Tiếp" }).tap();
  await expect(page.locator(`[data-exercise="${id}"]`)).toHaveCount(0);
}

// Answers the exercise on screen correctly on the first try and moves on.
export async function answerRight(page: Page) {
  const exercise = currentExercise(page);
  const id = await exerciseId(page);
  await answersFor(id).right(exercise);
  await acceptAndContinue(page, exercise, id);
}

// One wrong check, then the right answer: finished, but rated Again.
export async function answerWrongOnce(page: Page) {
  const exercise = currentExercise(page);
  const id = await exerciseId(page);
  const { wrong, fix } = answersFor(id);
  if (!wrong || !fix) throw new Error(`No wrong answer listed for "${id}"`);
  await wrong(exercise);
  await check(exercise);
  await expect(exercise.locator("section[data-phase]")).toHaveAttribute(
    "data-phase",
    "wrong1",
  );
  await fix(exercise);
  await acceptAndContinue(page, exercise, id);
}

async function stepKind(page: Page) {
  const step = page.locator("[data-section-step]");
  await expect(step).toHaveCount(1);
  return step.getAttribute("data-section-step");
}

async function missThreeTimesThenRetype(page: Page, id: string) {
  const exercise = currentExercise(page);
  const frame = exercise.locator("section[data-phase]");
  await answersFor(id).wrong?.(exercise);
  for (const phase of ["wrong1", "wrong2", "wrong3"]) {
    await check(exercise);
    await expect(frame).toHaveAttribute("data-phase", phase);
  }
  await exercise.getByRole("button", { name: "Tự làm lại" }).tap();
  await expect(frame).toHaveAttribute("data-phase", "retype");
  await answerRight(page);
}

// From anywhere inside a section: goes through the remaining blocks and
// exercises (all right, except `missedId`, which is missed three times and
// retyped), then taps "Xong phần" on the recap.
export async function finishSection(page: Page, missedId: string) {
  let missed = false;
  for (;;) {
    const kind = await stepKind(page);
    if (kind === "block") {
      await page.getByRole("button", { name: "Tiếp" }).tap();
    } else if (kind === "exercise") {
      await expectNoHorizontalScroll(page);
      if ((await exerciseId(page)) === missedId) {
        await missThreeTimesThenRetype(page, missedId);
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
}

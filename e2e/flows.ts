import { expect, type Locator, type Page } from "@playwright/test";

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

// The exercise currently on screen in the section player or a review.
export function currentExercise(page: Page): Locator {
  return page.locator("[data-exercise]");
}

export async function check(exercise: Locator) {
  await exercise.getByRole("button", { name: "Kiểm tra" }).tap();
}

async function pad(exercise: Locator, keys: string[]) {
  for (const key of keys) {
    await exercise.locator(`[data-pad-key="${key}"]`).tap();
  }
}

// Taps order cards until they read `ids` top to bottom: picking a card and
// then the card at its target place moves it there.
async function sortItems(exercise: Locator, ids: string[]) {
  for (const [position, id] of ids.entries()) {
    const current = await exercise
      .locator("[data-item]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-item")));
    if (current[position] === id) continue;
    await exercise.locator(`[data-item="${id}"]`).tap();
    await exercise.locator(`[data-item="${current[position]}"]`).tap();
  }
}

type Answerer = (exercise: Locator) => Promise<void>;

// Known answers of the fixture exercises: `right` enters the correct answer,
// `wrong` a wrong one. Only exercises the E2E flows reach are listed.
export const FIXTURE_ANSWERS: Record<
  string,
  { right: Answerer; wrong?: Answerer; clear?: Answerer }
> = {
  "fixture.ex.chon-phep-nhan": {
    right: (ex) => ex.locator('[data-option="a"]').tap(),
  },
  "fixture.ex.dem-cham": {
    right: (ex) => pad(ex, ["6"]),
    wrong: (ex) => pad(ex, ["9"]),
    clear: (ex) => pad(ex, ["backspace"]),
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

// Answers the exercise on screen correctly on the first try and moves on.
export async function answerRight(page: Page) {
  const exercise = currentExercise(page);
  const id = await exerciseId(page);
  await answersFor(id).right(exercise);
  await check(exercise);
  await expect(exercise.locator("section[data-phase]")).toHaveAttribute(
    "data-phase",
    "correct",
  );
  await exercise.getByRole("button", { name: "Tiếp" }).tap();
  await expect(page.locator(`[data-exercise="${id}"]`)).toHaveCount(0);
}

// One wrong check, then the right answer: finished, but rated Again.
export async function answerWrongOnce(page: Page) {
  const exercise = currentExercise(page);
  const id = await exerciseId(page);
  const answers = answersFor(id);
  if (!answers.wrong || !answers.clear) {
    throw new Error(`No wrong answer listed for "${id}"`);
  }
  await answers.wrong(exercise);
  await check(exercise);
  await expect(exercise.locator("section[data-phase]")).toHaveAttribute(
    "data-phase",
    "wrong1",
  );
  await answers.clear(exercise);
  await answerRight(page);
}

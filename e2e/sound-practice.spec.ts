import { expect, type Page } from "@playwright/test";
import {
  answerRight,
  answersFor,
  check,
  createProfile,
  currentExercise,
  exerciseId,
  openFixtureLesson,
} from "./flows";
import { test } from "./test";

const SECTION = "fixture.section.phep-nhan";
// A number-pad exercise with a known wrong answer.
const EXERCISE = "fixture.ex.dem-cham";
// Every button tap plays this press sound; the sequences below are the
// feedback that follows a check, so the press is left out of them.
const PRESS_SOUND = "/sounds/button.m4a";

// Records every clip the page asks to play instead of playing it, and ends
// each at once, so a sequence (tone, then line) runs through. Short clips play
// as decoded buffers: the url of each is remembered from its fetch to its
// decode, and a buffer started is a clip played. A media element (a song)
// counts unless it is `muted` for the silent unlock; `muted` reads what the
// app set even though the silencer mutes the element for real.
async function recordSounds(page: Page) {
  await page.addInitScript(() => {
    const played: string[] = [];
    Object.assign(window, { __played: played });
    const fetchedFrom = new WeakMap<ArrayBuffer, string>();
    const decodedFrom = new WeakMap<AudioBuffer, string>();
    const arrayBuffer = Response.prototype.arrayBuffer;
    Response.prototype.arrayBuffer = async function (this: Response) {
      const data = await arrayBuffer.call(this);
      fetchedFrom.set(data, new URL(this.url).pathname);
      return data;
    };
    const decode = BaseAudioContext.prototype.decodeAudioData;
    BaseAudioContext.prototype.decodeAudioData = async function (
      this: BaseAudioContext,
      data: ArrayBuffer,
    ) {
      const url = fetchedFrom.get(data);
      const buffer = await decode.call(this, data);
      if (url) decodedFrom.set(buffer, url);
      return buffer;
    } as typeof decode;
    AudioBufferSourceNode.prototype.start = function (
      this: AudioBufferSourceNode,
    ) {
      const url = this.buffer && decodedFrom.get(this.buffer);
      if (url) played.push(url);
      setTimeout(() => this.dispatchEvent(new Event("ended")), 10);
    };
    HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
      if (!this.muted) played.push(new URL(this.src).pathname);
      setTimeout(() => this.dispatchEvent(new Event("ended")), 10);
      return Promise.resolve();
    };
  });
}

function played(page: Page): Promise<string[]> {
  return page.evaluate(
    () => (window as { __played?: string[] }).__played ?? [],
  );
}

async function reachExercise(page: Page, id: string) {
  await page.locator(`[data-section="${SECTION}"]`).tap();
  for (;;) {
    const step = page.locator("[data-section-step]");
    await expect(step).toHaveCount(1);
    if ((await step.getAttribute("data-section-step")) === "block") {
      await page.getByRole("button", { name: "Tiếp" }).tap();
    } else if ((await exerciseId(page)) === id) {
      return currentExercise(page);
    } else {
      await answerRight(page);
    }
  }
}

// The attempts saved for one exercise, straight from IndexedDB.
function attemptsOf(page: Page, id: string) {
  return page.evaluate(
    (exerciseId) =>
      new Promise<{ firstTryCorrect: boolean; wrongCount: number }[]>(
        (resolve, reject) => {
          const open = indexedDB.open("tutor");
          open.onerror = () => reject(open.error);
          open.onsuccess = () => {
            const all = open.result
              .transaction("attempts")
              .objectStore("attempts")
              .getAll();
            all.onsuccess = () =>
              resolve(
                all.result.filter(
                  (a: { exerciseId: string }) => a.exerciseId === exerciseId,
                ),
              );
          };
        },
      ),
    id,
  );
}

test("every check makes a sound, and an accepted exercise can be replayed unrated", async ({
  page,
}) => {
  await recordSounds(page);
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await openFixtureLesson(page);
  const exercise = await reachExercise(page, EXERCISE);
  const frame = exercise.locator("section[data-phase]");
  const { wrong, right } = answersFor(EXERCISE);
  const since = async (from: number) =>
    (await played(page)).slice(from).filter((url) => url !== PRESS_SOUND);

  let before = (await played(page)).length;
  await wrong?.(exercise);
  await check(exercise);
  await expect(frame).toHaveAttribute("data-phase", "wrong1");
  await expect
    .poll(() => since(before))
    .toEqual([expect.stringMatching(/^\/sounds\/encourage-/)]);
  // Later wrong checks: the wrong-answer sound, then the owl's line of that tier.
  for (const [phase, line] of [
    ["wrong2", /^\/sounds\/hint-/],
    ["wrong3", /^\/sounds\/(solution-visual|reveal)\.m4a$/],
  ] as const) {
    before = (await played(page)).length;
    await check(exercise);
    await expect(frame).toHaveAttribute("data-phase", phase);
    await expect
      .poll(() => since(before))
      .toEqual(["/sounds/wrong-answer.m4a", expect.stringMatching(line)]);
  }
  // Correct after wrong checks (entered again): the jingle and the praise.
  await exercise.getByRole("button", { name: "Tự làm lại" }).tap();
  before = (await played(page)).length;
  await right(exercise);
  await check(exercise);
  await expect(frame).toHaveAttribute("data-phase", "correct");
  await expect
    .poll(() => since(before))
    .toEqual([
      "/sounds/correct-jingle.m4a",
      expect.stringMatching(/^\/sounds\/praise-/),
    ]);

  // "Làm lại": a clean slate, right on the first try this time.
  await exercise.getByRole("button", { name: "Làm lại" }).tap();
  await expect(frame).toHaveAttribute("data-phase", "idle");
  await right(exercise);
  await check(exercise);
  await expect(frame).toHaveAttribute("data-phase", "correct");
  await exercise.getByRole("button", { name: "Tiếp" }).tap();
  await expect(page.locator(`[data-exercise="${EXERCISE}"]`)).toHaveCount(0);

  // Saved once, as the first play went: three wrong checks, not first try.
  await expect
    .poll(() => attemptsOf(page, EXERCISE))
    .toEqual([
      expect.objectContaining({ firstTryCorrect: false, wrongCount: 3 }),
    ]);
});

test("one sound switch, at the right of every top row, silences every screen", async ({
  page,
}) => {
  await recordSounds(page);
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  const toggle = page.getByRole("button", { name: "Âm thanh" });
  // Home.
  await expect(toggle).toHaveAttribute("aria-pressed", "true");

  // The lesson page and the section player carry the same switch.
  await openFixtureLesson(page);
  await expect(
    page.locator("[data-page-top-bar]").getByRole("button", {
      name: "Âm thanh",
    }),
  ).toBeVisible();
  const exercise = await reachExercise(page, EXERCISE);
  const headerToggle = page
    .locator("header")
    .getByRole("button", { name: "Âm thanh" });
  await expect(headerToggle).toBeVisible();
  const header = await page.locator("header").boundingBox();
  const box = await headerToggle.boundingBox();
  // Nothing to its right: it ends the row.
  expect(box && header && box.x + box.width).toBeGreaterThanOrEqual(
    (header?.x ?? 0) + (header?.width ?? 0),
  );

  await headerToggle.tap();
  await expect(headerToggle).toHaveAttribute("aria-pressed", "false");
  const before = (await played(page)).length;
  await answersFor(EXERCISE).wrong?.(exercise);
  await check(exercise);
  await expect(exercise.locator("section[data-phase]")).toHaveAttribute(
    "data-phase",
    "wrong1",
  );
  expect((await played(page)).slice(before)).toEqual([]);

  // Off everywhere for this child.
  await page.getByRole("link", { name: "Về trang bài" }).tap();
  await expect(page).toHaveURL(/\/lessons\/fixture$/);
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await page.goto("/");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

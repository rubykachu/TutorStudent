import { expect, type Locator, type Page } from "@playwright/test";
import { patchFixtureLesson } from "./fixture-routes";
import {
  answerRight,
  createProfile,
  exerciseId,
  openFixtureLesson,
} from "./flows";
import {
  expectInViewAboveBar,
  expectNoHorizontalScroll,
  expectNothingUnderBottomBar,
} from "./layout";
import { test } from "./test";

// After a wrong check the child must see the hint visual (second check), the
// solution visual or the revealed answer (third check) at once, on every
// target screen, and the sticky bottom bar must never cover a control.

const SCREENS = [
  { name: "phone portrait", project: "phone", width: 390, height: 844 },
  { name: "iPad portrait", project: "ipad", width: 820, height: 1180 },
  { name: "iPad landscape", project: "ipad", width: 1180, height: 820 },
] as const;

async function openSection(page: Page) {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await openFixtureLesson(page);
  await page.locator('[data-section="fixture.section.phep-nhan"]').tap();
  const step = page.locator("[data-section-step]");
  while ((await step.getAttribute("data-section-step")) === "block") {
    const stepper = page.locator("[data-section-stepper]");
    const current = await stepper.getAttribute("data-current");
    await page.getByRole("button", { name: "Tiếp" }).tap();
    await expect(stepper).not.toHaveAttribute("data-current", current ?? "");
  }
}

async function reach(page: Page, id: string): Promise<Locator> {
  while ((await exerciseId(page)) !== id) await answerRight(page);
  return page.locator(`[data-exercise="${id}"]`);
}

async function checkTo(exercise: Locator, phase: string) {
  await exercise.getByRole("button", { name: "Kiểm tra" }).tap();
  await expect(exercise.locator("section[data-phase]")).toHaveAttribute(
    "data-phase",
    phase,
  );
}

// The owl's speech bubble is on screen and overlaps neither the answer card
// nor any control a child might tap.
async function expectBubbleClear(page: Page) {
  const bubble = page.locator("[data-mascot-speech]");
  await expect(bubble).toBeVisible();
  // Let its fade-in and the frame's scrolling settle.
  await expect
    .poll(() => bubble.evaluate((el) => getComputedStyle(el).opacity))
    .toBe("1");
  const clash = await page.evaluate(() => {
    const speech = document.querySelector("[data-mascot-speech]");
    if (!speech) return ["bubble missing"];
    const b = speech.getBoundingClientRect();
    const overlaps = (r: DOMRect) =>
      r.width > 0 &&
      r.height > 0 &&
      r.left < b.right &&
      r.right > b.left &&
      r.top < b.bottom &&
      r.bottom > b.top;
    const selector = [
      "[data-answer-area]",
      "button",
      "a[href]",
      "input",
      "[role=button]",
      "[tabindex]:not([tabindex='-1'])",
    ].join(",");
    const hits = [...document.querySelectorAll(selector)]
      .filter((el) => overlaps(el.getBoundingClientRect()))
      .map((el) => el.outerHTML.slice(0, 100));
    if (b.left < 0 || b.right > window.innerWidth) hits.push("off screen");
    const size = Number.parseFloat(getComputedStyle(speech).fontSize);
    if (size < 18) hits.push(`text ${size}px`);
    return hits;
  });
  expect(clash).toEqual([]);
}

async function expectFeedbackInView(page: Page, selector: string) {
  await expectInViewAboveBar(page, selector);
  await expectNothingUnderBottomBar(page);
  await expectNoHorizontalScroll(page);
}

for (const screen of SCREENS) {
  test.describe(screen.name, () => {
    test.use({ viewport: { width: screen.width, height: screen.height } });

    test("hint, solution and revealed answer show without scrolling", async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== screen.project);
      await openSection(page);

      // Hint and solution visuals.
      const dots = await reach(page, "fixture.ex.dem-cham");
      await dots.locator('[data-pad-key="9"]').tap();
      await checkTo(dots, "wrong1");
      await checkTo(dots, "wrong2");
      await expectFeedbackInView(page, "[data-feedback-visual]");
      await checkTo(dots, "wrong3");
      await expectFeedbackInView(page, "[data-feedback-visual]");
      await dots.getByRole("button", { name: "Tự làm lại" }).tap();
      await expectNothingUnderBottomBar(page);
      await answerRight(page);

      // No solution visual: the answer is revealed in the answer card.
      const power = await reach(page, "fixture.ex.viet-luy-thua");
      await power.locator('[data-pad-key="8"]').tap();
      await checkTo(power, "wrong1");
      await checkTo(power, "wrong2");
      await expectFeedbackInView(page, "[data-feedback-visual]");
      await checkTo(power, "wrong3");
      await expect(power.locator("[data-reveal]")).toBeVisible();
      await expectFeedbackInView(page, "[data-answer-area]");
    });

    test("the owl's bubble never covers the answer or a control", async ({
      page,
    }, testInfo) => {
      test.skip(testInfo.project.name !== screen.project);
      await openSection(page);

      const dots = await reach(page, "fixture.ex.dem-cham");
      await dots.locator('[data-pad-key="9"]').tap();
      await checkTo(dots, "wrong1");
      await expectBubbleClear(page);
      await checkTo(dots, "wrong2");
      await expectBubbleClear(page);
      await checkTo(dots, "wrong3");
      await expectBubbleClear(page);
      await dots.getByRole("button", { name: "Tự làm lại" }).tap();
      await expect(page.locator("[data-mascot-speech]")).toHaveCount(0);
      await dots.locator('[data-pad-key="6"]').tap();
      await checkTo(dots, "correct");
      await expectBubbleClear(page);
      await dots.getByRole("button", { name: "Tiếp" }).tap();
      await expect(dots).toHaveCount(0);

      const power = await reach(page, "fixture.ex.viet-luy-thua");
      await power.locator('[data-pad-key="8"]').tap();
      await checkTo(power, "wrong1");
      await checkTo(power, "wrong2");
      await checkTo(power, "wrong3");
      await expectBubbleClear(page);
    });
  });
}

// A question and a passage above four
// options that wrap to two lines: taller than a phone screen together. The
// frame must lift the whole answer card, last option included, above the
// bottom bar, both when the exercise opens and once the praise bubble pushes
// the card down.
const LONG_CHOICE_ID = "fixture.ex.dem-cham";

test("a long prompt keeps every option above the bottom bar on a phone", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "phone");
  await patchFixtureLesson(page, (lesson) => {
    const index = lesson.exercises.findIndex((e) => e.id === LONG_CHOICE_ID);
    const long = (text: string) => ({ type: "text" as const, text });
    lesson.exercises[index] = {
      id: LONG_CHOICE_ID,
      type: "choice",
      cardIds: [],
      difficulty: 1,
      multiple: false,
      hints: { highlight: [] },
      prompt: [
        {
          type: "note",
          text: "Minh nói việc Lan mang bài sang nhà “như là một món quà”. Điều đó cho thấy gì về hai bạn?",
        },
        {
          type: "passage",
          annotations: [],
          paragraphs: [
            {
              sentences: [
                {
                  id: "p1",
                  text: "Những ngày Lan nghỉ ốm, lớp học vắng hẳn đi.",
                },
                {
                  id: "p2",
                  text: "Còn khi thấy Minh mang vở sang, Lan vui như được nghe một bài hát hay.",
                },
              ],
            },
          ],
        },
      ],
      options: [
        { id: "a", content: long("Hai bạn quý nhau và luôn nghĩ đến nhau") },
        { id: "b", content: long("Minh muốn được cô giáo khen trước cả lớp") },
        { id: "c", content: long("Lan không thích đi học cùng các bạn khác") },
        { id: "d", content: long("Minh thích tặng quà cho tất cả mọi người") },
      ],
      answer: ["a"],
    };
  });
  await openSection(page);
  const exercise = await reach(page, LONG_CHOICE_ID);
  await expectInViewAboveBar(page, "[data-answer-area]");
  await expectNothingUnderBottomBar(page);

  await exercise.locator('[data-option="a"]').tap();
  await checkTo(exercise, "correct");
  await expectInViewAboveBar(page, "[data-answer-area]");
  await expectNothingUnderBottomBar(page);
});

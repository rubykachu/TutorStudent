import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import {
  type Browser,
  chromium,
  type Locator,
  type Page,
  webkit,
} from "@playwright/test";
import { lessonContentUrl } from "@/content";
import { readContentRoot } from "@/content/load";
import { lessonPath, PROFILES_PATH, sectionPath } from "@/lib/routes";
import {
  type BasicExercise,
  type Exercise,
  type Lesson,
  LessonSchema,
  type ManipulateExercise,
  type OpenEndedExercise,
} from "@/schema/content";
import { findVisual, type VisualState } from "@/visuals/registry";
import {
  STATE_KEY_ATTR,
  STATE_SET_ATTR,
  STATE_STEP_ATTR,
  STATE_VALUE_ATTR,
  STEP_NEXT_ATTR,
} from "@/visuals/shared/markers";
import { createProfile, pad, pairItems, sortItems } from "../e2e/flows";
import {
  coveredByBottomBar,
  expectInViewAboveBar,
  expectNothingUnderBottomBar,
} from "../e2e/layout";
import { TARGET_DEVICES, TEST_BASE_URL } from "../e2e/targets";
import { ensureServer, isServing, stopServer } from "./lib/dev-server";

// Usage: lesson-walk <lessonId>
// Walks every section of a lesson the way a child does, on each walk device:
// every explanation screen, every exercise answered right (read from the
// lesson the server serves; an open-ended one step by step, then a sample
// paragraph with every rubric line ticked), and the first exercise of each
// type, with and without a hint visual, missed three times to see all
// feedback tiers. Screenshots go to .shots/walk/<lessonId>/<device>/.
// Fails when a feedback visual (hint or solution) is out of view, when the
// hint is lost after the number pad is opened again, when the bottom bar
// covers something the child must tap, or when anything sticks out of the
// answer card, an exercise column or the screen sideways, and when a video
// block has no video, an unserved file or a small play button. Drafts are walked too: a
// server it starts serves them (CONTENT_INCLUDE_DRAFT=1); WALK_BASE_URL
// points it at another running server instead.

const SHOTS_DIR = path.join(process.cwd(), ".shots", "walk");
const BASE_URL = process.env.WALK_BASE_URL ?? TEST_BASE_URL;
const DRAFT_ENV = { CONTENT_INCLUDE_DRAFT: "1" };
// Lets a feedback visual load and any scroll the app starts settle before
// the checks measure the screen.
const SETTLE_MS = 800;
const MAX_STEPPER_TAPS = 100;
// A video's play button is at least this big; the walk plays it for this
// many seconds of video, waiting at most this long.
const VIDEO_PLAY_MIN_PX = 64;
const VIDEO_PLAY_CHECK_S = 2;
const VIDEO_PLAY_TIMEOUT_MS = 10_000;
const PROFILE = { name: "Bé Thử", avatar: "Cáo" };
// Typed after an open-ended exercise's starter: a few plain sentences, so
// the writing step has more than its opening and can be handed in.
const WRITING_SAMPLE =
  "Cáo thấy buồn bã và nhớ bạn. Nhìn cánh đồng lúa mì, cáo nhớ mái tóc vàng óng. Tiếng gió xào xạc làm cáo vui vui. Cáo mong bạn luôn nhớ lời dặn.";

// The two E2E targets plus the iPad held in landscape.
const WALK_DEVICES = {
  ipad: TARGET_DEVICES.ipad,
  phone: TARGET_DEVICES.phone,
  "ipad-landscape": {
    ...TARGET_DEVICES.ipad,
    viewport: { width: 1180, height: 820 },
  },
} as const;
type WalkDevice = keyof typeof WALK_DEVICES;

const BROWSERS = { webkit, chromium } as const;

type Severity = "fail" | "warn";
type Finding = {
  severity: Severity;
  device: WalkDevice;
  where: string;
  message: string;
};

function usage(): never {
  console.error("Usage: pnpm lesson:walk <lessonId>");
  process.exit(2);
}

// The lesson as the server serves it, so answers match the screens even
// while lesson.json has edits the server does not serve yet.
async function servedLesson(lessonId: string): Promise<Lesson | undefined> {
  const response = await fetch(`${BASE_URL}${lessonContentUrl(lessonId)}`);
  if (!response.ok) return undefined;
  return LessonSchema.parse(await response.json());
}

function readLesson(lessonId: string): Lesson {
  const file = readContentRoot().lessons.find(
    (raw) =>
      typeof raw.data === "object" &&
      raw.data !== null &&
      "id" in raw.data &&
      raw.data.id === lessonId,
  );
  if (!file) {
    console.error(`Unknown lesson "${lessonId}"`);
    process.exit(2);
  }
  return LessonSchema.parse(file.data);
}

// ---------------------------------------------------------------------------
// Answers, read from the exercise itself

// Enters the right answer into an empty answer area.
async function enterRight(exercise: Locator, ex: BasicExercise) {
  switch (ex.type) {
    case "choice":
      for (const id of ex.answer) {
        await exercise.locator(`[data-option="${id}"]`).tap();
      }
      return;
    case "numeric":
      return pad(exercise, numericKeys(ex, 0));
    case "match":
      return pairItems(
        exercise,
        ex.pairs.map((p) => [p.left, p.right]),
      );
    case "order":
      return sortItems(
        exercise,
        ex.items.map((item) => item.id),
      );
    case "fillBlank":
      return fillBlanks(exercise, ex, (accept) => accept[0] ?? "");
    case "tapText":
      for (const id of ex.answer) {
        await exercise.locator(`[data-sentence="${id}"]`).tap();
      }
      return;
    case "tapRegion":
      for (const id of ex.answer) {
        await exercise.locator(`[data-region="${id}"]`).tap();
      }
      return;
    case "manipulate":
      return driveTo(exercise, solvedState(ex));
  }
}

// Enters an answer that is wrong but close to right, as a child's slip.
async function enterWrong(exercise: Locator, ex: BasicExercise) {
  switch (ex.type) {
    case "choice": {
      const wrong = ex.options.find((o) => !ex.answer.includes(o.id));
      if (!wrong) throw new Error("every option is right");
      await exercise.locator(`[data-option="${wrong.id}"]`).tap();
      return;
    }
    case "numeric":
      return pad(exercise, numericKeys(ex, 1));
    case "match": {
      // Each left item takes the partner of the next one.
      const rights = ex.pairs.map((p) => p.right);
      return pairItems(
        exercise,
        ex.pairs.map((p, i) => [p.left, rights[(i + 1) % rights.length] ?? ""]),
      );
    }
    case "order":
      return sortItems(exercise, ex.items.map((item) => item.id).reverse());
    case "fillBlank":
      return fillBlanks(exercise, ex, (accept) =>
        ex.bank
          ? (ex.bank.find((word) => !accept.includes(word)) ?? "")
          : "sai",
      );
    case "tapText": {
      const ids = await exercise
        .locator("[data-sentence]")
        .evaluateAll((els) =>
          els.map((el) => el.getAttribute("data-sentence")),
        );
      const wrong = ids.find((id) => id && !ex.answer.includes(id));
      if (!wrong) throw new Error("every sentence is right");
      await exercise.locator(`[data-sentence="${wrong}"]`).tap();
      return;
    }
    case "tapRegion": {
      const regions = findVisual(ex.visualId)?.regions ?? [];
      const wrong = regions.find((id) => !ex.answer.includes(id));
      if (!wrong) throw new Error("every region is right");
      await exercise.locator(`[data-region="${wrong}"]`).tap();
      return;
    }
    case "manipulate":
      await driveTo(exercise, solvedState(ex));
      return nudgeAway(exercise);
  }
}

// Pad keys for a numeric answer; `offset` is added to the value, or to the
// exponent of a power, to make a wrong answer.
function numericKeys(
  ex: Extract<BasicExercise, { type: "numeric" }>,
  offset: number,
): string[] {
  const digits = (value: number) =>
    [...String(value)].map((char) => (char === "." ? "comma" : char));
  const { answer } = ex;
  return answer.kind === "value"
    ? digits(answer.value + offset)
    : [...digits(answer.base), "power", ...digits(answer.exponent + offset)];
}

async function fillBlanks(
  exercise: Locator,
  ex: Extract<BasicExercise, { type: "fillBlank" }>,
  pick: (accept: readonly string[]) => string,
) {
  for (const segment of ex.segments) {
    if (segment.type !== "blank") continue;
    const word = pick(segment.accept);
    const blank = exercise.locator(`[data-blank="${segment.id}"]`);
    if (ex.bank) {
      await exercise
        .locator(`[data-chip="${word.replaceAll('"', '\\"')}"]`)
        .first()
        .tap();
      await blank.tap();
    } else {
      await blank.fill(word);
    }
  }
}

function solvedState(ex: ManipulateExercise): VisualState {
  const solve = findVisual(ex.visualId)?.solutions?.[ex.validatorId];
  if (!solve) {
    throw new Error(`${ex.visualId} has no solver for "${ex.validatorId}"`);
  }
  return solve(ex.params);
}

async function stepperValue(stepper: Locator): Promise<number> {
  return Number(await stepper.getAttribute(STATE_VALUE_ATTR));
}

async function tapStep(stepper: Locator, direction: "down" | "up") {
  await stepper.locator(`[${STATE_STEP_ATTR}="${direction}"]`).tap();
}

// Drives an interactive visual through its marked controls (see
// src/visuals/shared/markers.ts) until it shows `state`. A value already on
// screen is moved away and back, since only a change reports the state.
// Keys without a control are values the visual derives itself (the grains
// of a chessboard square follow from the square).
async function driveTo(exercise: Locator, state: VisualState) {
  let driven = 0;
  for (const [key, target] of Object.entries(state)) {
    const set = exercise.locator(`[${STATE_SET_ATTR}="${key}=${target}"]`);
    if ((await set.count()) > 0) {
      await set.first().tap();
      driven += 1;
      continue;
    }
    const stepper = exercise.locator(`[${STATE_KEY_ATTR}="${key}"]`).first();
    if ((await stepper.count()) === 0) {
      // A visual that advances one step per tap (strokes of a symbol) marks
      // only its next control: tap "<key>=1", then "<key>=2", up to the target.
      if (
        (await exercise.locator(`[${STATE_SET_ATTR}^="${key}="]`).count()) > 0
      ) {
        for (let value = 1; value <= target; value++) {
          await exercise
            .locator(`[${STATE_SET_ATTR}="${key}=${value}"]`)
            .first()
            .tap();
        }
        driven += 1;
      }
      continue;
    }
    driven += 1;
    if ((await stepperValue(stepper)) === target) {
      const up = stepper.locator(`[${STATE_STEP_ATTR}="up"]`);
      await tapStep(stepper, (await up.isEnabled()) ? "up" : "down");
    }
    for (let taps = 0; (await stepperValue(stepper)) !== target; taps++) {
      if (taps >= MAX_STEPPER_TAPS) {
        throw new Error(`cannot bring "${key}" to ${target}`);
      }
      await tapStep(
        stepper,
        (await stepperValue(stepper)) < target ? "up" : "down",
      );
    }
  }
  if (driven === 0) {
    throw new Error(
      `no control marked for any of ${Object.keys(state).join(", ")}`,
    );
  }
}

// One step off the solved state: the first stepper moves by one.
async function nudgeAway(exercise: Locator) {
  const stepper = exercise.locator(`[${STATE_KEY_ATTR}]`).first();
  if ((await stepper.count()) > 0) {
    const up = stepper.locator(`[${STATE_STEP_ATTR}="up"]`);
    await tapStep(stepper, (await up.isEnabled()) ? "up" : "down");
    return;
  }
  const other = exercise.locator(`[${STATE_SET_ATTR}][aria-pressed="false"]`);
  if ((await other.count()) > 0) {
    await other.first().tap();
    return;
  }
  // Everything is pressed: undo one control (a filled gap, the reset button).
  const undo = exercise.locator(`[${STATE_SET_ATTR}]:not([disabled])`);
  if ((await undo.count()) === 0) throw new Error("no control to go wrong");
  await undo.first().tap();
}

// ---------------------------------------------------------------------------
// Screen checks, run in the browser

type TextReport = { horizontalScroll: boolean; smallText: string[] };

// Runs in the browser, so it must not reference anything outside itself.
// Elements that stick out sideways: of the answer card or an exercise column
// (a visual too wide for its column), or of the screen. Content inside a
// scrolling or clipping box is that box's business and is skipped, as are
// highlight halos (painted a few px past their content on purpose) and
// fixed-position helpers such as screen-reader live regions; only the
// outermost element of an overflow is named.
function measureOverflow(): string[] {
  const SLACK_PX = 1;
  const issues: string[] = [];
  const name = (el: Element) => {
    const marks = ["data-visual-fit", "data-block", "data-option", "data-slot"]
      .map(
        (attr) => el.getAttribute(attr) && `${attr}=${el.getAttribute(attr)}`,
      )
      .filter(Boolean);
    const text = el.textContent?.trim().slice(0, 24) ?? "";
    return `<${el.tagName.toLowerCase()}${marks.length ? ` ${marks.join(" ")}` : ""}> "${text}"`;
  };
  const clippedWithin = (el: Element, box: Element | null) => {
    for (let p = el.parentElement; p && p !== box; p = p.parentElement) {
      if (getComputedStyle(p).overflowX !== "visible") return true;
    }
    return false;
  };
  const fixedWithin = (el: Element, box: Element | null) => {
    for (let p: Element | null = el; p && p !== box; p = p.parentElement) {
      if (getComputedStyle(p).position === "fixed") return true;
    }
    return false;
  };
  const check = (
    box: Element | null,
    left: number,
    right: number,
    what: string,
  ) => {
    const reported: Element[] = [];
    const scope = box ?? document.querySelector("main");
    if (!scope) return;
    for (const el of scope.querySelectorAll("*")) {
      if (el.closest(".sr-only, [data-halo]")) continue;
      if (fixedWithin(el, box)) continue;
      if (reported.some((outer) => outer.contains(el))) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.left >= left - SLACK_PX && r.right <= right + SLACK_PX) continue;
      if (clippedWithin(el, box)) continue;
      reported.push(el);
      const by = Math.round(Math.max(left - r.left, r.right - right));
      issues.push(`${name(el)} sticks out of ${what} by ${by}px`);
    }
  };
  const boxes = [
    ...document.querySelectorAll("[data-answer-area]"),
    ...document.querySelectorAll(
      "[data-exercise-layout] > :not([data-answer-column])",
    ),
  ];
  for (const box of boxes) {
    const r = box.getBoundingClientRect();
    if (r.width === 0) continue;
    const what = box.hasAttribute("data-answer-area")
      ? "the answer card"
      : "its exercise column";
    check(box, r.left, r.right, what);
  }
  check(null, 0, document.documentElement.clientWidth, "the screen");
  return issues;
}

// Runs in the browser, so it must not reference anything outside itself.
function measureText({ minTextPx }: { minTextPx: number }): TextReport {
  const smallText: string[] = [];
  for (const el of document.querySelectorAll("main *")) {
    const ownText = [...el.childNodes].some(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
    );
    if (!ownText || el.closest(".sr-only")) continue;
    const rect = el.getBoundingClientRect();
    const shown =
      rect.width > 0 &&
      el.checkVisibility({ opacityProperty: true, visibilityProperty: true });
    if (!shown) continue;
    let px = Number.parseFloat(getComputedStyle(el).fontSize);
    const svg = el.closest("svg");
    if (svg && el instanceof SVGElement && svg.viewBox.baseVal.width > 0) {
      px *= svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
    }
    if (px < minTextPx - 0.5) {
      smallText.push(
        `${px.toFixed(1)}px "${el.textContent?.trim().slice(0, 24)}"`,
      );
    }
  }
  const root = document.documentElement;
  return { horizontalScroll: root.scrollWidth > root.clientWidth, smallText };
}

// The line of a failed `expect` that says what was on screen.
function received(error: unknown): string {
  const lines = (error as Error).message.split("\n").map((l) => l.trim());
  return (
    lines.find((l) => l.startsWith("Received")) ??
    lines[0] ??
    "unknown"
  ).replace(/^Received:?\s*/, "");
}

const MIN_TEXT_PX = 16;
// Longest wait for a visual's code to load before its screen is shot.
const VISUAL_LOAD_MS = 10_000;

class Walker {
  readonly findings: Finding[] = [];
  private shotCount = 0;

  constructor(
    private readonly page: Page,
    private readonly device: WalkDevice,
    private readonly outDir: string,
  ) {}

  private report(severity: Severity, where: string, message: string) {
    this.findings.push({ severity, device: this.device, where, message });
  }

  // Screenshots what the child sees and checks it; `where` names the screen.
  // `feedback` is set after the second and third wrong check: the hint or
  // solution visual, or else the revealed answer, must then be in view.
  async look(where: string, { feedback = false } = {}) {
    await this.page.waitForTimeout(feedback ? SETTLE_MS : 100);
    // A visual still fetching its code shows an `aria-busy` placeholder; a
    // shot of it shows the reviewer nothing, so wait for the drawing.
    const loadingVisual = await this.page
      .locator("[aria-busy]")
      .first()
      .waitFor({ state: "detached", timeout: VISUAL_LOAD_MS })
      .then(() => false)
      .catch(() => true);
    this.shotCount += 1;
    const file = `${String(this.shotCount).padStart(3, "0")}-${where.replaceAll(/[^a-z0-9-]+/gi, "-")}.png`;
    await this.page.screenshot({ path: path.join(this.outDir, file) });
    if (loadingVisual) {
      this.report("fail", where, `visual still loading (${file})`);
    }
    try {
      await expectNothingUnderBottomBar(this.page);
    } catch {
      for (const element of await coveredByBottomBar(this.page)) {
        this.report("fail", where, `bottom bar covers ${element} (${file})`);
      }
    }
    if (feedback) {
      const target =
        (await this.page.locator("[data-feedback-visual]").count()) > 0
          ? "[data-feedback-visual]"
          : "[data-answer-area]";
      try {
        await expectInViewAboveBar(this.page, target);
      } catch (error) {
        this.report("fail", where, `out of view: ${received(error)} (${file})`);
      }
    }
    const text = await this.page.evaluate(measureText, {
      minTextPx: MIN_TEXT_PX,
    });
    if (text.horizontalScroll) {
      this.report("fail", where, `page scrolls sideways (${file})`);
    }
    for (const overflow of await this.page.evaluate(measureOverflow)) {
      this.report("fail", where, `${overflow} (${file})`);
    }
    for (const small of new Set(text.smallText)) {
      this.report(
        "warn",
        where,
        `text below ${MIN_TEXT_PX}px: ${small} (${file})`,
      );
    }
  }

  private bottomButton(name: string): Locator {
    return this.page
      .locator("[data-bottom-bar]")
      .getByRole("button", { name, exact: true });
  }

  private async stepKind(): Promise<string | null> {
    const step = this.page.locator("[data-section-step]");
    await step.first().waitFor();
    return step.first().getAttribute("data-section-step");
  }

  async walkSection(lesson: Lesson, sectionIndex: number) {
    const section = lesson.sections[sectionIndex];
    if (!section) return;
    const exercises = new Map(lesson.exercises.map((e) => [e.id, e]));
    const label = `s${sectionIndex + 1}`;
    await this.page.goto(`${BASE_URL}${sectionPath(lesson.id, section.id)}`);
    await this.page.waitForLoadState("networkidle");
    for (let step = 1; ; step++) {
      const kind = await this.stepKind();
      const where = `${label}-${String(step).padStart(2, "0")}-${kind}`;
      if (kind === "block") {
        await this.walkBlock(where);
        await this.bottomButton("Tiếp").tap();
      } else if (kind === "exercise") {
        const id = await this.page
          .locator("[data-exercise]")
          .getAttribute("data-exercise");
        const exercise = id ? exercises.get(id) : undefined;
        if (!exercise) throw new Error(`${where}: unknown exercise ${id}`);
        await this.walkExercise(`${where}-${id?.split(".").at(-1)}`, exercise);
      } else if (kind === "recap") {
        await this.look(where);
        await this.bottomButton("Xong phần").tap();
        await this.page
          .locator(
            '[data-section-step="section-done"], [data-section-step="sticker"]',
          )
          .waitFor();
        await this.look(`${label}-done`);
        return;
      } else {
        throw new Error(`${where}: unexpected screen`);
      }
    }
  }

  // An explainer that steps on "Tiếp" (reduced motion) is shot at its first
  // and its last step.
  private async walkBlock(where: string) {
    await this.look(where);
    const video = this.page.locator("[data-section-step] [data-block=video]");
    if ((await video.count()) > 0) await this.walkVideo(where, video.first());
    const next = this.page.locator(`[data-section-step] [${STEP_NEXT_ATTR}]`);
    if ((await next.count()) === 0) return;
    // The step button leaves once the last step is on screen.
    while ((await next.count()) > 0) await next.tap();
    await this.look(`${where}-end`);
  }

  // A video block: the lesson lists the video, its files are served, the
  // play button is big enough, and (where the browser has an H.264 decoder)
  // it plays with captions on screen.
  private async walkVideo(where: string, block: Locator) {
    if ((await block.getAttribute("data-video-missing")) !== null) {
      this.report("fail", where, "video block without a video in the lesson");
      return;
    }
    const files = await block.evaluate((el) => {
      const video = el.querySelector("video");
      const track = el.querySelector("track");
      return [video?.currentSrc || video?.src, video?.poster, track?.src];
    });
    for (const file of files) {
      const url = file
        ? new URL(file.split("#")[0] ?? file, BASE_URL)
        : undefined;
      const response = url ? await fetch(url, { method: "HEAD" }) : undefined;
      if (!response?.ok) {
        this.report(
          "fail",
          where,
          `video file not served: ${file ?? "(none)"}`,
        );
      }
    }
    const play = block.locator("[data-video-play]");
    const box = await play.locator("span").first().boundingBox();
    if (!box || box.width < VIDEO_PLAY_MIN_PX) {
      this.report(
        "fail",
        where,
        `play button smaller than ${VIDEO_PLAY_MIN_PX}px`,
      );
      return;
    }
    await play.tap();
    const played = await this.page
      .waitForFunction(
        (min) =>
          ((
            document.querySelector(
              "[data-block=video] video",
            ) as HTMLVideoElement | null
          )?.currentTime ?? 0) > min,
        VIDEO_PLAY_CHECK_S,
        { timeout: VIDEO_PLAY_TIMEOUT_MS },
      )
      .then(() => true)
      .catch(() => false);
    if (!played) {
      this.report(
        "warn",
        where,
        "video did not play here (no H.264 decoder in this browser?)",
      );
      return;
    }
    const caption = await block
      .locator("[data-video-caption]")
      .waitFor({ timeout: VIDEO_PLAY_TIMEOUT_MS })
      .then(() => true)
      .catch(() => false);
    await this.look(`${where}-playing`);
    await block.locator("video").evaluate((v: HTMLVideoElement) => v.pause());
    if (!caption) this.report("fail", where, "video plays without captions");
  }

  private readonly missedTypes = new Set<string>();

  // Where the number pad stepped aside for the hint, the child may open it
  // again: the hint must then stay reachable, as a strip right above the pad
  // or still in full. Tapping the strip brings the hint back for the next
  // tier.
  private async reopenPad(where: string, area: Locator) {
    const open = area.locator("[data-open-pad]");
    if (!(await open.isVisible())) return;
    await open.tap();
    const strip = area.locator("[data-hint-strip]");
    await this.look(`${where}-pad`);
    const target = (await strip.isVisible())
      ? "[data-hint-strip]"
      : "[data-feedback-visual]";
    try {
      await expectInViewAboveBar(this.page, target);
    } catch (error) {
      this.report(
        "fail",
        `${where}-pad`,
        `hint lost after opening the pad: ${received(error)}`,
      );
    }
    if (await strip.isVisible()) {
      await strip.tap();
      await area.locator("[data-feedback-visual]").waitFor();
    }
  }

  private async walkExercise(where: string, exercise: Exercise) {
    const area = this.page.locator(`[data-exercise="${exercise.id}"]`);
    if (exercise.type === "openEnded") {
      await this.walkOpenEnded(where, area, exercise);
    } else {
      await this.answerBasic(where, area, exercise);
    }
    await area.waitFor({ state: "detached" });
  }

  // An open-ended exercise: every graded step answered like a plain
  // exercise, then the writing step filled with a sample paragraph and every
  // rubric line ticked, as a child checking their own writing would.
  private async walkOpenEnded(
    where: string,
    area: Locator,
    exercise: OpenEndedExercise,
  ) {
    const total = exercise.steps.length;
    for (const [i, step] of exercise.steps.entries()) {
      const stepWhere = `${where}-step${i + 1}-${step.id.split(".").at(-1)}`;
      await this.answerBasic(stepWhere, area, step);
      // The next step replaces this one in the same frame, so wait for the
      // step dots (or the writing step after the last) to move on.
      await (i + 1 < total
        ? area
            .locator("[data-step-dots]")
            .getByText(`Bước ${i + 2} trên ${total}`, { exact: true })
        : area.locator("[data-writing-step]")
      ).waitFor();
    }
    const writing = area.locator("[data-writing-step]");
    await writing.waitFor();
    await this.look(`${where}-writing`);
    await writing
      .locator("textarea")
      .fill(`${exercise.writing.starter} ${WRITING_SAMPLE}`);
    await this.look(`${where}-written`);
    await writing.getByRole("button", { name: "Xong", exact: true }).tap();
    const rubric = area.locator("[data-rubric]");
    await rubric.waitFor();
    for (const box of await rubric.getByRole("checkbox").all()) {
      await box.check();
    }
    await this.look(`${where}-rubric`);
    await rubric.getByRole("button", { name: "Hoàn thành", exact: true }).tap();
  }

  // Answers one auto-graded exercise shown in `area`, up to its "Tiếp".
  private async answerBasic(
    where: string,
    area: Locator,
    exercise: BasicExercise,
  ) {
    const frame = area.locator("section[data-phase]");
    await frame.waitFor();
    await this.look(where);
    // Missed on purpose: the first exercise of each type, with and without a
    // hint visual, so every feedback layout (the pad giving way to a hint
    // included) is seen.
    const missKind = `${exercise.type}:${exercise.hints.hintVisualId ? "visual" : "plain"}`;
    if (!this.missedTypes.has(missKind)) {
      this.missedTypes.add(missKind);
      await enterWrong(area, exercise);
      const check = area.getByRole("button", { name: "Kiểm tra" });
      for (const tier of [1, 2, 3]) {
        // A wrong pick of a selection answer is let go after each check.
        if (!(await check.isEnabled())) await enterWrong(area, exercise);
        await check.tap();
        await area.locator(`section[data-phase="wrong${tier}"]`).waitFor();
        // Tier 1 only lights up the question; tiers 2 and 3 show a visual
        // or the answer.
        await this.look(`${where}-wrong${tier}`, { feedback: tier > 1 });
        if (tier === 2) await this.reopenPad(`${where}-wrong2`, area);
      }
      await this.bottomButton("Tự làm lại").tap();
      await area.locator('section[data-phase="retype"]').waitFor();
    }
    await enterRight(area, exercise);
    await area.getByRole("button", { name: "Kiểm tra" }).tap();
    await area.locator('section[data-phase="correct"]').waitFor();
    await this.look(`${where}-correct`);
    await this.bottomButton("Tiếp").tap();
  }
}

async function walkDevice(
  browser: Browser,
  device: WalkDevice,
  lesson: Lesson,
  outRoot: string,
): Promise<Finding[]> {
  const { browserName: _, ...contextOptions } = WALK_DEVICES[device];
  const context = await browser.newContext({
    ...contextOptions,
    // Explainers then wait on "Tiếp", so every screenshot is a still frame.
    reducedMotion: "reduce",
  });
  // tsx compiles with esbuild keepNames, which wraps nested functions in a
  // `__name` helper; functions sent to page.evaluate need it too.
  await context.addInitScript("globalThis.__name = (target) => target;");
  const outDir = path.join(outRoot, device);
  mkdirSync(outDir, { recursive: true });
  const page = await context.newPage();
  const walker = new Walker(page, device, outDir);
  try {
    await page.goto(`${BASE_URL}${PROFILES_PATH}`);
    await createProfile(page, PROFILE.name, PROFILE.avatar);
    const response = await page.goto(`${BASE_URL}${lessonPath(lesson.id)}`);
    if (!response?.ok()) {
      throw new Error(
        `${lessonPath(lesson.id)} returned ${response?.status()}; a draft needs a server started with CONTENT_INCLUDE_DRAFT=1`,
      );
    }
    for (let i = 0; i < lesson.sections.length; i++) {
      await walker.walkSection(lesson, i);
    }
  } catch (error) {
    walker.findings.push({
      severity: "fail",
      device,
      where: "walk",
      message: `stopped: ${(error as Error).message.split("\n")[0]}`,
    });
    await page.screenshot({ path: path.join(outDir, "stopped.png") });
  } finally {
    await context.close();
  }
  return walker.findings;
}

async function main() {
  const lessonId = process.argv[2];
  if (!lessonId) usage();
  const local = readLesson(lessonId);
  const outRoot = path.join(SHOTS_DIR, lessonId);
  rmSync(outRoot, { recursive: true, force: true });

  const external = process.env.WALK_BASE_URL !== undefined;
  if (external && !(await isServing(BASE_URL))) {
    console.error(`No server answers at ${BASE_URL}`);
    process.exit(2);
  }
  const server = external ? undefined : await ensureServer("/", DRAFT_ENV);
  const lesson = (await servedLesson(lessonId)) ?? local;
  if (JSON.stringify(lesson) !== JSON.stringify(local)) {
    console.log(
      `lesson:walk ${lessonId}: the server serves another version than lesson.json (not emitted or not approved yet); walking the served one`,
    );
  }
  // The devices walk side by side, each in its own browser process, so one
  // walk costs about as long as its slowest device. Findings keep the
  // device order of WALK_DEVICES.
  const devices = Object.keys(WALK_DEVICES) as WalkDevice[];
  const browsers: Browser[] = [];
  let findings: Finding[];
  try {
    const perDevice = await Promise.all(
      devices.map(async (device) => {
        console.log(`lesson:walk ${lessonId} on ${device}…`);
        const browser =
          await BROWSERS[WALK_DEVICES[device].browserName].launch();
        browsers.push(browser);
        return walkDevice(browser, device, lesson, outRoot);
      }),
    );
    findings = perDevice.flat();
  } finally {
    await Promise.all(browsers.map((b) => b.close()));
    stopServer(server);
  }

  for (const f of findings) {
    const line = `${f.severity.toUpperCase()} [${f.device}] ${f.where}: ${f.message}`;
    if (f.severity === "fail") console.error(line);
    else console.log(line);
  }
  const failed = findings.filter((f) => f.severity === "fail");
  console.log(
    `lesson:walk ${lessonId}: ${failed.length} failures, ${findings.length - failed.length} warnings, screenshots in ${path.relative(process.cwd(), outRoot)}`,
  );
  process.exitCode = failed.length > 0 ? 1 : 0;
}

await main();

import { type ChildProcess, spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { type Browser, chromium, type Page, webkit } from "@playwright/test";
import { collectVisualRefs } from "@/content/check";
import { readContentRoot } from "@/content/load";
import { MASCOT_EXPRESSIONS, MASCOT_SIZES } from "@/mascot/expressions";
import { findVisual, visualRegistry } from "@/visuals/registry";
import {
  attrSelector,
  DECORATIVE_ATTR,
  STEP_ATTR,
  STEP_COUNT_ATTR,
  STEP_NEXT_ATTR,
  STEP_PLAYER_ATTR,
  VISUAL_FRAME_ATTR,
} from "@/visuals/shared/markers";
import {
  TARGET_DEVICES,
  type TargetDeviceName,
  TEST_BASE_URL,
  TEST_SERVER_COMMAND,
  TEST_SERVER_ENV,
} from "../e2e/targets";

// Usage: visual-shot <lessonId|all|mascot>
// Screenshots every visual a lesson uses (or the whole registry, or every owl
// expression at every size) at each target device into .shots/<target>/, and
// fails when any element leaves the frame or two sibling shapes/boxes overlap.

const ALL = "all";
const MASCOT = "mascot";
const SHOTS_DIR = path.join(process.cwd(), ".shots");
const SERVER_START_TIMEOUT_MS = 120_000;
const STEP_TIMEOUT_MS = 5_000;
const PROBE_PATH = "/dev/visuals";

function usage(): never {
  console.error("Usage: pnpm visual:shot <lessonId|all|mascot>");
  process.exit(2);
}

// Visual ids referenced by one lesson, read from the raw files so draft
// lessons still being written can be checked before they pass content:check.
function lessonVisualIds(lessonId: string): string[] {
  const lesson = readContentRoot().lessons.find(
    (file) =>
      typeof file.data === "object" &&
      file.data !== null &&
      "id" in file.data &&
      file.data.id === lessonId,
  );
  if (!lesson) {
    console.error(`Unknown lesson "${lessonId}"`);
    process.exit(2);
  }
  return [...new Set(collectVisualRefs(lesson.data).map((r) => r.visualId))];
}

async function isServing(): Promise<boolean> {
  try {
    const response = await fetch(`${TEST_BASE_URL}${PROBE_PATH}`);
    return response.ok;
  } catch {
    return false;
  }
}

// Reuses a dev server already on the test port (e.g. from an E2E run),
// otherwise starts one and returns it so it can be stopped afterwards.
async function ensureServer(): Promise<ChildProcess | undefined> {
  if (await isServing()) return undefined;
  const server = spawn(TEST_SERVER_COMMAND, {
    shell: true,
    // Own process group, so stopping it also stops the processes Next forks.
    detached: true,
    stdio: "ignore",
    env: { ...process.env, ...TEST_SERVER_ENV },
  });
  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (await isServing()) return server;
    if (server.exitCode !== null) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  stopServer(server);
  throw new Error(`Dev server did not start: ${TEST_SERVER_COMMAND}`);
}

function stopServer(server: ChildProcess | undefined) {
  if (server?.pid === undefined || server.exitCode !== null) return;
  process.kill(-server.pid, "SIGTERM");
}

type Selectors = { frame: string; decorative: string };

// Runs in the browser, so it must not reference anything outside itself.
function findLayoutIssues({ frame, decorative }: Selectors): string[] {
  const root = document.querySelector(frame);
  if (!root) return ["visual frame not found"];
  const issues: string[] = [];
  const box = root.getBoundingClientRect();
  const TOLERANCE = 0.5;

  function describe(el: Element): string {
    const parts: string[] = [];
    for (let n: Element | null = el; n && n !== root; n = n.parentElement) {
      const index = n.parentElement
        ? [...n.parentElement.children].indexOf(n) + 1
        : 1;
      const region = n.getAttribute("data-region");
      parts.unshift(
        `${n.tagName.toLowerCase()}${region ? `[${region}]` : `:${index}`}`,
      );
    }
    return parts.join(">");
  }

  function isShown(el: Element): boolean {
    const rect = el.getBoundingClientRect();
    // Screen-reader-only text is clipped to 1px and never seen.
    if (rect.width * rect.height <= 1) return false;
    for (let n: Element | null = el; n && n !== root; n = n.parentElement) {
      const style = getComputedStyle(n);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0
      ) {
        return false;
      }
    }
    return true;
  }

  // SVG shapes, and HTML elements that form their own box. Inline text runs
  // are left out: a span wrapping onto two lines has a box that spans both.
  function isLayoutUnit(el: Element): boolean {
    if (el instanceof SVGGraphicsElement) return true;
    const display = getComputedStyle(el).display;
    return display !== "inline" && display !== "contents";
  }

  const all = [root, ...root.querySelectorAll("*")];
  for (const el of all) {
    if (el === root || !isShown(el)) continue;
    const r = el.getBoundingClientRect();
    const out = Math.max(
      box.left - r.left,
      box.top - r.top,
      r.right - box.right,
      r.bottom - box.bottom,
    );
    if (out > TOLERANCE) {
      issues.push(`${describe(el)} overflows the frame by ${out.toFixed(1)}px`);
    }
  }

  for (const parent of all) {
    // Decorative and aria-hidden subtrees (icons, marks) are single glyphs
    // whose inner paths overlap by design; they are checked only as a whole.
    if (parent.closest(`${decorative}, [aria-hidden="true"]`)) continue;
    const siblings = [...parent.children].filter(
      (el) => !el.matches(decorative) && isShown(el) && isLayoutUnit(el),
    );
    for (let i = 0; i < siblings.length; i++) {
      for (let j = i + 1; j < siblings.length; j++) {
        const a = siblings[i]?.getBoundingClientRect();
        const b = siblings[j]?.getBoundingClientRect();
        if (!a || !b) continue;
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapX > 1 && overlapY > 1) {
          issues.push(
            `${describe(siblings[i] as Element)} overlaps ${describe(siblings[j] as Element)}`,
          );
        }
      }
    }
  }
  return issues;
}

// One page to screenshot: a registry visual, or an owl expression at a size.
type Shot = { id: string; path: string };

function visualShots(ids: readonly string[]): Shot[] {
  return ids.map((id) => ({ id, path: `/dev/visuals/${id}` }));
}

function mascotShots(): Shot[] {
  return MASCOT_EXPRESSIONS.flatMap((expression) =>
    Object.keys(MASCOT_SIZES).map((size) => ({
      id: `${expression}-${size}`,
      path: `/dev/mascot/${expression}?size=${size}`,
    })),
  );
}

type ShotResult = {
  id: string;
  // "-" when the visual could not be shot on any device.
  device: TargetDeviceName | "-";
  steps: number;
  issues: string[];
};

async function shoot(
  page: Page,
  { id, path: shotPath }: Shot,
  device: TargetDeviceName,
  outDir: string,
): Promise<ShotResult> {
  const result: ShotResult = { id, device, steps: 1, issues: [] };
  const response = await page.goto(`${TEST_BASE_URL}${shotPath}`);
  if (!response?.ok()) {
    result.issues.push(`page returned ${response?.status() ?? "no response"}`);
    return result;
  }
  // Interaction needs hydration, which is done once the chunks have loaded.
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);

  const frame = page.locator(attrSelector(VISUAL_FRAME_ATTR));
  const selectors: Selectors = {
    frame: attrSelector(VISUAL_FRAME_ATTR),
    decorative: attrSelector(DECORATIVE_ATTR),
  };
  const players = page.locator(attrSelector(STEP_PLAYER_ATTR));
  const playerCount = await players.count();
  if (playerCount > 1) {
    result.issues.push("more than one StepPlayer; only one per visual");
    return result;
  }
  if (playerCount === 1) {
    result.steps = Number(await players.getAttribute(STEP_COUNT_ATTR));
  }

  const base = path.join(outDir, `${id}-${device}`);
  // The browser runs with reduced motion, so a StepPlayer waits on "Tiếp" and
  // every step is a still frame. The final step gets the plain file name.
  for (let step = 0; step < result.steps; step++) {
    const issues = await page.evaluate(findLayoutIssues, selectors);
    const prefix = result.steps > 1 ? `step ${step + 1}: ` : "";
    result.issues.push(...issues.map((issue) => `${prefix}${issue}`));
    const isLast = step === result.steps - 1;
    await frame.screenshot({
      path: isLast ? `${base}.png` : `${base}-step-${step + 1}.png`,
    });
    if (isLast) break;
    await players.locator(attrSelector(STEP_NEXT_ATTR)).click();
    try {
      await page.waitForFunction(
        ({ selector, attr, expected }) =>
          document.querySelector(selector)?.getAttribute(attr) === expected,
        {
          selector: attrSelector(STEP_PLAYER_ATTR),
          attr: STEP_ATTR,
          expected: String(step + 1),
        },
        { timeout: STEP_TIMEOUT_MS },
      );
    } catch {
      result.issues.push(`step ${step + 1}: "Tiếp" did not advance`);
      break;
    }
  }
  return result;
}

const BROWSERS = { webkit, chromium } as const;

async function main() {
  const target = process.argv[2];
  if (!target) usage();
  const ids =
    target === MASCOT
      ? []
      : target === ALL
        ? Object.keys(visualRegistry)
        : lessonVisualIds(target);
  const unknown = ids.filter((id) => !findVisual(id));
  const shots =
    target === MASCOT
      ? mascotShots()
      : visualShots(ids.filter((id) => findVisual(id)));

  const outDir = path.join(SHOTS_DIR, target);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const results: ShotResult[] = unknown.map((id) => ({
    id,
    device: "-",
    steps: 0,
    issues: ["not in the visual registry"],
  }));

  const server = await ensureServer();
  const browsers: Browser[] = [];
  try {
    for (const [name, device] of Object.entries(TARGET_DEVICES)) {
      const { browserName, ...contextOptions } = device;
      const browser = await BROWSERS[browserName].launch();
      browsers.push(browser);
      const context = await browser.newContext({
        ...contextOptions,
        reducedMotion: "reduce",
      });
      // tsx compiles with esbuild keepNames, which wraps nested functions in
      // a `__name` helper; functions sent to page.evaluate need it too.
      await context.addInitScript("globalThis.__name = (target) => target;");
      const page = await context.newPage();
      for (const shot of shots) {
        results.push(await shoot(page, shot, name as TargetDeviceName, outDir));
      }
    }
  } finally {
    await Promise.all(browsers.map((browser) => browser.close()));
    stopServer(server);
  }

  const idWidth = Math.max(2, ...results.map((r) => r.id.length));
  console.log(`${"id".padEnd(idWidth)}  device  steps  result`);
  for (const r of results) {
    console.log(
      `${r.id.padEnd(idWidth)}  ${r.device.padEnd(6)}  ${String(r.steps).padStart(5)}  ${r.issues.length === 0 ? "pass" : `FAIL (${r.issues.length})`}`,
    );
  }
  const failed = results.filter((r) => r.issues.length > 0);
  for (const r of failed) {
    for (const issue of r.issues)
      console.error(`${r.id} [${r.device}] ${issue}`);
  }
  console.log(
    `visual:shot ${target}: ${results.length - failed.length}/${results.length} passed, images in ${path.relative(process.cwd(), outDir)}`,
  );
  process.exitCode = failed.length > 0 ? 1 : 0;
}

await main();

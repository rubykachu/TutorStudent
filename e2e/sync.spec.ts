import { expect, type Page } from "@playwright/test";
import { finishSection } from "./flows";
import {
  backupFile,
  childIdOf,
  familyFor,
  idbAll,
  importBackupFile,
  Lab,
  mainDoc,
  monthDoc,
  NAME,
  newChild,
  nudgeSync,
  openLesson,
  openParent,
  pickChild,
  profileDoc,
  strangerFor,
  waitForStore,
} from "./sync-lab";
import { test as base } from "./test";

// Two or more browser contexts are two devices of one family, syncing through
// the sync dev server and its folder store (`SYNC_*` in `targets.ts`). Every
// scenario has its own family, so the tests running side by side never meet.

const test = base.extend<{ lab: Lab }>({
  lab: async ({ browser }, use, testInfo) => {
    const lab = new Lab(browser, testInfo.project.name);
    await use(lab);
    await lab.close();
  },
});

test.describe.configure({ timeout: 180_000 });

const SECTION = "fixture.section.phep-nhan";
const OTHER_SECTION = "fixture.section.doc-hieu";
// Answered wrong three times in the section (see flows.ts).
const MISSED_EXERCISE = "fixture.ex.dem-cham";
const LESSON = "fixture";

const section = (page: Page, id: string) =>
  page.locator(`[data-section="${id}"]`);

async function studySection(page: Page) {
  await openLesson(page);
  await section(page, SECTION).tap();
  await finishSection(page, MISSED_EXERCISE);
  await expect(
    page.getByRole("heading", { name: "Xong phần này!" }),
  ).toBeVisible();
}

const isDone = (childId: string, family: ReturnType<typeof familyFor>) => () =>
  mainDoc(family, childId)?.sections.some(
    (s) => s.sectionId === SECTION && s.doneAt !== null,
  ) === true;

async function resetLesson(page: Page) {
  const row = page.locator(`[data-parent-lesson="${LESSON}"]`);
  await row.getByRole("button", { name: "Học lại bài này" }).tap();
  const dialog = page.getByRole("dialog", { name: "Học lại bài này" });
  await dialog.getByRole("button", { name: "Tiếp tục" }).tap();
  await dialog.getByRole("button", { name: "Xoá và học lại" }).tap();
  await expect(dialog).toBeHidden();
}

test("1. a section finished on A shows on B after a reload", async ({
  lab,
}) => {
  const family = familyFor(lab.target, 1);
  const a = await lab.device(family);
  await newChild(a.page);
  const childId = await childIdOf(a.page);
  await studySection(a.page);
  await waitForStore("A's section reaches the cloud", isDone(childId, family));

  const b = await lab.device(family);
  await pickChild(b.page);
  await openLesson(b.page);
  await expect(section(b.page, SECTION)).toHaveAttribute("data-state", "done", {
    timeout: 30_000,
  });
  await b.page.reload();
  await expect(section(b.page, SECTION)).toHaveAttribute("data-state", "done");
});

test("2. what B studies without a connection reaches A when B is back online", async ({
  lab,
}) => {
  const family = familyFor(lab.target, 2);
  const a = await lab.device(family);
  await newChild(a.page);
  const childId = await childIdOf(a.page);
  await waitForStore(
    "A's profile reaches the cloud",
    () => profileDoc(family)?.profiles.length === 1,
  );

  const b = await lab.device(family);
  await pickChild(b.page);
  // B can no longer reach the sync API.
  let refused = 0;
  await b.context.route("**/api/sync**", (route) => {
    refused += 1;
    return route.abort("internetdisconnected");
  });
  const before = refused;
  await studySection(b.page);
  await expect.poll(() => refused).toBeGreaterThan(before);
  // The child sees nothing about it, and nothing was sent.
  await expect(b.page.locator("body")).not.toContainText(/đồng bộ|sync/i);
  expect(isDone(childId, family)()).toBe(false);

  await b.context.unroute("**/api/sync**");
  await nudgeSync(b.page);
  await waitForStore("B's section reaches the cloud", isDone(childId, family));
  await openLesson(a.page);
  await expect(section(a.page, SECTION)).toHaveAttribute("data-state", "done", {
    timeout: 30_000,
  });
});

test("3. a reset on A reaches B, and what B studied after the reset is kept", async ({
  lab,
}) => {
  const family = familyFor(lab.target, 3);
  const a = await lab.device(family);
  await newChild(a.page);
  const childId = await childIdOf(a.page);
  await studySection(a.page);
  await waitForStore("A's section reaches the cloud", isDone(childId, family));

  const b = await lab.device(family);
  await pickChild(b.page);
  await openLesson(b.page);
  await expect(section(b.page, SECTION)).toHaveAttribute("data-state", "done", {
    timeout: 30_000,
  });

  await openParent(a.page);
  await resetLesson(a.page);
  await waitForStore(
    "the reset reaches the cloud",
    () => mainDoc(family, childId)?.resets[LESSON] !== undefined,
  );

  // B has not heard of the reset: it starts the lesson's other section.
  await expect(section(b.page, SECTION)).toHaveAttribute("data-state", "done");
  await section(b.page, OTHER_SECTION).tap();
  await expect(b.page.locator("[data-section-stepper]")).toBeVisible();
  await b.page.getByRole("button", { name: "Tiếp" }).tap();
  await expect(b.page.locator("[data-section-stepper]")).toHaveAttribute(
    "data-current",
    "1",
  );
  await b.page.getByRole("link", { name: "Về trang bài" }).tap();
  await nudgeSync(b.page);

  // The cloud ends with the reset and B's later position, not A's old section.
  await waitForStore(
    "B's later study joins the reset",
    () =>
      mainDoc(family, childId)
        ?.sections.map((s) => s.sectionId)
        .join() === OTHER_SECTION,
  );
  for (const device of [a, b]) {
    await openLesson(device.page);
    await expect(section(device.page, SECTION)).toHaveAttribute(
      "data-state",
      "not_started",
      { timeout: 30_000 },
    );
    await expect(section(device.page, OTHER_SECTION)).toHaveAttribute(
      "data-state",
      "in_progress",
    );
  }
});

test("4. a backup imported on A reaches B", async ({ lab }) => {
  const family = familyFor(lab.target, 4);
  const a = await lab.device(family);
  await newChild(a.page);
  const childId = await childIdOf(a.page);
  await openParent(a.page);
  await importBackupFile(a.page, backupFile({ id: childId, name: NAME }, 2));
  await waitForStore("the import reaches the cloud", () => {
    const doc = mainDoc(family, childId);
    return (
      doc !== null &&
      doc.historyMonths.length === 2 &&
      isDone(childId, family)() &&
      doc.historyMonths.every((m) => monthDoc(family, childId, m) !== null)
    );
  });

  const b = await lab.device(family);
  await pickChild(b.page);
  await openLesson(b.page);
  await expect(section(b.page, SECTION)).toHaveAttribute("data-state", "done", {
    timeout: 30_000,
  });
});

test("5. a device of another family sees nothing of it", async ({ lab }) => {
  const family = familyFor(lab.target, 5);
  const stranger = strangerFor(lab.target);
  const a = await lab.device(family);
  await newChild(a.page);
  const childId = await childIdOf(a.page);
  await studySection(a.page);
  await waitForStore("A's section reaches the cloud", isDone(childId, family));

  const d = await lab.device(stranger);
  await d.page.goto("/profiles");
  await expect(d.page.getByLabel("Bạn tên là gì?")).toBeVisible();
  await expect(d.page.getByText(NAME, { exact: true })).toHaveCount(0);
  const child = await d.page.request.get(`/api/sync?child=${childId}`);
  expect([403, 404]).toContain(child.status());
  expect(await child.text()).not.toContain(SECTION);
  const profile = await d.page.request.get("/api/sync?doc=profile");
  expect(profile.status()).toBe(200);
  expect(await profile.json()).toMatchObject({
    familyId: stranger.id,
    doc: null,
  });
  expect(profileDoc(stranger)).toBeNull();
});

test("6. B stays on its item while A's progress on the same section arrives", async ({
  lab,
}) => {
  const family = familyFor(lab.target, 6);
  const a = await lab.device(family);
  await newChild(a.page);
  const childId = await childIdOf(a.page);
  await waitForStore(
    "A's profile reaches the cloud",
    () => profileDoc(family)?.profiles.length === 1,
  );

  const b = await lab.device(family);
  await pickChild(b.page);
  await b.page.goto(`/lessons/fixture/sections/${SECTION}`);
  const stepper = b.page.locator("[data-section-stepper]");
  await expect(stepper).toHaveAttribute("data-current", "0");
  await b.page.getByRole("button", { name: "Tiếp" }).tap();
  await expect(stepper).toHaveAttribute("data-current", "1");

  await studySection(a.page);
  await waitForStore("A's section reaches the cloud", isDone(childId, family));
  await nudgeSync(b.page);
  await expect
    .poll(async () =>
      (
        await idbAll<{ sectionId: string; state: string }>(
          b.page,
          "sectionProgress",
        )
      ).some((r) => r.sectionId === SECTION && r.state === "done"),
    )
    .toBe(true);
  // The section on screen did not move.
  await expect(stepper).toHaveAttribute("data-current", "1");
  await b.page.getByRole("link", { name: "Về trang bài" }).tap();
  await expect(section(b.page, SECTION)).toHaveAttribute("data-state", "done");
});

// A child with answers in several months, imported on A and sent to the cloud.
async function deviceWithHistory(lab: Lab, scenario: number, months: number) {
  const family = familyFor(lab.target, scenario);
  const a = await lab.device(family);
  await newChild(a.page);
  const childId = await childIdOf(a.page);
  await openParent(a.page);
  await importBackupFile(
    a.page,
    backupFile({ id: childId, name: NAME }, months),
  );
  await waitForStore("the history reaches the cloud", () => {
    const doc = mainDoc(family, childId);
    return (
      doc !== null &&
      doc.historyMonths.length === months &&
      doc.historyMonths.every((m) => monthDoc(family, childId, m) !== null)
    );
  });
  return { family, a, childId };
}

test("7. a new device studies before the old months arrive, then the parent page matches", async ({
  lab,
}) => {
  const { family, a, childId } = await deviceWithHistory(lab, 7, 5);
  const lessonRow = (page: Page) =>
    page.locator(`[data-parent-lesson="${LESSON}"]`);
  const timeRegion = (page: Page) =>
    page.getByRole("region", { name: "Thời gian học" });
  const onA = {
    lesson: await lessonRow(a.page).innerText(),
    time: await timeRegion(a.page).innerText(),
  };
  const months = (mainDoc(family, childId)?.historyMonths ?? []).sort();
  // The two newest months come with the first sync; the older ones are held
  // back until the test lets them through.
  const held = months.slice(0, -2);
  let release: () => void = () => undefined;
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  let heldRequests = 0;

  const c = await lab.device(family);
  await c.context.route(
    (url) =>
      url.pathname === "/api/sync" &&
      held.some((m) => url.search.includes(`month=${m}`)),
    async (route) => {
      heldRequests += 1;
      await released;
      await route.continue().catch(() => undefined);
    },
  );
  await pickChild(c.page);
  await expect.poll(() => heldRequests, { timeout: 30_000 }).toBeGreaterThan(0);

  // Sections and stickers are there and a section opens while history waits.
  await openLesson(c.page);
  await expect(section(c.page, SECTION)).toHaveAttribute("data-state", "done", {
    timeout: 30_000,
  });
  await section(c.page, SECTION).tap();
  await expect(c.page.locator("[data-section-stepper]")).toBeVisible();

  await openParent(c.page);
  await expect(c.page.locator("[data-history-loading]")).toContainText(
    "Đang tải lịch sử học…",
  );
  release();
  await expect(c.page.locator("[data-history-loading]")).toHaveCount(0, {
    timeout: 60_000,
  });
  expect(await lessonRow(c.page).innerText()).toBe(onA.lesson);
  expect(await timeRegion(c.page).innerText()).toBe(onA.time);
});

test("8. after a reset on A a new device does not show the earlier answers, and the cloud still holds them", async ({
  lab,
}) => {
  const { family, a, childId } = await deviceWithHistory(lab, 8, 3);
  await resetLesson(a.page);
  await waitForStore(
    "the reset reaches the cloud",
    () => mainDoc(family, childId)?.resets[LESSON] !== undefined,
  );

  const c = await lab.device(family);
  await pickChild(c.page);
  await openParent(c.page);
  // Every listed month has been pulled.
  await expect
    .poll(
      async () => {
        const rows = await idbAll<{
          months: Record<string, { applied: boolean }>;
        }>(c.page, "syncState");
        const months = rows.flatMap((r) => Object.values(r.months));
        return months.length >= 3 && months.every((m) => m.applied);
      },
      { timeout: 60_000 },
    )
    .toBe(true);

  const attempts = await idbAll<{ lessonId: string }>(c.page, "attempts");
  expect(attempts.filter((x) => x.lessonId === LESSON)).toHaveLength(0);
  const row = c.page.locator(`[data-parent-lesson="${LESSON}"]`);
  await expect(row).toContainText("Xong 0/2 phần");
  await expect(
    row.getByRole("button", { name: "Học lại bài này" }),
  ).toHaveCount(0);
  await expect(c.page.locator("[data-parent-wrong]")).toHaveCount(0);

  // The old month docs were never rewritten: they still hold the answers.
  for (const month of mainDoc(family, childId)?.historyMonths ?? []) {
    const stored = monthDoc(family, childId, month);
    expect(stored?.attempts.some((x) => x.lessonId === LESSON)).toBe(true);
  }
});

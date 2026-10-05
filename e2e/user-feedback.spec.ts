import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Page, TestInfo } from "@playwright/test";
import { findOverlaps } from "./overlap";
import { idbAll, Lab, newChild, openLesson, openParent } from "./sync-lab";
import { feedbackFamily, syncStoreDir } from "./targets";
import { test as base, expect } from "./test";

// The "Góp ý" button end to end on the sync server: the report is stored in
// the folder store and left pending (the server has no GitHub token, so
// nothing leaves localhost and the forwarding records `no-token`).

const test = base.extend<{ lab: Lab }>({
  lab: async ({ browser }, use, testInfo) => {
    const lab = new Lab(browser, testInfo.project.name);
    await use(lab);
    await lab.close();
  },
});

test.describe.configure({ timeout: 180_000 });

const SECTION = "fixture.section.phep-nhan";
const FEEDBACK_DIR = () => path.join(syncStoreDir(), "dev", "feedback");

type StoredRecord = {
  report: Record<string, unknown>;
  forward: { state: string; lastError: string | null };
  family: string;
};

function storedRecord(id: string): StoredRecord | null {
  let months: string[];
  try {
    months = readdirSync(FEEDBACK_DIR()).filter((name) =>
      /^\d{4}-\d{2}$/.test(name),
    );
  } catch {
    return null;
  }
  for (const month of months) {
    try {
      return JSON.parse(
        readFileSync(path.join(FEEDBACK_DIR(), month, `${id}.json`), "utf8"),
      );
    } catch {
      // Not in this month.
    }
  }
  return null;
}

function pendingIds(): string[] {
  try {
    const list = JSON.parse(
      readFileSync(path.join(FEEDBACK_DIR(), "pending.json"), "utf8"),
    ) as { items: { id: string }[] };
    return list.items.map((item) => item.id);
  } catch {
    return [];
  }
}

const feedbackButton = (page: Page) =>
  page.getByRole("button", { name: "Góp ý về bài này" });

async function openExercise(page: Page) {
  await openLesson(page);
  await page.locator(`[data-section="${SECTION}"]`).tap();
  const step = page.locator("[data-section-step]");
  await expect(step).toHaveCount(1);
  while ((await step.getAttribute("data-section-step")) === "block") {
    await page.getByRole("button", { name: "Tiếp" }).tap();
  }
  await expect(step).toHaveAttribute("data-section-step", "exercise");
}

async function headerOverlaps(page: Page) {
  return page.evaluate(findOverlaps, {
    scope: "header",
    decorativeAttr: "data-decorative",
  });
}

// The id of the next report the page sends.
function nextReportId(page: Page): Promise<string> {
  return page
    .waitForRequest(
      (r) => r.url().endsWith("/api/feedback") && r.method() === "POST",
    )
    .then((r) => (r.postDataJSON() as { id: string }).id);
}

async function shot(page: Page, info: TestInfo, name: string) {
  await page.screenshot({ path: info.outputPath(`${name}.png`) });
}

test("a child's report from an exercise is stored and left pending", async ({
  lab,
}, testInfo) => {
  const a = await lab.device(feedbackFamily(lab.target, 1));
  await newChild(a.page);
  await expect(feedbackButton(a.page)).toHaveCount(0);

  await openExercise(a.page);
  expect(await headerOverlaps(a.page)).toEqual([]);
  const exerciseId = await a.page
    .locator("[data-exercise]")
    .getAttribute("data-exercise");

  await feedbackButton(a.page).tap();
  const sheet = a.page.getByRole("dialog", { name: "Góp ý về bài này" });
  await expect(sheet.getByText("Bạn thấy chỗ này thế nào?")).toBeVisible();
  await shot(a.page, testInfo, "child-sheet");
  const sentId = nextReportId(a.page);
  await sheet.getByRole("button", { name: "Sai nội dung hoặc đáp án" }).tap();
  await expect(sheet.getByRole("status")).toHaveText(
    "Cảm ơn bạn! Cú đã ghi lại rồi.",
  );
  await shot(a.page, testInfo, "child-thanks");
  const id = await sentId;

  await expect.poll(() => storedRecord(id) !== null).toBe(true);
  const record = storedRecord(id) as StoredRecord;
  expect(record.report).toMatchObject({
    lesson: "fixture",
    section: SECTION,
    sectionNumber: 1,
    item: exerciseId,
    screen: "exercise",
    reason: "sai-noi-dung",
    source: "be",
  });
  expect(record.forward.state).toBe("pending");
  expect(record.family).toMatch(/^[0-9a-f]{12}$/);
  expect(pendingIds()).toContain(id);
  // The forwarding ran after the answer, in the real server.
  await expect
    .poll(() => storedRecord(id)?.forward.lastError, { timeout: 30_000 })
    .toBe("no-token");

  // The thank-you closes by itself; the chip is marked for this exercise.
  await expect(sheet).toBeHidden({ timeout: 10_000 });
  await feedbackButton(a.page).tap();
  await expect(
    sheet.getByRole("button", { name: /Sai nội dung hoặc đáp án/ }),
  ).toBeDisabled();
});

test("a report made offline is queued and sent when the network is back", async ({
  lab,
}) => {
  const a = await lab.device(feedbackFamily(lab.target, 2));
  await newChild(a.page);
  await openLesson(a.page);
  await a.context.route("**/api/feedback", (route) =>
    route.abort("internetdisconnected"),
  );
  await feedbackButton(a.page).tap();
  const sheet = a.page.getByRole("dialog", { name: "Góp ý về bài này" });
  await sheet.getByRole("button", { name: "Khó hiểu" }).tap();
  await expect(sheet.getByRole("status")).toBeVisible();

  const outbox = async () => {
    const rows = await idbAll<{ key: string; value: string }>(
      a.page,
      "settings",
    );
    const row = rows.find((r) => r.key === "feedbackOutbox");
    return row ? (JSON.parse(row.value) as { id: string }[]) : [];
  };
  await expect.poll(async () => (await outbox()).length).toBe(1);
  const [queued] = await outbox();

  await a.context.unroute("**/api/feedback");
  await a.page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect.poll(() => storedRecord(queued?.id ?? "") !== null).toBe(true);
  expect(storedRecord(queued?.id ?? "")?.report).toMatchObject({
    screen: "lesson",
    reason: "kho-hieu",
  });
  await expect.poll(async () => (await outbox()).length).toBe(0);
});

test("a parent sends a note behind the PIN", async ({ lab }, testInfo) => {
  const a = await lab.device(feedbackFamily(lab.target, 3));
  await newChild(a.page);
  await openParent(a.page);
  await openLesson(a.page);
  await feedbackButton(a.page).tap();
  const sheet = a.page.getByRole("dialog", { name: "Góp ý về bài này" });
  await sheet
    .getByRole("button", { name: "Phụ huynh góp ý kèm ghi chú" })
    .tap();
  await expect(sheet.getByLabel("Nhập PIN")).toBeVisible();
  await shot(a.page, testInfo, "parent-pin");
  await sheet.getByLabel("Nhập PIN").fill("2468");
  await sheet.getByRole("button", { name: "Tiếp tục" }).tap();
  await sheet.getByRole("radio", { name: "Hình hoặc video bị lỗi" }).check();
  await sheet.getByLabel("Ghi chú (không bắt buộc)").fill("Hình phần 1 bị mờ");
  await shot(a.page, testInfo, "parent-form");
  const sentId = nextReportId(a.page);
  await sheet.getByRole("button", { name: "Gửi góp ý" }).tap();
  await expect(sheet.getByRole("status")).toHaveText(
    "Đã gửi. Cảm ơn bạn đã góp ý!",
  );
  const id = await sentId;
  await expect.poll(() => storedRecord(id) !== null).toBe(true);
  expect(storedRecord(id)?.report).toMatchObject({
    screen: "lesson",
    reason: "loi-hinh-video",
    source: "phu-huynh",
    note: "Hình phần 1 bị mờ",
  });
});

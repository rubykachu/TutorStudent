import { readFile } from "node:fs/promises";
import { expect, type Page } from "@playwright/test";
import {
  createProfile,
  FIXTURE_LESSON_TITLE,
  finishSection,
  openFixtureLesson,
} from "./flows";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";
import { test } from "./test";

const SECTION = "fixture.section.phep-nhan";
// Missed three times in the section, so it heads "Câu hay sai".
const MISSED_EXERCISE = "fixture.ex.dem-cham";
const PIN = "2468";

async function submitPin(page: Page, label: string, button: string) {
  await page.getByLabel(label).fill(PIN);
  await page.getByRole("button", { name: button }).click();
}

test("a parent sets a PIN and sees the child's progress after one section", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await openFixtureLesson(page);
  await page.locator(`[data-section="${SECTION}"]`).tap();
  await finishSection(page, MISSED_EXERCISE);
  await expect(
    page.getByRole("heading", { name: "Xong phần này!" }),
  ).toBeVisible();

  // The low-key entry on the profile picker.
  await page.goto("/profiles");
  await page.getByRole("link", { name: "Phụ huynh" }).click();
  await expect(page).toHaveURL(/\/parent$/);
  await expectNoHorizontalScroll(page);
  await submitPin(page, "PIN mới", "Tiếp tục");
  await submitPin(page, "Nhập lại PIN để xác nhận", "Lưu PIN");

  await expect(
    page.getByRole("heading", { level: 1, name: "Trang phụ huynh" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Bé Na" })).toBeVisible();
  const time = page.getByRole("region", { name: "Thời gian học" });
  await expect(time).toContainText(/Hôm nay\s*[1-9]\d* phút/);
  await expect(time).toContainText(/Chuỗi ngày học\s*1 ngày/);
  await expect(page.locator('[data-parent-lesson="fixture"]')).toContainText(
    `${FIXTURE_LESSON_TITLE}`,
  );
  await expect(page.locator('[data-parent-lesson="fixture"]')).toContainText(
    "Xong 1/2 phần",
  );
  const wrong = page.locator(`[data-parent-wrong="${MISSED_EXERCISE}"]`);
  await expect(wrong).toContainText("Có tất cả bao nhiêu chấm?");
  await expect(wrong).toContainText("Sai 3 lần trong 1 lượt làm");
  // Cards were just practised, so none is below the forgetting threshold yet.
  await expect(
    page.getByRole("region", { name: "Thẻ hay quên" }),
  ).toContainText("chưa có thẻ nào con sắp quên");
  await expect(
    page.getByRole("region", { name: "Bài viết của con" }),
  ).toContainText("Con chưa viết bài nào.");
  await expectTouchTargets(page);
  await expectNoHorizontalScroll(page);

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Tải bản sao lưu (JSON)" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(
    /^tien-do-be-na-\d{4}-\d{2}-\d{2}\.json$/,
  );
  const backup = JSON.parse(await readFile(await download.path(), "utf8"));
  expect(backup.format).toBe("tutor-progress");
  expect(backup.profile.name).toBe("Bé Na");
  expect(backup.sections).toHaveLength(1);

  // The unlock lives in memory only: a reload asks for the PIN again.
  await page.reload();
  await submitPin(page, "Nhập PIN", "Mở trang phụ huynh");
  await expect(page.getByRole("heading", { name: "Bé Na" })).toBeVisible();
  await page.getByRole("button", { name: "Khoá lại" }).click();
  await expect(page.getByLabel("Nhập PIN")).toBeVisible();
});

// Earns the sticker of the fixture lesson without playing its second section.
async function earnFixtureSticker(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open("tutor");
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const db = open.result;
          const tx = db.transaction(["profiles", "stickers"], "readwrite");
          const profiles = tx.objectStore("profiles").getAll();
          profiles.onsuccess = () => {
            const [profile] = profiles.result;
            tx.objectStore("stickers").put({
              familyId: profile.familyId,
              childId: profile.id,
              lessonId: "fixture",
              at: new Date().toISOString(),
            });
          };
          tx.oncomplete = () => {
            db.close();
            resolve();
          };
          tx.onerror = () => reject(tx.error);
        };
      }),
  );
}

test("a parent starts a lesson over; the child finds it fresh and keeps the sticker", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await openFixtureLesson(page);
  await page.locator(`[data-section="${SECTION}"]`).tap();
  await finishSection(page, MISSED_EXERCISE);
  await expect(
    page.getByRole("heading", { name: "Xong phần này!" }),
  ).toBeVisible();
  await earnFixtureSticker(page);

  await page.goto("/parent");
  await submitPin(page, "PIN mới", "Tiếp tục");
  await submitPin(page, "Nhập lại PIN để xác nhận", "Lưu PIN");
  const row = page.locator('[data-parent-lesson="fixture"]');
  await expect(row).toContainText("Xong 1/2 phần · có sticker");
  const wrong = page.locator(`[data-parent-wrong="${MISSED_EXERCISE}"]`);
  await expect(wrong).toBeVisible();

  // Step 1 says what is lost; closing erases nothing.
  await row.getByRole("button", { name: "Học lại bài này" }).tap();
  const dialog = page.getByRole("dialog", { name: "Học lại bài này" });
  await expect(dialog).toContainText("Sticker con đã nhận vẫn được giữ");
  await expectNoHorizontalScroll(page);
  await expectTouchTargets(page);
  await dialog.getByRole("button", { name: "Hủy" }).tap();
  await expect(dialog).toBeHidden();
  await expect(row).toContainText("Xong 1/2 phần");

  // Step 2 asks again; only its confirm button erases.
  await row.getByRole("button", { name: "Học lại bài này" }).tap();
  await dialog.getByRole("button", { name: "Tiếp tục" }).tap();
  await expect(dialog).toContainText("Việc này không hoàn tác được");
  await expectNoHorizontalScroll(page);
  await expectTouchTargets(page);
  await dialog.getByRole("button", { name: "Xoá và học lại" }).tap();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("status")).toContainText(
    "Đã cho Bé Na học lại bài",
  );

  // The page refreshed: no progress, no missed question, sticker kept.
  await expect(row).toContainText("Xong 0/2 phần · có sticker");
  await expect(
    row.getByRole("button", { name: "Học lại bài này" }),
  ).toHaveCount(0);
  await expect(wrong).toHaveCount(0);
  await expect(row.locator("[data-sticker-earned]")).toHaveAttribute(
    "data-sticker-earned",
    "true",
  );
  await expectNoHorizontalScroll(page);
  await expectTouchTargets(page);

  // Home: the lesson is the one to start, the subject shows no progress, and
  // the sticker is still on the shelf.
  await page.goto("/");
  await expect(page.locator("[data-continue]")).toHaveAccessibleName(
    new RegExp(`^Bắt đầu học: ${FIXTURE_LESSON_TITLE}, phần 1`),
  );
  const math = page.locator('[data-subject="math"]');
  await expect(
    math.getByRole("img", { name: /^Xong 0 trên \d+ phần$/ }),
  ).toBeVisible();
  await expect(math).toContainText("Chưa học");
  await expect(
    page.locator('[data-shelf-sticker="fixture"] [data-sticker-earned="true"]'),
  ).toBeVisible();

  // The lesson opens on its overview again, then lists section 1 as new.
  await page.goto("/lessons/fixture");
  await expect(page.locator("[data-lesson-overview]")).toBeVisible();
  await expect(page.getByRole("button", { name: "Bắt đầu học" })).toBeVisible();
  await page.locator("[data-overview-browse]").tap();
  await expect(page.locator(`[data-section="${SECTION}"]`)).toHaveAttribute(
    "data-state",
    "not_started",
  );
});

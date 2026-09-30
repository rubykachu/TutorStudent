import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";
import {
  createProfile,
  FIXTURE_LESSON_TITLE,
  finishSection,
  openFixtureLesson,
} from "./flows";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";

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

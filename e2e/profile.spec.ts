import { expect, type Page, test } from "@playwright/test";
import { createProfile, FIXTURE_LESSON_TITLE } from "./flows";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";

// Each test starts in a fresh browser context, so IndexedDB is empty and the
// device has no profile yet. The dev server runs with CONTENT_INCLUDE_FIXTURE=1,
// so the draft fixture lesson (textbook order 0) is the first math lesson,
// next to every published one; a default build leaves it (and every other
// draft) out of /content/index.json, which the unit tests of the content index
// cover.

// Lessons the served index lists, so the checks follow published content.
async function servedLessons(page: Page): Promise<{ subject: string }[]> {
  const response = await page.request.get("/content/index.json");
  return ((await response.json()) as { lessons: { subject: string }[] })
    .lessons;
}

test("a first visit creates a profile that survives a reload", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/profiles$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(
    page.getByRole("button", { name: "Bắt đầu học" }),
  ).toBeDisabled();
  await expectNoHorizontalScroll(page);

  await createProfile(page, "Bé Na", "Cáo");
  await expect(page).toHaveURL(/\/$/);
  const lessons = await servedLessons(page);
  const mathLessons = lessons.filter((l) => l.subject === "math").length;

  // No chain yet: an invitation, never "0 ngày".
  await expect(
    page.getByText("Bắt đầu chuỗi ngày học hôm nay nhé"),
  ).toBeVisible();
  // The main action starts the first lesson's first section in one tap.
  const start = page.locator("[data-continue]");
  await expect(start).toHaveAccessibleName(
    new RegExp(`^Bắt đầu học: ${FIXTURE_LESSON_TITLE}, phần 1`),
  );
  await expect(start).toHaveAttribute(
    "href",
    "/lessons/fixture/sections/fixture.section.phep-nhan",
  );

  const math = page.locator('[data-subject="math"]');
  await expect(math).toBeVisible();
  await expect(
    math.getByRole("img", { name: `Xong 0 trên ${mathLessons} bài` }),
  ).toBeVisible();
  await expect(math).toContainText(`${mathLessons} bài · Chưa học`);
  await expect(page.getByRole("link", { name: /Ngữ văn/ })).toContainText(
    "Sắp có bài",
  );
  // Every lesson's sticker waits, greyed and not coloured at all yet, in the
  // strip.
  await expect(page.locator("[data-sticker-lesson]")).toHaveCount(
    lessons.length,
  );
  await expect(page.locator('[data-sticker-earned="true"]')).toHaveCount(0);
  await expect(page.locator("[data-sticker-colour]")).toHaveCount(0);
  await expectTouchTargets(page);
  await expectNoHorizontalScroll(page);

  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();

  await math.click();
  await expect(page).toHaveURL(/\/subjects\/math$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Toán" }),
  ).toBeVisible();
  const lesson = page.getByRole("link", {
    name: new RegExp(FIXTURE_LESSON_TITLE),
  });
  await expect(lesson).toHaveAttribute("href", "/lessons/fixture");
  await expect(lesson).toContainText("Chưa học");
  // Exactly the lessons in the served index: nothing else leaks into the list.
  await expect(page.locator("[data-lesson]")).toHaveCount(mathLessons);
  await expectNoHorizontalScroll(page);

  await page.getByRole("link", { name: "Trang chủ" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("switching between two children from the home corner", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Mèo");

  await page.getByRole("link", { name: "Đổi hồ sơ" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Ai đang học đấy?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Thêm bạn mới" }).click();
  await createProfile(page, "Bin", "Gấu");

  await page.getByRole("link", { name: "Đổi hồ sơ" }).click();
  await page.getByRole("button", { name: "Bé Na" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();

  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();
});

test("a subject missing from subjects.json does not exist", async ({
  page,
}) => {
  const response = await page.goto("/subjects/physics");
  expect(response?.status()).toBe(404);
});

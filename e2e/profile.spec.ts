import { expect, test } from "@playwright/test";
import { createProfile, FIXTURE_LESSON_TITLE } from "./flows";
import { expectNoHorizontalScroll } from "./layout";

// Each test starts in a fresh browser context, so IndexedDB is empty and the
// device has no profile yet. The dev server runs with CONTENT_INCLUDE_FIXTURE=1,
// so the draft fixture lesson is the only math lesson; a default build leaves
// it (and every other draft) out of /content/index.json, which the unit tests
// of the content index cover.

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

  const math = page.getByRole("link", { name: /Toán/ });
  await expect(math).toBeVisible();
  await expect(
    math.getByRole("img", { name: "Xong 0 trên 1 bài" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Ngữ văn/ })).toContainText(
    "Sắp có bài",
  );
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
  await expect(page.locator("[data-lesson]")).toHaveCount(1);
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

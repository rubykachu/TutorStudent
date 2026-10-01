import { expect, type Page } from "@playwright/test";
import {
  createProfile,
  FIXTURE_LESSON_TITLE,
  openFixtureLesson,
} from "./flows";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";
import { test } from "./test";

// Each test starts in a fresh browser context, so IndexedDB is empty and the
// device has no profile yet. The dev server runs with CONTENT_INCLUDE_FIXTURE=1,
// so the draft fixture lesson (textbook order 0) is the first math lesson,
// next to every published one; a default build leaves it (and every other
// draft) out of /content/index.json, which the unit tests of the content index
// cover.

// Lessons the served index lists, so the checks follow published content.
type ServedLesson = { subject: string; sections: unknown[] };

async function servedLessons(page: Page): Promise<ServedLesson[]> {
  const response = await page.request.get("/content/index.json");
  return ((await response.json()) as { lessons: ServedLesson[] }).lessons;
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
  const mathLessons = lessons.filter((l) => l.subject === "math");
  const mathSections = mathLessons.reduce((n, l) => n + l.sections.length, 0);

  // The owl greets the child and the sticker shelf sits right under it.
  await expect(page.getByText("Hôm nay mình học môn nào?")).toBeVisible();
  await expect(page.getByRole("region", { name: "Bạn cú" })).toBeVisible();
  // The main action starts the first lesson, on its overview first.
  const start = page.locator("[data-continue]");
  await expect(start).toHaveAccessibleName(
    new RegExp(`^Bắt đầu học: ${FIXTURE_LESSON_TITLE}, phần 1`),
  );
  await expect(start).toHaveAttribute("href", "/lessons/fixture");

  const math = page.locator('[data-subject="math"]');
  await expect(math).toBeVisible();
  await expect(
    math.getByRole("img", { name: `Xong 0 trên ${mathSections} phần` }),
  ).toBeVisible();
  await expect(math).toContainText(`${mathLessons.length} bài · Chưa học`);
  const literatureLessons = lessons.filter((l) => l.subject === "literature");
  await expect(page.locator('[data-subject="literature"]')).toContainText(
    literatureLessons.length === 0
      ? "Sắp ra mắt"
      : `${literatureLessons.length} bài · Chưa học`,
  );
  // Nothing earned yet: the sticker grid at the top shows every sticker grey
  // and not coloured at all, in at most two rows, and the collection behind
  // "Xem tất cả" (there when the stickers do not fit) lists every lesson's.
  await expect(page.locator("[data-shelf-count]")).toHaveText(
    `Đã nhận 0/${lessons.length}`,
  );
  await expect(page.locator('[data-sticker-earned="true"]')).toHaveCount(0);
  await expect(page.locator("[data-sticker-colour]")).toHaveCount(0);
  const rows = await page.evaluate(
    () =>
      new Set(
        [...document.querySelectorAll("[data-shelf-grid] > li")].map((cell) =>
          Math.round(cell.getBoundingClientRect().top),
        ),
      ).size,
  );
  expect(rows).toBeLessThanOrEqual(2);
  const openAll = page.locator("[data-shelf-open-all]");
  if (await openAll.isVisible()) {
    await openAll.tap();
    await expect(page.locator("[data-sticker-lesson]")).toHaveCount(
      lessons.length,
    );
    await page.getByRole("button", { name: "Đóng" }).tap();
  }
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
  await expect(page.locator("[data-lesson]")).toHaveCount(mathLessons.length);
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

// A second child, added from the picker, so a test can tell whose record an
// edit touched.
async function addSecondChild(page: Page) {
  await page.getByRole("link", { name: "Đổi hồ sơ" }).click();
  await page.getByRole("button", { name: "Thêm bạn mới" }).click();
  await createProfile(page, "Bin", "Gấu");
}

test("renaming a child and changing the avatar keeps their progress", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Mèo");
  await addSecondChild(page);

  // Bé Na starts a section, so there is progress to keep.
  await page.getByRole("link", { name: "Đổi hồ sơ" }).click();
  await page.getByRole("button", { name: "Bé Na" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Bé Na!" }),
  ).toBeVisible();
  await openFixtureLesson(page);
  await page.locator('[data-section="fixture.section.phep-nhan"]').tap();
  await page.getByRole("button", { name: "Tiếp" }).tap();
  await page.goto("/");
  await expect(page.locator('[data-subject="math"]')).toContainText(
    "Đang học phần 1",
  );

  await page.getByRole("link", { name: "Đổi hồ sơ" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Ai đang học đấy?" }),
  ).toBeVisible();
  await expectNoHorizontalScroll(page);
  await expectTouchTargets(page);

  await page
    .locator("li", { has: page.getByRole("button", { name: "Bé Na" }) })
    .getByRole("button", { name: "Sửa" })
    .click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Sửa hồ sơ" }),
  ).toBeVisible();
  await expect(page.getByLabel("Bạn tên là gì?")).toHaveValue("Bé Na");
  await expect(page.getByRole("radio", { name: "Mèo" })).toBeChecked();
  await expectNoHorizontalScroll(page);

  await page.getByLabel("Bạn tên là gì?").fill("Na Na");
  await page.getByText("Xe đua", { exact: true }).click();
  await page.getByRole("button", { name: "Lưu" }).click();

  // Back on the list the card shows the change; the other child is untouched.
  await expect(
    page.getByRole("heading", { level: 1, name: "Ai đang học đấy?" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Bin" })).toBeVisible();
  await page.getByRole("button", { name: "Na Na" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Na Na!" }),
  ).toBeVisible();
  await expect(
    page.locator('header [data-avatar="racecar"]').first(),
  ).toBeVisible();
  await expect(page.locator('[data-subject="math"]')).toContainText(
    "Đang học phần 1",
  );
  await expect(page.locator("[data-continue]")).toHaveAccessibleName(
    /^Học tiếp: /,
  );

  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào Na Na!" }),
  ).toBeVisible();
});

test("a subject missing from subjects.json does not exist", async ({
  page,
}) => {
  const response = await page.goto("/subjects/physics");
  expect(response?.status()).toBe(404);
});

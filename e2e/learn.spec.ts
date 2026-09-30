import { expect, test } from "@playwright/test";
import { createProfile, finishSection } from "./flows";
import { expectNoHorizontalScroll } from "./layout";

const SECTION = "fixture.section.phep-nhan";
const NEXT_SECTION = "fixture.section.doc-hieu";
// Answered wrong three times, then retyped after the answer is shown.
const MISSED_EXERCISE = "fixture.ex.dem-cham";

test("a child learns a section, resuming where they left off", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto("/lessons/fixture");
  const sectionLink = page.locator(`[data-section="${SECTION}"]`);
  await expect(sectionLink).toHaveAttribute("data-state", "not_started");
  await expectNoHorizontalScroll(page);

  await sectionLink.tap();
  await expect(page).toHaveURL(new RegExp(`/sections/${SECTION}$`));
  const stepper = page.locator("[data-section-stepper]");
  await expect(stepper).toHaveAttribute("data-current", "0");
  await page.getByRole("button", { name: "Tiếp" }).tap();
  await expect(stepper).toHaveAttribute("data-current", "1");

  // Leaving and coming back opens the same block, and the lesson page
  // already shows the section as started and as the one to continue.
  await page.getByRole("link", { name: "Về trang bài" }).tap();
  await expect(sectionLink).toHaveAttribute("data-state", "in_progress");
  await expect(sectionLink).toHaveAttribute("data-next", "true");
  await expect(sectionLink).toContainText("Học tiếp");
  await sectionLink.tap();
  await expect(stepper).toHaveAttribute("data-current", "1");

  // Home offers the same section in one tap.
  await page.goto("/");
  const continueCard = page.locator("[data-continue]");
  await expect(continueCard).toHaveAccessibleName(/^Học tiếp: /);
  await expect(continueCard).toHaveAttribute("data-continue", SECTION);
  await expect(page.locator('[data-subject="math"]')).toContainText(
    "Đang học phần 1",
  );
  await continueCard.tap();
  await expect(stepper).toHaveAttribute("data-current", "1");

  await finishSection(page, MISSED_EXERCISE);
  await expect(
    page.getByRole("heading", { name: "Xong phần này!" }),
  ).toBeVisible();
  await expect(page.getByText("Xong 1/2 phần")).toBeVisible();
  await expect(page.getByText("Còn 1 phần nữa là có sticker")).toBeVisible();
  // One of two sections done: the sticker is half coloured.
  await expect(
    page.getByRole("img", { name: /^Sticker .*, đã tô 1\/2 phần$/ }),
  ).toHaveAttribute("data-sticker-fill", "1/2");
  await expectNoHorizontalScroll(page);
  await page.getByRole("link", { name: "Về bài" }).tap();
  await expect(sectionLink).toHaveAttribute("data-state", "done");
  await expect(sectionLink).not.toHaveAttribute("data-next");
  await expect(
    page.locator(`[data-section="${NEXT_SECTION}"]`),
  ).toHaveAttribute("data-next", "true");
  await expect(
    page.getByRole("region", { name: "Sticker của bài" }).getByRole("img"),
  ).toHaveAttribute("data-sticker-fill", "1/2");

  // The home sticker strip shows the same progress.
  await page.goto("/");
  await expect(
    page.locator('[data-sticker-lesson="fixture"] [data-sticker-fill]'),
  ).toHaveAttribute("data-sticker-fill", "1/2");
});

test("Học tiếp goes back to the first unfinished section when a later one was started", async ({
  page,
}) => {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
  await page.goto("/lessons/fixture");
  // Sections are not locked: the second one opens straight away.
  await page.locator(`[data-section="${NEXT_SECTION}"]`).tap();
  await expect(page).toHaveURL(new RegExp(`/sections/${NEXT_SECTION}$`));
  await page.getByRole("button", { name: "Tiếp" }).tap();
  await expect(page.locator("[data-section-stepper]")).toHaveAttribute(
    "data-current",
    "1",
  );

  // Home still sends the child to part 1, and names part 2 as left half-way.
  await page.goto("/");
  const continueCard = page.locator("[data-continue]");
  await expect(continueCard).toHaveAttribute("data-continue", SECTION);
  await expect(continueCard).toContainText("Phần 1: ");
  await expect(continueCard).toContainText("Đang dở: Phần 2");
  await expectNoHorizontalScroll(page);

  // The lesson page marks part 1 as the one to continue.
  await page.goto("/lessons/fixture");
  await expect(page.locator(`[data-section="${SECTION}"]`)).toHaveAttribute(
    "data-next",
    "true",
  );
  const later = page.locator(`[data-section="${NEXT_SECTION}"]`);
  await expect(later).toHaveAttribute("data-state", "in_progress");
  await expect(later).not.toHaveAttribute("data-next");
});

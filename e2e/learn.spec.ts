import { expect, test } from "@playwright/test";
import { createProfile, finishSection } from "./flows";
import { expectNoHorizontalScroll } from "./layout";

const SECTION = "fixture.section.phep-nhan";
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
  // already shows the section as started.
  await page.getByRole("link", { name: "Về trang bài" }).tap();
  await expect(sectionLink).toHaveAttribute("data-state", "in_progress");
  await sectionLink.tap();
  await expect(stepper).toHaveAttribute("data-current", "1");

  await finishSection(page, MISSED_EXERCISE);
  await expect(
    page.getByRole("heading", { name: "Xong phần này!" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Về bài" }).tap();
  await expect(sectionLink).toHaveAttribute("data-state", "done");
});

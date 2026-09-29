import { expect, test } from "@playwright/test";

test("home shows the Vietnamese greeting without horizontal scroll", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Chào bạn nhỏ!" }),
  ).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");

  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
});

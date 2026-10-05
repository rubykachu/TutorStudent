import type { Page } from "@playwright/test";
import { createProfile } from "./flows";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";
import { expect, test } from "./test";

// The "install the app" bar on home. The browser's prompt is a Chromium API,
// and a user agent is all the other platforms are told apart by, so these run
// on the Chromium target and fake both. The bar waits a few seconds after
// home shows, so each test allows for that.

const SHOW_TIMEOUT = 10_000;

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const IOS_ZALO =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Zalo iOS/536 ZaloTheme/light ZaloLanguage/vn";

test.skip(
  ({ browserName }) => browserName !== "chromium",
  "beforeinstallprompt is Chromium only",
);

async function openHome(page: Page) {
  await page.goto("/profiles");
  await createProfile(page, "Bé Na", "Cáo");
}

// Fires what Chrome fires when the page can be installed; the page's
// `prompt()` calls are counted in `window.__prompts`.
async function fireInstallPrompt(page: Page) {
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    const w = window as unknown as { __prompts: number };
    w.__prompts = 0;
    Object.assign(event, {
      prompt: async () => {
        w.__prompts += 1;
      },
      userChoice: Promise.resolve({ outcome: "accepted" }),
    });
    window.dispatchEvent(event);
  });
}

const bar = (page: Page) => page.locator("[data-install-bar]");

test("Cài app shows the browser's install prompt", async ({ page }) => {
  await openHome(page);
  await fireInstallPrompt(page);
  await expect(bar(page)).toBeVisible({ timeout: SHOW_TIMEOUT });
  await expect(bar(page)).toContainText("dùng được cả khi không có mạng");
  await expectNoHorizontalScroll(page);
  await expectTouchTargets(page);
  await page.getByRole("button", { name: "Cài app" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { __prompts: number }).__prompts,
      ),
    )
    .toBe(1);
  await expect(bar(page)).toHaveCount(0);
  // Accepted: never again on this device.
  await page.reload();
  await page.waitForTimeout(6000);
  await expect(bar(page)).toHaveCount(0);
});

test.describe("on iPhone Safari", () => {
  test.use({ userAgent: IPHONE_SAFARI });

  test("Xem cách cài opens the Share steps", async ({ page }) => {
    await openHome(page);
    await expect(bar(page)).toBeVisible({ timeout: SHOW_TIMEOUT });
    await page.getByRole("button", { name: "Xem cách cài" }).click();
    const sheet = page.locator('[data-install-sheet="ios-steps"]');
    await expect(sheet).toContainText("Chia sẻ");
    await expect(sheet).toContainText("Thêm vào Màn hình chính");
    await expect(sheet.locator("[data-install-step]")).toHaveCount(2);
    // Để sau after closing the sheet: gone for this visit.
    await page.getByRole("button", { name: "Đóng" }).click();
    await page.getByRole("button", { name: "Để sau" }).click();
    await expect(bar(page)).toHaveCount(0);
  });
});

test.describe("in Zalo on iPhone", () => {
  test.use({ userAgent: IOS_ZALO });

  test("asks to open in Safari and copies the link", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openHome(page);
    await expect(bar(page)).toBeVisible({ timeout: SHOW_TIMEOUT });
    await page.getByRole("button", { name: "Mở bằng Safari" }).click();
    await page.getByRole("button", { name: "Chép link" }).click();
    await expect(
      page.getByRole("button", { name: "Đã chép link" }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      page.url(),
    );
  });
});

test.describe("opened from the Home Screen", () => {
  test.use({ userAgent: IPHONE_SAFARI });

  test("never shows the bar", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "standalone", { value: true });
    });
    await openHome(page);
    await fireInstallPrompt(page);
    await page.waitForTimeout(6000);
    await expect(bar(page)).toHaveCount(0);
  });
});

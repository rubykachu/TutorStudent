import { expect, type Page } from "@playwright/test";
import { APP_NAME, APP_SHORT_NAME, SITE_URL } from "../src/lib/brand";
import { expectNoHorizontalScroll, expectTouchTargets } from "./layout";
import { GATE_BASE_URL, GATE_FAMILY_CODE } from "./targets";
import { test } from "./test";

// These specs run against the second dev server, which has the family-code
// gate on (`GATE_SERVER_ENV`).
test.use({ baseURL: GATE_BASE_URL });

// The server counts wrong codes per address. Each test claims its own
// address, so one test's lock never reaches another running beside it.
test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({
    "x-forwarded-for": `test-${crypto.randomUUID()}`,
  });
});

async function enterCode(page: Page, code: string) {
  const field = page.getByLabel("Nhập mã của gia đình để vào học");
  const button = page.getByRole("button", { name: "Vào học" });
  // Text typed before the page hydrates is forgotten, which keeps the button
  // off: type again until the button wakes up.
  await expect(async () => {
    await field.fill(code);
    await expect(button).toBeEnabled({ timeout: 500 });
  }).toPass();
  await button.click();
}

test("a visitor without the code is sent to the unlock page", async ({
  page,
}) => {
  await page.goto("/profiles");
  await expect(page).toHaveURL(/\/unlock\?next=%2Fprofiles$/);
  await expect(
    page.getByLabel("Nhập mã của gia đình để vào học"),
  ).toBeVisible();
  await expectNoHorizontalScroll(page);
  await expectTouchTargets(page);
  // The parent page sits behind the same gate.
  await page.goto("/parent");
  await expect(page).toHaveURL(/\/unlock\?next=%2Fparent$/);
});

test("files and API calls without the code get 401, not a page", async ({
  page,
}) => {
  for (const path of ["/sounds/button.m4a", "/content/index.json"]) {
    const response = await page.request.get(path);
    expect(response.status(), path).toBe(401);
  }
});

type Manifest = {
  start_url: string;
  display: string;
  icons: { src: string; sizes: string; purpose: string }[];
};

test("the manifest and its icons load without the code while the rest stays locked", async ({
  page,
}) => {
  const response = await page.request.get("/manifest.webmanifest");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/json/);
  const manifest = (await response.json()) as Manifest;
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.map((i) => `${i.sizes} ${i.purpose}`)).toEqual([
    "192x192 any",
    "512x512 any",
    "512x512 maskable",
  ]);
  for (const path of [
    ...manifest.icons.map((i) => i.src),
    "/brand/apple-touch-icon.png",
  ]) {
    const icon = await page.request.get(path);
    expect(icon.status(), path).toBe(200);
    expect(icon.headers()["content-type"], path).toBe("image/png");
  }
  // Public files do not open the door to anything beside them.
  for (const path of ["/content/index.json", "/brand/other.png"]) {
    expect((await page.request.get(path)).status(), path).toBe(401);
  }
});

test("a link preview crawler without the cookie gets the share card from the unlock page", async ({
  page,
}) => {
  // `/` redirects to `/unlock`; a crawler follows it and reads that page.
  await page.goto("/");
  await expect(page).toHaveURL(/\/unlock\?next=%2F$/);
  const meta = (name: string) =>
    page.locator(`meta[property="${name}"], meta[name="${name}"]`);
  const production = SITE_URL;
  await expect(page).toHaveTitle(new RegExp(APP_NAME));
  await expect(meta("apple-mobile-web-app-title")).toHaveAttribute(
    "content",
    APP_SHORT_NAME,
  );
  await expect(meta("og:type")).toHaveAttribute("content", "website");
  await expect(meta("og:locale")).toHaveAttribute("content", "vi_VN");
  await expect(meta("og:site_name")).toHaveAttribute("content", APP_NAME);
  await expect(meta("og:url")).toHaveAttribute("content", production);
  await expect(meta("og:title")).toHaveAttribute(
    "content",
    new RegExp(APP_NAME),
  );
  await expect(meta("og:description")).toHaveAttribute("content", /bạn cú/);
  await expect(meta("og:image")).toHaveAttribute(
    "content",
    `${production}/brand/share.png`,
  );
  await expect(meta("og:image:width")).toHaveAttribute("content", "1200");
  await expect(meta("og:image:height")).toHaveAttribute("content", "630");
  await expect(meta("twitter:card")).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(meta("twitter:image")).toHaveAttribute(
    "content",
    `${production}/brand/share.png`,
  );
  await expect(
    page.locator('link[rel="icon"][type="image/svg+xml"]'),
  ).toHaveAttribute("href", "/brand/favicon.svg");
  // Search engines stay out, previews still work.
  await expect(meta("robots")).toHaveAttribute("content", /noindex/);

  // The image the card points to loads for a client with no cookie (its path
  // on this server, since the tag names the production address).
  const image = await page.request.get("/brand/share.png");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toBe("image/png");
  expect(image.headers()["x-robots-tag"]).toContain("noindex");
  const favicon = await page.request.get("/favicon.ico");
  expect(favicon.status()).toBe(200);
});

test("a Home Screen launch opens the unlock page once, then the app, with no service worker", async ({
  page,
}) => {
  // What the browser needs to offer "Add to Home Screen", read from the page
  // a visitor without the code gets.
  await page.goto("/");
  await expect(page).toHaveURL(/\/unlock\?next=%2F$/);
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    "href",
    "/brand/apple-touch-icon.png",
  );
  await expect(
    page.locator('meta[name="apple-mobile-web-app-capable"]'),
  ).toHaveAttribute("content", "yes");
  await expect(
    page.locator('meta[name="apple-mobile-web-app-status-bar-style"]'),
  ).toHaveAttribute("content", "default");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#f8fafc",
  );
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    /viewport-fit=cover/,
  );

  // The launch opens the manifest's start URL: locked, then through the code.
  const manifest = (await (
    await page.request.get("/manifest.webmanifest")
  ).json()) as Manifest;
  await page.goto(manifest.start_url);
  await expect(page).toHaveURL(/\/unlock\?next=%2F$/);
  await enterCode(page, GATE_FAMILY_CODE);
  await expect(page).toHaveURL(/\/profiles$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Chào bạn mới!" }),
  ).toBeVisible();

  expect(
    await page.evaluate(
      async () => (await navigator.serviceWorker.getRegistrations()).length,
    ),
  ).toBe(0);
});

test("a wrong code says so kindly, the right one opens the page asked for and stays", async ({
  page,
  context,
}) => {
  await page.goto("/profiles");
  await enterCode(page, "khong-dung-roi");
  await expect(page.locator("[data-unlock-problem=wrong]")).toContainText(
    "Chưa đúng rồi",
  );
  await expect(page).toHaveURL(/\/unlock/);

  // Capitals and spaces are forgiven.
  await enterCode(
    page,
    ` ${GATE_FAMILY_CODE.toUpperCase().replace(/-/g, " ")} `,
  );
  await expect(page).toHaveURL(/\/profiles$/);

  // The proof is a cookie the page cannot read, and it outlasts a reload.
  const cookie = (await context.cookies()).find(
    (c) => c.name === "tutor_family",
  );
  expect(cookie?.httpOnly).toBe(true);
  expect(await page.evaluate(() => document.cookie)).not.toContain(
    "tutor_family",
  );
  await page.reload();
  await expect(page).toHaveURL(/\/profiles$/);

  // Unlocked: the unlock page is skipped, files load, the parent page opens.
  await page.goto("/unlock");
  // Home sends a device without a profile on to the profile picker.
  await expect(page).toHaveURL(/\/profiles$/);
  expect((await page.request.get("/sounds/button.m4a")).status()).toBe(200);
  await page.goto("/parent");
  await expect(page).toHaveURL(/\/parent$/);
});

test("too many wrong codes ask the child to rest, even for the right code", async ({
  page,
}) => {
  await page.goto("/unlock");
  for (let i = 0; i < 5; i++) await enterCode(page, `sai-lan-${i}-nhe`);
  await expect(page.locator("[data-unlock-problem=locked]")).toContainText(
    "Nghỉ một chút",
  );
  await enterCode(page, GATE_FAMILY_CODE);
  await expect(page.locator("[data-unlock-problem=locked]")).toBeVisible();
  await expect(page).toHaveURL(/\/unlock/);
});

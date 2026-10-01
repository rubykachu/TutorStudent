import { expect, type Page } from "@playwright/test";
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

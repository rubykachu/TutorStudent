import { expect, type Page } from "@playwright/test";

// Layout rules from docs/design-system.md that every page must keep.

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return { scrollWidth: root.scrollWidth, clientWidth: root.clientWidth };
  });
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
}

const MIN_TOUCH_PX = 48;
// Sub-pixel layout can put a 48px box at 47.99px.
const ROUNDING_PX = 0.5;

// Every visible interactive element is at least 48×48. Sentences tapped
// inside running text are the design-system exception: they wrap like prose,
// so each of their lines must be at least 48px tall instead.
export async function expectTouchTargets(page: Page) {
  const { checked, tooSmall } = await page.evaluate(
    ({ min }) => {
      const selector = [
        "button",
        "a[href]",
        "input",
        "select",
        "textarea",
        "[role=button]",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",");
      const visible = [...document.querySelectorAll(selector)]
        .map((el) => ({ el, box: el.getBoundingClientRect() }))
        .filter(({ box }) => box.width > 0 && box.height > 0);
      return {
        checked: visible.length,
        tooSmall: visible
          .filter(({ el, box }) =>
            el.hasAttribute("data-sentence")
              ? Number.parseFloat(getComputedStyle(el).lineHeight) < min
              : box.width < min || box.height < min,
          )
          .map(
            ({ el, box }) =>
              `${Math.round(box.width)}×${Math.round(box.height)} ${el.outerHTML.slice(0, 120)}`,
          ),
      };
    },
    { min: MIN_TOUCH_PX - ROUNDING_PX },
  );
  expect(checked).toBeGreaterThan(0);
  expect(tooSmall).toEqual([]);
}

type Box = { top: number; bottom: number; left: number; right: number };

// Where the sticky bottom bar starts on screen: content must end above it.
async function bottomBarTop(page: Page): Promise<number> {
  return page.evaluate(() => {
    const bar = document.querySelector("[data-bottom-bar]");
    return bar ? bar.getBoundingClientRect().top : window.innerHeight;
  });
}

// The element is wholly on screen and above the bottom bar, without the
// child scrolling. Polls, since the frame may still be gliding it into view.
export async function expectInViewAboveBar(page: Page, selector: string) {
  await expect
    .poll(
      async () => {
        const box: Box | null = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
        }, selector);
        if (!box) return `${selector} missing`;
        const barTop = await bottomBarTop(page);
        const width = page.viewportSize()?.width ?? 0;
        const ok =
          box.top >= -ROUNDING_PX &&
          box.bottom <= barTop + ROUNDING_PX &&
          box.left >= -ROUNDING_PX &&
          box.right <= width + ROUNDING_PX;
        return ok
          ? "in view"
          : `${selector} at ${Math.round(box.top)}–${Math.round(box.bottom)}, bar at ${Math.round(barTop)}`;
      },
      { timeout: 5_000 },
    )
    .toBe("in view");
}

// No interactive element outside the bottom bar is even partly behind it.
// Polls, since the frame may still be gliding the answer into view.
export async function expectNothingUnderBottomBar(page: Page) {
  await expect
    .poll(() => coveredByBottomBar(page), { timeout: 5_000 })
    .toEqual([]);
}

async function coveredByBottomBar(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const bar = document.querySelector("[data-bottom-bar]");
    if (!bar) return [];
    const b = bar.getBoundingClientRect();
    const selector = [
      "button",
      "a[href]",
      "input",
      "select",
      "textarea",
      "[role=button]",
    ].join(",");
    return [...document.querySelectorAll(selector)]
      .filter((el) => !bar.contains(el))
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(
        ({ r }) =>
          r.width > 0 &&
          r.height > 0 &&
          r.bottom > b.top + 0.5 &&
          r.top < b.bottom &&
          r.right > b.left &&
          r.left < b.right,
      )
      .map(({ el }) => el.outerHTML.slice(0, 120));
  });
}

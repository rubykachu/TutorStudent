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

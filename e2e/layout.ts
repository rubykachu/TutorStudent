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

export async function coveredByBottomBar(page: Page): Promise<string[]> {
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

// Controls set apart enough that a tap never lands on the wrong one: no two
// visible interactive elements closer than MIN_CONTROL_GAP_PX (edge to edge),
// and, with the page scrolled to its end, nothing above the sticky bottom bar
// closer to it than MIN_BAR_GAP_PX. Sentences tapped inside running text are
// prose, not separate controls, and are left out; so is anything nested in
// another control (a button inside a link counts once).
const MIN_CONTROL_GAP_PX = 8;
const MIN_BAR_GAP_PX = 16;

export async function controlSpacingProblems(page: Page): Promise<string[]> {
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight }),
  );
  return page.evaluate(
    ({ minGap, minBarGap, rounding }) => {
      const selector = [
        "button",
        "a[href]",
        "input",
        "select",
        "textarea",
        "[role=button]",
      ].join(",");
      const describe = (el: Element) =>
        (
          el.getAttribute("aria-label") ||
          el.textContent?.trim() ||
          el.outerHTML
        ).slice(0, 40);
      const controls = [...document.querySelectorAll(selector)]
        .filter((el) => !el.closest("[data-sentence-id], [data-passage]"))
        .filter(
          (el) =>
            ![...document.querySelectorAll(selector)].some(
              (other) => other !== el && other.contains(el),
            ),
        )
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter(({ el, r }) => {
          const style = getComputedStyle(el);
          return (
            r.width > 0 &&
            r.height > 0 &&
            style.visibility !== "hidden" &&
            style.pointerEvents !== "none"
          );
        });
      const problems: string[] = [];
      for (let i = 0; i < controls.length; i++) {
        for (let j = i + 1; j < controls.length; j++) {
          const a = controls[i];
          const b = controls[j];
          if (!a || !b) continue;
          const dx = Math.max(0, b.r.left - a.r.right, a.r.left - b.r.right);
          const dy = Math.max(0, b.r.top - a.r.bottom, a.r.top - b.r.bottom);
          const gap = Math.hypot(dx, dy);
          if (gap < minGap - rounding) {
            problems.push(
              `"${describe(a.el)}" and "${describe(b.el)}" are ${gap.toFixed(1)}px apart`,
            );
          }
        }
      }
      const bar = document.querySelector("[data-bottom-bar]");
      if (bar) {
        const barTop = bar.getBoundingClientRect().top;
        for (const { el, r } of controls) {
          if (bar.contains(el)) continue;
          const gap = barTop - r.bottom;
          if (gap < minBarGap - rounding) {
            problems.push(
              `"${describe(el)}" is ${gap.toFixed(1)}px from the bottom bar`,
            );
          }
        }
      }
      return problems;
    },
    {
      minGap: MIN_CONTROL_GAP_PX,
      minBarGap: MIN_BAR_GAP_PX,
      rounding: ROUNDING_PX,
    },
  );
}

export async function expectControlsApart(page: Page) {
  expect(await controlSpacingProblems(page)).toEqual([]);
}

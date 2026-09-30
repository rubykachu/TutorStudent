// Overlap check shared by `pnpm lesson:walk` and `pnpm visual:shot`: text
// that another text or a hint ring paints over. It catches what a sibling
// box check cannot see, such as the outlines of a formula's base and
// exponent crossing each other when a hint lights up both, or a label
// drawn on top of a word.

export type OverlapOptions = {
  // CSS selector of the element whose content is checked.
  scope: string;
};

// Runs in the browser, so it must not reference anything outside itself.
// Returns one line per problem found, empty when the screen is clean:
// - two runs of text whose glyph boxes cross (text boxes of one wrapped
//   run, lines that only touch through their leading, and text passing
//   under a fixed or sticky bar are left out);
// - two hint rings (every `[data-highlighted]` element: its halo, its
//   outline, or else its own box) that cross, unless one holds the other;
// - a hint ring painted over text outside the element it marks.
export function findOverlaps({ scope }: OverlapOptions): string[] {
  // Glyph boxes are the font's content area, taller than the ink; lines
  // set tighter than that touch by a few px without any ink meeting, so
  // text counts as covered only past this share of the shorter box.
  const MIN_TEXT_OVERLAP_SHARE = 0.35;
  // Sub-pixel layout and anti-aliasing: crossings up to this are ignored.
  const SLACK_PX = 1.5;
  const root = document.querySelector(scope);
  if (!root) return [];

  type Box = { left: number; right: number; top: number; bottom: number };
  type Glyph = { box: Box; node: Node; owner: Element; layer: Element | null };
  type Ring = { boxes: Box[]; el: Element };

  const snippet = (text: string | null | undefined) =>
    `"${(text ?? "").replaceAll(/\s+/g, " ").trim().slice(0, 24)}"`;
  const crossing = (a: Box, b: Box) => ({
    x: Math.min(a.right, b.right) - Math.max(a.left, b.left),
    y: Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top),
  });
  const hidden = (el: Element) =>
    el.closest(".sr-only, .katex-mathml, [data-halo]") !== null ||
    !el.checkVisibility({ opacityProperty: true, visibilityProperty: true });

  // Fixed and sticky bars (the bottom bar) float over content scrolling
  // under them by design; only text within the same layer is compared.
  const layers = new Map<Element, Element | null>();
  const layerOf = (el: Element): Element | null => {
    if (layers.has(el)) return layers.get(el) ?? null;
    const position = getComputedStyle(el).position;
    const layer =
      position === "fixed" || position === "sticky"
        ? el
        : el.parentElement
          ? layerOf(el.parentElement)
          : null;
    layers.set(el, layer);
    return layer;
  };

  const glyphs: Glyph[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const svgTexts = new Set<Element>();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const owner = node.parentElement;
    if (!owner || !node.textContent?.trim() || hidden(owner)) continue;
    const svgText = owner.closest("text");
    if (svgText && owner instanceof SVGElement) {
      // SVG text has no line boxes; its element box is the glyph run.
      if (svgTexts.has(svgText)) continue;
      svgTexts.add(svgText);
      glyphs.push({
        box: svgText.getBoundingClientRect(),
        node,
        owner,
        layer: layerOf(owner),
      });
      continue;
    }
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue;
      glyphs.push({ box: r, node, owner, layer: layerOf(owner) });
    }
  }

  const issues: string[] = [];
  for (let i = 0; i < glyphs.length; i++) {
    for (let j = i + 1; j < glyphs.length; j++) {
      const a = glyphs[i];
      const b = glyphs[j];
      if (!a || !b || a.node === b.node || a.layer !== b.layer) continue;
      const { x, y } = crossing(a.box, b.box);
      const shorter = Math.min(
        a.box.bottom - a.box.top,
        b.box.bottom - b.box.top,
      );
      if (x > SLACK_PX && y > shorter * MIN_TEXT_OVERLAP_SHARE) {
        issues.push(
          `text ${snippet(a.node.textContent)} overlaps text ${snippet(b.node.textContent)}`,
        );
      }
    }
  }

  const rings: Ring[] = [];
  for (const el of root.querySelectorAll("[data-highlighted]")) {
    if (hidden(el)) continue;
    const halo = [...el.children].find((c) => c.hasAttribute("data-halo"));
    if (halo) {
      rings.push({ boxes: [halo.getBoundingClientRect()], el });
      continue;
    }
    const style = getComputedStyle(el);
    const width =
      style.outlineStyle === "none" ? 0 : Number.parseFloat(style.outlineWidth);
    const reach =
      width > 0 ? width + Number.parseFloat(style.outlineOffset) : 0;
    // An inline element wrapping over several lines is ringed line by line.
    rings.push({
      el,
      boxes: [...el.getClientRects()].map((r) => ({
        left: r.left - reach,
        right: r.right + reach,
        top: r.top - reach,
        bottom: r.bottom + reach,
      })),
    });
  }
  const nested = (a: Element, b: Element) => a.contains(b) || b.contains(a);
  for (let i = 0; i < rings.length; i++) {
    for (let j = i + 1; j < rings.length; j++) {
      const a = rings[i];
      const b = rings[j];
      if (!a || !b || nested(a.el, b.el)) continue;
      const meet = a.boxes.some((p) =>
        b.boxes.some((q) => {
          const { x, y } = crossing(p, q);
          return x > SLACK_PX && y > SLACK_PX;
        }),
      );
      if (meet) {
        issues.push(
          `hint ring of ${snippet(a.el.textContent)} overlaps hint ring of ${snippet(b.el.textContent)}`,
        );
      }
    }
  }
  for (const ring of rings) {
    for (const glyph of glyphs) {
      if (
        ring.el.contains(glyph.owner) ||
        glyph.owner.contains(ring.el) ||
        layerOf(ring.el) !== glyph.layer
      ) {
        continue;
      }
      const shorter = glyph.box.bottom - glyph.box.top;
      const covered = ring.boxes.some((box) => {
        const { x, y } = crossing(box, glyph.box);
        return x > SLACK_PX && y > shorter * MIN_TEXT_OVERLAP_SHARE;
      });
      if (covered) {
        issues.push(
          `hint ring of ${snippet(ring.el.textContent)} covers text ${snippet(glyph.node.textContent)}`,
        );
      }
    }
  }
  return [...new Set(issues)];
}

import type { ReactElement } from "react";
import { VISUAL_SPECS } from "@/visuals/math/chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc/catalog";
import { FigureLayers } from "@/visuals/shared/plane/figure";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";

// The pictures of the lesson's visuals, taken from the lesson's own catalog
// so the videos draw the unit squares, the floor, the cut parallelogram and
// the folded rhombus exactly as the app does. The figure draws with Tailwind
// utility classes the video page does not have, so each svg carries the few
// rules it needs.
const CONCEPTS = [
  "blue",
  "violet",
  "pink",
  "amber",
  "teal",
  "sky",
  "lime",
  "slate",
] as const;

const FIGURE_CSS = [
  ".stroke-foreground{stroke:var(--color-foreground)}",
  ".fill-foreground{fill:var(--color-foreground)}",
  ".stroke-muted-foreground{stroke:var(--color-muted-foreground)}",
  ".fill-muted-foreground{fill:var(--color-muted-foreground)}",
  ".fill-muted{fill:var(--color-muted)}",
  ".font-heading{font-family:Baloo\\ 2,sans-serif}",
  ".font-bold{font-weight:700}",
  ...CONCEPTS.flatMap((color) => [
    `.stroke-concept-${color}{stroke:var(--color-concept-${color})}`,
    `.fill-concept-${color}{fill:var(--color-concept-${color})}`,
  ]),
].join("");

// Where the drawing lives: a box round every point and text of `specs`, so the
// picture fills the video and a figure that grows frame by frame keeps one
// frame of reference. The lesson draws on a fixed canvas with room to spare.
const PAD = 16;
const CHAR_WIDTH = 5;

function boxOf(
  specs: readonly FigureSpec[],
): readonly [number, number, number, number] {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const spec of specs) {
    for (const [x, y] of Object.values(spec.pts ?? {})) {
      xs.push(x);
      ys.push(y);
    }
    for (const t of spec.texts ?? []) {
      const half = (t.text.length * CHAR_WIDTH) / 2;
      xs.push(t.x - half, t.x + half);
      ys.push(t.y - PAD / 2, t.y + PAD / 2);
    }
  }
  const x0 = Math.min(...xs) - PAD;
  const y0 = Math.min(...ys) - PAD;
  return [x0, y0, Math.max(...xs) + PAD - x0, Math.max(...ys) + PAD - y0];
}

// The lines that carry a result ("6 · 3 = 18 cm²") are left out: the video
// shows a result as its own label when it says it, after asking the child.
function withoutResults(spec: FigureSpec): FigureSpec {
  return {
    ...spec,
    texts: (spec.texts ?? []).filter((t) => !t.text.includes("=")),
  };
}

function draw(
  spec: FigureSpec,
  box: readonly [number, number, number, number],
): ReactElement {
  return (
    <svg viewBox={box.join(" ")} aria-hidden>
      <style>{FIGURE_CSS}</style>
      <FigureLayers spec={spec} />
    </svg>
  );
}

function framesOf(id: string): readonly FigureSpec[] {
  const spec = VISUAL_SPECS[id];
  if (spec?.kind !== "steps") throw new Error(`${id} is not a steps visual`);
  return spec.frames.map((frame) => withoutResults(frame.figure));
}

function galleryFigure(id: string, item: number): FigureSpec {
  const spec = VISUAL_SPECS[id];
  const figure =
    spec?.kind === "gallery" ? spec.items[item]?.figure : undefined;
  if (!figure) throw new Error(`${id} has no picture ${item}`);
  return withoutResults(figure);
}

// Each step visual becomes one figure per frame: `<prefix>-1`, `<prefix>-2`, ...
function numbered(prefix: string, id: string): Record<string, ReactElement> {
  const frames = framesOf(id);
  const box = boxOf(frames);
  return Object.fromEntries(
    frames.map((spec, i) => [`${prefix}-${i + 1}`, draw(spec, box)] as const),
  );
}

const rect = galleryFigure("dt-cn-quy-tac", 0);

const figures = {
  // Unit squares painted row by row on a 4 by 3 rectangle.
  ...numbered("squares", "phu-o-vuong"),
  // The floor of 6 m by 4 m, empty, then one to four rows of squares.
  ...numbered("floor", "hang-cot-gach"),
  // The rectangle with sides a and b.
  rect: draw(rect, boxOf([rect])),
  // The parallelogram: base, height, the cut, the slid piece, the rectangle.
  ...numbered("para", "bbh-cat-ghep"),
  // The rhombus: its diagonals, the box, the outer triangles, turned in, half.
  ...numbered("rhombus", "thoi-gap"),
};

export default figures;

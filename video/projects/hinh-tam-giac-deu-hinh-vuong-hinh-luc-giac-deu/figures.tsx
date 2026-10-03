import type { ReactElement } from "react";
import { VISUAL_SPECS } from "@/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/catalog";
import { constructFigure } from "@/visuals/math/hinh-tam-giac-deu-hinh-vuong-hinh-luc-giac-deu/construction";
import { FigureLayers } from "@/visuals/shared/plane/figure";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";

// The pictures of the lesson's visuals, taken from the lesson's own catalog
// so the videos draw the shapes, marks and construction steps exactly as the
// app does. The figure draws with Tailwind utility classes the video page
// does not have, so each svg carries the few rules it needs.
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

// `trimTop` cuts that many drawing units off the top, for a drawing whose
// upper part stays empty so the rest can be shown larger.
function draw(spec: FigureSpec, trimTop = 0): ReactElement {
  return (
    <svg viewBox={`0 ${trimTop} ${spec.w} ${spec.h - trimTop}`} aria-hidden>
      <style>{FIGURE_CSS}</style>
      <FigureLayers spec={spec} />
    </svg>
  );
}

function figureOf(id: string): FigureSpec {
  const spec = VISUAL_SPECS[id];
  if (spec?.kind !== "figure") throw new Error(`${id} is not a figure`);
  return spec.figure;
}

function framesOf(id: string): readonly FigureSpec[] {
  const spec = VISUAL_SPECS[id];
  if (spec?.kind !== "steps") throw new Error(`${id} is not a steps visual`);
  return spec.frames.map((frame) => frame.figure);
}

// The shape without its equal-side strokes and angle marks, for the moment a
// video asks the child what the shapes have in common.
function plain(spec: FigureSpec): FigureSpec {
  const { ticks: _ticks, angles: _angles, rights: _rights, ...rest } = spec;
  return rest;
}

// The compass drawing keeps its top empty until the apex appears.
const DRAWING_TRIM = 45;

const drawing = framesOf("ve-td-cac-buoc");
const hexagon = framesOf("ghep-cac-buoc");

const figures = {
  // The three shapes with their equal-side and angle marks, and without.
  tri: draw(figureOf("tam-giac-deu-quy-tac")),
  sq: draw(figureOf("hinh-vuong-quy-tac")),
  hex: draw(figureOf("luc-giac-deu-quy-tac")),
  "tri-plain": draw(plain(figureOf("tam-giac-deu-quy-tac"))),
  "sq-plain": draw(plain(figureOf("hinh-vuong-quy-tac"))),
  "hex-plain": draw(plain(figureOf("luc-giac-deu-quy-tac"))),
  // Drawing an equilateral triangle: side, compass opening, the first arc
  // alone, both arcs, apex, finished triangle.
  ...Object.fromEntries(
    drawing.map(
      (spec, i) => [`ve-${i + 1}`, draw(spec, DRAWING_TRIM)] as const,
    ),
  ),
  "ve-first-arc": draw(
    constructFigure("triangle", ["A", "B", "C"], {
      len: 5,
      open: 5,
      arcM: 1,
    }),
    DRAWING_TRIM,
  ),
  // The hexagon grown one triangle at a time, then with its main diagonal.
  ...Object.fromEntries(
    hexagon.map((spec, i) => [`ghep-${i + 1}`, draw(spec)] as const),
  ),
};

export default figures;

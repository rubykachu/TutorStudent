import type { ReactElement } from "react";
import { VISUAL_SPECS } from "@/visuals/math/hinh-binh-hanh-hinh-thang-can/catalog";
import { FigureLayers } from "@/visuals/shared/plane/figure";
import type { FigureSpec } from "@/visuals/shared/plane/figure-spec";
import { quad } from "@/visuals/shared/quadrilaterals/figures";
import { Scene, type SceneKind } from "@/visuals/shared/quadrilaterals/scene";

// The pictures of the lesson's visuals, taken from the lesson's own catalog
// so the videos draw the shapes, marks and drawing steps exactly as the app
// does. The figure draws with Tailwind utility classes the video page does
// not have, so each svg carries the few rules it needs.
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

function draw(spec: FigureSpec): ReactElement {
  return (
    <svg viewBox={`0 0 ${spec.w} ${spec.h}`} aria-hidden>
      <style>{FIGURE_CSS}</style>
      <FigureLayers spec={spec} />
    </svg>
  );
}

// An everyday thing of the opening; the scene brings its own svg, and the
// colour tokens of the video page already carry the classes it draws with.
function drawScene(kind: SceneKind): ReactElement {
  return <Scene kind={kind} />;
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

const parallelogram = framesOf("binh-hanh-cac-buoc");
// The two equal diagonals marked with one stroke each, placed on different
// halves, so no pair of strokes reads as the equal halves of the diagonals.
function equalDiagonals(spec: FigureSpec): FigureSpec {
  return {
    ...spec,
    ticks: [
      ...(spec.ticks ?? []).filter(
        (tick) => !tick.segs.some(([a, b]) => a === "A" && b === "C"),
      ),
      { segs: [["A", "C"]], count: 2, tone: "blue", at: 0.22 },
      { segs: [["B", "D"]], count: 2, tone: "blue", at: 0.78 },
    ],
  };
}

const trapezoid = framesOf("thang-can-cac-buoc");
const trapezoidDiagonals = framesOf("cheo-thang-can-cac-buoc");
const drawing = framesOf("ve-binh-hanh-cac-buoc");

// A frame of a steps visual, which the lesson has by position.
function at(frames: readonly FigureSpec[], index: number): FigureSpec {
  const frame = frames[index];
  if (!frame) throw new Error(`no frame ${index}`);
  return frame;
}

const figures = {
  // The everyday things of the openings: tiles, the A-frame ladder.
  tiles: drawScene("tiles"),
  ladder: drawScene("ladder"),
  // The parallelogram: plain, equal opposite sides, parallel opposite sides,
  // equal opposite angles, and the rule's whole picture.
  "bh-plain": draw(at(parallelogram, 0)),
  "bh-canh": draw(at(parallelogram, 1)),
  "bh-song-song": draw(at(parallelogram, 2)),
  "bh-goc": draw(at(parallelogram, 3)),
  "bh-rule": draw(figureOf("binh-hanh-quy-tac")),
  // Its diagonals: crossing at O, and the halves marked equal.
  "bh-cheo": draw(figureOf("binh-hanh-cheo-ten")),
  "bh-cheo-rule": draw(figureOf("cheo-binh-hanh-quy-tac")),
  // The isosceles trapezoid: plain, parallel bases, equal legs, equal base
  // angles, and the rule's whole picture.
  "tc-plain": draw(at(trapezoid, 0)),
  "tc-day": draw(at(trapezoid, 1)),
  "tc-ben": draw(at(trapezoid, 2)),
  "tc-goc": draw(at(trapezoid, 3)),
  "tc-rule": draw(figureOf("thang-can-quy-tac")),
  // Its diagonals: one, both, both equal.
  "tc-ac": draw(at(trapezoidDiagonals, 1)),
  "tc-cheo": draw(at(trapezoidDiagonals, 2)),
  "tc-bang": draw(equalDiagonals(at(trapezoidDiagonals, 3))),
  // The two properties of the closing line together: equal legs, equal
  // diagonals.
  "tc-final": draw(
    equalDiagonals(
      quad("thang-can", {
        label:
          "Hình thang cân: hai cạnh bên bằng nhau, hai đường chéo bằng nhau",
        names: true,
        fill: true,
        sides: "legs",
        diagonals: "equal",
      }),
    ),
  ),
  // Drawing the parallelogram: the side, the angle line, the second side, the
  // two parallels, the finished shape.
  "ve-1": draw(at(drawing, 0)),
  "ve-2": draw(at(drawing, 1)),
  "ve-3": draw(at(drawing, 2)),
  "ve-4": draw(at(drawing, 3)),
  "ve-5": draw(at(drawing, 4)),
  "ve-6": draw(at(drawing, 5)),
};

export default figures;

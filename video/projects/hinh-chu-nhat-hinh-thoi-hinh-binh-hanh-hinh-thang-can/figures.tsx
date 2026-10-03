import type { ReactElement } from "react";
import { VISUAL_SPECS } from "@/visuals/math/hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can/catalog";
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

const rectangle = framesOf("chu-nhat-cac-buoc");
const rectangleDiagonals = framesOf("cheo-chu-nhat-cac-buoc");
const rhombus = framesOf("thoi-cac-buoc");
const rhombusDiagonals = framesOf("cheo-thoi-cac-buoc");
const drawing = framesOf("ve-chu-nhat-cac-buoc");

// A frame of a steps visual, which the lesson has by position.
function at(frames: readonly FigureSpec[], index: number): FigureSpec {
  const frame = frames[index];
  if (!frame) throw new Error(`no frame ${index}`);
  return frame;
}

const figures = {
  // The door and the fence mesh of the openings.
  door: drawScene("door"),
  fence: drawScene("fence"),
  // The rectangle: plain, with its right angles, with its opposite sides
  // marked, with both marks.
  "cn-plain": draw(at(rectangle, 0)),
  "cn-goc": draw(at(rectangle, 1)),
  "cn-canh": draw(at(rectangle, 2)),
  "cn-rule": draw(figureOf("chu-nhat-quy-tac")),
  // Its diagonals: one, both, both equal.
  "cn-ac": draw(at(rectangleDiagonals, 1)),
  "cn-cheo": draw(at(rectangleDiagonals, 2)),
  "cn-bang": draw(at(rectangleDiagonals, 3)),
  // The rhombus: plain, equal sides, parallel opposite sides, equal opposite
  // angles.
  "th-plain": draw(at(rhombus, 0)),
  "th-canh": draw(at(rhombus, 1)),
  "th-song-song": draw(at(rhombus, 2)),
  "th-goc": draw(at(rhombus, 3)),
  // Equal sides with parallel opposite sides, the picture of the rule's first
  // half, and the rule's whole picture with the angles.
  "th-canh-song": draw(
    quad("thoi", {
      label: "Hình thoi: bốn cạnh bằng nhau, cạnh đối song song",
      names: true,
      fill: true,
      sides: "all",
      parallel: "opposite",
    }),
  ),
  "th-rule": draw(figureOf("thoi-quy-tac")),
  // Its diagonals: both, perpendicular.
  "th-cheo": draw(at(rhombusDiagonals, 2)),
  "th-vuong": draw(at(rhombusDiagonals, 3)),
  // Drawing the rectangle: the side, the two perpendiculars, the two
  // segments, the finished rectangle.
  "ve-1": draw(at(drawing, 0)),
  "ve-2": draw(at(drawing, 1)),
  "ve-3": draw(at(drawing, 2)),
  "ve-4": draw(at(drawing, 3)),
};

export default figures;

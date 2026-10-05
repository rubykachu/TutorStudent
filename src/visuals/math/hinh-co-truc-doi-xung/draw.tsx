import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import type { Line, Pt, Stroke } from "./geometry";
import type { ShapeStroke } from "./shapes";

// Drawing parts shared by every picture of the lesson: the strokes of a
// shape with their soft fill, and the lines laid over it (axes, test lines).

export const OUTLINE_WIDTH = 3;
export const DETAIL_WIDTH = 1.8;
export const LINE_WIDTH = 3;
const FILL_OPACITY = 0.22;
const DASH = "9 7";

// The colour every axis of symmetry is drawn in, in every picture.
export const AXIS_COLOR: ConceptColor = "pink";
// The colour of a mirror image (a point or a part placed across the axis).
export const MIRROR_COLOR: ConceptColor = "teal";

export function points(pts: readonly Pt[]): string {
  return pts.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

type StrokesProps = {
  strokes: readonly ShapeStroke[];
  // Class of the outline; default the ink colour.
  lineClass?: string;
  // Class of the fill, drawn soft; `none` leaves shapes unfilled.
  fillClass?: string | "none";
  // Draws the thin details too (veins, spots); default yes.
  details?: boolean;
  // Dashes the outline (the moving half of a fold).
  dashed?: boolean;
  width?: number;
};

// The strokes of a shape: filled closed strokes first, then every line.
export function Strokes({
  strokes,
  lineClass = "stroke-foreground",
  fillClass = CONCEPT_CLASSES.sky.fill,
  details = true,
  dashed = false,
  width = OUTLINE_WIDTH,
}: StrokesProps) {
  const shown = details ? strokes : strokes.filter((s) => !s.thin);
  return (
    <g {...decorative} strokeLinecap="round" strokeLinejoin="round">
      {fillClass !== "none" &&
        shown.map((stroke, i) =>
          stroke.fill && stroke.closed ? (
            <polygon
              // biome-ignore lint/suspicious/noArrayIndexKey: strokes never reorder
              key={i}
              points={points(stroke.pts)}
              className={fillClass}
              fillOpacity={FILL_OPACITY}
              stroke="none"
            />
          ) : null,
        )}
      {shown.map((stroke, i) =>
        stroke.pts.length === 1 ? null : stroke.closed ? (
          <polygon
            // biome-ignore lint/suspicious/noArrayIndexKey: strokes never reorder
            key={i}
            points={points(stroke.pts)}
            fill="none"
            strokeWidth={stroke.thin ? DETAIL_WIDTH : width}
            strokeDasharray={dashed ? DASH : undefined}
            className={lineClass}
          />
        ) : (
          <polyline
            // biome-ignore lint/suspicious/noArrayIndexKey: strokes never reorder
            key={i}
            points={points(stroke.pts)}
            fill="none"
            strokeWidth={stroke.thin ? DETAIL_WIDTH : width}
            strokeDasharray={dashed ? DASH : undefined}
            className={lineClass}
          />
        ),
      )}
    </g>
  );
}

// A straight line laid over a drawing.
export function LineMark({
  axis,
  className,
  dashed = true,
  width = LINE_WIDTH,
}: {
  axis: Line;
  className: string;
  dashed?: boolean;
  width?: number;
}) {
  return (
    <line
      x1={axis.p[0]}
      y1={axis.p[1]}
      x2={axis.q[0]}
      y2={axis.q[1]}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={dashed ? DASH : undefined}
      className={className}
    />
  );
}

export const AXIS_CLASS = CONCEPT_CLASSES[AXIS_COLOR].stroke;
export const AXIS_FILL_CLASS = CONCEPT_CLASSES[AXIS_COLOR].fill;
export const MIRROR_STROKE_CLASS = CONCEPT_CLASSES[MIRROR_COLOR].stroke;
export const MIRROR_FILL_CLASS = CONCEPT_CLASSES[MIRROR_COLOR].fill;

export type { Stroke };

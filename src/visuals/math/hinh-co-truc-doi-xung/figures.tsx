import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";
import { AXIS_CLASS, AXIS_FILL_CLASS, LineMark, Strokes } from "./draw";
import type { Line, Pt } from "./geometry";
import {
  GLYPH_AXES,
  GLYPH_HEIGHT,
  GLYPH_NAME,
  GLYPH_WIDTH,
  GLYPHS,
  type GlyphId,
} from "./glyphs";
import { LineBadge } from "./line-badge";
import { candidatesOf, type LineRef } from "./lines";
import {
  FRAME,
  SHAPES,
  type ShapeId,
  type ShapeStroke,
  through,
} from "./shapes";

// Still pictures of the lesson: a shape or a glyph on its own frame, with its
// axes if wanted, and strips of them whose items are tappable regions.

// Block glyphs are drawn this many frame units to a glyph unit, centred.
const GLYPH_SCALE = 9;
const GLYPH_LINE = 15;

// A glyph's strokes scaled into the square frame the shapes live in.
export function glyphStrokes(id: GlyphId): ShapeStroke[] {
  const dx = 120 - (GLYPH_WIDTH * GLYPH_SCALE) / 2;
  const dy = 120 - (GLYPH_HEIGHT * GLYPH_SCALE) / 2;
  const at = ([x, y]: Pt): Pt => [dx + x * GLYPH_SCALE, dy + y * GLYPH_SCALE];
  return GLYPHS[id].map((stroke) => ({
    closed: stroke.closed,
    pts: stroke.pts.map(at),
  }));
}

// The axes of a glyph as lines across its frame.
export function glyphAxisLines(id: GlyphId): Line[] {
  return GLYPH_AXES[id].map((which) =>
    which === "v" ? through([120, 120], 90, 100) : through([120, 120], 0, 100),
  );
}

export type Subject = { shape: ShapeId } | { glyph: GlyphId };

export function subjectName(subject: Subject): string {
  return "shape" in subject
    ? SHAPES[subject.shape].name
    : GLYPH_NAME[subject.glyph];
}

// Number of axes of a shape or glyph; `null` for endless.
export function subjectAxisCount(subject: Subject): number | null {
  if ("glyph" in subject) return GLYPH_AXES[subject.glyph].length;
  const def = SHAPES[subject.shape];
  return def.endless ? null : def.axes.length;
}

export function subjectAxes(subject: Subject): readonly Line[] {
  return "glyph" in subject
    ? glyphAxisLines(subject.glyph)
    : SHAPES[subject.shape].axes;
}

// The words under a card once its axes are shown.
export function axisCountText(count: number | null): string {
  if (count === null) return "Vô số trục đối xứng";
  if (count === 0) return "Không có trục đối xứng";
  return `${count} trục đối xứng`;
}

// The drawing of a shape or glyph, as SVG children for a `FRAME` square.
export function SubjectDrawing({
  subject,
  axes = false,
  axisLabel,
  thin = false,
}: {
  subject: Subject;
  axes?: boolean;
  // The name written beside the first axis, as the workbook writes "d".
  axisLabel?: string;
  // A small drawing (a thumbnail) uses thicker lines for its size.
  thin?: boolean;
}) {
  const glyph = "glyph" in subject;
  return (
    <>
      <Strokes
        strokes={
          glyph ? glyphStrokes(subject.glyph) : SHAPES[subject.shape].strokes
        }
        width={glyph ? GLYPH_LINE : thin ? 3 : 4}
        fillClass={glyph ? "none" : CONCEPT_CLASSES.sky.fill}
      />
      {axes && (
        <g {...decorative}>
          {subjectAxes(subject).map((axis) => (
            <LineMark
              key={`${axis.p}${axis.q}`}
              axis={axis}
              className={AXIS_CLASS}
              width={4}
            />
          ))}
        </g>
      )}
      {axes && axisLabel && (
        <AxisLabel axis={subjectAxes(subject)[0]} text={axisLabel} />
      )}
    </>
  );
}

function AxisLabel({ axis, text }: { axis: Line | undefined; text: string }) {
  if (!axis) return null;
  return (
    <text
      x={axis.p[0] + 18}
      y={axis.p[1] + 4}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={26}
      stroke="none"
      className={`font-heading font-bold ${AXIS_FILL_CLASS}`}
      {...decorative}
    >
      {text}
    </text>
  );
}

// A single still picture.
export function SubjectFigure({
  subject,
  axes = false,
  axisLabel,
  maxWidth = 280,
}: {
  subject: Subject;
  axes?: boolean;
  axisLabel?: string;
  maxWidth?: number;
}) {
  const count = subjectAxisCount(subject);
  return (
    <div className="mx-auto w-full" style={{ maxWidth }}>
      <svg
        viewBox={`0 0 ${FRAME} ${FRAME}`}
        role="img"
        aria-label={`${subjectName(subject)}${axes ? `, ${axisCountText(count).toLowerCase()}` : ""}`}
        className="h-auto w-full"
      >
        <SubjectDrawing subject={subject} axes={axes} axisLabel={axisLabel} />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A strip of drawings, each a tappable region of a `tapRegion` exercise.

export type StripItem = { id: string; label: string } & Subject;

const CELL = 112;
const GAP = 8;

export function Strip({
  label,
  items,
  columns,
  tappable,
  axes = false,
}: {
  label: string;
  items: readonly StripItem[];
  columns: number;
  // Each item is a region of a `tapRegion` exercise; otherwise the strip is
  // a still picture.
  tappable: boolean;
  // Draws the axes of every item over it.
  axes?: boolean;
}) {
  const rows = Math.ceil(items.length / columns);
  const width = columns * CELL + (columns + 1) * GAP;
  const height = rows * CELL + (rows + 1) * GAP;
  return (
    <div className="mx-auto w-full" style={{ maxWidth: width * 1.5 }}>
      <RegionSvg
        label={label}
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
      >
        {items.map((item, n) => {
          const x = GAP + (n % columns) * (CELL + GAP);
          const y = GAP + Math.floor(n / columns) * (CELL + GAP);
          return (
            <g key={item.id}>
              <svg
                x={x}
                y={y}
                width={CELL}
                height={CELL}
                viewBox={`0 0 ${FRAME} ${FRAME}`}
                aria-hidden="true"
                {...decorative}
              >
                <SubjectDrawing subject={item} thin axes={axes} />
              </svg>
              {tappable && (
                <Region id={item.id} label={item.label}>
                  <rect
                    x={x}
                    y={y}
                    width={CELL}
                    height={CELL}
                    rx={14}
                    fill="transparent"
                  />
                </Region>
              )}
            </g>
          );
        })}
      </RegionSvg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A shape with some lines named a, b, c ... laid over it, for a question that
// asks which of the lines is an axis.

export type LinesSpec = {
  shape: ShapeId;
  lines: readonly LineRef[];
};

export function LinesFigure({ spec }: { spec: LinesSpec }) {
  const def = SHAPES[spec.shape];
  const candidates = candidatesOf(spec.shape, spec.lines);
  return (
    <div className="mx-auto w-full max-w-xs">
      <svg
        viewBox={`0 0 ${FRAME} ${FRAME}`}
        role="img"
        aria-label={`${def.name} và các đường ${candidates.map((c) => c.letter).join(", ")}`}
        className="h-auto w-full"
      >
        <Strokes strokes={def.strokes} />
        <g {...decorative}>
          {candidates.map((c) => (
            <LineMark
              key={c.letter}
              axis={c.axis}
              className="stroke-muted-foreground"
            />
          ))}
        </g>
        {candidates.map((c) => (
          <LineBadge
            key={c.letter}
            axis={c.axis}
            letter={c.letter}
            end={c.end}
          />
        ))}
      </svg>
    </div>
  );
}

import type { ReactNode } from "react";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";
import { Region, RegionSvg } from "@/visuals/shared/region";
import type {
  FigureAngle,
  FigureArc,
  FigurePoly,
  FigureRuler,
  FigureSpec,
  FigureTick,
  Pt,
  Tone,
} from "./figure-spec";
import { directionDeg, lerp, polar, unit } from "./geometry";

// Draws a `FigureSpec`: shapes, extra segments, compass arcs, angle arcs and
// right-angle squares, equal-length strokes, dots and names. A picture that
// needs more than this (a ruler, buttons) draws its own SVG around
// `FigureLayers`.

const DEFAULT_TEXT_SIZE = 17;
const LINE = 3;
const MARK_LINE = 2.5;
const NAME_GAP = 17;
const TICK_LENGTH = 11;
const TICK_GAP = 6;
const RIGHT_SIZE = 13;
const ANGLE_RADIUS = 24;
const ANGLE_TEXT_GAP = 17;
const DASH = "7 6";
const ALONE_DIRECTION: Pt = [-0.7, 0.7];
const FILL_OPACITY = 0.2;
// A drawing never grows past this many times its own size.
const MAX_SCALE = 1.2;

const TEXT = "font-heading font-bold";
const RULER_HEIGHT = 28;
const RULER_MARGIN = 7;

export function strokeClass(tone: Tone | undefined): string {
  if (tone === undefined || tone === "ink") return "stroke-foreground";
  if (tone === "mute") return "stroke-muted-foreground";
  return CONCEPT_CLASSES[tone].stroke;
}

export function fillClass(tone: Tone | undefined): string {
  if (tone === undefined || tone === "ink") return "fill-foreground";
  if (tone === "mute") return "fill-muted-foreground";
  return CONCEPT_CLASSES[tone].fill;
}

export function pointList(points: readonly Pt[]): string {
  return points.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function at(spec: FigureSpec, name: string): Pt {
  const point = spec.pts[name];
  if (!point) throw new Error(`Figure "${spec.label}" has no point "${name}"`);
  return point;
}

function centre(spec: FigureSpec): Pt {
  const points = Object.values(spec.pts);
  const sum = points.reduce<Pt>(
    (acc, [x, y]) => [acc[0] + x, acc[1] + y],
    [0, 0],
  );
  return [sum[0] / points.length, sum[1] / points.length];
}

function Poly({ spec, poly }: { spec: FigureSpec; poly: FigurePoly }) {
  const points = pointList(poly.v.map((name) => at(spec, name)));
  const fill = poly.fill ? (
    <polygon
      points={points}
      className={fillClass(poly.fill)}
      fillOpacity={FILL_OPACITY}
      stroke="none"
    />
  ) : (
    <polygon points={points} fill="transparent" stroke="none" />
  );
  if (poly.region === undefined) return fill;
  return (
    <Region id={poly.region} label={poly.label ?? poly.region}>
      {fill}
    </Region>
  );
}

function PolyOutline({ spec, poly }: { spec: FigureSpec; poly: FigurePoly }) {
  return (
    <polygon
      points={pointList(poly.v.map((name) => at(spec, name)))}
      fill="none"
      strokeWidth={LINE}
      strokeLinejoin="round"
      className={`${strokeClass(poly.tone)} pointer-events-none`}
    />
  );
}

function Ticks({ spec, tick }: { spec: FigureSpec; tick: FigureTick }) {
  return tick.segs.map(([a, b]) => {
    const pa = at(spec, a);
    const pb = at(spec, b);
    const mid = lerp(pa, pb, tick.at ?? 0.5);
    const [ux, uy] = unit(pa, pb);
    return Array.from({ length: tick.count }, (_, i) => {
      const along = (i - (tick.count - 1) / 2) * TICK_GAP;
      const cx = mid[0] + ux * along;
      const cy = mid[1] + uy * along;
      const half = TICK_LENGTH / 2;
      return (
        <line
          key={`${a}${b}${along}`}
          x1={cx - uy * half}
          y1={cy + ux * half}
          x2={cx + uy * half}
          y2={cy - ux * half}
          strokeWidth={MARK_LINE}
          strokeLinecap="round"
          className={strokeClass(tick.tone ?? "blue")}
        />
      );
    });
  });
}

function RightMark({
  spec,
  mark,
}: {
  spec: FigureSpec;
  mark: { at: string; a: string; b: string; tone?: Tone };
}) {
  const v = at(spec, mark.at);
  const [ax, ay] = unit(v, at(spec, mark.a));
  const [bx, by] = unit(v, at(spec, mark.b));
  const s = RIGHT_SIZE;
  const path = `M ${round(v[0] + ax * s)} ${round(v[1] + ay * s)} L ${round(v[0] + (ax + bx) * s)} ${round(v[1] + (ay + by) * s)} L ${round(v[0] + bx * s)} ${round(v[1] + by * s)}`;
  return (
    <path
      d={path}
      fill="none"
      strokeWidth={MARK_LINE}
      strokeLinejoin="miter"
      className={strokeClass(mark.tone ?? "violet")}
    />
  );
}

// Signed turn from direction `from` to direction `to`, within -180 to 180.
function turn(from: number, to: number): number {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta <= -180) delta += 360;
  return delta;
}

function arcPath(
  centre: Pt,
  radius: number,
  fromDeg: number,
  toDeg: number,
): string {
  const start = polar(centre[0], centre[1], radius, fromDeg);
  const end = polar(centre[0], centre[1], radius, toDeg);
  const delta = turn(fromDeg, toDeg);
  const large = Math.abs(delta) > 180 ? 1 : 0;
  const sweep = delta > 0 ? 1 : 0;
  return `M ${round(start[0])} ${round(start[1])} A ${radius} ${radius} 0 ${large} ${sweep} ${round(end[0])} ${round(end[1])}`;
}

// The drawn part of an angle: an arc, or the square of a right angle.
function AngleDrawing({
  spec,
  angle,
}: {
  spec: FigureSpec;
  angle: FigureAngle;
}) {
  const v = at(spec, angle.at);
  const from = directionDeg(v, at(spec, angle.a));
  const to = directionDeg(v, at(spec, angle.b));
  const tone = angle.tone ?? "violet";
  if (angle.right) {
    return (
      <RightMark
        spec={spec}
        mark={{ at: angle.at, a: angle.a, b: angle.b, tone }}
      />
    );
  }
  return (
    <path
      d={arcPath(v, angle.radius ?? ANGLE_RADIUS, from, to)}
      fill="none"
      strokeWidth={MARK_LINE}
      strokeLinecap="round"
      className={strokeClass(tone)}
    />
  );
}

// The measure written beside an angle, on its bisector.
function AngleText({ spec, angle }: { spec: FigureSpec; angle: FigureAngle }) {
  const size = spec.textSize ?? DEFAULT_TEXT_SIZE;
  const v = at(spec, angle.at);
  const from = directionDeg(v, at(spec, angle.a));
  const to = directionDeg(v, at(spec, angle.b));
  const reach = angle.right
    ? RIGHT_SIZE * Math.SQRT2
    : (angle.radius ?? ANGLE_RADIUS);
  const label = polar(
    v[0],
    v[1],
    angle.textDistance ?? reach + ANGLE_TEXT_GAP,
    from + turn(from, to) / 2,
  );
  return (
    <text
      x={label[0]}
      y={label[1]}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      stroke="none"
      className={`${TEXT} ${fillClass(angle.tone ?? "violet")}`}
    >
      {angle.text}
    </text>
  );
}

function CompassArc({ spec, arc }: { spec: FigureSpec; arc: FigureArc }) {
  return (
    <path
      d={arcPath(at(spec, arc.c), arc.r, arc.from, arc.to)}
      fill="none"
      strokeWidth={MARK_LINE}
      strokeLinecap="round"
      strokeDasharray={arc.dash ? DASH : undefined}
      className={strokeClass(arc.tone ?? "teal")}
    />
  );
}

// A flat ruler: a pale bar with a long stroke and a number at every
// centimetre and a short stroke at every half.
function Ruler({ ruler, size }: { ruler: FigureRuler; size: number }) {
  const { x, y, cm, unit } = ruler;
  return (
    <g {...decorative}>
      <rect
        x={x - RULER_MARGIN}
        y={y}
        width={cm * unit + 2 * RULER_MARGIN}
        height={RULER_HEIGHT}
        rx={4}
        className="fill-muted stroke-muted-foreground"
        strokeWidth={1.5}
      />
      {Array.from({ length: cm * 2 + 1 }, (_, i) => {
        const tx = x + (i * unit) / 2;
        const whole = i % 2 === 0;
        return (
          <line
            // biome-ignore lint/suspicious/noArrayIndexKey: ticks never reorder
            key={i}
            x1={tx}
            y1={y}
            x2={tx}
            y2={y + (whole ? 10 : 6)}
            strokeWidth={1.5}
            className="stroke-foreground"
          />
        );
      })}
      {Array.from({ length: cm + 1 }, (_, i) => (
        <text
          // biome-ignore lint/suspicious/noArrayIndexKey: numbers never reorder
          key={i}
          x={x + i * unit}
          y={y + 21}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size}
          stroke="none"
          className="fill-foreground font-heading"
        >
          {i}
        </text>
      ))}
    </g>
  );
}

// The shapes, strokes and writing of a figure as SVG children, so a picture
// can add its own layers around them.
export function FigureLayers({ spec }: { spec: FigureSpec }): ReactNode {
  const middle = centre(spec);
  const size = spec.textSize ?? DEFAULT_TEXT_SIZE;
  return (
    <>
      {spec.ruler && <Ruler ruler={spec.ruler} size={size} />}
      <g {...decorative}>
        {(spec.polys ?? []).map((poly) => (
          <Poly key={poly.v.join("")} spec={spec} poly={poly} />
        ))}
        <g strokeLinecap="round" strokeLinejoin="round">
          {(spec.polys ?? []).map((poly) => (
            <PolyOutline key={poly.v.join("")} spec={spec} poly={poly} />
          ))}
          {(spec.segs ?? []).map((seg) => {
            const a = at(spec, seg.a);
            const b = at(spec, seg.b);
            return (
              <line
                key={`${seg.a}${seg.b}`}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                strokeWidth={seg.bold ? LINE + 1.5 : LINE}
                strokeDasharray={seg.dash ? DASH : undefined}
                className={`${strokeClass(seg.tone)} pointer-events-none`}
              />
            );
          })}
        </g>
        {(spec.arcs ?? []).map((arc) => (
          <CompassArc
            key={`${arc.c}${arc.from}${arc.to}`}
            spec={spec}
            arc={arc}
          />
        ))}
        {(spec.angles ?? []).map((angle) => (
          <AngleDrawing
            key={`${angle.at}${angle.a}${angle.b}`}
            spec={spec}
            angle={angle}
          />
        ))}
        {(spec.rights ?? []).map((mark) => (
          <RightMark
            key={`${mark.at}${mark.a}${mark.b}`}
            spec={spec}
            mark={mark}
          />
        ))}
        {(spec.ticks ?? []).map((tick) => (
          <Ticks
            key={tick.segs.map((s) => s.join("")).join("-")}
            spec={spec}
            tick={tick}
          />
        ))}
        {(spec.dots ?? []).map((name) => {
          const p = at(spec, name);
          return (
            <circle
              key={name}
              cx={p[0]}
              cy={p[1]}
              r={4.5}
              className="fill-foreground"
              stroke="none"
            />
          );
        })}
      </g>
      {(spec.angles ?? []).map((angle) =>
        angle.text === undefined ? null : (
          <AngleText
            key={`${angle.at}${angle.a}${angle.b}`}
            spec={spec}
            angle={angle}
          />
        ),
      )}
      {(spec.names ?? []).map((name) => {
        const p = at(spec, name);
        const [ox, oy] = unit(middle, p);
        // A lone point has no outward side: its name goes below and left.
        const [ux, uy] = ox === 0 && oy === 0 ? ALONE_DIRECTION : [ox, oy];
        const shift = spec.nameShift?.[name] ?? [0, 0];
        return (
          <text
            key={name}
            x={p[0] + ux * NAME_GAP + shift[0]}
            y={p[1] + uy * NAME_GAP + shift[1]}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={size}
            stroke="none"
            className={`${TEXT} fill-foreground`}
          >
            {name}
          </text>
        );
      })}
      {(spec.texts ?? []).map((t) => (
        <text
          key={`${t.x}${t.y}${t.text}`}
          x={t.x}
          y={t.y}
          textAnchor={t.anchor ?? "middle"}
          dominantBaseline="central"
          fontSize={size}
          stroke="none"
          className={`${TEXT} ${fillClass(t.tone)}`}
        >
          {t.text}
        </text>
      ))}
    </>
  );
}

// A still figure, or the same figure with tappable regions when a `tapRegion`
// exercise provides them.
export function Figure({
  spec,
  maxHeight,
}: {
  spec: FigureSpec;
  // Caps the drawing's height in pixels (the drawing keeps its proportions).
  maxHeight?: number;
}) {
  return (
    <div
      className="mx-auto w-full"
      style={{
        maxWidth: spec.w * (spec.maxScale ?? MAX_SCALE),
        ...(maxHeight === undefined ? {} : { maxHeight }),
      }}
    >
      <RegionSvg
        label={spec.label}
        viewBox={`0 0 ${spec.w} ${spec.h}`}
        className="h-auto max-h-[inherit] w-full"
      >
        <FigureLayers spec={spec} />
      </RegionSvg>
    </div>
  );
}

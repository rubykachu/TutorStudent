import type { FigureSpec, Pt, Tone } from "./figure-spec";
import { directionDeg, lerp, polar, unit } from "./geometry";

// What a "chạm để đo" picture is made of: a figure and a list of parts the
// child taps one by one; each tapped part shows its measure (a segment its
// length, an angle its degrees) or is coloured in (a region), until all are
// done. Pure data and drawing, no React.

export type ProbePart =
  // A segment between two points of the figure; `text` is what it measures.
  | {
      kind: "seg";
      a: string;
      b: string;
      text: string;
      label: string;
      tone: Tone;
      // Where along the segment its "?" and its measure stand, 0 to 1
      // (default: the middle). Segments crossing at their middles need it.
      at?: number;
      // Where its measure is written, when beside the segment is no place
      // for it (segments that cross).
      textAt?: Pt;
    }
  // The angle at `at` between the directions to `a` and `b`.
  | {
      kind: "angle";
      at: string;
      a: string;
      b: string;
      text: string;
      label: string;
      tone: Tone;
      // Drawn as a right-angle square instead of an arc.
      right?: boolean;
    }
  // A region (a polygon named by its corners) that is coloured in when tapped.
  | { kind: "poly"; v: readonly string[]; label: string; tone: Tone }
  // A button under the figure that outlines the whole figure (`whole`).
  | { kind: "chip"; label: string; tone: Tone };

export type ProbeSpec = {
  figure: FigureSpec;
  parts: readonly ProbePart[];
  // Corners of the outline a "chip" part draws.
  whole?: readonly string[];
  // The word in the progress line: "Đã đo 2/4", "Đã tô 3/5".
  verb: string;
  // Closing line once every part is done.
  done: string;
};

// A measure written beside a segment stands this far (plus half its own
// size, along the segment's normal) from the segment.
const LABEL_GAP = 6;
const CHAR_HALF_WIDTH = 4.7;
const TEXT_HALF_HEIGHT = 8.5;
const RIGHT_REACH = 18;
const ANGLE_BUBBLE = 27;
const ANGLE_ARC = 25;

function centreOf(figure: FigureSpec): Pt {
  const points = Object.values(figure.pts);
  return [
    points.reduce((sum, p) => sum + p[0], 0) / points.length,
    points.reduce((sum, p) => sum + p[1], 0) / points.length,
  ];
}

function point(figure: FigureSpec, name: string): Pt {
  const p = figure.pts[name];
  if (!p)
    throw new Error(`Probe figure "${figure.label}" has no point "${name}"`);
  return p;
}

function turn(from: number, to: number): number {
  let delta = (to - from) % 360;
  if (delta > 180) delta -= 360;
  if (delta <= -180) delta += 360;
  return delta;
}

// Where an angle part's "?" bubble stands: inside the angle, on its bisector.
export function angleBubble(
  figure: FigureSpec,
  part: Extract<ProbePart, { kind: "angle" }>,
): Pt {
  const v = point(figure, part.at);
  const from = directionDeg(v, point(figure, part.a));
  const to = directionDeg(v, point(figure, part.b));
  return polar(v[0], v[1], ANGLE_BUBBLE, from + turn(from, to) / 2);
}

// Where a part's "?" bubble stands, or undefined for a button part.
export function bubbleOf(figure: FigureSpec, part: ProbePart): Pt | undefined {
  switch (part.kind) {
    case "seg":
      return lerp(point(figure, part.a), point(figure, part.b), part.at ?? 0.5);
    case "angle":
      return angleBubble(figure, part);
    case "poly": {
      const corners = part.v.map((name) => point(figure, name));
      return [
        corners.reduce((sum, p) => sum + p[0], 0) / corners.length,
        corners.reduce((sum, p) => sum + p[1], 0) / corners.length,
      ];
    }
    case "chip":
      return undefined;
  }
}

// Puts `item` in `list`, in the place of the entry that already draws the same
// thing: a segment or polygon the figure already has is restyled, never drawn
// twice (two elements of one drawing must not share a React key).
function put<T>(list: T[], item: T, same: (other: T) => boolean): void {
  const at = list.findIndex(same);
  if (at < 0) list.push(item);
  else list[at] = item;
}

// The figure with every part marked `done` shown as measured.
export function probeFigure(
  spec: ProbeSpec,
  done: readonly boolean[],
): FigureSpec {
  const { figure } = spec;
  const middle = centreOf(figure);
  const segs = [...(figure.segs ?? [])];
  const angles = [...(figure.angles ?? [])];
  const polys = [...(figure.polys ?? [])];
  const texts = [...(figure.texts ?? [])];
  spec.parts.forEach((part, i) => {
    if (!done[i]) return;
    switch (part.kind) {
      case "seg": {
        put(
          segs,
          { a: part.a, b: part.b, tone: part.tone, bold: true },
          (seg) =>
            (seg.a === part.a && seg.b === part.b) ||
            (seg.a === part.b && seg.b === part.a),
        );
        const from = point(figure, part.a);
        const to = point(figure, part.b);
        const spot = lerp(from, to, part.at ?? 0.5);
        const [dx, dy] = unit(from, to);
        // The measure stands beside the segment, on the side away from the
        // middle of the figure (above, when both sides are as far).
        const sides: Pt[] = [
          [-dy, dx],
          [dy, -dx],
        ];
        const away = (n: Pt) =>
          Math.hypot(spot[0] + n[0] - middle[0], spot[1] + n[1] - middle[1]);
        const [first, second] = sides as [Pt, Pt];
        const farther =
          Math.abs(away(first) - away(second)) < 0.5
            ? first[1] < second[1]
              ? first
              : second
            : away(first) > away(second)
              ? first
              : second;
        const push =
          part.text.length * CHAR_HALF_WIDTH * Math.abs(farther[0]) +
          TEXT_HALF_HEIGHT * Math.abs(farther[1]) +
          LABEL_GAP;
        texts.push({
          x: part.textAt?.[0] ?? spot[0] + farther[0] * push,
          y: part.textAt?.[1] ?? spot[1] + farther[1] * push,
          text: part.text,
          tone: part.tone,
        });
        break;
      }
      case "angle":
        angles.push({
          at: part.at,
          a: part.a,
          b: part.b,
          text: part.text,
          tone: part.tone,
          radius: ANGLE_ARC,
          textDistance:
            (part.right ? RIGHT_REACH : ANGLE_ARC) +
            10 +
            part.text.length * 2 * CHAR_HALF_WIDTH * 0.6,
          ...(part.right ? { right: true } : {}),
        });
        break;
      case "poly":
        put(
          polys,
          { v: part.v, tone: part.tone, fill: part.tone },
          (poly) => poly.v.join("") === part.v.join(""),
        );
        break;
      case "chip":
        if (spec.whole) {
          const whole = spec.whole;
          put(
            polys,
            { v: whole, tone: part.tone, fill: part.tone },
            (poly) => poly.v.join("") === whole.join(""),
          );
        }
        break;
    }
  });
  return { ...figure, segs, angles, polys, texts };
}

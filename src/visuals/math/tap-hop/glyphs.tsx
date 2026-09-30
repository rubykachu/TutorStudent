import { decorative } from "@/visuals/shared/markers";

// Hand-drawn outlines of the marks the lesson teaches, as SVG paths in one
// 120 x 160 box. The same paths draw the big glyph of a symbol card, the tiles
// of the "tap the mark" questions, the inline marks of a line of maths and the
// strokes the child traces, so a mark looks the same everywhere.

export const GLYPH_WIDTH = 120;
export const GLYPH_HEIGHT = 160;

// One pen movement. Strokes are listed in writing order.
export type Stroke = {
  d: string;
  // A dot is a one-point stroke drawn with a fat round cap.
  dot?: boolean;
  // Where the numbered start dot sits, beside the start so it never covers the
  // ink; by default behind the start, on the line the pen arrives along.
  badge?: readonly [number, number];
  // Number of evenly spaced guide dots along the stroke, for a stroke that
  // doubles back (a point), so one dot lands exactly on the point instead of
  // two meeting beside it.
  guideSteps?: number;
};

export type GlyphKey =
  | "ngoac-tron-mo"
  | "ngoac-vuong-mo"
  | "ngoac-nhon-mo"
  | "ngoac-nhon-dong"
  | "ngoac-tron-dong"
  | "phay"
  | "cham"
  | "cham-phay"
  | "hai-cham"
  | "thuoc"
  | "khong-thuoc"
  | "bang"
  | "nho-hon";

export type GlyphDef = {
  // Spoken name, also the label of a tappable tile.
  label: string;
  strokes: readonly Stroke[];
  // Horizontal extent of the ink, so an inline mark is not padded by the box.
  crop: readonly [number, number];
};

export const STROKE_WIDTH = 9;
export const DOT_WIDTH = 22;

// Mirrors a path made of absolute M/L/C commands across the box's middle.
function mirror(d: string): string {
  let index = 0;
  return d.replace(/-?\d+(\.\d+)?/g, (n) =>
    index++ % 2 === 0 ? String(GLYPH_WIDTH - Number(n)) : n,
  );
}

function mirrorStroke(stroke: Stroke): Stroke {
  return {
    ...stroke,
    d: mirror(stroke.d),
    badge: stroke.badge && [GLYPH_WIDTH - stroke.badge[0], stroke.badge[1]],
  };
}

// "{": the top hook down the spine, the point on the left, the lower hook.
const OPEN_BRACE: readonly Stroke[] = [
  { d: "M 92 14 C 70 14 62 24 62 42 L 62 62" },
  {
    d: "M 62 62 C 62 70 54 74 34 80 C 54 86 62 90 62 98",
    badge: [90, 62],
    guideSteps: 8,
  },
  { d: "M 62 98 L 62 118 C 62 136 70 146 92 146", badge: [90, 98] },
];

// "∈" and "∉" share the C and the bar; "∉" adds the slash.
const MEMBER: readonly Stroke[] = [
  { d: "M 88 44 C 70 28 30 32 30 80 C 30 128 70 132 88 116" },
  { d: "M 30 80 L 96 80" },
];

export const GLYPHS: Readonly<Record<GlyphKey, GlyphDef>> = {
  "ngoac-tron-mo": {
    label: "Mở ngoặc tròn",
    strokes: [{ d: "M 84 14 C 40 50 40 110 84 146" }],
    crop: [32, 92],
  },
  "ngoac-vuong-mo": {
    label: "Mở ngoặc vuông",
    strokes: [{ d: "M 84 16 L 44 16 L 44 144 L 84 144" }],
    crop: [34, 92],
  },
  "ngoac-nhon-mo": {
    label: "Mở ngoặc nhọn",
    strokes: OPEN_BRACE,
    crop: [26, 98],
  },
  "ngoac-nhon-dong": {
    label: "Đóng ngoặc nhọn",
    strokes: OPEN_BRACE.map(mirrorStroke),
    crop: [22, 94],
  },
  "ngoac-tron-dong": {
    label: "Đóng ngoặc tròn",
    strokes: [{ d: "M 36 14 C 80 50 80 110 36 146" }],
    crop: [28, 88],
  },
  phay: {
    label: "Dấu phẩy",
    strokes: [{ d: "M 60 116 C 69 118 68 136 48 152" }],
    crop: [38, 76],
  },
  cham: {
    label: "Dấu chấm",
    strokes: [{ d: "M 60 132 L 60 133", dot: true }],
    crop: [44, 76],
  },
  "cham-phay": {
    label: "Dấu chấm phẩy",
    strokes: [
      { d: "M 60 62 L 60 63", dot: true, badge: [26, 62] },
      { d: "M 60 104 C 69 106 68 126 48 144" },
    ],
    crop: [38, 76],
  },
  "hai-cham": {
    label: "Dấu hai chấm",
    strokes: [
      { d: "M 60 62 L 60 63", dot: true },
      { d: "M 60 122 L 60 123", dot: true },
    ],
    crop: [44, 76],
  },
  thuoc: {
    label: "Dấu ∈",
    strokes: MEMBER,
    crop: [22, 102],
  },
  "khong-thuoc": {
    label: "Dấu ∉",
    strokes: [...MEMBER, { d: "M 102 8 L 42 142", badge: [124, 8] }],
    crop: [22, 108],
  },
  bang: {
    label: "Dấu bằng",
    strokes: [{ d: "M 28 62 L 92 62" }, { d: "M 28 98 L 92 98" }],
    crop: [22, 98],
  },
  "nho-hon": {
    label: "Dấu nhỏ hơn",
    strokes: [{ d: "M 92 40 L 30 80 L 92 120" }],
    crop: [24, 98],
  },
};

// Marks the child learns to draw, by the symbol a stroke visual teaches.
export type TraceSymbol =
  | "ngoac-mo"
  | "ngoac-dong"
  | "cham-phay"
  | "thuoc"
  | "khong-thuoc";

export const TRACE_GLYPH: Readonly<Record<TraceSymbol, GlyphKey>> = {
  "ngoac-mo": "ngoac-nhon-mo",
  "ngoac-dong": "ngoac-nhon-dong",
  "cham-phay": "cham-phay",
  thuoc: "thuoc",
  "khong-thuoc": "khong-thuoc",
};

export function strokeWidth(stroke: Stroke): number {
  return stroke.dot ? DOT_WIDTH : STROKE_WIDTH;
}

// Start point of a stroke and the direction its pen leaves in (radians), read
// from its first command.
export function strokeStart(stroke: Stroke): {
  x: number;
  y: number;
  angle: number;
} {
  const n = stroke.d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const [x = 0, y = 0, nx = 0, ny = 0] = n;
  return { x, y, angle: Math.atan2(ny - y, nx - x) };
}

type PathsProps = {
  name: GlyphKey;
  className?: string;
  // Multiplies the pen width, for a mark drawn small.
  thickness?: number;
};

// The ink of a mark, in box units. Shapes carry their own stroke, so a mark
// inside a tappable region keeps its width instead of taking the region's
// ring (hence the inline vector-effect, which beats the region's rule).
export function GlyphPaths({
  name,
  className = "stroke-foreground",
  thickness = 1,
}: PathsProps) {
  return (
    <g {...decorative} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[name].strokes.map((stroke) => (
        <path
          key={stroke.d}
          d={stroke.d}
          className={className}
          strokeWidth={strokeWidth(stroke) * thickness}
          style={{ vectorEffect: "none" }}
        />
      ))}
    </g>
  );
}

type GlyphProps = PathsProps & {
  // Sizes the mark by height; its width follows the ink.
  sizeClass?: string;
};

// A mark on its own, sized by its height so it sits in a line next to text.
export function Glyph({
  name,
  className,
  sizeClass = "h-12 md:h-14",
}: GlyphProps) {
  const { label, crop } = GLYPHS[name];
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`${crop[0]} 0 ${crop[1] - crop[0]} ${GLYPH_HEIGHT}`}
      className={`${sizeClass} w-auto shrink-0`}
    >
      <GlyphPaths name={name} className={className} />
    </svg>
  );
}

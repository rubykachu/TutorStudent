import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const MEDAL = { x: 50, y: 44, r: 27 } as const;
// Two upright bars read as the numeral II of the chapter.
const BAR = { width: 6, height: 26, gap: 8 } as const;
const BARS = [-1, 1].map((side) => ({
  id: side,
  x: MEDAL.x + side * (BAR.gap / 2 + BAR.width / 2) - BAR.width / 2,
}));
// One dot per lesson of the chapter, in the colours of its main concept.
const DOTS = [
  { id: "uoc", color: "violet", cx: 18, cy: 30 },
  { id: "tan-cung", color: "teal", cx: 30, cy: 12 },
  { id: "nguyen-to", color: "sky", cx: 50, cy: 7 },
  { id: "uclnn", color: "amber", cx: 70, cy: 12 },
  { id: "quy-dong", color: "blue", cx: 82, cy: 30 },
] as const;

// Lesson sticker: a gold medal with the numeral II on two ribbons, ringed by
// five dots, one for each lesson of the chapter.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy chương chương hai: chữ số La Mã II trên huy chương, xung quanh có năm chấm màu"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <polygon
          points="36,62 50,62 46,94 38,86 29,90"
          className="fill-concept-blue stroke-surface"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <polygon
          points="50,62 64,62 71,90 62,86 54,94"
          className="fill-concept-violet stroke-surface"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <circle
          cx={MEDAL.x}
          cy={MEDAL.y}
          r={MEDAL.r}
          className="fill-concept-amber stroke-surface"
          strokeWidth={3}
        />
        <circle cx={MEDAL.x} cy={MEDAL.y} r={19} className="fill-surface" />
        {BARS.map(({ id, x }) => (
          <rect
            key={id}
            x={x}
            y={MEDAL.y - BAR.height / 2}
            width={BAR.width}
            height={BAR.height}
            rx={1.5}
            className="fill-concept-sky"
          />
        ))}
        {DOTS.map(({ id, color, cx, cy }) => (
          <ConceptShape
            key={id}
            color={color}
            cx={cx}
            cy={cy}
            r={5}
            className="stroke-surface"
          />
        ))}
      </g>
    </svg>
  );
}

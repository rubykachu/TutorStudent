import { decorative } from "@/visuals/shared/markers";
import { pointList } from "@/visuals/shared/plane/figure";
import type { Pt } from "@/visuals/shared/plane/figure-spec";

// Lesson sticker: a round badge with the four shapes of the lesson, a teal
// rectangle, a pink rhombus, a lime parallelogram and a sky trapezoid.
const SHAPES: readonly { points: readonly Pt[]; className: string }[] = [
  {
    points: [
      [20, 24],
      [46, 24],
      [46, 42],
      [20, 42],
    ],
    className: "fill-concept-teal",
  },
  {
    points: [
      [73, 22],
      [84, 33],
      [73, 44],
      [62, 33],
    ],
    className: "fill-concept-pink",
  },
  {
    points: [
      [26, 58],
      [48, 58],
      [42, 76],
      [20, 76],
    ],
    className: "fill-concept-lime",
  },
  {
    points: [
      [64, 58],
      [80, 58],
      [86, 76],
      [58, 76],
    ],
    className: "fill-concept-sky",
  },
];

export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu bốn hình: hình chữ nhật, hình thoi, hình bình hành và hình thang cân"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <circle
          cx={50}
          cy={50}
          r={40}
          className="fill-surface stroke-concept-teal"
          strokeWidth={3}
        />
        {SHAPES.map((shape) => (
          <polygon
            key={shape.className}
            points={pointList(shape.points)}
            className={`${shape.className} stroke-foreground`}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        ))}
      </g>
    </svg>
  );
}

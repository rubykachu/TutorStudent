import { decorative } from "@/visuals/shared/markers";
import { pointList } from "@/visuals/shared/plane/figure";
import type { Pt } from "@/visuals/shared/plane/figure-spec";

// Lesson sticker: a round badge with the two shapes of the lesson, a lime parallelogram and a sky trapezoid.
const SHAPES: readonly { points: readonly Pt[]; className: string }[] = [
  {
    points: [
      [24, 36],
      [52, 36],
      [44, 64],
      [16, 64],
    ],
    className: "fill-concept-lime",
  },
  {
    points: [
      [65, 38],
      [79, 38],
      [84, 62],
      [60, 62],
    ],
    className: "fill-concept-sky",
  },
];

export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu hai hình: hình bình hành và hình thang cân"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <circle
          cx={50}
          cy={50}
          r={40}
          className="fill-surface stroke-concept-lime"
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

import { decorative } from "@/visuals/shared/markers";
import { pointList } from "@/visuals/shared/plane/figure";
import { regularPoints } from "@/visuals/shared/plane/geometry";

const CENTRE = 50;

// Lesson sticker: a round badge with a regular hexagon; inside it a teal
// triangle and a pink square, the three regular shapes of the lesson.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu ba hình, trong hình lục giác đều có hình tam giác đều và hình vuông"
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
        <polygon
          points={pointList(regularPoints(6, CENTRE, CENTRE, 31, 0))}
          fill="none"
          className="stroke-concept-lime"
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <polygon
          points={pointList(regularPoints(3, 41, 53, 13, -90))}
          className="fill-concept-teal stroke-surface"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <polygon
          points={pointList(regularPoints(4, 61, 53, 11, -135))}
          className="fill-concept-pink stroke-surface"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

import { shapeOutline, toPoints } from "@/visuals/shared/concept";
import { decorative } from "@/visuals/shared/markers";

// Centre, radius and tilt of each star coming out of the box.
const STARS = [
  { cx: 30, cy: 34, r: 9, tilt: -15 },
  { cx: 50, cy: 20, r: 11, tilt: 8 },
  { cx: 70, cy: 34, r: 9, tilt: 18 },
] as const;

// Lesson sticker: a teal box with its lid tipped open and three amber stars
// coming out.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Chiếc hộp tập hợp với ba ngôi sao bay ra"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        {STARS.map(({ cx, cy, r, tilt }) => (
          <polygon
            key={cx}
            points={toPoints(shapeOutline("star", r), cx, cy)}
            transform={`rotate(${tilt} ${cx} ${cy})`}
            className="fill-concept-amber stroke-surface"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        ))}
        <rect
          x={24}
          y={50}
          width={52}
          height={32}
          rx={4}
          className="fill-concept-teal stroke-surface"
          strokeWidth={1.5}
        />
        <rect
          x={20}
          y={42}
          width={60}
          height={10}
          rx={4}
          transform="rotate(-8 50 47)"
          className="fill-concept-teal stroke-surface"
          strokeWidth={1.5}
        />
        <circle cx={50} cy={66} r={4} className="fill-surface" />
      </g>
    </svg>
  );
}

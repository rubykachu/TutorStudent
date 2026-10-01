import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const COLUMN = 12.5;
const LEFT = 19.5;
const TOP_Y = 40;
const BOTTOM_Y = 60;
// Two rows of marks over the same six places: the top row every 2 places,
// the bottom row every 3. Only place 6 has a mark in both rows.
const TOP = [2, 4, 6] as const;
const BOTTOM = [3, 6] as const;
const MEET = 6;

function xOf(place: number): number {
  return LEFT + (place - 1) * COLUMN;
}

// Lesson sticker: two rows of marks that repeat at different paces and line
// up for the first time under a star.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu hai hàng dấu lặp lại nhịp khác nhau, gặp nhau lần đầu dưới một ngôi sao"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <rect
          x={9}
          y={24}
          width={82}
          height={52}
          rx={10}
          className="fill-surface stroke-concept-violet"
          strokeWidth={2.5}
        />
        <line
          x1={xOf(MEET)}
          x2={xOf(MEET)}
          y1={30}
          y2={70}
          className="stroke-concept-lime"
          strokeWidth={2}
          strokeDasharray="3 2"
        />
        {TOP.map((place) => (
          <ConceptShape
            key={`top-${place}`}
            color="sky"
            cx={xOf(place)}
            cy={TOP_Y}
            r={6}
          />
        ))}
        {BOTTOM.map((place) => (
          <ConceptShape
            key={`bottom-${place}`}
            color="amber"
            cx={xOf(place)}
            cy={BOTTOM_Y}
            r={6}
          />
        ))}
        <ConceptShape
          color="pink"
          cx={xOf(MEET)}
          cy={(TOP_Y + BOTTOM_Y) / 2}
          r={8}
          className="stroke-surface"
          strokeWidth={2}
        />
      </g>
    </svg>
  );
}

import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const MEDAL = { x: 50, y: 44, r: 27 } as const;
// The seven squares of the face in one row: seven can only be laid out as a
// single row, the picture of a prime.
const SQUARE = 5.5;
const GAP = 1.2;
const ROW_WIDTH = 7 * SQUARE + 6 * GAP;
const SQUARES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  x: MEDAL.x - ROW_WIDTH / 2 + i * (SQUARE + GAP),
}));

// Lesson sticker: a gold medal on two ribbons whose face shows seven squares
// in a single row, with prime marks around it.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy chương số nguyên tố, mặt huy chương có bảy ô vuông xếp một hàng"
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
        <rect
          x={MEDAL.x - ROW_WIDTH / 2 - 3}
          y={MEDAL.y - SQUARE / 2 - 3}
          width={ROW_WIDTH + 6}
          height={SQUARE + 6}
          rx={3}
          className="fill-surface"
        />
        {SQUARES.map(({ id, x }) => (
          <rect
            key={id}
            x={x}
            y={MEDAL.y - SQUARE / 2}
            width={SQUARE}
            height={SQUARE}
            rx={1}
            className="fill-concept-sky"
          />
        ))}
        <ConceptShape
          color="sky"
          cx={24}
          cy={24}
          r={7}
          className="stroke-surface"
        />
        <ConceptShape
          color="sky"
          cx={76}
          cy={24}
          r={7}
          className="stroke-surface"
        />
        <ConceptShape
          color="sky"
          cx={50}
          cy={10}
          r={6}
          className="stroke-surface"
        />
      </g>
    </svg>
  );
}

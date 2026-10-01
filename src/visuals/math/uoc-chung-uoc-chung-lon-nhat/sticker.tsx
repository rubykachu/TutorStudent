import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const UNIT = 3.2;
const GAP = 1.4;
const STRIP_HEIGHT = 12;
const PIECE = 3;
const PIECE_WIDTH = PIECE * UNIT;
// Two ribbons of 12 and 18 units, both cut into pieces of 3.
const ROWS = [
  { y: 30, pieces: 4 },
  { y: 50, pieces: 6 },
] as const;

// Every piece with the centres of its dots, keyed by ribbon and place.
const PIECES = ROWS.flatMap(({ y, pieces }) => {
  const width = pieces * PIECE_WIDTH + (pieces - 1) * GAP;
  const left = 50 - width / 2;
  return Array.from({ length: pieces }, (_, place) => {
    const x = left + place * (PIECE_WIDTH + GAP);
    return {
      key: `${y}-${x.toFixed(1)}`,
      x,
      y,
      dots: Array.from({ length: PIECE }, (_, dot) => ({
        key: dot * UNIT,
        cx: x + dot * UNIT + UNIT / 2,
      })),
    };
  });
});

// Lesson sticker: two ribbons of different lengths cut into equal pieces of
// the same size under a star, each ribbon fitting exactly.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu hai dải băng dài ngắn khác nhau cắt thành các đoạn bằng nhau"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <rect
          x={10}
          y={20}
          width={80}
          height={52}
          rx={10}
          className="fill-surface stroke-concept-violet"
          strokeWidth={2.5}
        />
        {PIECES.map(({ key, x, y, dots }) => (
          <g key={key}>
            <rect
              x={x}
              y={y}
              width={PIECE_WIDTH}
              height={STRIP_HEIGHT}
              rx={3}
              className="fill-concept-blue/25 stroke-concept-blue"
              strokeWidth={1}
            />
            {dots.map((dot) => (
              <circle
                key={dot.key}
                cx={dot.cx}
                cy={y + STRIP_HEIGHT / 2}
                r={1.1}
                className="fill-concept-blue"
              />
            ))}
          </g>
        ))}
        <ConceptShape
          color="amber"
          cx={50}
          cy={87}
          r={9}
          className="stroke-surface"
          strokeWidth={2}
        />
        <ConceptShape
          color="teal"
          cx={22}
          cy={85}
          r={6}
          className="stroke-surface"
        />
        <ConceptShape
          color="teal"
          cx={78}
          cy={85}
          r={6}
          className="stroke-surface"
        />
      </g>
    </svg>
  );
}

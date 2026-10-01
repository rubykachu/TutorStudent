import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const MEDAL = { x: 50, y: 44, r: 27 } as const;
// The four digit tiles of the face, two by two.
const TILE = 15;
const TILES = [
  { digit: 2, x: 34.5, y: 28.5 },
  { digit: 3, x: 50.5, y: 28.5 },
  { digit: 5, x: 34.5, y: 44.5 },
  { digit: 9, x: 50.5, y: 44.5 },
] as const;

// Lesson sticker: a gold medal on two ribbons with four digit tiles 2, 3, 5, 9
// on its face.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy chương dấu hiệu chia hết, có bốn chữ số 2, 3, 5, 9"
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
        {TILES.map(({ digit, x, y }) => (
          <rect
            key={digit}
            x={x}
            y={y}
            width={TILE}
            height={TILE}
            rx={3}
            className="fill-surface"
          />
        ))}
        <ConceptShape
          color="teal"
          cx={24}
          cy={24}
          r={7}
          className="stroke-surface"
        />
        <ConceptShape
          color="teal"
          cx={76}
          cy={24}
          r={7}
          className="stroke-surface"
        />
        <ConceptShape
          color="teal"
          cx={50}
          cy={10}
          r={6}
          className="stroke-surface"
        />
      </g>
      {TILES.map(({ digit, x, y }) => (
        <text
          key={digit}
          x={x + TILE / 2}
          y={y + TILE / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={13}
          fontWeight={700}
          className="fill-foreground"
        >
          {digit}
        </text>
      ))}
    </svg>
  );
}

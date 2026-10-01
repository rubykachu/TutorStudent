import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const MEDAL = { x: 50, y: 44, r: 27 } as const;
// The four tiles of the face, two by two, each marked with a dot.
const TILE = 15;
const TILES = [
  { id: 1, x: 34.5, y: 28.5 },
  { id: 2, x: 50.5, y: 28.5 },
  { id: 3, x: 34.5, y: 44.5 },
  { id: 4, x: 50.5, y: 44.5 },
] as const;

// Lesson sticker: a gold medal on two ribbons with four number tiles on its
// face.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy chương dấu hiệu chia hết, có bốn ô số"
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
        {TILES.map(({ id, x, y }) => (
          <rect
            key={id}
            x={x}
            y={y}
            width={TILE}
            height={TILE}
            rx={3}
            className="fill-surface"
          />
        ))}
        {TILES.map(({ id, x, y }) => (
          <circle
            key={id}
            cx={x + TILE / 2}
            cy={y + TILE / 2}
            r={3}
            className="fill-concept-teal"
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
    </svg>
  );
}

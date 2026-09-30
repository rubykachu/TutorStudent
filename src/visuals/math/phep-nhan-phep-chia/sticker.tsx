import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const MEDAL = { x: 50, y: 44, r: 27 } as const;
const DOT_RADIUS = 4;

// Lesson sticker: a gold medal on two ribbons, with the multiplication dot
// and the division colon on its face.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy chương nhà vô địch nhân chia, có dấu nhân và dấu chia"
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
        <circle
          cx={MEDAL.x}
          cy={MEDAL.y}
          r={MEDAL.r - 6}
          className="fill-none stroke-surface"
          strokeWidth={2}
        />
        <circle cx={40} cy={MEDAL.y} r={DOT_RADIUS} className="fill-surface" />
        <circle
          cx={60}
          cy={MEDAL.y - 8}
          r={DOT_RADIUS}
          className="fill-surface"
        />
        <circle
          cx={60}
          cy={MEDAL.y + 8}
          r={DOT_RADIUS}
          className="fill-surface"
        />
        <ConceptShape
          color="lime"
          cx={24}
          cy={24}
          r={7}
          className="stroke-surface"
        />
        <ConceptShape
          color="lime"
          cx={76}
          cy={24}
          r={7}
          className="stroke-surface"
        />
        <ConceptShape
          color="lime"
          cx={50}
          cy={10}
          r={6}
          className="stroke-surface"
        />
      </g>
    </svg>
  );
}

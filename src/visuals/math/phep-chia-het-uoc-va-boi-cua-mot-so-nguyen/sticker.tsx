import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const CENTRE = 50;

// Lesson sticker: a round badge with a division sign (a bar between two
// dots) in the middle; a lime star (positive) above and a pink diamond
// (negative) below, the two signs a quotient can take.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu phép chia số nguyên, dấu chia có một ngôi sao ở trên và một hình thoi ở dưới"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <circle
          cx={50}
          cy={50}
          r={40}
          className="fill-surface stroke-concept-amber"
          strokeWidth={3}
        />
        <line
          x1={CENTRE - 20}
          y1={CENTRE}
          x2={CENTRE + 20}
          y2={CENTRE}
          className="stroke-foreground"
          strokeWidth={5}
          strokeLinecap="round"
        />
        <circle
          cx={CENTRE}
          cy={CENTRE - 13}
          r={5}
          className="fill-foreground"
        />
        <circle
          cx={CENTRE}
          cy={CENTRE + 13}
          r={5}
          className="fill-foreground"
        />
        <ConceptShape
          color="lime"
          cx={CENTRE - 22}
          cy={CENTRE - 22}
          r={7}
          className="stroke-surface"
        />
        <ConceptShape
          color="pink"
          cx={CENTRE + 22}
          cy={CENTRE + 22}
          r={7}
          className="stroke-surface"
        />
      </g>
    </svg>
  );
}

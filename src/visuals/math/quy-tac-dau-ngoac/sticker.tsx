import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const CENTRE = 50;

// Lesson sticker: a round badge with a pair of brackets; inside, a lime plus
// turns into a pink minus (and back) along one curved arrow, the sign flip of
// a bracket with a minus before it.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu quy tắc dấu ngoặc, trong cặp ngoặc dấu cộng đổi thành dấu trừ"
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
        <path
          d="M 33 28 Q 21 50 33 72"
          fill="none"
          className="stroke-foreground"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M 67 28 Q 79 50 67 72"
          fill="none"
          className="stroke-foreground"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <g
          className="stroke-concept-lime"
          strokeWidth={4}
          strokeLinecap="round"
        >
          <line x1={CENTRE - 17} y1={42} x2={CENTRE - 5} y2={42} />
          <line x1={CENTRE - 11} y1={36} x2={CENTRE - 11} y2={48} />
        </g>
        <line
          x1={CENTRE + 5}
          y1={42}
          x2={CENTRE + 17}
          y2={42}
          className="stroke-concept-pink"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M 36 58 Q 50 70 64 58"
          fill="none"
          className="stroke-concept-violet"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polygon points="64,58 55,57 59,66" className="fill-concept-violet" />
        <ConceptShape
          color="amber"
          cx={CENTRE}
          cy={80}
          r={4}
          className="stroke-surface"
        />
      </g>
    </svg>
  );
}

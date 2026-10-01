import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

// Lesson sticker: a gold medal on two ribbons, a number written with three
// digit tiles on its face and a Roman numeral below.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy chương ghi số, có ba chữ số và một số La Mã"
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
          cx={50}
          cy={44}
          r={27}
          className="fill-concept-amber stroke-surface"
          strokeWidth={3}
        />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={30 + i * 14}
            y={31}
            width={12}
            height={18}
            rx={3}
            className="fill-surface"
          />
        ))}
        <text
          x={36}
          y={44}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          className="fill-concept-blue font-heading"
        >
          2
        </text>
        <text
          x={50}
          y={44}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          className="fill-concept-blue font-heading"
        >
          0
        </text>
        <text
          x={64}
          y={44}
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          className="fill-concept-blue font-heading"
        >
          6
        </text>
        <text
          x={50}
          y={59}
          textAnchor="middle"
          fontSize={9}
          fontWeight={700}
          className="fill-surface font-heading"
        >
          XXVI
        </text>
        <ConceptShape
          color="blue"
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
          color="violet"
          cx={50}
          cy={10}
          r={6}
          className="stroke-surface"
        />
      </g>
    </svg>
  );
}

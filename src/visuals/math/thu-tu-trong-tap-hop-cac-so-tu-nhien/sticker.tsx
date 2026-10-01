import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

// Four ticks of a number line and the dots above ticks 1 to 3, bigger
// toward the right.
const TICK_X = [24, 42, 60, 78] as const;
const LINE_Y = 60;
const DOT_Y = 40;
const DOTS = [
  { tick: 1, color: "blue", r: 5 },
  { tick: 2, color: "violet", r: 7 },
  { tick: 3, color: "pink", r: 9 },
] as const;

// Lesson sticker: a number line with an arrow and three dots growing toward
// the right, the way numbers grow along the line.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu tia số có mũi tên với bốn vạch và ba chấm to dần về bên phải"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <rect
          x={8}
          y={24}
          width={84}
          height={52}
          rx={10}
          className="fill-surface stroke-concept-violet"
          strokeWidth={2.5}
        />
        <line
          x1={14}
          x2={82}
          y1={LINE_Y}
          y2={LINE_Y}
          className="stroke-foreground"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <polygon
          points={`90,${LINE_Y} 81,${LINE_Y - 5} 81,${LINE_Y + 5}`}
          className="fill-foreground"
        />
        {TICK_X.map((x) => (
          <g key={x}>
            <line
              x1={x}
              x2={x}
              y1={LINE_Y - 5}
              y2={LINE_Y + 5}
              className="stroke-foreground"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </g>
        ))}
        {DOTS.map(({ tick, color, r }) => (
          <ConceptShape
            key={tick}
            color={color}
            cx={TICK_X[tick] ?? 0}
            cy={DOT_Y}
            r={r}
            className="stroke-surface"
            strokeWidth={1.5}
          />
        ))}
      </g>
    </svg>
  );
}

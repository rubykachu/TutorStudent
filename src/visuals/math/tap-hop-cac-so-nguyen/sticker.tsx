import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const AXIS_Y = 52;
const TICKS = [-3, -2, -1, 0, 1, 2, 3] as const;
const TICK_GAP = 11;
const CENTRE = 50;

const tickX = (tick: number) => CENTRE + tick * TICK_GAP;

// Lesson sticker: a round badge with a number line across it. A ring marks the
// origin, two pink diamonds sit on the negative side and two lime stars on
// the positive side; a pennant flies above the ring.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu số nguyên, trục số có số âm ở bên trái gốc và số dương ở bên phải gốc"
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
          x1={12}
          y1={AXIS_Y}
          x2={88}
          y2={AXIS_Y}
          className="stroke-foreground"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {TICKS.map((tick) => (
          <line
            key={tick}
            x1={tickX(tick)}
            x2={tickX(tick)}
            y1={AXIS_Y - (tick === 0 ? 8 : 4)}
            y2={AXIS_Y + (tick === 0 ? 8 : 4)}
            className="stroke-foreground"
            strokeWidth={tick === 0 ? 3 : 2}
            strokeLinecap="round"
          />
        ))}
        <circle
          cx={CENTRE}
          cy={AXIS_Y}
          r={6}
          className="fill-surface stroke-foreground"
          strokeWidth={3}
        />
        <ConceptShape
          color="pink"
          cx={tickX(-2)}
          cy={AXIS_Y - 14}
          r={6}
          className="stroke-surface"
        />
        <ConceptShape
          color="pink"
          cx={tickX(-1)}
          cy={AXIS_Y + 15}
          r={6}
          className="stroke-surface"
        />
        <ConceptShape
          color="lime"
          cx={tickX(1)}
          cy={AXIS_Y + 15}
          r={6}
          className="stroke-surface"
        />
        <ConceptShape
          color="lime"
          cx={tickX(2)}
          cy={AXIS_Y - 14}
          r={6}
          className="stroke-surface"
        />
        <line
          x1={CENTRE}
          y1={AXIS_Y - 8}
          x2={CENTRE}
          y2={28}
          className="stroke-foreground"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <polygon
          points={`${CENTRE},28 ${CENTRE + 16},34 ${CENTRE},40`}
          className="fill-concept-violet stroke-surface"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

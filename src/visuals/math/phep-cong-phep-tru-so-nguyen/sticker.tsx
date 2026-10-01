import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";

const AXIS_Y = 56;
const CENTRE = 50;
const TICK_GAP = 11;
const TICKS = [-3, -2, -1, 0, 1, 2, 3] as const;

const tickX = (tick: number) => CENTRE + tick * TICK_GAP;

// Lesson sticker: a round badge with a number line across it and a pink arrow
// hopping left from 2 to -2, with a lime "+" and a pink "-" above: adding goes
// right for a positive number and left for a negative one.
export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu cộng trừ số nguyên, trục số có một mũi tên đi sang trái và một mũi tên đi sang phải"
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
        <path
          d={`M ${tickX(2)} ${AXIS_Y - 6} Q ${CENTRE} ${AXIS_Y - 36} ${tickX(-2) + 3} ${AXIS_Y - 8}`}
          fill="none"
          className="stroke-concept-pink"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <polygon
          points={`${tickX(-2) - 3},${AXIS_Y - 6} ${tickX(-2) + 9},${AXIS_Y - 14} ${tickX(-2) + 6},${AXIS_Y - 2}`}
          className="fill-concept-pink"
        />
        <ConceptShape
          color="blue"
          cx={tickX(2)}
          cy={AXIS_Y}
          r={6}
          className="stroke-surface"
        />
        <ConceptShape
          color="amber"
          cx={tickX(-2)}
          cy={AXIS_Y}
          r={6}
          className="stroke-surface"
        />
        <text
          x={CENTRE - 12}
          y={36}
          fontSize={14}
          fontWeight={700}
          className="fill-concept-lime font-heading"
        >
          +
        </text>
        <text
          x={CENTRE + 2}
          y={36}
          fontSize={14}
          fontWeight={700}
          className="fill-concept-pink font-heading"
        >
          −
        </text>
      </g>
    </svg>
  );
}

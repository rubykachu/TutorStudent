import { decorative } from "@/visuals/shared/markers";
import type { Line } from "./geometry";
import { FRAME } from "./shapes";

const BUBBLE = 14;
const BADGE_CLASS = "fill-surface stroke-border";

// The letter that names a line, in a small round badge at the line's end.
export function LineBadge({
  axis,
  letter,
  scale = 1,
}: {
  axis: Line;
  letter: string;
  // Bigger when the picture is shown small (several shapes side by side).
  scale?: number;
}) {
  // Kept inside the frame, so a line that ends at the edge keeps its badge.
  const radius = BUBBLE * scale;
  const limit = FRAME - radius - 2;
  const x = Math.max(radius + 2, Math.min(limit, axis.q[0]));
  const y = Math.max(radius + 2, Math.min(limit, axis.q[1]));
  return (
    <g {...decorative}>
      <circle
        cx={x}
        cy={y}
        r={radius}
        className={BADGE_CLASS}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={19 * scale}
        stroke="none"
        className="fill-foreground font-heading font-bold"
      >
        {letter}
      </text>
    </g>
  );
}

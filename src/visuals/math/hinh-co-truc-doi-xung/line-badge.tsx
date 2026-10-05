import { decorative } from "@/visuals/shared/markers";
import type { Line } from "./geometry";
import { BADGE_RADIUS, badgeSpot } from "./lines";

const BADGE_CLASS = "fill-surface stroke-border";

// The letter that names a line, in a small round badge at the line's end.
export function LineBadge({
  axis,
  letter,
  end = "q",
  scale = 1,
}: {
  axis: Line;
  letter: string;
  // The end of the line the badge stands at.
  end?: "p" | "q";
  // Bigger when the picture is shown small (several shapes side by side).
  scale?: number;
}) {
  const radius = BADGE_RADIUS * scale;
  const [x, y] = badgeSpot(axis, end, scale);
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

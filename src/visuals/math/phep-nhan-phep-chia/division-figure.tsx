import { decorative } from "@/visuals/shared/markers";
import type { Figure, FigureCell } from "./long-division";

const CELL_W = 28;
// Rows are tall enough that the text boxes of two rows never touch.
const CELL_H = 38;
const FONT = 24;
// Tallest drawing, in px, before it is scaled down to leave room for the
// sentence and controls beneath it.
const MAX_HEIGHT = 250;
// Space between the dividend and the vertical bar, and between the bar and
// the divisor.
const BAR_GAP = 6;
const RIGHT_GAP = 14;
const PAD = 4;

const ROLE_FILL: Record<FigureCell["role"], string> = {
  dividend: "fill-concept-blue",
  divisor: "fill-concept-violet",
  quotient: "fill-concept-amber",
  product: "fill-foreground",
  remainder: "fill-foreground",
  brought: "fill-foreground",
  sign: "fill-foreground",
};

type DivisionFigureProps = {
  figure: Figure;
  label: string;
  // Size of the drawing relative to its natural size.
  zoom?: number;
  // Remainder of this round is the final one and is drawn in the remainder's
  // colour.
  finalRemainderStep?: number;
  // Keys of slots to ring in the orange "try again" dashes.
  wrongKeys?: ReadonlySet<string>;
};

function cellX(figure: Figure, cell: FigureCell): number {
  const origin =
    cell.zone === "left" ? 0 : figure.leftCols * CELL_W + BAR_GAP + RIGHT_GAP;
  return PAD + origin + cell.col * CELL_W + CELL_W / 2;
}

// The long-division frame: dividend, vertical bar, divisor, quotient rule and
// the subtractions stacked beneath, drawn from a `Figure`.
export function DivisionFigure({
  figure,
  label,
  zoom = 1.15,
  finalRemainderStep,
  wrongKeys,
}: DivisionFigureProps) {
  const rightX = PAD + figure.leftCols * CELL_W + BAR_GAP + RIGHT_GAP;
  const width = rightX + figure.rightCols * CELL_W + PAD;
  const height = figure.rows * CELL_H + PAD * 2;
  const barX = PAD + figure.leftCols * CELL_W + BAR_GAP;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: width * Math.min(zoom, MAX_HEIGHT / height) }}
    >
      <line
        {...decorative}
        x1={barX}
        x2={barX}
        y1={PAD}
        y2={PAD + 2 * CELL_H}
        className="stroke-foreground"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {figure.rules.map((rule) => {
        const left = rule.zone === "left" ? PAD : rightX;
        const y = PAD + (rule.row + 1) * CELL_H;
        return (
          <line
            {...decorative}
            key={rule.key}
            x1={left + rule.from * CELL_W + 2}
            x2={left + (rule.to + 1) * CELL_W - 2}
            y1={y}
            y2={y}
            className="stroke-foreground"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
      {figure.cells.map((cell) => {
        const x = cellX(figure, cell);
        const centerY = PAD + cell.row * CELL_H + CELL_H / 2;
        const box = {
          x: x - CELL_W / 2 + 1.5,
          y: centerY - CELL_H / 2 + 2,
          width: CELL_W - 3,
          height: CELL_H - 4,
          rx: 6,
        };
        if (cell.kind === "slot") {
          return (
            <rect
              {...decorative}
              key={cell.key}
              {...box}
              className={`fill-surface ${
                wrongKeys?.has(cell.key)
                  ? "stroke-retry"
                  : "stroke-muted-foreground"
              }`}
              strokeWidth={2}
              strokeDasharray="4 3"
            />
          );
        }
        const isFinalRemainder =
          cell.role === "remainder" &&
          finalRemainderStep !== undefined &&
          cell.key.startsWith(`r${finalRemainderStep}.`);
        // Digits in play sit on the highlight fill and use the plain text
        // colour there, where a concept colour would lose contrast.
        let fill = isFinalRemainder
          ? "fill-concept-pink"
          : ROLE_FILL[cell.role];
        if (cell.highlighted) fill = "fill-foreground";
        if (cell.kind === "unknown") fill = "fill-muted-foreground";
        return (
          <g key={cell.key}>
            {cell.highlighted && (
              <rect {...decorative} {...box} className="fill-highlight" />
            )}
            <text
              x={x}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={FONT}
              fontWeight={700}
              className={fill}
            >
              {cell.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

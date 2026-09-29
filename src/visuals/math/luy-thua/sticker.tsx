import { decorative } from "@/visuals/shared/markers";

const CELLS = 4;
const CELL = 16;
const GRAINS = [
  [44, 78],
  [56, 78],
  [68, 78],
  [50, 70],
  [62, 70],
  [56, 62],
] as const;

// Lesson sticker: a small chessboard with a heap of rice grains in front.
export default function Sticker() {
  const cells = Array.from({ length: CELLS * CELLS }, (_, i) => i);
  return (
    <svg
      role="img"
      aria-label="Bàn cờ và đống hạt thóc"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        {cells.map((i) => (
          <rect
            key={i}
            x={18 + (i % CELLS) * CELL}
            y={14 + Math.floor(i / CELLS) * CELL}
            width={CELL}
            height={CELL}
            className={
              (Math.floor(i / CELLS) + (i % CELLS)) % 2 === 1
                ? "fill-foreground/70"
                : "fill-surface"
            }
          />
        ))}
        {GRAINS.map(([x, y]) => (
          <ellipse
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            rx={6}
            ry={4}
            transform={`rotate(-30 ${x} ${y})`}
            className="fill-concept-amber stroke-surface"
            strokeWidth={1.5}
          />
        ))}
      </g>
    </svg>
  );
}

import { decorative } from "@/visuals/shared/markers";

// Lesson sticker: a round badge with a rectangle cut into unit squares and a
// blue loop round it, the perimeter and the area side by side.
const COLS = 4;
const ROWS = 3;
const CELL = 11;
const X0 = 28;
const Y0 = 33;

export default function Sticker() {
  return (
    <svg
      role="img"
      aria-label="Huy hiệu chu vi và diện tích: một hình chữ nhật chia thành ô vuông, có đường viền xanh quanh hình"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <circle
          cx={50}
          cy={50}
          r={40}
          className="fill-surface stroke-concept-teal"
          strokeWidth={3}
        />
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: squares never reorder
            key={i}
            x={X0 + (i % COLS) * CELL}
            y={Y0 + Math.floor(i / COLS) * CELL}
            width={CELL}
            height={CELL}
            strokeWidth={1.2}
            className="fill-concept-teal stroke-foreground"
            fillOpacity={0.45}
          />
        ))}
        <rect
          x={X0 - 4}
          y={Y0 - 4}
          width={COLS * CELL + 8}
          height={ROWS * CELL + 8}
          rx={2}
          fill="none"
          strokeWidth={3}
          strokeLinejoin="round"
          className="stroke-concept-blue"
        />
      </g>
    </svg>
  );
}

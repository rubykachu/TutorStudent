const ROWS = 2;
const COLUMNS = 3;
const CELL = 40;

export default function DotGrid() {
  return (
    <svg
      role="img"
      aria-label="Hai hàng, mỗi hàng ba chấm"
      viewBox={`0 0 ${COLUMNS * CELL} ${ROWS * CELL}`}
      className="h-auto w-full max-w-60"
    >
      {Array.from({ length: ROWS * COLUMNS }, (_, i) => (
        <circle
          // biome-ignore lint/suspicious/noArrayIndexKey: dots never reorder, position is the identity
          key={i}
          cx={(i % COLUMNS) * CELL + CELL / 2}
          cy={Math.floor(i / COLUMNS) * CELL + CELL / 2}
          r={CELL / 3}
          className="fill-concept-amber"
        />
      ))}
    </svg>
  );
}

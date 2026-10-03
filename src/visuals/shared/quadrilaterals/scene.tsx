import { decorative } from "@/visuals/shared/markers";

// Everyday things that have the shape of one of the four quadrilaterals,
// drawn small for the gallery and the "chạm để xem" cards.

export type SceneKind = "door" | "fence" | "tiles" | "ladder" | "bag";

export const SCENE_SIZE = { w: 160, h: 130 };

export const SCENE_LABEL: Readonly<Record<SceneKind, string>> = {
  door: "Cánh cửa ra vào",
  fence: "Hàng rào lưới B40",
  tiles: "Gạch lát nền hình bình hành",
  ladder: "Chiếc thang chữ A có dạng hình thang cân",
  bag: "Túi xách có dạng hình thang cân",
};

const STROKE = "stroke-foreground";

function Door() {
  return (
    <>
      <rect
        x={48}
        y={8}
        width={64}
        height={114}
        rx={2}
        className={`fill-concept-teal ${STROKE}`}
        fillOpacity={0.35}
        strokeWidth={3}
      />
      <rect
        x={58}
        y={20}
        width={44}
        height={38}
        className={`fill-none ${STROKE}`}
        strokeWidth={2}
      />
      <rect
        x={58}
        y={68}
        width={44}
        height={44}
        className={`fill-none ${STROKE}`}
        strokeWidth={2}
      />
      <circle cx={102} cy={64} r={3.5} className="fill-foreground" />
    </>
  );
}

// A panel of B40 wire fence between two posts: the wires cross in a lattice
// of rhombuses, one of them filled. Each wire leans 18 across for every 26
// up, so a rhombus is 36 wide and 52 high, with four equal sides.
const FENCE = { left: 24, right: 136, top: 14, bottom: 116 };
const WIRE_STEP = 36;
const WIRE_LEAN = 18 / 26;
// The top corner of the filled rhombus; the wires of both families cross there.
const NODE = { x: 80, y: 39 };

// The wires of one family, each cut to the panel: leaning right going down
// (`slope` 1) or left going down (`slope` -1). A wire is x = c + slope * lean
// * y; it stays in the panel for the heights where x is between its sides.
function wires(slope: 1 | -1) {
  const lean = slope * WIRE_LEAN;
  return Array.from({ length: 13 }, (_, i) => i - 6).flatMap((m) => {
    const c = NODE.x + m * WIRE_STEP - lean * NODE.y;
    const [atLeft, atRight] = [FENCE.left, FENCE.right].map(
      (x) => (x - c) / lean,
    ) as [number, number];
    const top = Math.max(FENCE.top, Math.min(atLeft, atRight));
    const bottom = Math.min(FENCE.bottom, Math.max(atLeft, atRight));
    if (bottom - top < 1) return [];
    return [
      {
        key: `${m}${slope}`,
        x1: c + lean * top,
        y1: top,
        x2: c + lean * bottom,
        y2: bottom,
      },
    ];
  });
}

function Fence() {
  const width = FENCE.right - FENCE.left;
  const height = FENCE.bottom - FENCE.top;
  return (
    <>
      <polygon
        points="80,39 98,65 80,91 62,65"
        className="fill-concept-pink"
        fillOpacity={0.4}
      />
      {[...wires(1), ...wires(-1)].map(({ key, ...wire }) => (
        <line key={key} {...wire} className={STROKE} strokeWidth={2} />
      ))}
      <rect
        x={FENCE.left}
        y={FENCE.top}
        width={width}
        height={height}
        className={`fill-none ${STROKE}`}
        strokeWidth={3}
      />
      {[FENCE.left - 6, FENCE.right + 6].map((x) => (
        <line
          key={x}
          x1={x}
          y1={6}
          x2={x}
          y2={126}
          className={STROKE}
          strokeWidth={6}
          strokeLinecap="round"
        />
      ))}
    </>
  );
}

// Two rows of three parallelogram tiles on a darker floor.
function Tiles() {
  const tileW = 38;
  const tileH = 32;
  const skew = 10;
  const gap = 4;
  const left = 14;
  const top = 22;
  return (
    <>
      <rect
        x={left - gap}
        y={top - gap}
        width={3 * tileW + 2 * gap + skew + 2 * gap}
        height={2 * tileH + 3 * gap}
        className="fill-muted-foreground"
      />
      {[0, 1].flatMap((row) =>
        [0, 1, 2].map((col) => {
          const x = left + col * (tileW + gap);
          const y = top + row * (tileH + gap);
          return (
            <polygon
              key={`${row}${col}`}
              points={`${x + skew},${y} ${x + skew + tileW},${y} ${x + tileW},${y + tileH} ${x},${y + tileH}`}
              className={
                (row + col) % 2 === 0 ? "fill-concept-lime" : "fill-surface"
              }
              fillOpacity={(row + col) % 2 === 0 ? 0.4 : 1}
            />
          );
        }),
      )}
    </>
  );
}

// An A-frame ladder seen from the side: legs 28 to 132 at the foot, 56 to 104
// at the top, with three rungs.
function Ladder() {
  const topY = 12;
  const footY = 120;
  const edge = (y: number, topX: number, footX: number) =>
    topX + ((footX - topX) * (y - topY)) / (footY - topY);
  return (
    <>
      <polygon
        points="56,12 104,12 132,120 28,120"
        className={`fill-concept-sky ${STROKE}`}
        fillOpacity={0.3}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {[40, 66, 92].map((y) => (
        <line
          key={y}
          x1={edge(y, 56, 28)}
          y1={y}
          x2={edge(y, 104, 132)}
          y2={y}
          className={STROKE}
          strokeWidth={3}
        />
      ))}
    </>
  );
}

// A paper bag a little wider at the top than at the bottom, with a handle.
function Bag() {
  return (
    <>
      <path
        d="M62 50 C 62 12, 98 12, 98 50"
        className={`fill-none ${STROKE}`}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <polygon
        points="32,50 128,50 114,120 46,120"
        className={`fill-concept-amber ${STROKE}`}
        fillOpacity={0.35}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </>
  );
}

export function Scene({ kind }: { kind: SceneKind }) {
  return (
    <svg
      role="img"
      aria-label={SCENE_LABEL[kind]}
      viewBox={`0 0 ${SCENE_SIZE.w} ${SCENE_SIZE.h}`}
      className="h-auto w-full"
    >
      <g {...decorative}>
        {kind === "door" && <Door />}
        {kind === "fence" && <Fence />}
        {kind === "tiles" && <Tiles />}
        {kind === "ladder" && <Ladder />}
        {kind === "bag" && <Bag />}
      </g>
    </svg>
  );
}

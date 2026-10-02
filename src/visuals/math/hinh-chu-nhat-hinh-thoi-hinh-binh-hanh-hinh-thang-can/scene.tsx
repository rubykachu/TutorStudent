import { decorative } from "@/visuals/shared/markers";

// Everyday things that have the shape of one of the four quadrilaterals,
// drawn small for the gallery and the "chạm để xem" cards.

export type SceneKind = "door" | "kite" | "tiles" | "ladder" | "bag";

export const SCENE_SIZE = { w: 160, h: 130 };

export const SCENE_LABEL: Readonly<Record<SceneKind, string>> = {
  door: "Cánh cửa ra vào hình chữ nhật",
  kite: "Khung cánh diều hình thoi",
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

function Kite() {
  return (
    <>
      <polygon
        points="80,6 118,58 80,110 42,58"
        className={`fill-concept-pink ${STROKE}`}
        fillOpacity={0.35}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <line
        x1={80}
        y1={6}
        x2={80}
        y2={110}
        className={STROKE}
        strokeWidth={2}
      />
      <line
        x1={42}
        y1={58}
        x2={118}
        y2={58}
        className={STROKE}
        strokeWidth={2}
      />
      <path
        d="M80 110 Q 96 116 86 123 Q 76 128 88 130"
        className={`fill-none ${STROKE}`}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </>
  );
}

// Two rows of three parallelogram tiles on a darker floor.
function Tiles() {
  const tileW = 44;
  const tileH = 32;
  const skew = 12;
  const gap = 4;
  const left = 20;
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
        {kind === "kite" && <Kite />}
        {kind === "tiles" && <Tiles />}
        {kind === "ladder" && <Ladder />}
        {kind === "bag" && <Bag />}
      </g>
    </svg>
  );
}

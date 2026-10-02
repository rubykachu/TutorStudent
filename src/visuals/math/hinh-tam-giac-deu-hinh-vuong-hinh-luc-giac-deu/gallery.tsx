import { decorative } from "@/visuals/shared/markers";
import { Figure, pointList } from "./figure";
import type { FigureSpec } from "./figure-spec";
import { regularPoints } from "./geometry";

// Pictures side by side, each with a caption: the three real-life things the
// lesson opens with, or the three regular shapes with their names.

export type SceneKind = "tiles" | "honeycomb" | "sign";

export type GalleryItem = { caption: string } & (
  | { figure: FigureSpec }
  | { scene: SceneKind }
);

export type GallerySpec = {
  label: string;
  items: readonly GalleryItem[];
};

const SCENE_SIZE = { w: 160, h: 130 };
const SCENE_LABEL: Readonly<Record<SceneKind, string>> = {
  tiles: "Mặt sàn lát gạch hình vuông",
  honeycomb: "Tổ ong gồm các ngăn hình lục giác đều",
  sign: "Biển báo nguy hiểm hình tam giác đều",
};

const TILE = 38;
const GROUT = 4;

function Tiles() {
  const left = (SCENE_SIZE.w - 3 * TILE - 2 * GROUT) / 2;
  const top = (SCENE_SIZE.h - 3 * TILE - 2 * GROUT) / 2;
  return (
    <>
      <rect
        x={left - GROUT}
        y={top - GROUT}
        width={3 * TILE + 4 * GROUT}
        height={3 * TILE + 4 * GROUT}
        className="fill-muted-foreground"
      />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}${col}`}
            x={left + col * (TILE + GROUT)}
            y={top + row * (TILE + GROUT)}
            width={TILE}
            height={TILE}
            className={
              (row + col) % 2 === 0 ? "fill-concept-amber" : "fill-surface"
            }
            fillOpacity={(row + col) % 2 === 0 ? 0.35 : 1}
          />
        )),
      )}
    </>
  );
}

// Seven pointy-top cells: one in the middle, six round it.
function Honeycomb() {
  const radius = 24;
  const step = radius * Math.sqrt(3);
  const centres: [number, number][] = [[0, 0]];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    centres.push([step * Math.cos(angle), step * Math.sin(angle)]);
  }
  return (
    <>
      {centres.map(([dx, dy]) => (
        <polygon
          key={`${dx}${dy}`}
          points={pointList(
            regularPoints(
              6,
              SCENE_SIZE.w / 2 + dx,
              SCENE_SIZE.h / 2 + dy,
              radius - 1.5,
              -90,
            ),
          )}
          className="fill-concept-amber stroke-foreground"
          fillOpacity={0.4}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      ))}
    </>
  );
}

function Sign() {
  const [cx, cy] = [SCENE_SIZE.w / 2, SCENE_SIZE.h / 2 + 6];
  const outer = regularPoints(3, cx, cy, 62, -90);
  const inner = regularPoints(3, cx, cy, 44, -90);
  return (
    <>
      <polygon
        points={pointList(outer)}
        className="fill-retry stroke-retry"
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <polygon points={pointList(inner)} className="fill-surface" />
      <line
        x1={cx}
        y1={cy - 20}
        x2={cx}
        y2={cy + 6}
        className="stroke-foreground"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy + 20} r={4} className="fill-foreground" />
    </>
  );
}

function Scene({ kind }: { kind: SceneKind }) {
  return (
    <svg
      role="img"
      aria-label={SCENE_LABEL[kind]}
      viewBox={`0 0 ${SCENE_SIZE.w} ${SCENE_SIZE.h}`}
      className="h-auto w-full"
    >
      <g {...decorative}>
        {kind === "tiles" && <Tiles />}
        {kind === "honeycomb" && <Honeycomb />}
        {kind === "sign" && <Sign />}
      </g>
    </svg>
  );
}

// Two or three items fit one row on every screen; their captions wrap under
// them.
export function Gallery({ spec }: { spec: GallerySpec }) {
  return (
    <figure aria-label={spec.label} className="w-full">
      <ul
        className={`grid items-start gap-2 ${spec.items.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
      >
        {spec.items.map((item) => (
          <li
            key={item.caption}
            className="flex min-w-0 flex-col items-center gap-1"
          >
            <div className="w-full max-w-44">
              {"scene" in item ? (
                <Scene kind={item.scene} />
              ) : (
                <Figure spec={item.figure} />
              )}
            </div>
            <span className="text-center text-caption">{item.caption}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

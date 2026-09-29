import { decorative } from "@/visuals/shared/markers";

// Pictures of a² and a³: a flat square of a × a tiles and an isometric cube
// of a × a × a small cubes. Both draw at a fixed pixel size so their side
// labels stay at readable text size.

export const PICTURE = 180;
const LABEL_SPACE = 28;
const LABEL_SIZE = 20;
const COS30 = Math.cos(Math.PI / 6);

type PictureProps = { side: number; label: string };

function SideLabel({ x, y, side }: { x: number; y: number; side: number }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={LABEL_SIZE}
      className="fill-concept-blue font-heading font-bold"
    >
      {side}
    </text>
  );
}

export function SquareTiles({ side, label }: PictureProps) {
  const tile = (PICTURE - LABEL_SPACE) / side;
  const size = PICTURE;
  const origin = LABEL_SPACE;
  const cells = Array.from({ length: side * side }, (_, i) => i);
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="max-w-full"
    >
      <g {...decorative}>
        {cells.map((i) => (
          <rect
            key={i}
            x={origin + (i % side) * tile}
            y={origin + Math.floor(i / side) * tile}
            width={tile}
            height={tile}
            className="fill-concept-amber/70 stroke-surface"
            strokeWidth={2}
          />
        ))}
      </g>
      <SideLabel
        x={origin + (side * tile) / 2}
        y={LABEL_SPACE / 2}
        side={side}
      />
      <SideLabel
        x={LABEL_SPACE / 2}
        y={origin + (side * tile) / 2}
        side={side}
      />
    </svg>
  );
}

type Point3 = readonly [number, number, number];

export function CubeBlocks({ side, label }: PictureProps) {
  // Isometric projection sized so the whole cube fits the picture box with
  // room for the labels under its two bottom edges.
  const unit = (PICTURE - LABEL_SPACE) / (2 * side);
  const centerX = PICTURE / 2;
  const topY = LABEL_SPACE / 2 + side * unit;
  const project = ([x, y, z]: Point3): [number, number] => [
    centerX + (x - y) * unit * COS30,
    topY + (x + y) * unit * 0.5 - z * unit,
  ];
  const polygon = (corners: readonly Point3[]) =>
    corners
      .map(project)
      .map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`)
      .join(" ");

  const range = Array.from({ length: side }, (_, i) => i);
  const faces: { key: string; points: string; paint: string }[] = [];
  for (const i of range) {
    for (const j of range) {
      faces.push({
        key: `top-${i}-${j}`,
        points: polygon([
          [i, j, side],
          [i + 1, j, side],
          [i + 1, j + 1, side],
          [i, j + 1, side],
        ]),
        paint: "fill-concept-amber/40",
      });
      faces.push({
        key: `right-${i}-${j}`,
        points: polygon([
          [side, i, j],
          [side, i + 1, j],
          [side, i + 1, j + 1],
          [side, i, j + 1],
        ]),
        paint: "fill-concept-amber",
      });
      faces.push({
        key: `left-${i}-${j}`,
        points: polygon([
          [i, side, j],
          [i + 1, side, j],
          [i + 1, side, j + 1],
          [i, side, j + 1],
        ]),
        paint: "fill-concept-amber/70",
      });
    }
  }

  const [bottomX, bottomY] = project([side, side, 0]);
  const [rightX, rightY] = project([side, 0, 0]);
  const [leftX, leftY] = project([0, side, 0]);
  const [, rightTopY] = project([side, 0, side]);
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${PICTURE} ${PICTURE}`}
      width={PICTURE}
      height={PICTURE}
      className="max-w-full"
    >
      <g {...decorative}>
        {faces.map((face) => (
          <polygon
            key={face.key}
            points={face.points}
            className={`${face.paint} stroke-surface`}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        ))}
      </g>
      <SideLabel
        x={(bottomX + leftX) / 2 - 10}
        y={(bottomY + leftY) / 2 + 12}
        side={side}
      />
      <SideLabel
        x={(bottomX + rightX) / 2 + 10}
        y={(bottomY + rightY) / 2 + 12}
        side={side}
      />
      <SideLabel x={rightX + 12} y={(rightY + rightTopY) / 2} side={side} />
    </svg>
  );
}

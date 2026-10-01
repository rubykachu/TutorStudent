import { decorative } from "@/visuals/shared/markers";

// Two gears meshing side by side, each with one marked tooth: the picture
// behind "two marks meet again after the least common multiple of the teeth".
// Both gears share one tooth pitch, so a gear's radius grows with its tooth
// count, and the marked tooth of the left gear sits at the contact point while
// the marked tooth of the right gear is the one next to it.

export type GearsSpec = { teeth: readonly [number, number] };

// Arc length of one tooth plus one gap on the pitch circle, in viewBox units.
const PITCH = 22;
const TOOTH_DEPTH = 8;
const TOOTH_WIDTH = PITCH * 0.4;
const MARGIN = 6;

// Radii of the pitch circles, centres and size of the picture for a pair.
export function gearLayout(teeth: readonly [number, number]) {
  const [radiusA, radiusB] = teeth.map((n) => (n * PITCH) / (2 * Math.PI)) as [
    number,
    number,
  ];
  const reach = TOOTH_DEPTH / 2;
  const cy = MARGIN + radiusA + reach;
  const centreA = MARGIN + radiusA + reach;
  // One unit of play between the teeth of one gear and the rim of the other.
  const centreB = centreA + radiusA + radiusB + 1;
  return {
    radius: [radiusA, radiusB] as const,
    centre: [centreA, centreB] as const,
    cy,
    width: centreB + radiusB + reach + MARGIN,
    height: cy + radiusA + reach + MARGIN,
  };
}

// Angles (degrees, clockwise from the right) of a gear's teeth. Gear A has a
// tooth at the contact point (0); gear B has a gap there (180), so its teeth
// sit half a pitch to either side.
function toothAngles(count: number, first: number): number[] {
  return Array.from({ length: count }, (_, k) => first + (k * 360) / count);
}

const BODY = "fill-muted stroke-muted-foreground";
const MARKED = "fill-highlight stroke-foreground";

function Teeth({
  centre,
  cy,
  radius,
  angles,
  marked,
}: {
  centre: number;
  cy: number;
  radius: number;
  angles: readonly number[];
  marked: boolean;
}) {
  return (
    <>
      {angles.map((angle) => (
        <rect
          key={angle}
          x={radius - TOOTH_DEPTH / 2 - 1}
          y={-TOOTH_WIDTH / 2}
          width={TOOTH_DEPTH + 1}
          height={TOOTH_WIDTH}
          rx={1.5}
          transform={`translate(${centre} ${cy}) rotate(${angle})`}
          className={marked ? MARKED : BODY}
          strokeWidth={marked ? 2 : 1.5}
        />
      ))}
    </>
  );
}

function Label({
  x,
  y,
  name,
  teeth,
}: {
  x: number;
  y: number;
  name: string;
  teeth: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="fill-foreground font-bold font-heading"
      fontSize={9}
    >
      <tspan x={x}>{name}</tspan>
      <tspan x={x} dy={15}>
        {`${teeth} răng`}
      </tspan>
    </text>
  );
}

export function Gears({ spec }: { spec: GearsSpec }) {
  const [teethA, teethB] = spec.teeth;
  const layout = gearLayout(spec.teeth);
  const [radiusA, radiusB] = layout.radius;
  const [centreA, centreB] = layout.centre;
  const anglesA = toothAngles(teethA, 0);
  const anglesB = toothAngles(teethB, 180 + 180 / teethB);
  const rim = TOOTH_DEPTH / 2;
  return (
    <figure className="flex w-full flex-col items-center gap-2">
      <svg
        role="img"
        aria-label={`Hai bánh răng khớp nhau: bánh A có ${teethA} răng, bánh B có ${teethB} răng. Mỗi bánh có một răng đánh dấu, hai răng đó đang khớp nhau.`}
        viewBox={`0 0 ${layout.width.toFixed(1)} ${layout.height.toFixed(1)}`}
        className="h-auto w-full max-w-md"
      >
        <g {...decorative}>
          <Teeth
            centre={centreA}
            cy={layout.cy}
            radius={radiusA}
            angles={anglesA.slice(1)}
            marked={false}
          />
          <Teeth
            centre={centreB}
            cy={layout.cy}
            radius={radiusB}
            angles={anglesB.slice(1)}
            marked={false}
          />
          <Teeth
            centre={centreA}
            cy={layout.cy}
            radius={radiusA}
            angles={anglesA.slice(0, 1)}
            marked
          />
          <Teeth
            centre={centreB}
            cy={layout.cy}
            radius={radiusB}
            angles={anglesB.slice(0, 1)}
            marked
          />
          <circle
            cx={centreA}
            cy={layout.cy}
            r={radiusA - rim}
            className={BODY}
            strokeWidth={1.5}
          />
          <circle
            cx={centreB}
            cy={layout.cy}
            r={radiusB - rim}
            className={BODY}
            strokeWidth={1.5}
          />
        </g>
        <Label x={centreA} y={layout.cy - 7} name="Bánh A" teeth={teethA} />
        <Label x={centreB} y={layout.cy - 7} name="Bánh B" teeth={teethB} />
      </svg>
      <p className="flex items-center gap-2 text-caption">
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0">
          <rect
            x={3}
            y={3}
            width={10}
            height={10}
            rx={2}
            className={MARKED}
            strokeWidth={2}
          />
        </svg>
        Răng có dấu
      </p>
    </figure>
  );
}

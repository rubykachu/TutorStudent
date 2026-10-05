import { decorative } from "@/visuals/shared/markers";
import { AXIS_CLASS, LineMark, Strokes } from "./draw";
import { SHAPES } from "./shapes";

// Lesson sticker: a round badge with a butterfly and its axis of symmetry.
const SCALE = 0.3;
const OFFSET = (100 - 240 * SCALE) / 2;

export default function Sticker() {
  const { strokes, axes } = SHAPES.butterfly;
  const axis = axes[0];
  return (
    <svg
      role="img"
      aria-label="Huy hiệu cánh bướm có trục đối xứng"
      viewBox="0 0 100 100"
      className="h-auto w-full max-w-32"
    >
      <g {...decorative}>
        <circle cx={50} cy={50} r={48} className="fill-highlight" />
        <circle
          cx={50}
          cy={50}
          r={40}
          className="fill-surface stroke-concept-pink"
          strokeWidth={3}
        />
        <g transform={`translate(${OFFSET} ${OFFSET}) scale(${SCALE})`}>
          <Strokes strokes={strokes} width={6} />
          {axis && <LineMark axis={axis} className={AXIS_CLASS} width={7} />}
        </g>
      </g>
    </svg>
  );
}

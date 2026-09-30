import { Check, X } from "lucide-react";
import { formatInteger } from "@/lib/number-format";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import {
  DIVIDEND_COLOR,
  DIVISOR_COLOR,
  DivisionEquation,
  QUOTIENT_COLOR,
  REMAINDER_COLOR,
  Term,
} from "./chia-parts";

export type RemCheckProps = {
  dividend: number;
  divisor: number;
  q: number;
  r: number;
};

// A division with remainder is right when divisor · q + r gives back the
// dividend and the remainder is smaller than the divisor.
export function remainderCheck({ dividend, divisor, q, r }: RemCheckProps) {
  const rebuilt = divisor * q + r;
  const holds = rebuilt === dividend;
  const smaller = r < divisor;
  return { rebuilt, holds, smaller, ok: holds && smaller };
}

const WIDTH = 320;
const PAD = 4;
const FONT = 17;
const BAR_MAX_W = WIDTH - 2 * PAD;
const BAR_H = 26;
const MAX_UNIT = 28;
const UNIT_GAP = 2;
const LABEL_H = 26;
const ROW_H = LABEL_H + BAR_H + 10;

type BarProps = {
  y: number;
  units: number;
  unit: number;
  // Units from this one on are drawn in the "too long" style.
  overflowFrom?: number;
  color: typeof DIVISOR_COLOR | typeof REMAINDER_COLOR;
  label: string;
};

function Bar({ y, units, unit, overflowFrom, color, label }: BarProps) {
  return (
    <g>
      <ConceptShape
        {...decorative}
        color={color}
        cx={PAD + 9}
        cy={y + 12}
        r={8}
      />
      <text
        x={PAD + 24}
        y={y + 12}
        dominantBaseline="central"
        fontSize={FONT}
        fontWeight={600}
        className="fill-foreground"
      >
        {label}
      </text>
      {Array.from({ length: units }, (_, i) => {
        const over = overflowFrom !== undefined && i >= overflowFrom;
        return (
          <ConceptShapeCell
            // biome-ignore lint/suspicious/noArrayIndexKey: cells never reorder
            key={i}
            x={PAD + i * unit}
            y={y + LABEL_H}
            width={unit - UNIT_GAP}
            over={over}
            color={color}
          />
        );
      })}
    </g>
  );
}

function ConceptShapeCell({
  x,
  y,
  width,
  over,
  color,
}: {
  x: number;
  y: number;
  width: number;
  over: boolean;
  color: BarProps["color"];
}) {
  const fill = color === "violet" ? "fill-concept-violet" : "fill-concept-pink";
  return (
    <rect
      {...decorative}
      x={x}
      y={y}
      width={width}
      height={BAR_H}
      rx={4}
      className={
        over ? "fill-retry-soft stroke-retry" : `${fill} stroke-transparent`
      }
      strokeWidth={2}
      strokeDasharray={over ? "4 3" : undefined}
    />
  );
}

function Bars({ divisor, r }: { divisor: number; r: number }) {
  const unit = Math.min(MAX_UNIT, BAR_MAX_W / Math.max(divisor, r, 1));
  const height = 2 * ROW_H;
  const markX = PAD + divisor * unit - UNIT_GAP / 2;
  return (
    <svg
      role="img"
      aria-label={`So sánh số dư ${r} với số chia ${divisor}: ${r < divisor ? "số dư ngắn hơn" : "số dư dài hơn hoặc bằng"}`}
      viewBox={`0 0 ${WIDTH} ${height}`}
      className="h-auto w-full"
      style={{ maxWidth: WIDTH * Math.max(0.95, Math.min(1.25, 200 / height)) }}
    >
      <Bar
        y={0}
        units={divisor}
        unit={unit}
        color={DIVISOR_COLOR}
        label={`Số chia: ${divisor}`}
      />
      <Bar
        y={ROW_H}
        units={r}
        unit={unit}
        overflowFrom={divisor}
        color={REMAINDER_COLOR}
        label={`Số dư: ${r}`}
      />
      <line
        {...decorative}
        x1={markX}
        x2={markX}
        y1={LABEL_H - 2}
        y2={ROW_H + LABEL_H + BAR_H + 2}
        className="stroke-foreground"
        strokeWidth={2}
        strokeDasharray="3 3"
      />
    </svg>
  );
}

function message({ dividend, divisor, q, r }: RemCheckProps): string {
  const { rebuilt, holds, smaller } = remainderCheck({
    dividend,
    divisor,
    q,
    r,
  });
  if (!holds) {
    return `Chưa đúng: ${divisor} · ${q} + ${r} = ${formatInteger(rebuilt)}, không bằng ${formatInteger(dividend)}.`;
  }
  if (!smaller) {
    const extra = Math.floor(r / divisor);
    return `Chưa đúng: số dư ${r} không nhỏ hơn số chia ${divisor}, có thể chia thêm ${extra} lần nữa.`;
  }
  return `Đúng: số dư ${r} nhỏ hơn số chia ${divisor}, và ${divisor} · ${q} + ${r} = ${formatInteger(dividend)}.`;
}

// Checks a division with remainder: the equation divisor · q + r = dividend
// and the remainder against the divisor, on bars of equal unit length.
export default function RemCheck(props: RemCheckProps) {
  const { dividend, divisor, q, r } = props;
  const { rebuilt, ok } = remainderCheck(props);
  const Icon = ok ? Check : X;
  const tone = ok
    ? "border-correct bg-correct-soft text-correct-soft-foreground"
    : "border-retry bg-retry-soft text-retry-soft-foreground";
  const iconTone = ok ? "bg-correct" : "bg-retry";

  return (
    <figure
      className="flex w-full flex-col items-center gap-3"
      aria-label={`Kiểm tra ${dividend} chia ${divisor} bằng ${q} dư ${r}`}
    >
      <DivisionEquation
        dividend={dividend}
        divisor={divisor}
        quotient={q}
        remainder={r}
        withRemainder
      />
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-heading text-body-lg font-bold md:text-title">
        <Term color={DIVISOR_COLOR} value={divisor} />
        <span>·</span>
        <Term color={QUOTIENT_COLOR} value={q} />
        <span>+</span>
        <Term color={REMAINDER_COLOR} value={r} />
        <span>=</span>
        <Term color={DIVIDEND_COLOR} value={rebuilt} />
      </p>
      <Bars divisor={divisor} r={r} />
      <p
        className={`flex w-full items-start gap-2 rounded-lg border-2 px-3 py-2 text-caption md:text-body ${tone}`}
      >
        <span
          aria-hidden
          className={`mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-surface ${iconTone}`}
        >
          <Icon className="size-4" strokeWidth={3} />
        </span>
        {message(props)}
      </p>
    </figure>
  );
}

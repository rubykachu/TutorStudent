"use client";

import { motion } from "motion/react";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { decorative } from "@/visuals/shared/markers";
import { useVisualTransition } from "@/visuals/shared/motion";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { fmt, TIMES } from "./logic-nhan";
import { DotBlock, Hole, Legend, MATH_LINE, Product, Tint } from "./parts-nhan";

type Spec = SpecOf<"swap">;

const CELL = 32;
const TURNED_STEP = 1;
const PRODUCT_STEP = 2;

function gridWords(rows: number, cols: number): string {
  return `${rows} hàng, mỗi hàng ${cols} chấm`;
}

// The grid on a square stage that turns a quarter turn about its centre:
// after the turn its rows are the old columns. Each row sits on a pale band,
// which stays level and swaps for the bands of the turned grid, so the picture
// always shows which dots count as a row.
function TurningGrid({ spec, turned }: { spec: Spec; turned: boolean }) {
  const { rows, cols } = spec;
  const transition = useVisualTransition();
  const side = Math.max(rows, cols) * CELL;
  const left = (side - cols * CELL) / 2;
  const top = (side - rows * CELL) / 2;
  return (
    <svg
      role="img"
      aria-label={
        turned
          ? `Lưới xoay một phần tư vòng: ${gridWords(cols, rows)}`
          : `Lưới ${gridWords(rows, cols)}`
      }
      viewBox={`0 0 ${side} ${side}`}
      className="h-auto w-full max-w-72"
    >
      {[
        { count: rows, length: cols, shown: !turned },
        { count: cols, length: rows, shown: turned },
      ].map(({ count, length, shown }) => (
        <motion.g
          {...decorative}
          key={shown ? "turned" : "level"}
          initial={false}
          animate={{ opacity: shown ? 1 : 0 }}
          transition={transition}
        >
          {Array.from({ length: count }, (_, r) => (
            <rect
              // biome-ignore lint/suspicious/noArrayIndexKey: rows never reorder
              key={r}
              x={(side - length * CELL) / 2 + 1}
              y={(side - count * CELL) / 2 + r * CELL + 2}
              width={length * CELL - 2}
              height={CELL - 4}
              rx={(CELL - 4) / 2}
              className="fill-muted"
            />
          ))}
        </motion.g>
      ))}
      <motion.g
        initial={false}
        animate={{ rotate: turned ? 90 : 0 }}
        transition={transition}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        {Array.from({ length: rows * cols }, (_, i) => (
          <ConceptShape
            // biome-ignore lint/suspicious/noArrayIndexKey: dots are laid out by position
            key={i}
            color="blue"
            cx={left + (i % cols) * CELL + CELL / 2}
            cy={top + Math.floor(i / cols) * CELL + CELL / 2}
            r={CELL * 0.34}
          />
        ))}
      </motion.g>
    </svg>
  );
}

// "r · c = c · r = n"; a hint stops at "?" in place of n.
function Products({ spec }: { spec: Spec }) {
  const { rows, cols, mode } = spec;
  return (
    <p className={MATH_LINE}>
      <Product factors={[rows, cols]} />
      <span className="whitespace-nowrap">
        {"= "}
        <Product factors={[cols, rows]} />
      </span>
      <span className="whitespace-nowrap">
        {"= "}
        {mode === "hint" ? (
          <Hole />
        ) : (
          <Tint color="amber">{fmt(rows * cols)}</Tint>
        )}
      </span>
    </p>
  );
}

function SwapLegend() {
  return (
    <Legend
      items={[
        { color: "blue", name: "Thừa số" },
        { color: "amber", name: "Tích" },
      ]}
    />
  );
}

function SwapSteps({ spec, step }: { spec: Spec; step: number }) {
  const turned = step >= TURNED_STEP;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <p
        className="min-h-8 text-center text-body md:text-body-lg"
        aria-live="polite"
      >
        {turned
          ? gridWords(spec.cols, spec.rows)
          : gridWords(spec.rows, spec.cols)}
      </p>
      <TurningGrid spec={spec} turned={turned} />
      <Reveal
        shown={step >= PRODUCT_STEP}
        placeholder={<p className={MATH_LINE}>… = … = ?</p>}
      >
        <Products spec={spec} />
      </Reveal>
      <SwapLegend />
    </div>
  );
}

function SwapStill({ spec }: { spec: Spec }) {
  const { rows, cols } = spec;
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full items-start justify-center gap-4">
        {[
          [rows, cols],
          [cols, rows],
        ].map(([r, c]) => (
          <div
            key={`${r}-${c}`}
            className="flex w-full max-w-40 flex-col items-center gap-2"
          >
            <DotBlock
              rows={r ?? rows}
              columns={c ?? cols}
              label={`Lưới ${gridWords(r ?? rows, c ?? cols)}`}
            />
            <p className="text-center text-caption">
              {gridWords(r ?? rows, c ?? cols)}
            </p>
          </div>
        ))}
      </div>
      <Products spec={spec} />
      <SwapLegend />
    </div>
  );
}

export function Swap({ spec }: { spec: Spec }) {
  if (spec.mode === "still") return <SwapStill spec={spec} />;
  return (
    <StepPlayer
      steps={PRODUCT_STEP + 1}
      label={`Lưới ${spec.rows} ${TIMES} ${spec.cols} xoay một phần tư vòng thành lưới ${spec.cols} ${TIMES} ${spec.rows}`}
    >
      {(step) => <SwapSteps spec={spec} step={step} />}
    </StepPlayer>
  );
}

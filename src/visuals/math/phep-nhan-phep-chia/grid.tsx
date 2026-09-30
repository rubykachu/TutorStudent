"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import {
  fmt,
  GRID_RANGE,
  type GridProgress,
  gridProgress,
  TIMES,
} from "./logic-nhan";
import { DotBlock, MATH_LINE, Product, SumOf, Tint } from "./parts-nhan";

type Target = { rows: number; cols: number };

// Width of one dot cell on screen, so a grid never blows up or shrinks to
// nothing when the child changes its rows and columns.
const CELL_PX = 30;

function progressText(
  have: number,
  want: number,
  kind: GridProgress,
  words: { short: string; exact: string; over: string },
): string {
  if (kind === "short") return `${words.short} ${have}/${want}`;
  return kind === "exact" ? `${words.exact} ${want}` : `${words.over} ${want}`;
}

function Progress({
  rows,
  cols,
  target,
}: {
  rows: number;
  cols: number;
  target: Target;
}) {
  const items = [
    {
      kind: gridProgress(rows, target.rows),
      text: progressText(rows, target.rows, gridProgress(rows, target.rows), {
        short: "Đã xếp hàng:",
        exact: "Đủ số hàng:",
        over: "Nhiều hơn số hàng:",
      }),
    },
    {
      kind: gridProgress(cols, target.cols),
      text: progressText(cols, target.cols, gridProgress(cols, target.cols), {
        short: "Chấm mỗi hàng:",
        exact: "Đủ chấm mỗi hàng:",
        over: "Nhiều hơn chấm mỗi hàng:",
      }),
    },
  ];
  return (
    <ul className="flex flex-col gap-1 text-caption" aria-live="polite">
      {items.map(({ kind, text }) => (
        <li key={text} className="flex items-center gap-2">
          {kind === "exact" ? (
            <Check aria-hidden className="size-4 text-correct" />
          ) : (
            <span aria-hidden className="size-4" />
          )}
          {text}
        </li>
      ))}
    </ul>
  );
}

// The dot grid the child builds with two steppers, and the three ways the
// lesson writes it: in words, as a sum of equal rows and as a product.
// With a `target` (the hands-on screen) it also reports progress and ends on
// a closing line; without one (the exercise) it never reveals the answer.
function GridBuilder({
  target,
  onStateChange,
  shownState,
  disabled = false,
}: { target?: Target } & VisualProps) {
  const [own, setOwn] = useState<Target>({
    rows: GRID_RANGE.min,
    cols: GRID_RANGE.min,
  });
  const rows = shownState?.rows ?? own.rows;
  const cols = shownState?.cols ?? own.cols;
  const locked = disabled || shownState !== undefined;
  const done =
    target !== undefined && rows === target.rows && cols === target.cols;
  const total = rows * cols;

  function change(next: Target) {
    setOwn(next);
    const nextDone =
      target !== undefined &&
      next.rows === target.rows &&
      next.cols === target.cols;
    const state: VisualState =
      target === undefined ? next : { ...next, done: nextDone ? 1 : 0 };
    onStateChange?.(state);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex items-start justify-center gap-6">
        <NumberStepper
          label="Số hàng"
          value={rows}
          min={GRID_RANGE.min}
          max={GRID_RANGE.max}
          color="blue"
          stateKey="rows"
          disabled={locked}
          onChange={(value) => change({ rows: value, cols })}
        />
        <NumberStepper
          label="Chấm mỗi hàng"
          value={cols}
          min={GRID_RANGE.min}
          max={GRID_RANGE.max}
          color="blue"
          stateKey="cols"
          disabled={locked}
          onChange={(value) => change({ rows, cols: value })}
        />
      </div>
      {target && <Progress rows={rows} cols={cols} target={target} />}
      <div className="flex flex-col items-center gap-1" aria-live="polite">
        <p className="text-body md:text-body-lg">
          {`${rows} hàng, mỗi hàng ${cols} chấm`}
        </p>
        <p
          className={`${MATH_LINE} ${rows === 1 ? "invisible" : ""}`}
          aria-hidden={rows === 1 || undefined}
        >
          <SumOf term={cols} count={rows} />
          <span className="whitespace-nowrap">
            {"= "}
            <Tint color="amber">{fmt(total)}</Tint>
          </span>
        </p>
        <p className={MATH_LINE}>
          <Product factors={[rows, cols]} />
          <span className="whitespace-nowrap">
            {"= "}
            <Tint color="amber">{fmt(total)}</Tint>
          </span>
        </p>
      </div>
      {done && (
        <p className="rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground">
          Xong rồi! <SumOf term={cols} count={rows} />
          {` = ${rows} ${TIMES} ${cols} = ${fmt(total)}`}
        </p>
      )}
      <div className="w-full" style={{ maxWidth: cols * CELL_PX }}>
        <DotBlock
          rows={rows}
          columns={cols}
          label={`Lưới ${rows} hàng, mỗi hàng ${cols} chấm`}
        />
      </div>
    </div>
  );
}

export function GridTry({
  target,
  ...props
}: { target: Target } & VisualProps) {
  return <GridBuilder target={target} {...props} />;
}

export function GridFill(props: VisualProps) {
  return <GridBuilder {...props} />;
}

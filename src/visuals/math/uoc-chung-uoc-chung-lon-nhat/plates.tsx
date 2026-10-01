"use client";

import { Fragment } from "react";
import type { ConceptColor } from "@/schema/content";
import { DotBlock } from "@/visuals/shared/bag-groups";
import type { Mode } from "@/visuals/shared/formula-rows";
import { Hole, Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";

// Several kinds of things shared equally into the same number of plates,
// nothing left over: the picture of "the most plates is the greatest common
// divisor". Each kind has its own colour and shape.

export type PlateItem = {
  // What is counted, with its unit ("quả cam").
  label: string;
  total: number;
  color: ConceptColor;
};

// What a plates picture draws: the things, the container, how many plates
// and how it plays (a hint stops before the number of plates is named).
export type PlatesSpec = {
  items: readonly PlateItem[];
  plate: string;
  count: number;
  mode: Mode;
};

const MAX_COLUMNS = 5;

function Plate({
  items,
  count,
  index,
  plate,
}: {
  items: readonly PlateItem[];
  count: number;
  index: number;
  plate: string;
}) {
  const per = items.map((item) => item.total / count);
  const columns = Math.min(MAX_COLUMNS, Math.max(...per));
  const spoken = items.map((item, i) => `${per[i]} ${item.label}`).join(", ");
  return (
    <div
      className="flex flex-col gap-1 rounded-xl border-2 border-concept-slate bg-surface p-1.5"
      style={{ width: `calc(${columns} * 1rem + 1.25rem)` }}
      role="img"
      aria-label={`${plate} ${index + 1}: ${spoken}`}
    >
      {items.map((item, i) => (
        <DotBlock
          key={item.label}
          count={per[i] ?? 0}
          columns={columns}
          color={item.color}
          label={`${per[i]} ${item.label}`}
        />
      ))}
    </div>
  );
}

function names(items: readonly PlateItem[]): string {
  return items.map((item) => `${item.total} ${item.label}`).join(" và ");
}

export function Plates({ spec }: { spec: PlatesSpec }) {
  const { items, plate, count, mode } = spec;
  const hint = mode === "hint";
  const per = items.map((item) => item.total / count);
  const label = `Chia ${names(items)} vào ${count} ${plate} như nhau`;
  const draw = (step: number) => {
    const shown = mode === "still" ? count : Math.min(step, count);
    const done = mode === "still" || step >= count;
    const box = (i: number) => (
      <Plate items={items} count={count} index={i} plate={plate} />
    );
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <p className="text-center text-body md:text-body-lg">{names(items)}</p>
        <div className="flex max-w-xl flex-wrap items-end justify-center gap-2">
          {Array.from({ length: count }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: plates never reorder
            <Fragment key={i}>
              <Reveal shown={i < shown} placeholder={box(i)}>
                {box(i)}
              </Reveal>
            </Fragment>
          ))}
        </div>
        <div className="min-h-[3.25rem]" aria-live="polite">
          <Reveal shown={done && !hint} placeholder={<Hole />}>
            <p className={MATH_LINE}>
              <Tint color="amber">{count}</Tint>
              {` ${plate}, mỗi ${plate} có `}
              {items.map((item, i) => (
                <Fragment key={item.label}>
                  {i > 0 && " và "}
                  <Tint color={item.color}>{per[i]}</Tint>
                  {` ${item.label}`}
                </Fragment>
              ))}
            </p>
          </Reveal>
        </div>
        <Legend
          items={items.map((item) => ({
            color: item.color,
            name: item.label,
          }))}
        />
      </div>
    );
  };
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(count)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={count + 1} label={label}>
      {draw}
    </StepPlayer>
  );
}

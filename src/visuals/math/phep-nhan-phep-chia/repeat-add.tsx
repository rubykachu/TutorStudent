"use client";

import type { CSSProperties } from "react";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { fmt, TIMES } from "./logic-nhan";
import {
  capitalize,
  DotBlock,
  Hole,
  Legend,
  MATH_LINE,
  Product,
  SumOf,
  Tint,
} from "./parts-nhan";

type Spec = SpecOf<"repeatAdd">;

// Dots of a box: one row up to 5, else two rows.
function boxShape(size: number) {
  const columns = size <= 5 ? size : Math.ceil(size / 2);
  return { columns, rows: Math.ceil(size / columns) };
}

function Box({ spec, index }: { spec: Spec; index: number }) {
  const { columns, rows } = boxShape(spec.size);
  const name = `${capitalize(spec.groupWord)} ${index + 1}`;
  return (
    <div className="flex w-[4.5rem] flex-col items-center gap-1 md:w-24">
      <div className="w-full rounded-xl border-2 border-border bg-surface p-1.5">
        <DotBlock
          rows={rows}
          columns={columns}
          count={spec.size}
          label={`${name}: ${spec.size} ${spec.itemWord}`}
        />
      </div>
      <p className="text-center text-caption">{name}</p>
    </div>
  );
}

// The sum line under the boxes once `boxes` of them are on screen. The last
// line also writes the sum as a product; a hint stops at "?" there.
function SumLine({
  spec,
  boxes,
  final,
  hideResult,
}: {
  spec: Spec;
  boxes: number;
  final: boolean;
  hideResult: boolean;
}) {
  const { size, groups } = spec;
  const total = boxes * size;
  if (final) {
    return (
      <p className={MATH_LINE}>
        <SumOf term={fmt(size)} count={groups} />
        <span className="whitespace-nowrap">
          {"= "}
          <Product factors={[fmt(size), groups]} />
        </span>
        <span className="whitespace-nowrap">
          {"= "}
          {hideResult ? <Hole /> : <Tint color="amber">{fmt(total)}</Tint>}
        </span>
      </p>
    );
  }
  return (
    <p className={MATH_LINE}>
      <SumOf term={fmt(size)} count={boxes} />
      {boxes > 1 && (
        <span className="whitespace-nowrap">{`= ${fmt(total)}`}</span>
      )}
    </p>
  );
}

function RepeatAddView({ spec, step }: { spec: Spec; step: number }) {
  const { groups, size, groupWord, itemWord, mode } = spec;
  const hint = mode === "hint";
  const boxes = Math.min(step + 1, groups);
  const final = mode === "still" || step >= (hint ? groups - 1 : groups);
  const perRow = groups > 4 ? Math.ceil(groups / 2) : groups;
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-body md:text-body-lg">
        {`Mỗi ${groupWord} có ${size} ${itemWord}`}
      </p>
      <div
        className="flex max-w-[calc(var(--per-row)*4.75rem)] flex-wrap justify-center gap-2 md:max-w-[calc(var(--per-row)*6.5rem)]"
        style={{ "--per-row": perRow } as CSSProperties}
      >
        {Array.from({ length: groups }, (_, i) => (
          <Reveal
            // biome-ignore lint/suspicious/noArrayIndexKey: boxes never reorder
            key={i}
            shown={mode === "still" || i < boxes}
            placeholder={<Box spec={spec} index={i} />}
          >
            <Box spec={spec} index={i} />
          </Reveal>
        ))}
      </div>
      <div className="min-h-[4.25rem]" aria-live="polite">
        <SumLine spec={spec} boxes={boxes} final={final} hideResult={hint} />
      </div>
      <Legend
        items={[
          { color: "blue", name: "Thừa số" },
          { color: "amber", name: "Tích" },
        ]}
      />
    </div>
  );
}

export function RepeatAdd({ spec }: { spec: Spec }) {
  const label = `${spec.groups} ${spec.groupWord}, mỗi ${spec.groupWord} ${spec.size} ${spec.itemWord}, cộng lại thành ${spec.size} ${TIMES} ${spec.groups}`;
  if (spec.mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        <RepeatAddView spec={spec} step={spec.groups} />
      </figure>
    );
  }
  const steps = spec.mode === "hint" ? spec.groups : spec.groups + 1;
  return (
    <StepPlayer steps={steps} label={label}>
      {(step) => <RepeatAddView spec={spec} step={step} />}
    </StepPlayer>
  );
}

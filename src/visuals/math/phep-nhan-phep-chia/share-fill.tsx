"use client";

import { useState } from "react";
import type { VisualState } from "@/visuals/registry";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { type FillProps, QUOTIENT_COLOR, REMAINDER_COLOR } from "./chia-parts";
import { SharePicture } from "./share-picture";

const EMPTY: VisualState = { q: 0, r: 0 };
// Plates drawn when the exercise's numbers are not known.
const GENERIC_PEOPLE = 3;
// Items the pile of a generic picture has room for.
const GENERIC_CAPACITY = 16;

// `manipulate` exercise: how many items each plate gets and how many are left
// over. The picture shows what the child's two numbers mean, a pile of `r`
// beside plates of `q`, and never the answer. Reports { q, r }.
export default function ShareFill({
  params,
  onStateChange,
  shownState,
  disabled = false,
}: FillProps) {
  const total = params?.total;
  const people = params?.people ?? GENERIC_PEOPLE;
  const [state, setState] = useState<VisualState>(EMPTY);
  const view = shownState ?? state;
  const locked = disabled || shownState !== undefined;
  const q = view.q ?? 0;
  const r = view.r ?? 0;
  const placed = people * q + r;

  function change(key: "q" | "r", value: number) {
    const next = { ...state, [key]: value };
    setState(next);
    onStateChange?.(next);
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <SharePicture
        people={people}
        perPlate={q}
        pool={r}
        apart
        poolCapacity={total ?? GENERIC_CAPACITY}
        label={`${people} bạn, mỗi bạn ${q} cái, còn dư ${r} cái`}
      />
      {total !== undefined && (
        <p className="text-center text-caption" aria-live="polite">
          Đã xếp {placed} cái, có {total} cái.
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        <NumberStepper
          label="Mỗi bạn nhận"
          color={QUOTIENT_COLOR}
          value={q}
          min={0}
          max={total ?? 99}
          disabled={locked}
          stateKey="q"
          onChange={(value) => change("q", value)}
        />
        <NumberStepper
          label="Còn dư"
          color={REMAINDER_COLOR}
          value={r}
          min={0}
          max={total ?? 99}
          disabled={locked}
          stateKey="r"
          onChange={(value) => change("r", value)}
        />
      </div>
    </div>
  );
}

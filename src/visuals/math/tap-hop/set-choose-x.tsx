"use client";

import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Element, ListLine, SetName, Sign } from "./set-parts";

const RESULT_LINE = "font-heading text-title font-bold md:text-title-lg";

// The set "A = { … }" and a number x the child moves with − / +. With
// `verdict` on, the line below says whether x is in A; with it off there is
// no line, so the child compares x with the set herself.
export function ChooseX({
  elements,
  max,
  verdict,
  start,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & {
  elements: readonly number[];
  max: number;
  verdict: boolean;
  start: number;
}) {
  const [ownX, setOwnX] = useState(start);
  const x = shownState?.x ?? ownX;
  const locked = disabled || shownState !== undefined;
  const isMember = elements.includes(x);

  function change(next: number) {
    setOwnX(next);
    onStateChange?.({ x: next });
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ListLine name="A" elements={elements} />
      <NumberStepper
        label="x"
        value={x}
        min={0}
        max={max}
        color="amber"
        stateKey="x"
        disabled={locked}
        onChange={change}
      />
      {verdict && (
        <div
          aria-live="polite"
          className="flex min-h-20 flex-col items-center gap-1 text-center"
        >
          <p className={RESULT_LINE}>
            <Element>{x}</Element> <Sign inside={isMember} />{" "}
            <SetName>A</SetName>
          </p>
          <p className="text-body font-semibold">
            {isMember ? `${x} thuộc A` : `${x} không thuộc A`}
          </p>
        </div>
      )}
    </div>
  );
}

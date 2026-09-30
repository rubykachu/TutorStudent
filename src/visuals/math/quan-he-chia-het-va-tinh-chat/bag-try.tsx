"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import { Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { BagsScene } from "./bags";
import { BAG_RANGE, packBags } from "./logic";

const LEGEND = [
  { color: "violet", name: "Một túi" },
  { color: "pink", name: "Còn thừa" },
] as const;

// Bags of candy whose size the child changes with − and +. Reports { size }.
// With `goal` (the lesson screen) it reads the state back as progress and ends
// on a closing line once the bags hold the candy exactly; without it (the
// exercise) the `total` comes from the task's params and nothing is revealed.
export function BagTry({
  total: fixedTotal,
  goal,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { total: number; goal?: boolean }) {
  const total = params?.total ?? fixedTotal;
  const [own, setOwn] = useState<number>(BAG_RANGE.min);
  const [tried, setTried] = useState<readonly number[]>([BAG_RANGE.min]);
  const size = shownState?.size ?? own;
  const locked = disabled || shownState !== undefined;
  const { bags, left } = packBags(total, size);

  function change(next: number) {
    setOwn(next);
    setTried((all) => (all.includes(next) ? all : [...all, next]));
    const state: VisualState = { size: next };
    onStateChange?.(state);
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <NumberStepper
        label="Mỗi túi có"
        value={size}
        min={BAG_RANGE.min}
        max={BAG_RANGE.max}
        color="violet"
        stateKey="size"
        disabled={locked}
        onChange={change}
      />
      <p className="text-center text-body font-semibold md:text-body-lg">
        {`${total} cái kẹo, mỗi túi ${size} cái`}
      </p>
      <BagsScene total={total} size={size} shown={bags} showLeft bag="túi" />
      <p className={MATH_LINE} aria-live="polite">
        <Tint color="amber">{bags}</Tint>
        {" túi, "}
        {left === 0 ? (
          <span className="text-correct">không còn thừa</span>
        ) : (
          <Tint color="pink">{`còn thừa ${left}`}</Tint>
        )}
      </p>
      {goal && (
        <p className="text-center text-caption text-muted-foreground">
          {`Đã thử ${tried.length} cỡ túi`}
        </p>
      )}
      {goal && left === 0 && (
        <p className="flex items-center gap-2 rounded-lg bg-correct-soft px-4 py-2 text-center font-heading text-block font-semibold text-correct-soft-foreground">
          <Check aria-hidden className="size-5" />
          {`Xong rồi! ${total} cái vừa hết ${bags} túi ${size} cái.`}
        </p>
      )}
      <Legend items={LEGEND} />
    </div>
  );
}

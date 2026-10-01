"use client";

import { useState } from "react";
import type { VisualProps, VisualState } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import type { SlotsSpec } from "./catalog";
import {
  DIGIT_RANGE,
  digitsOf,
  groupedText,
  placeLabel,
  placePower,
  slotKey,
  slotsNumber,
} from "./logic";
import { Digit } from "./places";

// A number built one digit at a time: a − / + stepper for every place, the
// number they spell above. Reports { d0, d1, … }, d0 the leftmost digit; a
// slot never touched is left out. On a lesson screen with a goal, "Tiếp"
// waits until the number is the goal; "Xem cách làm" fills the slots.
export function Slots({
  spec,
  params,
  onStateChange,
  shownState,
  disabled = false,
}: VisualProps & { spec: SlotsSpec }) {
  const len = params?.len ?? spec.len;
  const goal = params ? undefined : spec.goal;
  const [own, setOwn] = useState<Readonly<VisualState>>({});
  const state = shownState ?? own;
  const locked = disabled || shownState !== undefined;
  const guided = isLessonScreen(params) && goal !== undefined;
  const built = slotsNumber(state, len);
  const met =
    goal !== undefined && built === goal && String(goal).length === len;

  function report(next: VisualState) {
    setOwn(next);
    onStateChange?.(next);
  }

  const { shown } = useGuidedGoal({
    met,
    guided,
    reveal: () =>
      report(
        Object.fromEntries(
          digitsOf(goal ?? 0).map((digit, i) => [slotKey(i), digit]),
        ),
      ),
  });

  const indexes = Array.from({ length: len }, (_, i) => i);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        role="img"
        aria-label={
          built === undefined
            ? "Số bạn đang viết, còn ô trống"
            : `Số bạn đang viết là ${groupedText(built)}`
        }
        className="flex gap-1.5"
      >
        {indexes.map((i) => (
          <Digit key={i} digit={state[slotKey(i)]} size="big" />
        ))}
      </div>
      <div className="grid w-full max-w-sm grid-cols-2 gap-x-4 gap-y-3 ">
        {indexes.map((i) => (
          <NumberStepper
            key={i}
            label={`Chữ số ${placeLabel(placePower(i, len))}`}
            value={state[slotKey(i)]}
            min={DIGIT_RANGE.min}
            max={DIGIT_RANGE.max}
            color="blue"
            stateKey={slotKey(i)}
            disabled={locked}
            onChange={(digit) => report({ ...state, [slotKey(i)]: digit })}
          />
        ))}
      </div>
      {guided && met && !shown && (
        <DoneLine data-slots-done>
          Xong rồi! Từ hàng lớn nhất, hàng nào thiếu thì viết chữ số 0.
        </DoneLine>
      )}
      {guided && shown && (
        <ShownLine data-slots-shown>
          Từ hàng lớn nhất, hàng nào thiếu thì viết chữ số 0.
        </ShownLine>
      )}
    </div>
  );
}

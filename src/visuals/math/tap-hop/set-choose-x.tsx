"use client";

import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Element, ListLine, SetName, Sign } from "./set-parts";

const RESULT_LINE = "font-heading text-title font-bold md:text-title-lg";

// The set "A = { … }" and a number x the child moves with − / +. With
// `verdict` on, the line below says whether x is in A; with it off there is
// no line, so the child compares x with the set herself. On a lesson screen
// with a verdict, "Tiếp" waits until the child has seen both cases (x in A and
// x not in A); "Xem cách làm" moves x to the case not seen yet.
export function ChooseX({
  elements,
  max,
  verdict,
  start,
  params,
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
  const guided = isLessonScreen(params) && verdict;
  const [seen, setSeen] = useState({
    inside: elements.includes(start),
    outside: !elements.includes(start),
  });
  const bothSeen = seen.inside && seen.outside;
  const { shown } = useGuidedGoal({
    met: bothSeen,
    guided,
    reveal: () => {
      const other = Array.from({ length: max + 1 }, (_, n) => n).find(
        (n) => elements.includes(n) !== isMember,
      );
      if (other !== undefined) change(other);
    },
  });

  function change(next: number) {
    setOwnX(next);
    const inside = elements.includes(next);
    setSeen((all) => ({
      inside: all.inside || inside,
      outside: all.outside || !inside,
    }));
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
      {guided && bothSeen && !shown && (
        <DoneLine data-choose-done>
          Xong rồi! x nằm trong A thì viết ∈, không thì viết ∉.
        </DoneLine>
      )}
      {guided && shown && (
        <ShownLine data-choose-shown>
          x nằm trong A thì viết ∈, không thì viết ∉.
        </ShownLine>
      )}
    </div>
  );
}

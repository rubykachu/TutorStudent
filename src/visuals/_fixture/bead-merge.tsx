"use client";

import { BeadGroup } from "@/visuals/shared/bead-group";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Highlight } from "@/visuals/shared/highlight";
import { StepPlayer } from "@/visuals/shared/step-player";

// 2³ · 2²: split groups, then the exponents lit, then one row of five beads.
const STEP_COUNT = 3;
const EXPONENTS_STEP = 1;
const MERGED_STEP = 2;

function Power({ exponent, lit }: { exponent: number; lit: boolean }) {
  return (
    <span>
      2
      <sup className="text-concept-violet">
        {/* <sup> has line-height 0; the ring needs a real box to wrap. */}
        <Highlight active={lit} color="violet" className="px-1 leading-none">
          {exponent}
        </Highlight>
      </sup>
    </span>
  );
}

export default function BeadMerge() {
  return (
    <StepPlayer steps={STEP_COUNT} label="Nhân hai luỹ thừa cùng cơ số">
      {(step) => {
        const merged = step >= MERGED_STEP;
        const lit = step >= EXPONENTS_STEP;
        return (
          <div className="flex w-full flex-col items-center gap-6">
            <BeadGroup
              groups={[
                { color: "blue", count: 3, text: "2" },
                { color: "blue", count: 2, text: "2" },
              ]}
              merged={merged}
              label={
                merged
                  ? "Năm hạt số 2 xếp thành một hàng"
                  : "Ba hạt số 2 và hai hạt số 2"
              }
            />
            <p className="flex items-baseline gap-3 font-heading text-title font-bold md:text-title-lg">
              <Power exponent={3} lit={lit && !merged} />
              <span aria-hidden>·</span>
              <Power exponent={2} lit={lit && !merged} />
              {merged && (
                <>
                  <span>=</span>
                  <Power exponent={5} lit />
                </>
              )}
            </p>
            <ul className="flex gap-6 text-caption text-muted-foreground">
              <li className="flex items-center gap-2">
                <ConceptMark color="blue" />
                Cơ số
              </li>
              <li className="flex items-center gap-2">
                <ConceptMark color="violet" />
                Số mũ
              </li>
            </ul>
          </div>
        );
      }}
    </StepPlayer>
  );
}

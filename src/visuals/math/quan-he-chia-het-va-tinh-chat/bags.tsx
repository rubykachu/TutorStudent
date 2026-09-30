"use client";

import { Fragment } from "react";
import { Hole, Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { packBags } from "./logic";
import { BagBox } from "./parts";

type Spec = SpecOf<"bags">;

// What the colours of a bag picture stand for; `bag` names the container.
export function bagLegend(bag: string) {
  return [
    { color: "violet", name: `Một ${bag}` },
    { color: "pink", name: "Còn thừa" },
  ] as const;
}

// The bags of a number: `shown` full bags, then the left-over box. `pending`
// draws the left-over box as a "?" (a hint stops before it is known).
export function BagsScene({
  total,
  size,
  shown,
  showLeft,
  leftPending = false,
  bag,
  unit,
}: {
  total: number;
  size: number;
  shown: number;
  showLeft: boolean;
  leftPending?: boolean;
  bag: string;
  // Name of one item ("cái", "viên"), for the spoken labels.
  unit: string;
}) {
  const { bags, left } = packBags(total, size);
  return (
    <div className="flex max-w-xl flex-wrap items-end justify-center gap-2">
      {Array.from({ length: bags }, (_, i) => {
        const box = (
          <BagBox
            count={size}
            size={size}
            tone="bag"
            label={`${capital(bag)} ${i + 1}: ${size} ${unit}`}
          />
        );
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: bags never reorder
          <Fragment key={i}>
            <Reveal shown={i < shown} placeholder={box}>
              {box}
            </Reveal>
          </Fragment>
        );
      })}
      {(left > 0 || leftPending) && (
        <Reveal
          shown={showLeft}
          placeholder={
            <BagBox count={1} size={size} tone="pending" label="Số còn thừa" />
          }
        >
          <BagBox
            count={leftPending ? 1 : left}
            size={size}
            tone={leftPending ? "pending" : "left"}
            label={`Còn thừa ${left} ${unit}`}
          />
        </Reveal>
      )}
    </div>
  );
}

function capital(word: string): string {
  return word.charAt(0).toLocaleUpperCase("vi") + word.slice(1);
}

// Equation line: the total as bags of `size`, plus what is left. With an
// open total the number of items and of bags stay the letters a and q.
function Equation({
  total,
  size,
  bags,
  left,
  hideLeft,
  open,
}: {
  total: number;
  size: number;
  bags: number;
  left: number;
  hideLeft: boolean;
  open: boolean;
}) {
  return (
    <p className={MATH_LINE}>
      <Tint color="blue">{open ? "a" : total}</Tint>
      <span className="whitespace-nowrap">
        {"= "}
        <Tint color="violet">{size}</Tint>
        {" · "}
        <Tint color="amber">{open ? "q" : bags}</Tint>
        {(left > 0 || hideLeft) && (
          <>
            {" + "}
            {hideLeft ? <Hole /> : <Tint color="pink">{left}</Tint>}
          </>
        )}
      </span>
    </p>
  );
}

function BagsView({ spec, step }: { spec: Spec; step: number }) {
  const { total, size, thing, bag, unit, mode, openTotal } = spec;
  const { bags, left } = packBags(total, size);
  const hint = mode === "hint";
  const final = mode === "still" || step >= bags;
  const shown = mode === "still" ? bags : Math.min(step, bags);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <p className="text-center text-body md:text-body-lg">
        {openTotal
          ? `Mỗi ${bag} ${size} ${unit}, còn thừa ${left} ${unit}`
          : `${total} ${unit} ${thing}, mỗi ${bag} ${size} ${unit}`}
      </p>
      <BagsScene
        total={total}
        size={size}
        shown={final ? bags : shown}
        showLeft={final}
        leftPending={hint}
        bag={bag}
        unit={unit}
      />
      <div className="min-h-[3.25rem]" aria-live="polite">
        {final ? (
          <Equation
            total={total}
            size={size}
            bags={bags}
            left={left}
            hideLeft={hint}
            open={openTotal === true}
          />
        ) : shown === 0 ? (
          <p className={MATH_LINE}>
            <Tint color="blue">{openTotal ? "a" : total}</Tint>
            <span className="whitespace-nowrap">
              {"= "}
              <Tint color="violet">{size}</Tint>
              {" · "}
              <Hole />
            </span>
          </p>
        ) : (
          <p className={MATH_LINE}>
            <Tint color="violet">{size}</Tint>
            {" · "}
            <Tint color="amber">{shown}</Tint>
            <span className="whitespace-nowrap">{`= ${size * shown}`}</span>
          </p>
        )}
      </div>
      {final && !hint && (
        <p className="text-center font-heading text-block font-semibold">
          {left === 0 ? "Không còn thừa" : `Còn thừa ${left} ${unit}`}
        </p>
      )}
      <Legend items={bagLegend(bag)} />
    </div>
  );
}

export function Bags({ spec }: { spec: Spec }) {
  const { total, size, bag, unit, openTotal } = spec;
  const { bags } = packBags(total, size);
  const label = openTotal
    ? `Xếp vào các ${bag}, mỗi ${bag} ${size} ${unit}, còn thừa ${total % size} ${unit}`
    : `Chia ${total} ${unit} vào các ${bag}, mỗi ${bag} ${size} ${unit}`;
  if (spec.mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        <BagsView spec={spec} step={bags} />
      </figure>
    );
  }
  return (
    <StepPlayer steps={bags + 1} label={label}>
      {(step) => <BagsView spec={spec} step={step} />}
    </StepPlayer>
  );
}

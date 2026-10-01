"use client";

import { Fragment } from "react";
import type { ConceptColor } from "@/schema/content";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import type { Mode } from "@/visuals/shared/formula-rows";
import { Hole, Legend, MATH_LINE, Tint } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";

// Pictures of items packed into bags: the dot blocks, one bag, the scene of
// bags and the walk-through `Bags`.

const DOT_CELL = 32;

// `count` dots in `columns` columns, in a concept colour; the first `gone`
// are drawn as empty slots (taken away). Its width follows the columns, so
// bags of the same size line up.
export function DotBlock({
  count,
  columns,
  color,
  label,
  gone = 0,
}: {
  count: number;
  columns: number;
  color: ConceptColor;
  label: string;
  gone?: number;
}) {
  const rows = Math.max(1, Math.ceil(count / columns));
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${columns * DOT_CELL} ${rows * DOT_CELL}`}
      className="h-auto w-full"
    >
      {Array.from({ length: count }, (_, i) => (
        <ConceptShape
          // biome-ignore lint/suspicious/noArrayIndexKey: dots are placed by position
          key={i}
          color={color}
          variant={i < gone ? "outline" : "filled"}
          cx={(i % columns) * DOT_CELL + DOT_CELL / 2}
          cy={Math.floor(i / columns) * DOT_CELL + DOT_CELL / 2}
          r={DOT_CELL * 0.36}
        />
      ))}
    </svg>
  );
}

// Columns of a bag holding `size` dots: one row up to 4, then a squarer block.
export function bagColumns(size: number): number {
  if (size <= 4) return size;
  if (size <= 6) return 3;
  if (size <= 8) return 4;
  return 5;
}

const BOX_TONES = {
  bag: "border-concept-violet bg-surface",
  left: "border-concept-pink border-dashed bg-surface",
  pending: "border-muted-foreground border-dashed bg-muted",
} as const;
export type BoxTone = keyof typeof BOX_TONES;

// A bag of items: solid violet box with blue dots, the left-over items in a
// dashed pink box with pink dots, or a dashed grey box still to be filled.
export function BagBox({
  count,
  size,
  tone,
  label,
  compact = false,
  gone = 0,
}: {
  count: number;
  size: number;
  tone: BoxTone;
  label: string;
  // Smaller dots, for pictures that stack several rows of bags.
  compact?: boolean;
  // How many of the first dots were taken away (drawn as empty slots).
  gone?: number;
}) {
  const columns = Math.min(bagColumns(size), Math.max(count, 1));
  return (
    <div
      className={`rounded-xl border-2 p-1.5 ${BOX_TONES[tone]}`}
      style={{
        width: `calc(${columns} * ${compact ? 0.85 : 1.25}rem + ${compact ? 1 : 1.25}rem)`,
      }}
    >
      {tone === "pending" ? (
        <p
          role="img"
          aria-label={label}
          className="py-1 text-center font-heading text-block font-bold text-muted-foreground"
        >
          ?
        </p>
      ) : (
        <DotBlock
          count={count}
          columns={columns}
          color={tone === "left" ? "pink" : "blue"}
          label={label}
          gone={gone}
        />
      )}
    </div>
  );
}

// `total` items packed into bags of `size`, one bag per step; what is left
// over is the remainder. `thing` names the items, `unit` one item and `bag`
// the container. With `openTotal` the picture never states the total: it
// says the bag size and the remainder, and the equation keeps the letters
// a and q.
export type BagsSpec = {
  total: number;
  size: number;
  thing: string;
  unit: string;
  bag: string;
  mode: Mode;
  openTotal?: boolean;
  // Writes the number of bags as plain text: a lesson whose own concepts use
  // the bag-count colour for something else keeps the picture from teaching
  // two meanings for one colour.
  plainBagCount?: boolean;
};

// `total` items packed into bags of `size`: full bags and what is left over.
export function packBags(
  total: number,
  size: number,
): { bags: number; left: number } {
  return { bags: Math.floor(total / size), left: total % size };
}

// What the colours of a bag picture stand for; `bag` names the container.
// "Còn thừa" is listed only when something is left over.
export function bagLegend(bag: string, hasLeft = true) {
  const items: { color: ConceptColor; name: string }[] = [
    { color: "violet", name: `Một ${bag}` },
  ];
  if (hasLeft) items.push({ color: "pink", name: "Còn thừa" });
  return items;
}

// The number of bags, tinted in its concept colour unless `plain`.
function BagCount({
  value,
  plain,
}: {
  value: number | string;
  plain: boolean;
}) {
  return plain ? value : <Tint color="amber">{value}</Tint>;
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
  plain,
}: {
  total: number;
  size: number;
  bags: number;
  left: number;
  hideLeft: boolean;
  open: boolean;
  plain: boolean;
}) {
  return (
    <p className={MATH_LINE}>
      <Tint color="blue">{open ? "a" : total}</Tint>
      <span className="whitespace-nowrap">
        {"= "}
        <Tint color="violet">{size}</Tint>
        {" · "}
        <BagCount value={open ? "q" : bags} plain={plain} />
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

function BagsView({ spec, step }: { spec: BagsSpec; step: number }) {
  const { total, size, thing, bag, unit, mode, openTotal, plainBagCount } =
    spec;
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
            plain={plainBagCount === true}
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
            <BagCount value={shown} plain={plainBagCount === true} />
            <span className="whitespace-nowrap">{`= ${size * shown}`}</span>
          </p>
        )}
      </div>
      {final && !hint && (
        <p className="text-center font-heading text-block font-semibold">
          {left === 0 ? "Không còn thừa" : `Còn thừa ${left} ${unit}`}
        </p>
      )}
      <Legend items={bagLegend(bag, left > 0 || hint)} />
    </div>
  );
}

export function Bags({ spec }: { spec: BagsSpec }) {
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

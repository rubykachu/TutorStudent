"use client";

import { useState } from "react";
import { Formula } from "@/components/blocks/formula";
import type { VisualProps } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Pending } from "@/visuals/shared/formula-rows";
import {
  DoneLine,
  isLessonScreen,
  ShownLine,
  useGuidedGoal,
} from "@/visuals/shared/guided-feedback";
import { Region, RegionSvg } from "@/visuals/shared/region";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { PlacesExploreSpec, PlacesPickSpec, PlacesSpec } from "./catalog";
import {
  digitsOf,
  groupedText,
  placeLabel,
  placeName,
  placePower,
  sumTex,
  valueTex,
} from "./logic";

// Pictures of a number written with digits: its digits in tiles, the place
// (hàng) each one sits in, the value each one has, and their sum. Digits are
// blue (chữ số), places violet (hàng), values pink (giá trị của chữ số).

const TILE =
  "flex shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border-2 font-heading font-bold tabular-nums";
const DIGIT_TONE = `${CONCEPT_CLASSES.blue.border} ${CONCEPT_CLASSES.blue.text} bg-concept-blue/15`;
const EMPTY_TONE = `border-dashed ${CONCEPT_CLASSES.blue.border} text-muted-foreground bg-surface`;
const PICKED_TONE = `border-foreground ${CONCEPT_CLASSES.blue.text} bg-highlight`;
// A group of three digits is set apart from the next, as in "4 273 105".
const GROUP_GAP = "ml-3";

// One digit tile; `undefined` is the empty slot, a dashed "?".
export function Digit({
  digit,
  size,
  picked = false,
}: {
  digit: number | undefined;
  size: "big" | "small";
  picked?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`${TILE} ${digit === undefined ? EMPTY_TONE : picked ? PICKED_TONE : DIGIT_TONE} w-11 ${size === "big" ? "h-16 text-title" : "h-12 text-block"}`}
    >
      {digit ?? "?"}
    </span>
  );
}

function PlaceName({ power }: { power: number }) {
  return (
    <span
      className={`flex items-center gap-1.5 text-caption leading-tight ${CONCEPT_CLASSES.violet.text}`}
    >
      <ConceptMark color="violet" className="size-3.5" />
      {placeLabel(power)}
    </span>
  );
}

// The digits side by side, optionally with the name of each place under it.
// `named` is how many places, counted from the right, already show a name.
export function PlaceColumns({
  digits,
  named,
  picked,
  label,
}: {
  digits: readonly number[];
  named: number;
  picked?: number;
  label: string;
}) {
  const wide = digits.length <= 4;
  return (
    <div role="img" aria-label={label} className="flex justify-center">
      {digits.map((digit, i) => {
        const power = placePower(i, digits.length);
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
            key={i}
            className={`flex flex-col items-center gap-1.5 ${wide ? "w-[4.5rem]" : "w-[3.25rem]"} ${power % 3 === 2 && i > 0 ? GROUP_GAP : ""}`}
          >
            <Digit digit={digit} size="big" picked={i === picked} />
            <Reveal shown={power < named} className="w-full">
              <span
                className={`block text-center text-caption leading-tight ${CONCEPT_CLASSES.violet.text}`}
              >
                {placeName(power)}
              </span>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}

// One row per digit: the tile, its place and its value. What is not shown yet
// keeps its space and reads "?", so nothing jumps. `valueShown` null leaves the
// value column out (rows that only name the places).
function PlaceRow({
  digit,
  power,
  nameShown = true,
  valueShown,
  picked,
  onTap,
  disabled,
}: {
  digit: number;
  power: number;
  nameShown?: boolean;
  valueShown: boolean | null;
  picked: boolean;
  onTap?: () => void;
  disabled?: boolean;
}) {
  const unknown = (
    <span className="font-heading text-block font-bold text-muted-foreground">
      ?
    </span>
  );
  const body = (
    <>
      <Digit digit={digit} size="small" picked={picked} />
      <span className="w-40 shrink-0 text-left">
        {nameShown ? <PlaceName power={power} /> : unknown}
      </span>
      {valueShown !== null && (
        <span className="min-w-0 flex-1 text-left">
          {valueShown ? (
            <Formula
              tex={`\\concept{pink}{${valueTex(digit, power)}}`}
              className="text-body-lg"
            />
          ) : (
            unknown
          )}
        </span>
      )}
    </>
  );
  if (!onTap) {
    return <div className="flex items-center gap-3">{body}</div>;
  }
  const answered = valueShown === null ? nameShown : valueShown;
  return (
    <button
      type="button"
      className="flex min-h-touch w-full items-center gap-3 rounded-lg border-2 border-transparent px-1 text-left motion-safe:transition-transform motion-safe:active:scale-97 enabled:hover:border-border"
      disabled={disabled}
      aria-pressed={answered}
      aria-label={`Chữ số ${digit}${answered ? `, ${placeLabel(power)}` : ", chạm để xem"}`}
      onClick={onTap}
    >
      {body}
    </button>
  );
}

function labelOf(spec: PlacesSpec): string {
  const text = groupedText(spec.n);
  const digits = digitsOf(spec.n).join(", ");
  switch (spec.show) {
    case "none":
      return `Số ${text} viết bằng các chữ số ${digits}`;
    case "names":
      return `Số ${text}: mỗi chữ số đứng ở một hàng, từ hàng đơn vị bên phải`;
    case "values":
      return `Số ${text}: giá trị của từng chữ số`;
    case "sum":
      return `Số ${text} bằng tổng giá trị các chữ số của nó`;
  }
}

// Steps of a picture: names appear one place at a time, rows one digit at a
// time (the sum comes last). In a hint the last line stays a dimmed "?".
function stepCount(spec: PlacesSpec, digitCount: number): number {
  switch (spec.show) {
    case "none":
      return 1;
    case "names":
      return digitCount + 1;
    case "values":
      return digitCount;
    case "sum":
      return digitCount + 1;
  }
}

export function Places({ spec }: { spec: PlacesSpec }) {
  const digits = digitsOf(spec.n);
  const count = digits.length;
  const hint = spec.mode === "hint";
  const label = labelOf(spec);
  const lastStep = stepCount(spec, count) - 1;

  const draw = (step: number) => {
    if (spec.show === "none" || spec.show === "names") {
      return (
        <PlaceColumns
          digits={digits}
          named={spec.show === "names" ? step : 0}
          picked={spec.focus}
          label={label}
        />
      );
    }
    const sum = spec.show === "sum";
    return (
      <div className="flex w-full max-w-md flex-col items-stretch gap-2">
        {digits.map((digit, i) => (
          <PlaceRow
            // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
            key={i}
            digit={digit}
            power={placePower(i, count)}
            valueShown={step >= i && !(hint && !sum && i === count - 1)}
            picked={i === spec.focus}
          />
        ))}
        {sum && (
          <div className="mt-1 flex justify-center" aria-live="polite">
            <Reveal
              shown={step >= count && !hint}
              placeholder={<Pending />}
              className="text-center"
            >
              <Formula
                tex={`${groupedTex(spec.n)} = ${sumTex(spec.n)}`}
                className="text-body-lg"
              />
            </Reveal>
          </div>
        )}
      </div>
    );
  };

  if (spec.mode === "still" || spec.show === "none") {
    return (
      <figure aria-label={label} className="w-full">
        <div className="flex justify-center">{draw(lastStep)}</div>
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? lastStep : lastStep + 1} label={label}>
      {draw}
    </StepPlayer>
  );
}

// The number in TeX with thin spaces between groups of three digits.
function groupedTex(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");
}

// A lesson screen where each digit's row hides its place (or its value) until
// the child taps it. On a lesson screen "Tiếp" waits until every row has been
// seen; "Xem cách làm" opens them all.
export function PlacesExplore({
  spec,
  params,
}: { spec: PlacesExploreSpec } & Pick<VisualProps, "params">) {
  const digits = digitsOf(spec.n);
  const count = digits.length;
  const [seen, setSeen] = useState<readonly boolean[]>(() =>
    digits.map(() => false),
  );
  const guided = isLessonScreen(params);
  const total = seen.filter(Boolean).length;
  const { shown } = useGuidedGoal({
    met: total === count,
    guided,
    reveal: () => setSeen(digits.map(() => true)),
  });
  const closing =
    spec.ask === "name"
      ? "Mỗi chữ số đứng ở một hàng, tính từ bên phải."
      : "Mỗi chữ số có giá trị riêng, tuỳ hàng nó đứng.";

  function open(index: number) {
    setSeen((all) => all.map((value, i) => value || i === index));
  }

  return (
    <div className="flex w-full max-w-md flex-col items-stretch gap-3">
      <figure
        aria-label={`Số ${groupedText(spec.n)}: chạm vào từng chữ số để xem ${spec.ask === "name" ? "hàng" : "giá trị"}`}
        className="flex flex-col gap-2"
      >
        {digits.map((digit, i) => (
          <PlaceRow
            // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
            key={i}
            digit={digit}
            power={placePower(i, count)}
            nameShown={spec.ask === "value" || seen[i] === true}
            valueShown={spec.ask === "value" ? seen[i] === true : null}
            picked={false}
            onTap={() => open(i)}
          />
        ))}
      </figure>
      <p
        className="text-center text-caption text-muted-foreground"
        aria-live="polite"
      >
        {`Đã xem ${total}/${count}`}
      </p>
      {guided && total === count && !shown && (
        <DoneLine data-places-done>{`Xong rồi! ${closing}`}</DoneLine>
      )}
      {guided && shown && <ShownLine data-places-shown>{closing}</ShownLine>}
    </div>
  );
}

const PICK_TILE = { w: 52, h: 64, gap: 8, group: 12, pad: 4 } as const;

// The digits as tappable tiles, for "chạm vào chữ số hàng ..." exercises. No
// place names are drawn: naming the places is what the child is asked.
export function PlacesPick({ spec }: { spec: PlacesPickSpec }) {
  const digits = digitsOf(spec.n);
  const xs: number[] = [];
  let x = PICK_TILE.pad;
  digits.forEach((_, i) => {
    const power = placePower(i, digits.length);
    if (i > 0) x += power % 3 === 2 ? PICK_TILE.group : PICK_TILE.gap;
    xs.push(x);
    x += PICK_TILE.w;
  });
  const width = x + PICK_TILE.pad;
  return (
    <RegionSvg
      label={`Số ${groupedText(spec.n)}: chạm vào một chữ số`}
      viewBox={`0 0 ${width} ${PICK_TILE.h + PICK_TILE.pad * 2}`}
      className="h-auto w-full max-w-sm"
    >
      {digits.map((digit, i) => (
        <Region
          // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
          key={i}
          id={`d${i}`}
          label={`Chữ số ${digit}, vị trí thứ ${i + 1} từ bên trái`}
        >
          <rect
            x={xs[i]}
            y={PICK_TILE.pad}
            width={PICK_TILE.w}
            height={PICK_TILE.h}
            rx={10}
            className="fill-concept-blue/15"
          />
          <text
            x={(xs[i] ?? 0) + PICK_TILE.w / 2}
            y={PICK_TILE.pad + PICK_TILE.h / 2 + 11}
            textAnchor="middle"
            fontSize={32}
            fontWeight={700}
            className="fill-concept-blue font-heading"
          >
            {digit}
          </text>
        </Region>
      ))}
    </RegionSvg>
  );
}

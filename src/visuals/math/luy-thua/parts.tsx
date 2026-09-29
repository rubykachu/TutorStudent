"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Fragment, type ReactNode } from "react";
import { THOUSANDS_SEPARATOR } from "@/lib/number-format";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { useVisualTransition } from "@/visuals/shared/motion";
import { PowerText } from "@/visuals/shared/power-text";

// Pieces shared by the visuals of this lesson.

// "2 · 2 · 2": equal factors in the base colour. Past `maxShown` factors the
// middle collapses to "…" so the row always fits a phone.
export function FactorRow({
  base,
  count,
  maxShown = 6,
}: {
  base: ReactNode;
  count: number;
  maxShown?: number;
}) {
  const shown =
    count <= maxShown
      ? Array.from({ length: count }, () => base)
      : [base, base, "…", base];
  return (
    <span className="whitespace-nowrap">
      {shown.map((factor, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: factors never reorder
        <Fragment key={i}>
          {i > 0 && <span className="mx-1.5 text-foreground">·</span>}
          <span
            className={
              factor === "…" ? "text-foreground" : CONCEPT_CLASSES.blue.text
            }
          >
            {factor}
          </span>
        </Fragment>
      ))}
    </span>
  );
}

// "▲ 3 thừa số": how many equal factors a product has, in the exponent colour
// because that count is what becomes the exponent. `working` shows how the
// count was found, e.g. "2 + 4 =" before "6 thừa số".
export function FactorCount({
  count,
  working,
}: {
  // A number, "?" while a step still has to work it out, or a letter.
  count: ReactNode;
  working?: string;
}) {
  return (
    <span className="flex items-center gap-2 text-body text-concept-violet md:text-body-lg">
      <ConceptMark color="violet" className="size-4" />
      <span>
        {working && `${working} `}
        {count} thừa số
      </span>
    </span>
  );
}

// "● Cơ số  ▲ Số mũ": the legend under a visual that shows powers.
export function PowerLegend() {
  return (
    <ul className="flex gap-6 text-body md:text-body-lg">
      <li className="flex items-center gap-2">
        <ConceptMark color="blue" className="size-5" />
        Cơ số
      </li>
      <li className="flex items-center gap-2">
        <ConceptMark color="violet" className="size-5" />
        Số mũ
      </li>
    </ul>
  );
}

// The large line of maths every visual of the lesson centres on.
export const MATH_LINE =
  "flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-heading text-title font-bold md:text-title-lg";

export const ACTION_BUTTON =
  "inline-flex min-h-touch items-center justify-center gap-1 whitespace-nowrap rounded-lg border-2 border-border bg-surface px-3 font-semibold md:gap-2 md:px-4 text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

// Opacity of a row that is still to come, dim enough to read as "not yet".
const PENDING_OPACITY = 0.35;

// Rows still to come keep their space, so later steps of an explainer never
// push the earlier rows around. With a `placeholder` (the row with "?" where
// its result will be) the row shows dimmed, so the child sees what is coming
// instead of a blank gap; without one it is hidden, from screen readers too.
export function Reveal({
  shown,
  children,
  placeholder,
  className = "",
}: {
  shown: boolean;
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
}) {
  const transition = useVisualTransition();
  const pending = !shown && placeholder !== undefined;
  return (
    <motion.div
      initial={false}
      animate={{ opacity: shown ? 1 : pending ? PENDING_OPACITY : 0 }}
      transition={transition}
      aria-hidden={pending || undefined}
      className={`${shown || pending ? "" : "invisible"} ${className}`}
    >
      {pending ? placeholder : children}
    </motion.div>
  );
}

// A rule or recap screen: the sentence to remember in body text, never a grey
// caption, above a labelled example that shows it.
export function RuleCard({
  rule,
  children,
}: {
  rule: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <p className="max-w-prose text-center font-semibold">{rule}</p>
      {children}
    </div>
  );
}

// Why a sum by place value skips a place: "0 · 10² = 0, nên không cần viết
// số hạng này." for each zero digit of `value` (the units place excepted,
// which never has a power of 10 to drop).
export function ZeroTermNote({ value }: { value: number }) {
  const digits = [...String(value)].map(Number);
  const zeroPlaces = digits
    .map((digit, i) => ({ digit, exponent: digits.length - 1 - i }))
    .filter(({ digit, exponent }) => digit === 0 && exponent > 0);
  if (zeroPlaces.length === 0) return null;
  return (
    <div className="flex flex-col items-center">
      {zeroPlaces.map(({ exponent }) => (
        <p key={exponent} className="text-center">
          0 ·{" "}
          {exponent === 1 ? (
            <span className="text-concept-blue">10</span>
          ) : (
            <PowerText base={10} exponent={exponent} />
          )}{" "}
          = 0, nên không cần viết số hạng này.
        </p>
      ))}
    </div>
  );
}

// 10ⁿ is 1 followed by n zeros: the zeros take the exponent colour so the
// child sees that their count is the exponent.
export function ZerosInColour({ value }: { value: string }) {
  return (
    <span className="whitespace-nowrap">
      {[...value].map((char, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: digits never reorder
          key={i}
          className={
            char === "0"
              ? "text-concept-violet"
              : char === THOUSANDS_SEPARATOR
                ? // Wide enough to read "1 000" as grouped, as KaTeX's \, does.
                  "inline-block w-[0.25em]"
                : undefined
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// A large power with its parts named: "● Cơ số →" before the base and
// "← Số mũ ▲" level with the raised exponent.
export function PowerAnatomy({
  base,
  exponent,
}: {
  base: ReactNode;
  exponent: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      <span className="flex items-center gap-1 text-body text-concept-blue md:text-body-lg">
        <ConceptMark color="blue" className="size-4" />
        Cơ số
        <ArrowRight aria-hidden className="size-5" />
      </span>
      <PowerText
        base={base}
        exponent={exponent}
        className="font-heading text-[4rem] leading-none font-bold md:text-[5rem]"
      />
      <span className="flex items-center gap-1 self-start text-body text-concept-violet md:text-body-lg">
        <ArrowLeft aria-hidden className="size-5" />
        Số mũ
        <ConceptMark color="violet" className="size-4" />
      </span>
    </div>
  );
}

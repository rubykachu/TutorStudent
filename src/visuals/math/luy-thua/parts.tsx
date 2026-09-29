"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Fragment, type ReactNode } from "react";
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
  count: number;
  working?: string;
}) {
  return (
    <span className="flex items-center gap-2 text-body text-concept-violet md:text-body-lg">
      <ConceptMark color="violet" className="size-4" />
      {working ? `${working} ${count} thừa số` : `${count} thừa số`}
    </span>
  );
}

// "● Cơ số  ▲ Số mũ": the legend under a visual that shows powers.
export function PowerLegend() {
  return (
    <ul className="flex gap-6 text-caption text-muted-foreground">
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

// Hidden rows keep their space, so later steps of an explainer never push
// the earlier rows around; `invisible` also hides them from screen readers.
export function Reveal({
  shown,
  children,
  className = "",
}: {
  shown: boolean;
  children: ReactNode;
  className?: string;
}) {
  const transition = useVisualTransition();
  return (
    <motion.div
      initial={false}
      animate={{ opacity: shown ? 1 : 0 }}
      transition={transition}
      className={`${shown ? "" : "invisible"} ${className}`}
    >
      {children}
    </motion.div>
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

"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { useVisualTransition } from "@/visuals/shared/motion";
import { formatNumber, type Op } from "./types";

// Pieces shared by the regrouping, shifting and bar-model pictures.

export const OP_SIGN: Record<Op, string> = { add: "+", sub: "−" };

// Backgrounds of bars, spelled out in full for Tailwind: `solid` for a bar
// with no text on it, `tint` for a box that holds a number in the concept's
// text colour.
export const BAR_FILL: Readonly<
  Record<ConceptColor, { solid: string; tint: string }>
> = {
  blue: { solid: "bg-concept-blue", tint: "bg-concept-blue/10" },
  violet: { solid: "bg-concept-violet", tint: "bg-concept-violet/10" },
  pink: { solid: "bg-concept-pink", tint: "bg-concept-pink/10" },
  amber: { solid: "bg-concept-amber", tint: "bg-concept-amber/10" },
  teal: { solid: "bg-concept-teal", tint: "bg-concept-teal/10" },
  sky: { solid: "bg-concept-sky", tint: "bg-concept-sky/10" },
  lime: { solid: "bg-concept-lime", tint: "bg-concept-lime/10" },
  slate: { solid: "bg-concept-slate", tint: "bg-concept-slate/10" },
};

// The wide line of maths every picture of these files centres on.
export const EQUATION_LINE =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-heading text-title font-bold md:text-title-lg";

// "Tròn chục", "Tròn trăm": what a sum that is a multiple of `unit` is called.
const UNIT_NAMES: Readonly<Record<number, string>> = {
  10: "chục",
  100: "trăm",
  1000: "nghìn",
};

export function roundLabel(unit: number): string {
  const name = UNIT_NAMES[unit];
  return name ? `Tròn ${name}` : `Tròn ${formatNumber(unit)}`;
}

export function signed(value: number): string {
  return value < 0 ? `−${formatNumber(-value)}` : `+${formatNumber(value)}`;
}

// "Tròn chục" in green with a tick, "Chưa tròn" plain: the words carry the
// meaning, colour only backs them up.
export function RoundBadge({ round, unit }: { round: boolean; unit: number }) {
  return (
    <span
      className={`inline-flex min-h-9 items-center rounded-full border-2 px-3 text-caption font-semibold ${
        round
          ? "border-correct bg-correct-soft text-correct-soft-foreground"
          : "border-border bg-surface text-muted-foreground"
      }`}
    >
      {round ? `✓ ${roundLabel(unit)}` : "Chưa tròn"}
    </span>
  );
}

// "● Số hạng": a short concept name behind its colour-and-shape mark.
export function NamedMark({
  color,
  name,
  className = "",
}: {
  color: ConceptColor;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-caption text-foreground ${className}`}
    >
      <ConceptMark color={color} className="size-4" />
      {name}
    </span>
  );
}

// A number in a rounded box in its concept colour.
export function NumberChip({
  color,
  children,
  dense = false,
}: {
  color: ConceptColor;
  children: ReactNode;
  dense?: boolean;
}) {
  const classes = CONCEPT_CLASSES[color];
  return (
    <span
      className={`inline-flex min-w-12 items-center justify-center rounded-xl border-2 bg-surface font-heading font-bold tabular-nums ${classes.border} ${classes.text} ${
        dense
          ? "px-2 py-1 text-body"
          : "px-3 py-1.5 text-title md:text-title-lg"
      }`}
    >
      {children}
    </span>
  );
}

// A number that fades and drops in whenever its value changes.
export function Swap({ value }: { value: string }) {
  const transition = useVisualTransition();
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
}

// "−2" or "+2" riding on a number that changes by that much.
export function DeltaToken({ value }: { value: number }) {
  return (
    <span className="inline-flex min-h-9 min-w-12 items-center justify-center rounded-full border-2 border-dashed border-foreground px-2 font-heading text-body font-bold tabular-nums">
      {signed(value)}
    </span>
  );
}

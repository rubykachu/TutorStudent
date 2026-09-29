"use client";

import { Minus, Plus } from "lucide-react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";

type NumberStepperProps = {
  // Visible name, e.g. "Cơ số"; buttons are spoken as "Giảm cơ số".
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  // Concept the number stands for: its mark sits beside the label and the
  // number takes its colour.
  color?: ConceptColor;
  disabled?: boolean;
};

const BUTTON =
  "inline-flex size-touch shrink-0 items-center justify-center rounded-lg border-2 border-border bg-surface text-foreground disabled:opacity-40 motion-safe:transition-transform motion-safe:active:scale-97";

// A labelled number the child changes one step at a time with large − / +
// buttons, for visuals where the child picks a base, an exponent or a count.
export function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
  color,
  disabled = false,
}: NumberStepperProps) {
  const name = label.toLocaleLowerCase("vi");
  const valueColor = color ? CONCEPT_CLASSES[color].text : "text-foreground";
  return (
    <fieldset className="flex flex-col items-center gap-1">
      <legend className="mx-auto flex items-center gap-2 text-caption text-muted-foreground">
        {color && <ConceptMark color={color} className="size-4" />}
        {label}
      </legend>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={BUTTON}
          aria-label={`Giảm ${name}`}
          disabled={disabled || value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus aria-hidden className="size-5" />
        </button>
        <output
          aria-live="polite"
          className={`min-w-9 text-center font-heading text-title font-bold tabular-nums ${valueColor}`}
        >
          {value}
        </output>
        <button
          type="button"
          className={BUTTON}
          aria-label={`Tăng ${name}`}
          disabled={disabled || value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus aria-hidden className="size-5" />
        </button>
      </div>
    </fieldset>
  );
}

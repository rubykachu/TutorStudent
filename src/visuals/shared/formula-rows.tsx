"use client";

import { Formula } from "@/components/blocks/formula";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptShape } from "@/visuals/shared/concept-mark";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";

// Pictures made of formula rows: stacked labelled examples (`Rows`) and a
// worked example revealed line by line (`Lines`).

// How a picture with several steps plays:
// - steps: animated walk-through that ends on the full result;
// - still: the finished picture, no animation;
// - hint: the walk-through of other numbers that stops at a "?" before the
//   result;
// - solution: walk-through of the exercise's own numbers up to the result
//   (drawn like "steps").
export type Mode = "steps" | "still" | "hint" | "solution";

export type LegendItem = { color: ConceptColor; name: string };

// A row of a picture: a formula and, beside it, a short tag in a concept
// colour saying what it shows. An empty `tex` leaves only the tag (a closing
// sentence with no formula of its own).
export type Row = {
  tex: string;
  tag?: { text: string; color: ConceptColor };
  // Starts a new group: leaves extra space above the row.
  gapBefore?: boolean;
  // A side fact that the next row uses ("vì ..."): smaller, in a dashed box,
  // so it does not read as a link of the chain of equalities.
  aside?: boolean;
  // Drawn dimmed: a case shown only to say why it is left out.
  muted?: boolean;
};

// Formulas stacked, each with an optional tag; the legend names the colours.
export type RowsSpec = {
  label: string;
  rows: readonly Row[];
  legend?: readonly LegendItem[];
};

// Lines of a worked example, one more on every step. In a hint the last line
// is never shown.
export type LinesSpec = {
  label: string;
  rows: readonly Row[];
  mode: "steps" | "still" | "hint";
};

export function TagChip({
  text,
  color,
}: {
  text: string;
  color: ConceptColor;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 px-3 py-0.5 text-caption ${CONCEPT_CLASSES[color].border}`}
    >
      <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0">
        <ConceptShape color={color} cx={8} cy={8} r={7} />
      </svg>
      {text}
    </span>
  );
}

// A formula with its tag on the right; the pair wraps on a narrow screen.
export function FormulaRow({ row }: { row: Row }) {
  if (row.aside) {
    return (
      <div className="mx-auto flex w-fit items-center justify-center gap-2 rounded-xl border-2 border-muted-foreground border-dashed bg-muted px-3 py-1">
        <span className="text-caption text-muted-foreground">vì</span>
        <Formula tex={row.tex} className="text-body-lg" />
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
      {row.tex !== "" && (
        <Formula
          tex={row.tex}
          className={`text-block md:text-block-lg ${row.muted ? "text-muted-foreground" : ""}`}
        />
      )}
      {row.tag && <TagChip text={row.tag.text} color={row.tag.color} />}
    </div>
  );
}

// Formulas stacked, each with its tag: a still picture of labelled examples.
export function Rows({ spec }: { spec: RowsSpec }) {
  const legend = spec.legend ?? [];
  return (
    <figure aria-label={spec.label} className="flex w-full flex-col gap-3">
      <ul className="flex flex-col items-center gap-3">
        {spec.rows.map((row) => (
          <li
            key={row.tex}
            className={row.gapBefore ? "mt-3 w-full" : "w-full"}
          >
            <FormulaRow row={row} />
          </li>
        ))}
      </ul>
      {legend.length > 0 && <Legend items={legend} />}
    </figure>
  );
}

// A result still to come, drawn dimmed in place of its row.
export function Pending() {
  return (
    <p className="text-center font-heading text-block font-bold text-muted-foreground">
      ?
    </p>
  );
}

// Lines of a worked example, one more on every step. In a hint the last line
// stays a dimmed "?" and is never revealed.
export function Lines({ spec }: { spec: LinesSpec }) {
  const { rows, mode, label } = spec;
  const hint = mode === "hint";
  const draw = (step: number) => (
    <ul className="flex w-full flex-col items-center gap-3">
      {rows.map((row, i) => {
        const hidden = hint && i === rows.length - 1;
        return (
          <li key={row.tex} className="w-full">
            <Reveal
              shown={mode === "still" || (step >= i && !hidden)}
              placeholder={i === 0 ? undefined : <Pending />}
            >
              <FormulaRow row={row} />
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(rows.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? rows.length - 1 : rows.length} label={label}>
      {draw}
    </StepPlayer>
  );
}

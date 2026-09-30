import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";

const LINE =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-heading text-block font-bold md:text-block-lg";

// A few lines of maths, each a row of short tokens (a token may carry a
// concept colour). Used where the picture is just the working itself: two ways
// of grouping three addends, the steps of a time problem.

export type EquationToken = { text: string; color?: ConceptColor };

export function Equations({
  rows,
  label,
}: {
  rows: readonly (readonly EquationToken[])[];
  label: string;
}) {
  return (
    <figure
      aria-label={label}
      className="flex w-full max-w-md flex-col items-center gap-3"
    >
      {rows.map((tokens, i) => (
        <p
          // biome-ignore lint/suspicious/noArrayIndexKey: rows never reorder
          key={i}
          className={LINE}
        >
          {tokens.map((token, j) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: tokens never reorder
              key={j}
              className={token.color ? CONCEPT_CLASSES[token.color].text : ""}
            >
              {token.text}
            </span>
          ))}
        </p>
      ))}
    </figure>
  );
}

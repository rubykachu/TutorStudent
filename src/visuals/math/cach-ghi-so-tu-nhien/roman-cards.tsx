import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import type { RomanCardsSpec } from "./catalog";

// Cards of Roman numerals, each with its value: the numeral in the lime
// concept colour (số La Mã), the number below.
export function RomanCards({ spec }: { spec: RomanCardsSpec }) {
  return (
    <ul
      aria-label={spec.label}
      className="flex w-full flex-wrap justify-center gap-2"
    >
      {spec.items.map(([roman, value]) => (
        <li
          key={roman}
          className={`flex min-w-16 flex-col items-center gap-1 rounded-xl border-2 bg-surface px-3 py-2 ${CONCEPT_CLASSES.lime.border}`}
        >
          <span
            className={`flex items-center gap-1.5 font-heading text-title font-bold ${CONCEPT_CLASSES.lime.text}`}
          >
            <ConceptMark color="lime" className="size-3.5" />
            {roman}
          </span>
          <span className="font-heading text-block font-bold tabular-nums">
            {`= ${value}`}
          </span>
        </li>
      ))}
    </ul>
  );
}

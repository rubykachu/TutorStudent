import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";

// How a digit tile looks: plain, picked out in the teal concept (with its
// shape, so never colour alone), or the dashed box still to be filled.
export type TileTone = "plain" | "concept" | "box";

const TONES: Readonly<Record<TileTone, string>> = {
  plain: "border-border bg-surface text-foreground",
  concept: `${CONCEPT_CLASSES.teal.border} ${CONCEPT_CLASSES.teal.text} bg-concept-teal/15`,
  box: `border-dashed ${CONCEPT_CLASSES.teal.border} ${CONCEPT_CLASSES.teal.text} bg-surface`,
};

const SIZES = {
  // One digit of a number.
  big: "h-16 w-11 text-title",
  // One of the ten digits of a row, filling its grid cell.
  cell: "h-14 w-full text-block",
} as const;

// One digit. Hidden from screen readers: the row it sits in carries the
// spoken label.
export function DigitTile({
  digit,
  tone = "plain",
  size = "big",
}: {
  // `undefined` draws a "?" (the box before any digit is picked).
  digit: number | undefined;
  tone?: TileTone;
  size?: keyof typeof SIZES;
}) {
  return (
    <span
      aria-hidden
      className={`flex flex-col items-center justify-center gap-0.5 rounded-lg border-2 font-heading font-bold tabular-nums ${TONES[tone]} ${SIZES[size]}`}
    >
      {digit ?? "?"}
      {tone === "concept" ? (
        <ConceptMark color="teal" className="size-3.5" />
      ) : (
        <span className="size-3.5" />
      )}
    </span>
  );
}

// The digits of a number as a row of tiles; `picked` is the index of the one
// painted in the concept colour.
export function DigitRow({
  digits,
  picked,
  label,
}: {
  digits: readonly number[];
  picked?: number;
  label: string;
}) {
  return (
    <div role="img" aria-label={label} className="flex flex-wrap gap-1.5">
      {digits.map((digit, i) => (
        <DigitTile
          // biome-ignore lint/suspicious/noArrayIndexKey: digits are placed by position
          key={i}
          digit={digit}
          tone={i === picked ? "concept" : "plain"}
        />
      ))}
    </div>
  );
}

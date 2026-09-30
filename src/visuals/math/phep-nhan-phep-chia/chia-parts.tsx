import type { ReactNode } from "react";
import { formatInteger } from "@/lib/number-format";
import type { ConceptColor } from "@/schema/content";
import type { VisualProps } from "@/visuals/registry";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";
import { ConceptMark } from "@/visuals/shared/concept-mark";

// Concept colours of the division lesson. Every number carries its colour
// together with its shape mark (see ConceptMark).
export const DIVIDEND_COLOR: ConceptColor = "blue";
export const DIVISOR_COLOR: ConceptColor = "violet";
export const QUOTIENT_COLOR: ConceptColor = "amber";
export const REMAINDER_COLOR: ConceptColor = "pink";

// Props of a `manipulate` visual. The numbers of the exercise (`params`) are
// optional: the lesson host may pass them so the picture can show the
// exercise's own numbers; without them the visual draws a generic frame and
// the exercise text carries the numbers.
export type FillProps = VisualProps & { params?: Record<string, number> };

const EQUATION =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-heading text-body-lg font-bold md:text-title";

// A number in its concept colour with the concept's shape before it. `value`
// undefined draws a dim "?" for a result still to come.
export function Term({
  color,
  value,
}: {
  color: ConceptColor;
  value: number | undefined;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <ConceptMark color={color} className="size-4" />
      {value === undefined ? (
        <span className="text-muted-foreground">?</span>
      ) : (
        <span className={CONCEPT_CLASSES[color].text}>
          {formatInteger(value)}
        </span>
      )}
    </span>
  );
}

function Plain({ children }: { children: ReactNode }) {
  return <span>{children}</span>;
}

// dividend : divisor = quotient dư remainder. Without `quotient` or
// `remainder` the result shows as "?"; `withRemainder` false leaves the "dư"
// part out (a division that comes out even).
export function DivisionEquation({
  dividend,
  divisor,
  quotient,
  remainder,
  withRemainder,
}: {
  dividend: number;
  divisor: number;
  quotient: number | undefined;
  remainder: number | undefined;
  withRemainder: boolean;
}) {
  const spoken = [
    `${dividend} chia ${divisor} bằng`,
    quotient === undefined ? "chưa biết" : String(quotient),
    withRemainder
      ? `dư ${remainder === undefined ? "chưa biết" : remainder}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <p className={EQUATION} role="img" aria-label={spoken}>
      <Term color={DIVIDEND_COLOR} value={dividend} />
      <Plain>:</Plain>
      <Term color={DIVISOR_COLOR} value={divisor} />
      <Plain>=</Plain>
      <Term color={QUOTIENT_COLOR} value={quotient} />
      {withRemainder && (
        <>
          <Plain>dư</Plain>
          <Term color={REMAINDER_COLOR} value={remainder} />
        </>
      )}
    </p>
  );
}

// One-line sentence under a figure; keeps room for two lines so a longer
// sentence never pushes the figure around.
export function Sentence({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "retry";
}) {
  const color =
    tone === "retry" ? "text-retry-soft-foreground" : "text-foreground";
  return (
    <p
      className={`min-h-12 w-full text-center text-caption md:text-body ${color}`}
      aria-live="polite"
    >
      {children}
    </p>
  );
}

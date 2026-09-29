import type { ReactNode } from "react";
import type { ConceptColor } from "@/schema/content";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";

type PowerTextProps = {
  base: ReactNode;
  exponent: ReactNode;
  // Base and exponent keep their concept colours (glossary: cơ số blue, số
  // mũ violet) wherever a power is written inside a visual.
  baseColor?: ConceptColor;
  exponentColor?: ConceptColor;
  className?: string;
};

// A power written as in the textbook, base with a raised exponent, for use in
// visuals' HTML text next to formulas rendered by KaTeX.
export function PowerText({
  base,
  exponent,
  baseColor = "blue",
  exponentColor = "violet",
  className = "",
}: PowerTextProps) {
  return (
    <span className={`whitespace-nowrap ${className}`}>
      <span className={CONCEPT_CLASSES[baseColor].text}>{base}</span>
      <sup className={`text-[0.6em] ${CONCEPT_CLASSES[exponentColor].text}`}>
        {exponent}
      </sup>
    </span>
  );
}

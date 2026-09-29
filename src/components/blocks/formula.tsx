"use client";

import "katex/dist/katex.min.css";
import katex, { type TrustContext } from "katex";
import { useLayoutEffect, useMemo, useRef } from "react";
import { CONCEPT_DATA_ATTR, isConceptColor, TEX_MACROS } from "@/lib/tex";
import { CONCEPT_CLASSES } from "@/visuals/shared/concept";

export type FormulaHighlight = { id: string; strong: boolean };

// Content may use two HTML extensions: `\htmlId`, naming the parts a hint can
// light up, and `\htmlData` carrying only a concept colour (what `\concept`
// expands to). Everything else stays untrusted.
function trusted(context: TrustContext): boolean {
  if (context.command === "\\htmlId") return true;
  if (context.command !== "\\htmlData") return false;
  const entries = Object.entries(context.attributes);
  return (
    entries.length === 1 &&
    entries[0]?.[0] === CONCEPT_DATA_ATTR &&
    isConceptColor(entries[0][1])
  );
}

function renderTex(tex: string): string {
  return katex.renderToString(tex, {
    throwOnError: false,
    errorColor: "var(--color-muted-foreground)",
    macros: { ...TEX_MACROS },
    trust: trusted,
    strict: (errorCode) => (errorCode === "htmlExtension" ? "ignore" : "warn"),
  });
}

const HIGHLIGHT_CLASSES = ["rounded-sm", "bg-highlight"];
const STRONG_CLASSES = ["outline-3", "outline-foreground"];

type FormulaProps = {
  tex: string;
  // Parts marked with `\htmlId{<id>}{…}` to light up.
  highlight?: readonly FormulaHighlight[];
  className?: string;
};

export function Formula({ tex, highlight = [], className = "" }: FormulaProps) {
  // A stable object keeps React from re-inserting the markup on every render,
  // which would drop the highlight marks set below.
  const markup = useMemo(() => ({ __html: renderTex(tex) }), [tex]);
  const ref = useRef<HTMLSpanElement>(null);

  // KaTeX output is an HTML string, so parts are marked on the DOM after it
  // is inserted rather than through React props.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    for (const el of root.querySelectorAll<HTMLElement>(
      `[${CONCEPT_DATA_ATTR}]`,
    )) {
      const color = el.getAttribute(CONCEPT_DATA_ATTR) ?? "";
      if (isConceptColor(color)) el.classList.add(CONCEPT_CLASSES[color].text);
    }
    const marks = new Map(highlight.map((h) => [h.id, h.strong]));
    for (const el of root.querySelectorAll<HTMLElement>("[id]")) {
      const strong = marks.get(el.id);
      const lit = strong !== undefined;
      el.toggleAttribute("data-highlighted", lit);
      for (const cls of HIGHLIGHT_CLASSES) el.classList.toggle(cls, lit);
      for (const cls of STRONG_CLASSES)
        el.classList.toggle(cls, strong === true);
    }
  }, [highlight]);

  return (
    <span
      ref={ref}
      // KaTeX draws at 1.21em of this, so a formula is about 1.5× the body
      // text; globals.css sets its digits in the body font at semibold.
      className={`formula text-[1.25em] ${className}`}
      // Trusted: KaTeX escapes the TeX source and only `\htmlId` is allowed.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output
      dangerouslySetInnerHTML={markup}
    />
  );
}

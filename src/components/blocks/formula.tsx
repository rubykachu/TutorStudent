"use client";

import "katex/dist/katex.min.css";
import katex from "katex";
import { useLayoutEffect, useMemo, useRef } from "react";

export type FormulaHighlight = { id: string; strong: boolean };

// `\htmlId` is the only HTML extension content may use: it names the parts a
// hint can light up. Everything else stays untrusted.
function renderTex(tex: string): string {
  return katex.renderToString(tex, {
    throwOnError: false,
    errorColor: "var(--color-muted-foreground)",
    trust: (context) => context.command === "\\htmlId",
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
      className={`text-[1.25em] ${className}`}
      // Trusted: KaTeX escapes the TeX source and only `\htmlId` is allowed.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output
      dangerouslySetInnerHTML={markup}
    />
  );
}

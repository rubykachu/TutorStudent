import type { ReactNode } from "react";
import type { HighlightSpec } from "@/exercises/feedback";
import { Highlight } from "@/visuals/shared/highlight";

type AnswerHighlightProps = {
  spec: HighlightSpec | undefined;
  children: ReactNode;
  className?: string;
};

// Lights up one answer-area element (option, blank, item, numeric slot) as the
// frame's highlight map asks for it.
export function AnswerHighlight({
  spec,
  children,
  className,
}: AnswerHighlightProps) {
  return (
    <Highlight
      active={spec !== undefined}
      color={spec?.color}
      strong={spec?.strong}
      className={className}
    >
      {children}
    </Highlight>
  );
}

// The highlight fill sits behind its element, so a lit element drops its own
// opaque background to let the fill show through.
export function surfaceFor(spec: HighlightSpec | undefined): string {
  const filled =
    spec !== undefined && (spec.color === "highlight" || spec.strong);
  return filled ? "bg-transparent" : "bg-surface";
}

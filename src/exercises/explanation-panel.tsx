import { Lightbulb } from "lucide-react";
import { Formula } from "@/components/blocks/formula";
import { RichText } from "@/components/rich-text";
import type { ResolvedExplanation } from "@/exercises/explanation";
import { ItemContent } from "@/exercises/item-content";
import { RegistryVisual } from "@/visuals/registry-visual";

type ExplanationPanelProps = {
  explanation: ResolvedExplanation;
  // A visual already on screen (the solution visual of a third wrong check)
  // is not drawn a second time.
  shownVisualId?: string;
};

// "Giải thích" under an answered exercise: why the answer is right, in a few
// words, with the formula or picture that carries it. It sits in the page
// flow above the sticky bottom bar, so "Tiếp" is never behind it.
export function ExplanationPanel({
  explanation,
  shownVisualId,
}: ExplanationPanelProps) {
  const { authored, text, tex, visualId, wrong, answer } = explanation;
  const showVisual = visualId !== undefined && visualId !== shownVisualId;
  return (
    <section
      aria-labelledby="explanation-heading"
      data-explanation={authored ? "authored" : "derived"}
      className="flex w-full max-w-prose flex-col gap-3 self-center rounded-xl border-3 border-primary/40 bg-surface p-4 md:p-6"
    >
      <h2
        id="explanation-heading"
        className="flex items-center gap-2 font-heading text-block font-semibold text-primary"
      >
        <Lightbulb aria-hidden className="size-6" />
        {authored ? "Giải thích" : "Lời giải"}
      </h2>
      {text && (
        <p>
          <RichText text={text} />
        </p>
      )}
      {tex && (
        <div className="w-full overflow-x-auto py-1 text-center">
          <Formula tex={tex} />
        </div>
      )}
      {answer.length > 0 && (
        <ul data-explanation-answer className="flex flex-col gap-2">
          {answer.map((line, i) => (
            // Answer lines keep the order of the exercise.
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <li key={i} className="flex flex-wrap items-center gap-2">
              {i === 0 && (
                <span className="font-semibold text-muted-foreground">
                  Đáp án:
                </span>
              )}
              {line.map((content, j) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <span key={j} className="flex items-center gap-2">
                  {j > 0 && <span aria-hidden>→</span>}
                  <ItemContent content={content} />
                </span>
              ))}
            </li>
          ))}
        </ul>
      )}
      {showVisual && (
        <div className="flex w-full justify-center" data-explanation-visual>
          <RegistryVisual id={visualId} />
        </div>
      )}
      {wrong.length > 0 && (
        <ul
          data-explanation-wrong
          className="flex flex-col gap-2 border-t-2 border-border pt-3"
        >
          {wrong.map((reason) => (
            <li
              key={reason.text}
              className="flex flex-wrap items-center gap-x-3 gap-y-1"
            >
              <span className="rounded-md bg-retry-soft px-2 py-1 text-retry-soft-foreground">
                <ItemContent content={reason.content} />
              </span>
              <span className="text-muted-foreground">
                <RichText text={reason.text} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

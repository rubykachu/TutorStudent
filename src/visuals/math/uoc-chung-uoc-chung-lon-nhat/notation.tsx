"use client";

import { Formula } from "@/components/blocks/formula";
import type { ConceptColor } from "@/schema/content";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import type { Mode } from "@/visuals/shared/formula-rows";
import { Pending } from "@/visuals/shared/formula-rows";
import { Legend } from "@/visuals/shared/math-parts";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";

// Lines of written notation, one more on every step: the abbreviations ƯC
// and ƯCLN with their values ("ƯCLN(12, 18) = 6"), which TeX would draw in a
// fallback font, so they are plain text; a line may also be a formula. Each
// line carries the mark of its concept colour.

// A line: plain `text` or a `tex` formula (not both), in a concept colour.
export type NotationLine = {
  text?: string;
  tex?: string;
  color: ConceptColor;
};

// What a notation picture draws: the lines, what the colours stand for and
// how it plays (a hint never shows the last line).
export type NotationSpec = {
  label: string;
  lines: readonly NotationLine[];
  legend?: readonly { color: ConceptColor; name: string }[];
  mode: Mode;
};

function LineView({ line }: { line: NotationLine }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <ConceptMark color={line.color} className="size-4" />
      {line.tex !== undefined ? (
        <Formula tex={line.tex} className="text-block md:text-block-lg" />
      ) : (
        <p className="text-center font-heading text-block font-bold md:text-block-lg">
          {line.text}
        </p>
      )}
    </div>
  );
}

export function Notation({ spec }: { spec: NotationSpec }) {
  const { lines, legend, mode, label } = spec;
  const hint = mode === "hint";
  const draw = (step: number) => (
    <div className="flex w-full flex-col items-center gap-4">
      <ul className="flex w-full flex-col items-center gap-3">
        {lines.map((line, i) => {
          const hidden = hint && i === lines.length - 1;
          return (
            <li key={line.text ?? line.tex} className="w-full">
              <Reveal
                shown={mode === "still" || (step >= i && !hidden)}
                placeholder={i === 0 ? undefined : <Pending />}
              >
                <LineView line={line} />
              </Reveal>
            </li>
          );
        })}
      </ul>
      {legend && <Legend items={legend} />}
    </div>
  );
  if (mode === "still") {
    return (
      <figure aria-label={label} className="w-full">
        {draw(lines.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={hint ? lines.length - 1 : lines.length} label={label}>
      {draw}
    </StepPlayer>
  );
}

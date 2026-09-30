"use client";

import type { ReactNode } from "react";
import { ConceptMark } from "@/visuals/shared/concept-mark";
import { Reveal } from "@/visuals/shared/reveal";
import { StepPlayer } from "@/visuals/shared/step-player";
import type { SpecOf } from "./catalog";
import { fmt, splitGroup } from "./logic-nhan";
import { Hole, Legend, Product, Tint } from "./parts-nhan";

// Text of a calculation line. A parenthesised group takes the "group" colour
// and an underline, so the eye sees what is worked out first.
const LINE = "font-heading text-block font-bold md:text-block-lg";
const GROUP_CLASS =
  "whitespace-nowrap text-concept-lime underline decoration-2 decoration-concept-lime underline-offset-4";
const UNFINISHED = "?";

function Expression({
  text,
  result,
}: {
  text: string;
  // The last line of a worked example is its result.
  result: boolean;
}): ReactNode {
  const unfinished = text.endsWith(UNFINISHED);
  const body = unfinished ? text.slice(0, -UNFINISHED.length) : text;
  if (result) return <Tint color="amber">{body}</Tint>;
  return (
    <span className={unfinished ? "text-muted-foreground" : ""}>
      {splitGroup(body).map((segment) =>
        segment.group ? (
          <span key={segment.text} className={GROUP_CLASS}>
            {segment.text}
          </span>
        ) : (
          <span key={segment.text} className="whitespace-pre-wrap">
            {segment.text}
          </span>
        ),
      )}
      {unfinished && <Hole />}
    </span>
  );
}

function Row({
  line,
  first,
  result,
}: {
  line: string;
  first: boolean;
  result: boolean;
}) {
  // "= 6 · 4" keeps its "=" in a column of its own so the lines align.
  const text = first ? line : line.replace(/^=\s*/, "");
  return (
    <p className={`grid grid-cols-[2rem_auto] items-baseline gap-x-2 ${LINE}`}>
      <span aria-hidden className={first ? "invisible" : ""}>
        =
      </span>
      <span>
        <Expression text={text} result={result} />
      </span>
    </p>
  );
}

function PendingRow() {
  return (
    <p
      className={`grid grid-cols-[2rem_auto] gap-x-2 ${LINE} text-muted-foreground`}
    >
      <span>=</span>
      <span>?</span>
    </p>
  );
}

// Lines of a calculation, one more on every step. The last line is the
// result, except in a hint, where it ends in "?" and stays unfinished.
// `groupName` names the parenthesised group in the legend; `still` draws every
// line at once, with no step to press.
export function CalcSteps({
  lines,
  groupName = "Nhóm tính trước",
  still = false,
}: {
  lines: SpecOf<"steps">["lines"];
  groupName?: string;
  still?: boolean;
}) {
  const last = lines[lines.length - 1] ?? "";
  const hint = last.endsWith(UNFINISHED);
  const hasGroup = lines.some((line) => splitGroup(line).length > 1);
  const legend = [
    ...(hasGroup ? [{ color: "lime" as const, name: groupName }] : []),
    ...(hint ? [] : [{ color: "amber" as const, name: "Kết quả" }]),
  ];
  const label = `Tính từng bước: ${lines.join(", ")}`;
  const draw = (step: number) => (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-col gap-2">
        {lines.map((line, i) => (
          <Reveal
            key={line}
            shown={step >= i}
            placeholder={i === 0 ? undefined : <PendingRow />}
          >
            <Row
              line={line}
              first={i === 0}
              result={!hint && i === lines.length - 1}
            />
          </Reveal>
        ))}
      </div>
      {legend.length > 0 && <Legend items={legend} />}
    </div>
  );
  if (still) {
    return (
      <figure aria-label={label} className="w-full">
        {draw(lines.length)}
      </figure>
    );
  }
  return (
    <StepPlayer steps={lines.length} label={label}>
      {draw}
    </StepPlayer>
  );
}

// Factor pairs whose product is a round number, each product tagged.
export function Pairs({ pairs }: { pairs: SpecOf<"pairs">["pairs"] }) {
  return (
    <ul
      className="grid w-fit grid-cols-[auto_auto] items-center justify-center gap-x-4 gap-y-3"
      aria-label="Các cặp thừa số cho tích là số tròn"
    >
      {pairs.map(([a, b]) => (
        <li key={`${a}-${b}`} className="contents">
          <p className={LINE}>
            <Product factors={[fmt(a), fmt(b)]} />
            <span className="whitespace-nowrap">
              {" = "}
              <Tint color="amber">{fmt(a * b)}</Tint>
            </span>
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-concept-amber px-3 py-0.5 text-caption">
            <ConceptMark color="amber" className="size-4" />
            Số tròn
          </span>
        </li>
      ))}
    </ul>
  );
}

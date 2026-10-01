"use client";

import { Check, ChevronRight, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";
import { JINGLE_ID, WRONG_ID } from "@/lib/sound-manifest";
import type { VisualProps } from "@/visuals/registry";
import { ShowHowButton, useGuidedTask } from "@/visuals/shared/guided-step";
import {
  type RegionInteraction,
  type RegionMark,
  RegionProvider,
} from "@/visuals/shared/region";
import { ExprSvg } from "./expr-svg";
import {
  applyOperation,
  type Line,
  nextOperation,
  type Operation,
  operationAt,
  operationIndices,
  parseExpression,
  spokenOperation,
  type Token,
} from "./expression";
import { Row, spokenExpression } from "./steps";

// Guided practice: the child taps the operation to do next. A right tap stays
// on the step: the operation turns green with a tick, a short line says what
// it came to and the jingle plays; the next line appears only when the child
// taps "Tiếp theo". A wrong one rings the tapped operation in the orange
// dashed "try again" ring and changes nothing.
const NO_REVEAL: ReadonlySet<string> = new Set();

// A right tap waiting for "Tiếp theo".
type Accepted = {
  id: string;
  operation: Operation;
  applied: { tokens: Token[]; resultIndex: number };
};

export function TryIt({
  source,
  onStateChange,
}: { source: string } & Pick<VisualProps, "onStateChange">) {
  const sounds = useFeedbackSoundsContext();
  const [history, setHistory] = useState<Line[]>([]);
  const [tokens, setTokens] = useState<Token[]>(() => parseExpression(source));
  const [resultIndex, setResultIndex] = useState<number | undefined>();
  const [wrong, setWrong] = useState<string | undefined>();
  const [accepted, setAccepted] = useState<Accepted | null>(null);

  const expected = nextOperation(tokens);
  const finished = expected === undefined;
  // The screen's "Tiếp" waits until the child has worked the expression to
  // its result, by themselves or after "Xem cách làm".
  useGuidedTask(finished);

  function tap(id: string) {
    const index = operationIndices(tokens)[Number(id.slice(2)) - 1];
    if (index === undefined || expected === undefined || accepted) return;
    if (index !== expected.index) {
      setWrong(id);
      sounds?.play([WRONG_ID]);
      return;
    }
    const operation = operationAt(tokens, index);
    setAccepted({ id, operation, applied: applyOperation(tokens, operation) });
    setWrong(undefined);
    sounds?.play([JINGLE_ID]);
  }

  function next() {
    if (!accepted) return;
    setHistory([
      ...history,
      { tokens, resultIndex, operation: accepted.operation },
    ]);
    setTokens(accepted.applied.tokens);
    setResultIndex(accepted.applied.resultIndex);
    setAccepted(null);
    onStateChange?.({ done: history.length + 1 });
  }

  // Works the rest of the expression out, one line per operation.
  function showHow() {
    const lines = [...history];
    let current = tokens;
    let currentResult = resultIndex;
    let pending = accepted?.operation ?? nextOperation(current);
    while (pending) {
      const applied = applyOperation(current, pending);
      lines.push({
        tokens: current,
        resultIndex: currentResult,
        operation: pending,
      });
      current = applied.tokens;
      currentResult = applied.resultIndex;
      pending = nextOperation(current);
    }
    setHistory(lines);
    setTokens(current);
    setResultIndex(currentResult);
    setWrong(undefined);
    setAccepted(null);
    onStateChange?.({ done: lines.length });
  }

  function restart() {
    setHistory([]);
    setTokens(parseExpression(source));
    setResultIndex(undefined);
    setWrong(undefined);
    setAccepted(null);
    onStateChange?.({ done: 0 });
  }

  const marks = new Map<string, RegionMark>(
    wrong === undefined ? [] : [[wrong, { tone: "wrong" }]],
  );
  const interaction: RegionInteraction = {
    selected: new Set(),
    revealed: accepted ? new Set([accepted.id]) : NO_REVEAL,
    marks,
    disabled: finished || accepted !== null,
    onToggle: tap,
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {history.map((line, i) => (
        <Row key={spokenExpression(line.tokens)} line={line} first={i === 0} />
      ))}
      <div className="flex w-full min-w-0 items-center justify-center gap-2">
        <span
          aria-hidden
          className={`font-heading text-title font-bold ${history.length === 0 ? "invisible" : ""}`}
        >
          =
        </span>
        <RegionProvider value={interaction}>
          <ExprSvg
            tokens={tokens}
            label={finished ? "Kết quả" : "Chạm phép tính làm trước"}
            resultIndex={resultIndex}
            tappable={!finished}
            unit={0.9}
          />
        </RegionProvider>
      </div>
      <p
        className={`flex min-h-6 items-center justify-center gap-2 text-center text-caption ${accepted ? "font-semibold text-correct" : ""}`}
        aria-live="polite"
        data-try-it-status={accepted ? "correct" : undefined}
      >
        {accepted && <Check aria-hidden className="size-5" strokeWidth={3} />}
        {finished
          ? "Xong rồi."
          : accepted
            ? `Đúng rồi! ${spokenOperation(accepted.operation)}.`
            : wrong === undefined
              ? "Chạm phép tính làm trước."
              : "Chưa phải. Thử phép khác."}
      </p>
      {accepted ? (
        <button
          type="button"
          onClick={next}
          data-try-it-next
          className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground motion-safe:transition-transform motion-safe:active:scale-97"
        >
          {nextOperation(accepted.applied.tokens) ? "Tiếp theo" : "Xem kết quả"}
          <ChevronRight aria-hidden className="size-5" />
        </button>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={restart}
            disabled={history.length === 0}
            className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-lg border-2 border-border bg-surface px-4 font-semibold disabled:opacity-50"
          >
            <RotateCcw aria-hidden className="size-5" />
            Làm lại
          </button>
          {!finished && <ShowHowButton onShow={showHow} />}
        </div>
      )}
    </div>
  );
}

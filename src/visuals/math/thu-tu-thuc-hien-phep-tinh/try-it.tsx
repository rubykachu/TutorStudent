"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import type { VisualProps } from "@/visuals/registry";
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
  operationAt,
  operationIndices,
  parseExpression,
  type Token,
} from "./expression";
import { Row, spokenExpression } from "./steps";

// Guided practice: the child taps the operation to do next; a right tap
// works it out and the line below appears, a wrong one rings the tapped
// operation in the orange dashed "try again" ring and changes nothing.
const NO_REVEAL: ReadonlySet<string> = new Set();

export function TryIt({
  source,
  onStateChange,
}: { source: string } & Pick<VisualProps, "onStateChange">) {
  const [history, setHistory] = useState<Line[]>([]);
  const [tokens, setTokens] = useState<Token[]>(() => parseExpression(source));
  const [resultIndex, setResultIndex] = useState<number | undefined>();
  const [wrong, setWrong] = useState<string | undefined>();

  const expected = nextOperation(tokens);
  const finished = expected === undefined;

  function tap(id: string) {
    const index = operationIndices(tokens)[Number(id.slice(2)) - 1];
    if (index === undefined || expected === undefined) return;
    if (index !== expected.index) {
      setWrong(id);
      return;
    }
    const operation = operationAt(tokens, index);
    const applied = applyOperation(tokens, operation);
    setHistory([...history, { tokens, resultIndex, operation }]);
    setTokens(applied.tokens);
    setResultIndex(applied.resultIndex);
    setWrong(undefined);
    onStateChange?.({ done: history.length + 1 });
  }

  function restart() {
    setHistory([]);
    setTokens(parseExpression(source));
    setResultIndex(undefined);
    setWrong(undefined);
    onStateChange?.({ done: 0 });
  }

  const marks = new Map<string, RegionMark>(
    wrong === undefined ? [] : [[wrong, { tone: "wrong" }]],
  );
  const interaction: RegionInteraction = {
    selected: new Set(),
    revealed: NO_REVEAL,
    marks,
    disabled: finished,
    onToggle: tap,
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {history.map((line, i) => (
        <Row key={spokenExpression(line.tokens)} line={line} first={i === 0} />
      ))}
      <div className="flex items-center gap-2">
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
      <p className="min-h-6 text-center text-caption" aria-live="polite">
        {finished
          ? "Xong rồi."
          : wrong === undefined
            ? "Chạm phép tính làm trước."
            : "Chưa phải. Thử phép khác."}
      </p>
      <button
        type="button"
        onClick={restart}
        disabled={history.length === 0}
        className="inline-flex min-h-touch min-w-touch items-center justify-center gap-2 rounded-lg border-2 border-border bg-surface px-4 font-semibold disabled:opacity-50"
      >
        <RotateCcw aria-hidden className="size-5" />
        Làm lại
      </button>
    </div>
  );
}

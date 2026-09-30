"use client";

import { ExprSvg } from "./expr-svg";
import { parseExpression } from "./expression";
import { spokenExpression } from "./steps";

// An expression drawn large for "tap the operation to do first": every sign
// and every power is a region `op1`, `op2`, … from left to right (see
// `tapRegions` in the catalog). Outside an exercise it is a plain picture.
export function TapFirst({ source }: { source: string }) {
  const tokens = parseExpression(source);
  return (
    <div className="flex w-full justify-center py-2">
      <ExprSvg
        tokens={tokens}
        label={spokenExpression(tokens)}
        tappable
        unit={0.9}
      />
    </div>
  );
}

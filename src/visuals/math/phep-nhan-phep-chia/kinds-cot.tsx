import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { ColMul } from "./col-mul";
import ColMulFill from "./col-mul-fill";
import { ColMulTry } from "./col-mul-try";
import { Estimate } from "./estimate";
import type { Factories } from "./examples";
import { Mistakes } from "./mistakes";

// Column multiplication and its neighbours: the written calculation, the
// hands-on screen, the `manipulate` exercise, estimating a product, and the
// three worked mistakes. Not a client module: the dev visual page calls these
// factories on the server.
export const cotKinds = {
  colMul: ({ a, b, mode }) =>
    function ColMulVisual() {
      return <ColMul a={a} b={b} mode={mode} />;
    },
  colMulTry: ({ a, b }) =>
    function ColMulTryVisual({ onStateChange }: VisualProps) {
      return <ColMulTry a={a} b={b} onStateChange={onStateChange} />;
    },
  colMulFill: () => ColMulFill as ComponentType<VisualProps>,
  estimate: (spec) =>
    function EstimateVisual() {
      return <Estimate {...spec} />;
    },
  mistakes: () => Mistakes,
} satisfies Pick<
  Factories,
  "colMul" | "colMulTry" | "colMulFill" | "estimate" | "mistakes"
>;

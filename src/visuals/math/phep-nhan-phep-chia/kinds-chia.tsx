import type { VisualProps } from "@/visuals/registry";
import ColDiv from "./col-div";
import ColDivFill from "./col-div-fill";
import ColDivTry from "./col-div-try";
import type { Factories } from "./examples";
import FactFamily from "./fact-family";
import Pack from "./pack";
import RemCheck, { remainderCheck } from "./rem-check";
import Share from "./share";
import ShareFill from "./share-fill";
import ShareTry from "./share-try";

// Factories of the sharing, dividing and packing pictures. The components
// are client modules; this file only wires a spec to its component, so the
// dev visual page (a server component) may call the factories.
export const chiaKinds = {
  share: (spec) =>
    function ShareVisual() {
      return <Share {...spec} />;
    },
  shareTry: (spec) =>
    function ShareTryVisual(props: VisualProps) {
      return <ShareTry {...spec} onStateChange={props.onStateChange} />;
    },
  shareFill: () => ShareFill,
  factFamily: (spec) =>
    function FactFamilyVisual() {
      return <FactFamily a={spec.a} b={spec.b} />;
    },
  remCheck: (spec) => {
    const { dividend, divisor, q, r, ok, quotientLine } = spec;
    if (remainderCheck({ dividend, divisor, q, r }).ok !== ok) {
      throw new Error(
        `remCheck ${dividend} : ${divisor} = ${q} dư ${r}: "ok" is ${ok} but the check says otherwise`,
      );
    }
    return function RemCheckVisual() {
      return (
        <RemCheck
          dividend={dividend}
          divisor={divisor}
          q={q}
          r={r}
          quotientLine={quotientLine}
        />
      );
    };
  },
  colDiv: (spec) =>
    function ColDivVisual() {
      return <ColDiv {...spec} />;
    },
  colDivTry: (spec) =>
    function ColDivTryVisual(props: VisualProps) {
      return <ColDivTry {...spec} onStateChange={props.onStateChange} />;
    },
  colDivFill: () => ColDivFill,
  pack: (spec) =>
    function PackVisual() {
      return <Pack {...spec} />;
    },
} satisfies Pick<
  Factories,
  | "share"
  | "shareTry"
  | "shareFill"
  | "factFamily"
  | "remCheck"
  | "colDiv"
  | "colDivTry"
  | "colDivFill"
  | "pack"
>;

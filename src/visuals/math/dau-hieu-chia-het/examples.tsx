import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Bags } from "@/visuals/shared/bag-groups";
import { Lines, Rows } from "@/visuals/shared/formula-rows";
import { Chips } from "@/visuals/shared/pick-chips";
import type { VisualSpec } from "./catalog";
import { DigitBox } from "./digit-box";
import { DigitSum } from "./digit-sum";
import { Digits } from "./digits";
import { EndDigits } from "./end-digits";
import Sticker from "./sticker";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "bags":
      return function BagsVisual() {
        return <Bags spec={spec} />;
      };
    case "rows":
      return function RowsVisual() {
        return <Rows spec={spec} />;
      };
    case "lines":
      return function LinesVisual() {
        return <Lines spec={spec} />;
      };
    case "chips":
      return function ChipsVisual(props: VisualProps) {
        return (
          <Chips
            items={spec.items}
            wants={spec.wants}
            done={spec.done}
            {...props}
          />
        );
      };
    case "digits":
      return function DigitsVisual() {
        return <Digits spec={spec} />;
      };
    case "endDigits":
      return function EndDigitsVisual() {
        return <EndDigits spec={spec} />;
      };
    case "digitSum":
      return function DigitSumVisual() {
        return <DigitSum spec={spec} />;
      };
    case "digitBox":
      return function DigitBoxVisual(props: VisualProps) {
        return (
          <DigitBox
            before={spec.before}
            after={spec.after}
            divisors={spec.divisors}
            goal={spec.goal}
            {...props}
          />
        );
      };
    case "sticker":
      return Sticker;
  }
}

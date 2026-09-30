import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { BagTry } from "./bag-try";
import { Bags } from "./bags";
import type { VisualSpec } from "./catalog";
import { Chips } from "./chips";
import { Hops } from "./hops";
import { Lines } from "./lines";
import { Pairs } from "./pairs";
import { Rows } from "./rows";
import Sticker from "./sticker";
import { SumBars } from "./sum-bars";
import { UocBoi } from "./uoc-boi";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "bags":
      return function BagsVisual() {
        return <Bags spec={spec} />;
      };
    case "bagTry":
      return function BagTryVisual(props: VisualProps) {
        return <BagTry total={spec.total} goal={spec.goal} {...props} />;
      };
    case "hops":
      return function HopsVisual() {
        return <Hops spec={spec} />;
      };
    case "rows":
      return function RowsVisual() {
        return <Rows spec={spec} />;
      };
    case "lines":
      return function LinesVisual() {
        return <Lines spec={spec} />;
      };
    case "uocBoi":
      return function UocBoiVisual() {
        return <UocBoi spec={spec} />;
      };
    case "pairs":
      return function PairsVisual() {
        return <Pairs spec={spec} />;
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
    case "sumBars":
      return function SumBarsVisual() {
        return <SumBars spec={spec} />;
      };
    case "sticker":
      return Sticker;
  }
}

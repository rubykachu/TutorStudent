import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Lines, Rows } from "@/visuals/shared/formula-rows";
import { NumberLine } from "@/visuals/shared/number-line";
import type { VisualSpec } from "./catalog";
import { HopTry } from "./hop-try";
import Sticker from "./sticker";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "line":
      return function LineVisual() {
        return <NumberLine spec={spec} />;
      };
    case "hopTry":
      return function HopTryVisual(props: VisualProps) {
        return <HopTry spec={spec} {...props} />;
      };
    case "rows":
      return function RowsVisual() {
        return <Rows spec={spec} />;
      };
    case "lines":
      return function LinesVisual() {
        return <Lines spec={spec} />;
      };
    case "sticker":
      return Sticker;
  }
}

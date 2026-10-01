import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Lines, Rows } from "@/visuals/shared/formula-rows";
import { Chips } from "@/visuals/shared/pick-chips";
import type { VisualSpec } from "./catalog";
import { Column } from "./column";
import { Rects } from "./rects";
import { PrimeTable } from "./prime-table";
import Sticker from "./sticker";
import { Tree } from "./tree";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
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
    case "rects":
      return function RectsVisual() {
        return <Rects spec={spec} />;
      };
    case "table":
      return function TableVisual() {
        return <PrimeTable spec={spec} />;
      };
    case "tree":
      return function TreeVisual() {
        return <Tree spec={spec} />;
      };
    case "column":
      return function ColumnVisual() {
        return <Column spec={spec} />;
      };
    case "sticker":
      return Sticker;
  }
}

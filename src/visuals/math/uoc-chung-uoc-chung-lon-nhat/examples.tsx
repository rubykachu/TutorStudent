import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Lines, Rows } from "@/visuals/shared/formula-rows";
import { Chips } from "@/visuals/shared/pick-chips";
import type { VisualSpec } from "./catalog";
import { CutBars, CutTry } from "./cut-bars";
import { ExpTable } from "./exp-table";
import { Ladder } from "./ladder";
import { Notation } from "./notation";
import { Plates } from "./plates";
import Sticker from "./sticker";
import { UcLists } from "./uc-lists";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "cutBars":
      return function CutBarsVisual() {
        return <CutBars spec={spec} />;
      };
    case "cutTry":
      return function CutTryVisual(props: VisualProps) {
        return <CutTry totals={spec.totals} goal={spec.goal} {...props} />;
      };
    case "ucLists":
      return function UcListsVisual() {
        return <UcLists spec={spec} />;
      };
    case "ladder":
      return function LadderVisual() {
        return <Ladder spec={spec} />;
      };
    case "expTable":
      return function ExpTableVisual() {
        return <ExpTable spec={spec} />;
      };
    case "plates":
      return function PlatesVisual() {
        return <Plates spec={spec} />;
      };
    case "notation":
      return function NotationVisual() {
        return <Notation spec={spec} />;
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
    case "sticker":
      return Sticker;
  }
}

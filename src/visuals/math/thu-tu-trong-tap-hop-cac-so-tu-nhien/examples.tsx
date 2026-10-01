import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Lines, Rows } from "@/visuals/shared/formula-rows";
import { Chips } from "@/visuals/shared/pick-chips";
import { Bars } from "./bars";
import type { VisualSpec } from "./catalog";
import { Digits } from "./digits";
import { Line } from "./line";
import { LineTap } from "./line-tap";
import { LineTry } from "./line-try";
import { Signs } from "./signs";
import Sticker from "./sticker";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. This module is not a client module, so the dev visual page
// (a server component) may call `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "line":
      return function LineVisual() {
        return <Line spec={spec} />;
      };
    case "lineTry":
      return function LineTryVisual(props: VisualProps) {
        return <LineTry spec={spec} {...props} />;
      };
    case "lineTap":
      return function LineTapVisual() {
        return <LineTap spec={spec} />;
      };
    case "bars":
      return function BarsVisual() {
        return <Bars spec={spec} />;
      };
    case "signs":
      return function SignsVisual() {
        return <Signs spec={spec} />;
      };
    case "digits":
      return function DigitsVisual() {
        return <Digits spec={spec} />;
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

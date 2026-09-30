import type { VisualProps } from "@/visuals/registry";
import type { Factories } from "./examples";
import { GridFill, GridTry } from "./grid";
import { MulTable, MulTableTap } from "./mul-table";
import { RepeatAdd } from "./repeat-add";
import { Skip } from "./skip";
import { SplitArea, SplitTry } from "./split-area";
import { CalcSteps, Pairs } from "./steps";
import Sticker from "./sticker";
import { Swap } from "./swap";
import { Tags } from "./tags";

// Factories of the multiplication kinds. This module is not a client module:
// the dev visual page (a server component) calls them while loading a visual.
export const nhanKinds = {
  repeatAdd: (spec) =>
    function RepeatAddVisual() {
      return <RepeatAdd spec={spec} />;
    },
  gridTry: (spec) =>
    function GridTryVisual(props: VisualProps) {
      return (
        <GridTry target={{ rows: spec.rows, cols: spec.cols }} {...props} />
      );
    },
  gridFill: () => GridFill,
  mulTable: (spec) =>
    function MulTableVisual() {
      return <MulTable spec={spec} />;
    },
  mulTableTap: (spec) =>
    function MulTableTapVisual() {
      return <MulTableTap spec={spec} />;
    },
  skip: (spec) =>
    function SkipVisual() {
      return <Skip spec={spec} />;
    },
  tags: (spec) =>
    function TagsVisual() {
      return <Tags spec={spec} />;
    },
  swap: (spec) =>
    function SwapVisual() {
      return <Swap spec={spec} />;
    },
  steps: (spec) =>
    function StepsVisual() {
      return <CalcSteps lines={spec.lines} />;
    },
  pairs: (spec) =>
    function PairsVisual() {
      return <Pairs pairs={spec.pairs} />;
    },
  splitArea: (spec) =>
    function SplitAreaVisual() {
      return <SplitArea spec={spec} />;
    },
  splitTry: (spec) =>
    function SplitTryVisual({ onStateChange }: VisualProps) {
      return <SplitTry spec={spec} onStateChange={onStateChange} />;
    },
  sticker: () => Sticker,
} satisfies Pick<
  Factories,
  | "repeatAdd"
  | "gridTry"
  | "gridFill"
  | "mulTable"
  | "mulTableTap"
  | "skip"
  | "tags"
  | "swap"
  | "steps"
  | "pairs"
  | "splitArea"
  | "splitTry"
  | "sticker"
>;

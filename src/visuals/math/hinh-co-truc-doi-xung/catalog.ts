import type { StepsSpec } from "@/visuals/shared/plane/figure-steps";
import type { AxisCardsSpec, FoldCardsSpec } from "./cards";
import type { EdgeStillSpec } from "./edge-board";
import type { EdgeBoardSpec } from "./edges";
import type { LinesSpec, StripItem, Subject } from "./figures";
import type { FoldLabSpec } from "./fold-lab";
import type {
  FoldStepsSpec,
  PaperOpenSpec,
  PaperTwiceSpec,
} from "./fold-player";
import type {
  DigitCardsSpec,
  GallerySpec,
  NumbersSpec,
  PapersSpec,
} from "./gallery";
import type { AxisPickerSpec } from "./lines";
import type { MirrorStepsSpec, MirrorStillSpec } from "./mirror-board";
import type { MirrorSpec } from "./mirror-model";
import type { PaperId } from "./paper";

// What one picture of the lesson is made of: the registry builds one entry
// per item of the catalog (`visuals.ts`), so a new picture is one item there
// and its id in lesson.json. Pure data, no React, so `content:check` reads it.

export type VisualSpec =
  // A shape or letter on its own, with or without its axes.
  | {
      kind: "subject";
      subject: Subject;
      axes?: boolean;
      axisLabel?: string;
      width?: number;
    }
  // Pictures side by side, each with a caption.
  | ({ kind: "gallery" } & GallerySpec)
  // A row of drawings; `tap`: each is a region of a `tapRegion` exercise.
  | {
      kind: "strip";
      label: string;
      items: readonly StripItem[];
      columns: number;
      mode: "tap" | "still";
      axes?: boolean;
    }
  // A shape with some lines named a, b, c laid over it.
  | ({ kind: "lines" } & LinesSpec)
  // Cards the child taps to fold a shape, or to see its axes.
  | ({ kind: "foldCards" } & FoldCardsSpec)
  | ({ kind: "axisCards" } & AxisCardsSpec)
  // A shape folded along the line the child taps.
  | ({ kind: "foldLab" } & FoldLabSpec)
  // The child marks the lines that are axes.
  | ({ kind: "axisPicker" } & AxisPickerSpec)
  // A shape folding along its axis, frame by frame.
  | ({ kind: "foldSteps" } & FoldStepsSpec)
  // A sheet of paper opening after a cut.
  | ({ kind: "paperOpen" } & PaperOpenSpec)
  | { kind: "paperFolded"; paper: PaperId }
  | ({ kind: "paperTwice" } & PaperTwiceSpec)
  | ({ kind: "papers" } & PapersSpec)
  // A lattice board: the child places the mirror image of a half drawing.
  | { kind: "mirror"; board: MirrorSpec }
  | ({ kind: "mirrorStill" } & MirrorStillSpec)
  | ({ kind: "mirrorSteps" } & MirrorStepsSpec)
  // A lattice board: the child adds a polyline to a given one.
  | { kind: "edges"; board: EdgeBoardSpec }
  | ({ kind: "edgesStill" } & EdgeStillSpec)
  // A construction with ruler and compass, frame by frame.
  | ({ kind: "steps" } & StepsSpec)
  | ({ kind: "numbers" } & NumbersSpec)
  | ({ kind: "digitCards" } & DigitCardsSpec)
  | { kind: "sticker" };

export type SpecKind = VisualSpec["kind"];

// Kinds the child acts on (counted as interactive by `--stats`).
export const INTERACTIVE_KINDS: ReadonlySet<SpecKind> = new Set([
  "foldCards",
  "axisCards",
  "foldLab",
  "axisPicker",
  "mirror",
  "edges",
]);

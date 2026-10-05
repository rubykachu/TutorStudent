import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { FigureSteps } from "@/visuals/shared/plane/figure-steps";
import { AxisCards, FoldCards } from "./cards";
import type { VisualSpec } from "./catalog";
import { EdgeBoard, EdgeStill } from "./edge-board";
import { LinesFigure, Strip, SubjectFigure } from "./figures";
import { AxisPicker, FoldLab } from "./fold-lab";
import { FoldSteps, PaperFolded, PaperOpen, PaperTwice } from "./fold-player";
import { DigitCards, Gallery, Numbers, Papers } from "./gallery";
import { MirrorBoard, MirrorSteps, MirrorStill } from "./mirror-board";
import Sticker from "./sticker";

// One registry entry per `VisualSpec` of the catalog. This module is not a
// client module, so the dev visual page (a server component) may call
// `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "subject":
      return function SubjectVisual() {
        return (
          <SubjectFigure
            subject={spec.subject}
            axes={spec.axes}
            axisLabel={spec.axisLabel}
            maxWidth={spec.width}
          />
        );
      };
    case "gallery":
      return function GalleryVisual() {
        return <Gallery spec={spec} />;
      };
    case "strip":
      return function StripVisual() {
        return (
          <Strip
            label={spec.label}
            items={spec.items}
            columns={spec.columns}
            tappable={spec.mode === "tap"}
            axes={spec.axes}
          />
        );
      };
    case "lines":
      return function LinesVisual() {
        return <LinesFigure spec={spec} />;
      };
    case "foldCards":
      return function FoldCardsVisual(props: VisualProps) {
        return <FoldCards spec={spec} {...props} />;
      };
    case "axisCards":
      return function AxisCardsVisual(props: VisualProps) {
        return <AxisCards spec={spec} {...props} />;
      };
    case "foldLab":
      return function FoldLabVisual(props: VisualProps) {
        return <FoldLab spec={spec} {...props} />;
      };
    case "axisPicker":
      return function AxisPickerVisual(props: VisualProps) {
        return <AxisPicker spec={spec} {...props} />;
      };
    case "foldSteps":
      return function FoldStepsVisual() {
        return <FoldSteps spec={spec} />;
      };
    case "paperOpen":
      return function PaperOpenVisual() {
        return <PaperOpen spec={spec} />;
      };
    case "paperFolded":
      return function PaperFoldedVisual() {
        return <PaperFolded paper={spec.paper} />;
      };
    case "paperTwice":
      return function PaperTwiceVisual() {
        return <PaperTwice spec={spec} />;
      };
    case "papers":
      return function PapersVisual() {
        return <Papers spec={spec} />;
      };
    case "mirror":
      return function MirrorVisual(props: VisualProps) {
        return <MirrorBoard spec={spec.board} {...props} />;
      };
    case "mirrorStill":
      return function MirrorStillVisual() {
        return <MirrorStill spec={spec} />;
      };
    case "mirrorSteps":
      return function MirrorStepsVisual() {
        return <MirrorSteps spec={spec} />;
      };
    case "edges":
      return function EdgesVisual(props: VisualProps) {
        return <EdgeBoard spec={spec.board} {...props} />;
      };
    case "edgesStill":
      return function EdgesStillVisual() {
        return <EdgeStill spec={spec} />;
      };
    case "steps":
      return function StepsVisual() {
        return <FigureSteps spec={spec} />;
      };
    case "numbers":
      return function NumbersVisual() {
        return <Numbers spec={spec} />;
      };
    case "digitCards":
      return function DigitCardsVisual() {
        return <DigitCards spec={spec} />;
      };
    case "sticker":
      return Sticker;
  }
}

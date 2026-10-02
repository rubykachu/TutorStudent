import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Figure } from "@/visuals/shared/plane/figure";
import { FigureSteps } from "@/visuals/shared/plane/figure-steps";
import { Probe } from "@/visuals/shared/plane/probe";
import { BoardVisual, PiecesVisual } from "./board-visual";
import { Gallery } from "./gallery";
import type { VisualSpec } from "./spec";
import Sticker from "./sticker";
import { TapCards } from "./tap-cards";

// One registry entry per `VisualSpec` of the catalog. This module is not a
// client module, so the dev visual page (a server component) may call
// `fromSpec` while loading a visual.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  switch (spec.kind) {
    case "figure":
      return function FigureVisual() {
        return <Figure spec={spec.figure} />;
      };
    case "gallery":
      return function GalleryVisual() {
        return <Gallery spec={spec} />;
      };
    case "steps":
      return function StepsVisual() {
        return <FigureSteps spec={spec} />;
      };
    case "probe":
      return function ProbeVisual(props: VisualProps) {
        return <Probe spec={spec} {...props} />;
      };
    case "cards":
      return function CardsVisual(props: VisualProps) {
        return <TapCards spec={spec} {...props} />;
      };
    case "board":
      return function BoardVisualEntry(props: VisualProps) {
        return <BoardVisual spec={spec} {...props} />;
      };
    case "pieces":
      return function PiecesVisualEntry(props: VisualProps) {
        return <PiecesVisual spec={spec} {...props} />;
      };
    case "sticker":
      return Sticker;
  }
}

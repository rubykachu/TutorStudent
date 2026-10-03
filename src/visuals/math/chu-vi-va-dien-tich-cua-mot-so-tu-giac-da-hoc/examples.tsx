import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Rows } from "@/visuals/shared/formula-rows";
import { Figure } from "@/visuals/shared/plane/figure";
import { FigureSteps } from "@/visuals/shared/plane/figure-steps";
import { Probe } from "@/visuals/shared/plane/probe";
import { Calc } from "./calc";
import { Floor } from "./floor";
import { Gallery } from "./gallery";
import type { VisualSpec } from "./spec";
import { Stage } from "./stage";
import Sticker from "./sticker";
import { Tiles } from "./tiles";
import { Walk } from "./walk";

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
    case "calc":
      return function CalcVisual() {
        return <Calc spec={spec} />;
      };
    case "rows":
      return function RowsVisual() {
        return <Rows spec={spec} />;
      };
    case "probe":
      return function ProbeVisual(props: VisualProps) {
        return <Probe spec={spec} {...props} />;
      };
    case "walk":
      return function WalkVisual(props: VisualProps) {
        return <Walk spec={spec} {...props} />;
      };
    case "tiles":
      return function TilesVisual(props: VisualProps) {
        return <Tiles spec={spec} {...props} />;
      };
    case "floor":
      return function FloorVisual(props: VisualProps) {
        return <Floor spec={spec} {...props} />;
      };
    case "stage":
      return function StageVisual(props: VisualProps) {
        return <Stage spec={spec} {...props} />;
      };
    case "sticker":
      return Sticker;
  }
}

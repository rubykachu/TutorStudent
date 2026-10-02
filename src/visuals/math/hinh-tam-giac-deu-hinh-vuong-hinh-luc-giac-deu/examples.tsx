import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { Assemble } from "./assemble";
import type { VisualSpec } from "./catalog";
import { Construct } from "./construct";
import { Figure } from "./figure";
import { FigureSteps } from "./figure-steps";
import { Gallery } from "./gallery";
import { Probe } from "./probe";
import Sticker from "./sticker";

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
    case "construct":
      return function ConstructVisual(props: VisualProps) {
        return <Construct spec={spec} {...props} />;
      };
    case "assemble":
      return function AssembleVisual(props: VisualProps) {
        return <Assemble spec={spec} {...props} />;
      };
    case "sticker":
      return Sticker;
  }
}

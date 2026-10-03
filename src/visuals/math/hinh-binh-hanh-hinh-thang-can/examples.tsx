import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import { fromSpec as fromQuadrilateralSpec } from "@/visuals/shared/quadrilaterals/from-spec";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";
import Sticker from "./sticker";

// One registry entry per `VisualSpec` of the lesson's catalog (see
// `@/visuals/shared/quadrilaterals/from-spec`), with the lesson's own sticker.
export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  return fromQuadrilateralSpec(spec, Sticker);
}

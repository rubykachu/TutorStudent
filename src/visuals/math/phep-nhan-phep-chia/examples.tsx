import type { ComponentType } from "react";
import type { VisualProps } from "@/visuals/registry";
import type { SpecKind, SpecOf, VisualSpec } from "./catalog";
import { chiaKinds } from "./kinds-chia";
import { cotKinds } from "./kinds-cot";
import { nhanKinds } from "./kinds-nhan";

// One registry entry per `VisualSpec` of the catalog: a component drawn with
// fixed numbers. Each `kinds-*` module builds the components of its kinds
// from a spec. This module is not a client module, so the dev visual page (a
// server component) may call `fromSpec` while loading a visual.

export type Factories = {
  [K in SpecKind]: (spec: SpecOf<K>) => ComponentType<VisualProps>;
};

const FACTORIES: Partial<Factories> = {
  ...nhanKinds,
  ...cotKinds,
  ...chiaKinds,
};

export function fromSpec(spec: VisualSpec): ComponentType<VisualProps> {
  const build = FACTORIES[spec.kind] as
    | ((spec: VisualSpec) => ComponentType<VisualProps>)
    | undefined;
  if (!build) throw new Error(`No visual factory for kind "${spec.kind}"`);
  return build(spec);
}

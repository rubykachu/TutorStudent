import type { BarsSpec } from "./types";

// Region ids of a bar chart used as a `tapRegion` exercise: one per bar, in
// the order of `items`.
export function barsRegions(spec: BarsSpec): string[] {
  return spec.items.map((_, index) => `b${index}`);
}

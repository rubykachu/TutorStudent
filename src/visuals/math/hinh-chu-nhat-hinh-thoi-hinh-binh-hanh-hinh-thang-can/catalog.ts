import { BOOK_SPECS } from "./catalog-book";
import { CHECK_SPECS } from "./catalog-check";
import { COMMON_SPECS } from "./catalog-common";
import { DRAWING_SPECS } from "./catalog-drawing";
import { SHAPES_SPECS } from "./catalog-shapes";
import type { VisualSpec } from "./spec";

// Every picture of the lesson: the registry builds one entry per item (id
// `hinh-chu-nhat-hinh-thoi-hinh-binh-hanh-hinh-thang-can.visual.<key>`).
// The items live in several files, one per part of the lesson; a key used in
// two of them is an error.

export { LESSON_SLUG } from "./logic";
export {
  INTERACTIVE_KINDS,
  regionsOf,
  type SpecKind,
  type VisualSpec,
  validatorIdOf,
} from "./spec";

function mergeSpecs(
  ...parts: readonly Record<string, VisualSpec>[]
): Record<string, VisualSpec> {
  const merged: Record<string, VisualSpec> = {};
  for (const part of parts) {
    for (const [key, spec] of Object.entries(part)) {
      if (key in merged)
        throw new Error(`Visual key "${key}" is defined twice`);
      merged[key] = spec;
    }
  }
  return merged;
}

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = mergeSpecs(
  COMMON_SPECS,
  SHAPES_SPECS,
  DRAWING_SPECS,
  CHECK_SPECS,
  BOOK_SPECS,
);

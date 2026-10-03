import { BOOK_SPECS } from "./catalog-book";
import { CHU_VI_SPECS } from "./catalog-chu-vi";
import { DIEN_TICH_SPECS } from "./catalog-dien-tich";
import { DON_VI_SPECS } from "./catalog-don-vi";
import type { VisualSpec } from "./spec";

// Every picture of the lesson: the registry builds one entry per item (id
// `chu-vi-va-dien-tich-cua-mot-so-tu-giac-da-hoc.visual.<key>`). The items
// live in several files, one per part of the lesson; a key used in two of
// them is an error.

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
  { sticker: { kind: "sticker" } },
  CHU_VI_SPECS,
  DIEN_TICH_SPECS,
  DON_VI_SPECS,
  BOOK_SPECS,
);

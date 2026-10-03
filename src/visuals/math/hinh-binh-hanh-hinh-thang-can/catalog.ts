import { mergeSpecs } from "@/visuals/shared/quadrilaterals/builders";
import type { VisualSpec } from "@/visuals/shared/quadrilaterals/spec";
import { BINH_HANH_THANG_CAN_SPECS } from "./catalog-binh-hanh-thang-can";
import { BOOK_SPECS } from "./catalog-book";
import { CHECK_SPECS } from "./catalog-check";
import { DRAWING_SPECS } from "./catalog-drawing";
import { THUMB_SPECS } from "./catalog-thumbs";

// Every picture of the lesson: the registry builds one entry per item (id
// `hinh-binh-hanh-hinh-thang-can.visual.<key>`).
// The items live in several files, one per part of the lesson; a key used in
// two of them is an error.

export const LESSON_SLUG = "hinh-binh-hanh-hinh-thang-can";

export {
  INTERACTIVE_KINDS,
  regionsOf,
  type SpecKind,
  type VisualSpec,
  validatorIdOf,
} from "@/visuals/shared/quadrilaterals/spec";

export const VISUAL_SPECS: Readonly<Record<string, VisualSpec>> = mergeSpecs(
  THUMB_SPECS,
  BINH_HANH_THANG_CAN_SPECS,
  DRAWING_SPECS,
  CHECK_SPECS,
  BOOK_SPECS,
);

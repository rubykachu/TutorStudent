import type { OrderInput } from "@/exercises/input";
import type { OrderExercise } from "@/schema/content";
import { fromWrongTargets, type GradeResult } from "./result";

// Items are authored in the correct order; any item not at its own position
// is misplaced, including items the child never placed.
export function gradeOrder(ex: OrderExercise, input: OrderInput): GradeResult {
  return fromWrongTargets(
    ex.items
      .filter((item, index) => input.order[index] !== item.id)
      .map((item) => item.id),
  );
}

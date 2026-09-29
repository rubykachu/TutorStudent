import type { ExerciseInput } from "@/exercises/input";
import type { BasicExercise } from "@/schema/content";
import { gradeFillBlank } from "./fill-blank";
import { gradeManipulate } from "./manipulate";
import { gradeMatch } from "./match";
import { gradeNumeric } from "./numeric";
import { gradeOrder } from "./order";
import type { GradeResult } from "./result";
import { gradeSelection } from "./selection";

export type { GradeResult } from "./result";

// Grades any basic exercise, including an openEnded step (steps are basic
// exercises). An input of another type is a wiring bug, not a wrong answer.
export function grade(
  exercise: BasicExercise,
  input: ExerciseInput,
): GradeResult {
  const mismatch = () =>
    new Error(
      `Input of type "${input.type}" cannot grade ${exercise.type} exercise "${exercise.id}"`,
    );
  switch (exercise.type) {
    case "choice":
      if (input.type !== "choice") throw mismatch();
      return gradeSelection(exercise.answer, input.selected);
    case "numeric":
      if (input.type !== "numeric") throw mismatch();
      return gradeNumeric(exercise, input);
    case "match":
      if (input.type !== "match") throw mismatch();
      return gradeMatch(exercise, input);
    case "order":
      if (input.type !== "order") throw mismatch();
      return gradeOrder(exercise, input);
    case "fillBlank":
      if (input.type !== "fillBlank") throw mismatch();
      return gradeFillBlank(exercise, input);
    case "tapText":
      if (input.type !== "tapText") throw mismatch();
      return gradeSelection(exercise.answer, input.selected);
    case "tapRegion":
      if (input.type !== "tapRegion") throw mismatch();
      return gradeSelection(exercise.answer, input.selected);
    case "manipulate":
      if (input.type !== "manipulate") throw mismatch();
      return gradeManipulate(exercise, input);
  }
}

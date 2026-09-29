import { newId } from "@/lib/id";
import {
  type ChildScope,
  saveWriting,
  type TutorDb,
  type WritingCheck,
  type WritingRecord,
} from "@/progress/db";

// Any open-ended result carries the finished writing; the step outcomes are
// recorded separately as attempts.
export type WritingOutcome = {
  writing: { text: string; checks: readonly WritingCheck[] };
};

// Keeps every submission (a child may redo the task), so parents can read
// how the writing changed over time.
export async function saveOpenEndedWriting(
  db: TutorDb,
  scope: ChildScope,
  exerciseId: string,
  result: WritingOutcome,
  now: Date,
): Promise<WritingRecord> {
  const record: WritingRecord = {
    id: newId(),
    familyId: scope.familyId,
    childId: scope.childId,
    exerciseId,
    text: result.writing.text,
    checks: result.writing.checks.map((check) => ({ ...check })),
    at: now.toISOString(),
  };
  await saveWriting(db, record);
  return record;
}

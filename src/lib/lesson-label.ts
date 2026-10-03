import type { Lesson } from "@/schema/content";

// How a lesson is named on screen, in one place: the textbook's own
// numbering ("Chương I · Bài 4") and the headings built from it.

type Placed = Pick<Lesson, "number" | "part" | "chapter">;

// "Bài 4", or "Bài 19 (phần 1)" for one part of a book lesson split across
// several lessons; undefined when the book prints no number.
function lessonNumberLabel(lesson: Placed): string | undefined {
  if (lesson.number === undefined) return undefined;
  return lesson.part === undefined
    ? `Bài ${lesson.number}`
    : `Bài ${lesson.number} (phần ${lesson.part})`;
}

// "Chương I · Bài 4", "Bài 4", "Chương I" or undefined when the book prints
// neither, for a parent looking the lesson up in the book.
export function lessonPlacement(lesson: Placed): string | undefined {
  const parts = [
    lesson.chapter && `Chương ${lesson.chapter.numeral}`,
    lessonNumberLabel(lesson),
  ].filter((part): part is string => typeof part === "string");
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

// "Bài 4: Phép cộng và phép trừ số tự nhiên", "Bài 19 (phần 1): Hình chữ nhật.
// Hình thoi", or the bare title.
export function lessonHeading(lesson: Placed & { title: string }): string {
  const label = lessonNumberLabel(lesson);
  return label === undefined ? lesson.title : `${label}: ${lesson.title}`;
}

// "Phần 3: Nhân, chia trước…" for the section at `index` (0-based), so a
// section title is never read as a question.
export function sectionHeading(index: number, title: string): string {
  return `Phần ${index + 1}: ${title}`;
}

// The subject page's title: "Môn: Toán".
export function subjectHeading(name: string): string {
  return `Môn: ${name}`;
}

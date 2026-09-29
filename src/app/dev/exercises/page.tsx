import { notFound } from "next/navigation";
import { loadContent } from "@/content/load";
import { ExerciseGallery } from "./exercise-gallery";

const FIXTURE_LESSON_ID = "fixture";

// Every exercise of the fixture lesson in its real frame, for manual review
// and E2E checks of the answer components.
export default function DevExercisesPage() {
  const fixture = loadContent({ includeFixture: true }).lessons.find(
    ({ lesson }) => lesson.id === FIXTURE_LESSON_ID,
  );
  if (!fixture) notFound();
  const { lesson } = fixture;

  return (
    <main className="mx-auto w-full max-w-content px-gutter py-8 md:px-gutter-lg">
      <h1 className="font-heading text-title font-bold md:text-title-lg">
        Bài tập
      </h1>
      <p className="mt-2 text-caption text-muted-foreground">{lesson.title}</p>
      <ExerciseGallery
        exercises={lesson.exercises}
        concepts={lesson.concepts}
      />
    </main>
  );
}

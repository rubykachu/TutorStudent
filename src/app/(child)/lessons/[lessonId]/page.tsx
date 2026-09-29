import { notFound } from "next/navigation";
import { servedLessons } from "@/content/load";
import { LessonScreen } from "./lesson-screen";

// Only served lessons exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return servedLessons().map((lesson) => ({ lessonId: lesson.id }));
}

// The lesson itself is fetched on the client from /content/<lessonId>.json,
// next to the child's progress, which only exists in the browser.
export default async function LessonPage({
  params,
}: PageProps<"/lessons/[lessonId]">) {
  const { lessonId } = await params;
  if (!servedLessons().some((lesson) => lesson.id === lessonId)) notFound();
  return <LessonScreen lessonId={lessonId} />;
}

import { notFound } from "next/navigation";
import { servedLessons } from "@/content/load";
import { ReviewScreen } from "./review-screen";

export const dynamicParams = false;

export function generateStaticParams() {
  return servedLessons().map((lesson) => ({ lessonId: lesson.id }));
}

export default async function ReviewPage({
  params,
}: PageProps<"/lessons/[lessonId]/review">) {
  const { lessonId } = await params;
  if (!servedLessons().some((lesson) => lesson.id === lessonId)) notFound();
  return <ReviewScreen lessonId={lessonId} />;
}

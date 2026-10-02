import { notFound } from "next/navigation";
import { servedLessons } from "@/content/load";
import { lessonParams } from "@/offline/routes";
import { ReviewScreen } from "./review-screen";

export const dynamicParams = false;

export function generateStaticParams() {
  return lessonParams();
}

export default async function ReviewPage({
  params,
}: PageProps<"/lessons/[lessonId]/review">) {
  const { lessonId } = await params;
  if (!servedLessons().some((lesson) => lesson.id === lessonId)) notFound();
  return <ReviewScreen lessonId={lessonId} />;
}

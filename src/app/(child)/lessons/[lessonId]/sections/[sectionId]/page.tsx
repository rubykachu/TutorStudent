import { notFound } from "next/navigation";
import { servedLessons } from "@/content/load";
import { SectionScreen } from "./section-screen";

export const dynamicParams = false;

export function generateStaticParams() {
  return servedLessons().flatMap((lesson) =>
    lesson.sections.map((section) => ({
      lessonId: lesson.id,
      sectionId: section.id,
    })),
  );
}

export default async function SectionPage({
  params,
}: PageProps<"/lessons/[lessonId]/sections/[sectionId]">) {
  const { lessonId, sectionId } = await params;
  const lesson = servedLessons().find((l) => l.id === lessonId);
  if (!lesson?.sections.some((s) => s.id === sectionId)) notFound();
  return <SectionScreen lessonId={lessonId} sectionId={sectionId} />;
}

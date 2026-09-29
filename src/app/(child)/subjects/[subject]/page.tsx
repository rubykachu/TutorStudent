import { notFound } from "next/navigation";
import { loadSubjects } from "@/content/load";
import { SubjectScreen } from "./subject-screen";

// Only subjects listed in content/subjects.json exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return loadSubjects().map((s) => ({ subject: s.id }));
}

export default async function SubjectPage({
  params,
}: PageProps<"/subjects/[subject]">) {
  const { subject: subjectId } = await params;
  const subject = loadSubjects().find((s) => s.id === subjectId);
  if (!subject) notFound();
  return <SubjectScreen subject={subject} />;
}

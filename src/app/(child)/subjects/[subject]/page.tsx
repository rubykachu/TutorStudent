import { notFound } from "next/navigation";
import { loadSubjects } from "@/content/load";
import { subjectParams } from "@/offline/routes";
import { SubjectScreen } from "./subject-screen";

// Only subjects listed in content/subjects.json exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return subjectParams();
}

export default async function SubjectPage({
  params,
}: PageProps<"/subjects/[subject]">) {
  const { subject: subjectId } = await params;
  const subject = loadSubjects().find((s) => s.id === subjectId);
  if (!subject) notFound();
  return <SubjectScreen subject={subject} />;
}

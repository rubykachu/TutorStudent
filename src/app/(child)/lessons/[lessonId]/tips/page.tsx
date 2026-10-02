import { notFound } from "next/navigation";
import { servedTipLessonIds } from "@/content/load";
import { tipsParams } from "@/offline/routes";
import { TipsScreen } from "./tips-screen";

// Only served lessons that have tips get a "Mẹo hay" page.
export const dynamicParams = false;

export function generateStaticParams() {
  return tipsParams();
}

export default async function TipsPage({
  params,
}: PageProps<"/lessons/[lessonId]/tips">) {
  const { lessonId } = await params;
  if (!servedTipLessonIds().includes(lessonId)) notFound();
  return <TipsScreen lessonId={lessonId} />;
}

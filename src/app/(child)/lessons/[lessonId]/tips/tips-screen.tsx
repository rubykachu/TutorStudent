"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { TipCard } from "@/components/blocks/tip-card";
import { PageTopBar } from "@/components/page-top-bar";
import { ChildSounds } from "@/learn/child-sounds";
import { useLessonTips } from "@/learn/use-lesson-tips";
import { lessonHeading } from "@/lib/lesson-label";
import { lessonPath } from "@/lib/routes";
import { ContentError } from "../../../content-error";
import { LessonGate } from "../lesson-gate";

// "Mẹo hay": every tip of one lesson, one card after another, so a child can
// come back to the tricks without replaying the lesson.
function TipsBody({ lessonId, title }: { lessonId: string; title: string }) {
  const { state, retry } = useLessonTips(lessonId);
  if (state.status === "error") {
    return (
      <ContentError
        message="Chưa tải được các mẹo. Mình thử lại nhé!"
        onRetry={retry}
      />
    );
  }
  if (state.status === "loading") return null;
  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="font-bold text-title md:text-title-lg">Mẹo hay</h1>
        <p className="text-caption text-muted-foreground">{title}</p>
      </header>
      <ol className="flex flex-col items-center gap-6" data-tips-list>
        {state.tips.map((tip) => (
          <li key={tip.id} className="flex w-full justify-center">
            <TipCard tip={tip} />
          </li>
        ))}
      </ol>
    </>
  );
}

export function TipsScreen({ lessonId }: { lessonId: string }) {
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-6 px-gutter py-6 md:px-gutter-lg md:py-10">
      <LessonGate lessonId={lessonId}>
        {({ lesson }, profile) => (
          <ChildSounds childId={profile.id}>
            <PageTopBar childId={profile.id}>
              <Link
                href={lessonPath(lesson.id)}
                data-tips-back
                className="-ml-2 flex h-12 w-fit items-center gap-1 rounded-full pr-4 pl-2 font-semibold text-muted-foreground"
              >
                <ChevronLeft aria-hidden className="size-6" />
                Về bài học
              </Link>
            </PageTopBar>
            <TipsBody lessonId={lesson.id} title={lessonHeading(lesson)} />
          </ChildSounds>
        )}
      </LessonGate>
    </main>
  );
}

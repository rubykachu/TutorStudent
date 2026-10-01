"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CosmosHorizon } from "@/components/cosmos-background";
import { PageTopBar } from "@/components/page-top-bar";
import { StateBadge } from "@/components/state-badge";
import { subjectStyle } from "@/components/subject-style";
import { LessonCardArt } from "@/components/subject-tile-art";
import { ChildSounds } from "@/learn/child-sounds";
import { lessonPlacement, subjectHeading } from "@/lib/lesson-label";
import { HOME_PATH, lessonPath } from "@/lib/routes";
import type { ProfileRecord } from "@/progress/db";
import { useChildProgress, useContentIndex } from "@/progress/hooks";
import { lessonState, lessonsForSubject } from "@/progress/summary";
import type { Subject } from "@/schema/content";
import { ContentError } from "../../content-error";
import { useRequiredProfile } from "../../use-required-profile";

function LessonList({
  subject,
  profile,
}: {
  subject: Subject;
  profile: ProfileRecord;
}) {
  const content = useContentIndex();
  const progress = useChildProgress(profile.id);
  if (content.status === "error") return <ContentError />;
  if (content.status === "loading" || !progress) return null;

  const lessons = lessonsForSubject(
    content.index,
    subject.id,
    profile.series[subject.id],
  );
  if (lessons.length === 0) {
    return (
      <p className="rounded-lg bg-surface p-6 text-center text-muted-foreground shadow-card">
        Môn này sắp có bài rồi!
      </p>
    );
  }

  const tint = subjectStyle(subject).text;
  return (
    <ul className="flex flex-col gap-4">
      {lessons.map((lesson, position) => {
        const state = lessonState(
          lesson,
          progress.sections.filter((s) => s.lessonId === lesson.id),
        );
        return (
          <li key={lesson.id}>
            <Link
              href={lessonPath(lesson.id)}
              data-lesson={lesson.id}
              className="relative isolate flex min-h-24 items-center gap-4 overflow-hidden rounded-lg border-2 border-border bg-surface p-4 shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:p-6"
            >
              <LessonCardArt position={position} tint={tint} />
              <div className="flex min-w-0 max-w-[58%] flex-1 flex-col gap-1">
                <h2 className="break-words text-block font-semibold md:text-block-lg">
                  {lesson.title}
                </h2>
                {lessonPlacement(lesson) && (
                  <p
                    className="font-semibold text-caption"
                    data-lesson-placement
                  >
                    {lessonPlacement(lesson)}
                  </p>
                )}
                <p className="text-caption text-muted-foreground">
                  {lesson.sourceRef}
                </p>
              </div>
              <StateBadge state={state} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SubjectScreen({ subject }: { subject: Subject }) {
  const profile = useRequiredProfile();
  const style = subjectStyle(subject);
  const Icon = style.icon;
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-6 px-gutter py-6 md:px-gutter-lg md:py-10">
      {profile && (
        <ChildSounds childId={profile.id}>
          <PageTopBar childId={profile.id}>
            <Link
              href={HOME_PATH}
              className="-ml-2 flex h-12 w-fit items-center gap-1 rounded-full pr-4 pl-2 font-semibold text-muted-foreground"
            >
              <ChevronLeft aria-hidden className="size-6" />
              Trang chủ
            </Link>
          </PageTopBar>
          <header className="flex items-center gap-4">
            <span
              className={`${style.bg} flex size-14 shrink-0 items-center justify-center rounded-full text-primary-foreground`}
            >
              <Icon aria-hidden className="size-8" strokeWidth={2.25} />
            </span>
            <h1 className="text-title font-bold md:text-title-lg">
              {subjectHeading(subject.name)}
            </h1>
          </header>
          <LessonList subject={subject} profile={profile} />
        </ChildSounds>
      )}
      {/* The end of the page: its own band of sky, like the home screen. */}
      <CosmosHorizon className="mt-auto -mx-gutter -mb-6 md:-mx-gutter-lg md:-mb-10" />
    </main>
  );
}

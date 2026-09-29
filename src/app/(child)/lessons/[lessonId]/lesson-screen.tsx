"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { StateBadge } from "@/components/state-badge";
import { Sticker } from "@/components/sticker";
import type { LessonIndex } from "@/content";
import { HOME_PATH, sectionPath, subjectPath } from "@/lib/routes";
import type { ProfileRecord, SectionState } from "@/progress/db";
import { useContentIndex, useLessonProgress } from "@/progress/hooks";
import { LessonGate } from "./lesson-gate";

function BackLink({ subjectId }: { subjectId: string }) {
  const content = useContentIndex();
  const subject =
    content.status === "ready"
      ? content.index.subjects.find((s) => s.id === subjectId)
      : undefined;
  return (
    <Link
      href={subject ? subjectPath(subject.id) : HOME_PATH}
      className="-ml-2 flex h-12 w-fit items-center gap-1 rounded-full pr-4 pl-2 font-semibold text-muted-foreground"
    >
      <ChevronLeft aria-hidden className="size-6" />
      {subject?.name ?? "Trang chủ"}
    </Link>
  );
}

function LessonBody({
  index,
  profile,
}: {
  index: LessonIndex;
  profile: ProfileRecord;
}) {
  const { lesson } = index;
  const progress = useLessonProgress(profile.id, lesson.id);
  if (!progress) return null;

  const stateOf = new Map(progress.sections.map((s) => [s.sectionId, s.state]));
  const earned = progress.sticker !== undefined;
  return (
    <>
      <BackLink subjectId={lesson.subject} />
      <header className="flex flex-col gap-1">
        <h1 className="text-title font-bold md:text-title-lg">
          {lesson.title}
        </h1>
        <p className="text-caption text-muted-foreground">{lesson.sourceRef}</p>
      </header>

      <section
        aria-label="Sticker của bài"
        className="flex items-center gap-4 rounded-lg bg-surface p-4 shadow-card md:p-6"
      >
        <Sticker
          visualId={lesson.sticker.visualId}
          name={lesson.sticker.name}
          earned={earned}
          className="size-20 shrink-0"
        />
        <p>
          {earned
            ? `Bạn đã nhận sticker “${lesson.sticker.name}”.`
            : `Học xong mọi phần để nhận sticker “${lesson.sticker.name}”.`}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-block font-semibold md:text-block-lg">
          Các phần của bài
        </h2>
        <ol className="flex flex-col gap-4">
          {lesson.sections.map((section, i) => {
            const state: SectionState =
              stateOf.get(section.id) ?? "not_started";
            return (
              <li key={section.id}>
                <Link
                  href={sectionPath(lesson.id, section.id)}
                  data-section={section.id}
                  data-state={state}
                  className="flex min-h-24 items-center gap-4 rounded-lg border-2 border-border bg-surface p-4 shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:p-6"
                >
                  <span
                    aria-hidden
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted font-heading text-block font-semibold"
                  >
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <h3 className="text-body font-semibold md:text-body-lg">
                      {section.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <StateBadge state={state} />
                      <span className="text-caption text-muted-foreground">
                        {section.minutes} phút
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="size-6 shrink-0 text-muted-foreground"
                  />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

export function LessonScreen({ lessonId }: { lessonId: string }) {
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-6 px-gutter py-6 md:px-gutter-lg md:py-10">
      <LessonGate lessonId={lessonId}>
        {(index, profile) => <LessonBody index={index} profile={profile} />}
      </LessonGate>
    </main>
  );
}

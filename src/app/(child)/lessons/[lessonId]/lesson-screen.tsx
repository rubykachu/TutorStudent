"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ReviewButton } from "@/components/review-button";
import { StateBadge } from "@/components/state-badge";
import { Sticker } from "@/components/sticker";
import { SUBJECT_STYLES } from "@/components/subject-style";
import type { LessonIndex } from "@/content";
import { nextSectionIndex } from "@/learn/next-step";
import { HOME_PATH, reviewPath, sectionPath, subjectPath } from "@/lib/routes";
import { now } from "@/lib/time";
import type { ProfileRecord, SectionState } from "@/progress/db";
import { useContentIndex, useLessonProgress } from "@/progress/hooks";
import { countForgetting, countOpened } from "@/srs/select";
import { LessonGate } from "./lesson-gate";

function useSubject(subjectId: string) {
  const content = useContentIndex();
  return content.status === "ready"
    ? content.index.subjects.find((s) => s.id === subjectId)
    : undefined;
}

function BackLink({ subjectId }: { subjectId: string }) {
  const subject = useSubject(subjectId);
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
  const subject = useSubject(lesson.subject);
  if (!progress) return null;

  const style = subject ? SUBJECT_STYLES[subject.color] : undefined;
  const next = nextSectionIndex(lesson.sections, progress.sections);
  const stateOf = new Map(progress.sections.map((s) => [s.sectionId, s.state]));
  const earned = progress.sticker !== undefined;
  const scope = {
    now: now(),
    lessonId: lesson.id,
    states: progress.cardStates,
    index,
  };
  return (
    <>
      <BackLink subjectId={lesson.subject} />
      <header className="flex flex-col gap-1">
        <h1 className="text-title font-bold md:text-title-lg">
          {lesson.title}
        </h1>
        <p className="text-caption text-muted-foreground">{lesson.sourceRef}</p>
      </header>

      {countOpened(scope) > 0 && (
        <ReviewButton
          href={reviewPath(lesson.id)}
          forgetting={countForgetting(scope)}
          variant={next === null ? "primary" : "secondary"}
        />
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-block font-semibold md:text-block-lg">
          Các phần của bài
        </h2>
        <ol className="flex flex-col gap-4">
          {lesson.sections.map((section, i) => {
            const state: SectionState =
              stateOf.get(section.id) ?? "not_started";
            const isNext = i === next;
            return (
              <li key={section.id}>
                <Link
                  href={sectionPath(lesson.id, section.id)}
                  data-section={section.id}
                  data-state={state}
                  data-next={isNext || undefined}
                  className={`flex min-h-24 items-center gap-4 rounded-lg bg-surface p-4 shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:p-6 ${
                    isNext
                      ? `border-3 ${style?.border ?? "border-primary"}`
                      : "border-2 border-border"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full font-heading text-block font-semibold ${
                      isNext
                        ? `${style?.bg ?? "bg-primary"} text-primary-foreground`
                        : "bg-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    {isNext && (
                      <span
                        className={`${style?.bg ?? "bg-primary"} w-fit rounded-full px-3 py-0.5 text-caption font-semibold text-primary-foreground`}
                      >
                        Học tiếp
                      </span>
                    )}
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

"use client";

import {
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bigButtonClassName } from "@/components/big-button";
import { CosmosHorizon } from "@/components/cosmos-background";
import { PageTopBar } from "@/components/page-top-bar";
import { PanelArt } from "@/components/panel-art";
import { ReviewButton } from "@/components/review-button";
import { RichText } from "@/components/rich-text";
import { SectionCardArt } from "@/components/section-card-art";
import { StateBadge } from "@/components/state-badge";
import { Sticker } from "@/components/sticker";
import { subjectStyle } from "@/components/subject-style";
import type { LessonIndex } from "@/content";
import { ChildSounds } from "@/learn/child-sounds";
import { LessonOverviewView } from "@/learn/lesson-overview";
import { nextSectionIndex, stickerFill } from "@/learn/next-step";
import { lessonHeading, lessonPlacement } from "@/lib/lesson-label";
import {
  HOME_PATH,
  INTRO_PARAM,
  reviewPath,
  sectionPath,
  subjectPath,
  tipsPath,
} from "@/lib/routes";
import { now } from "@/lib/time";
import { OuterScreenMusic } from "@/music/background-music-runner";
import type { ProfileRecord, SectionState } from "@/progress/db";
import {
  setOverviewSeen,
  useContentIndex,
  useLessonProgress,
} from "@/progress/hooks";
import { countForgetting, countOpened } from "@/srs/select";
import { lessonFeedbackContext } from "@/user-feedback/context";
import { LessonGate } from "./lesson-gate";

function useSubject(subjectId: string) {
  const content = useContentIndex();
  return content.status === "ready"
    ? content.index.subjects.find((s) => s.id === subjectId)
    : undefined;
}

// How many tips the lesson's "Mẹo hay" page lists (0 while the list loads).
function useTipCount(lessonId: string): number {
  const content = useContentIndex();
  return content.status === "ready"
    ? (content.index.lessons.find((l) => l.id === lessonId)?.tipCount ?? 0)
    : 0;
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
  const tipCount = useTipCount(lesson.id);
  const router = useRouter();
  // null: follow the stored state (the overview opens on the first visit);
  // true / false: the child opened or closed it on this visit.
  // The page was opened on the introduction (from a section player's back).
  // The body renders only after the client loaded the lesson, so reading
  // the address here never disagrees with the server's HTML.
  const [overviewOpen, setOverviewOpen] = useState<boolean | null>(() =>
    new URLSearchParams(window.location.search).has(INTRO_PARAM) ? true : null,
  );
  if (!progress) return null;

  const style = subject ? subjectStyle(subject) : undefined;
  const next = nextSectionIndex(lesson.sections, progress.sections);
  const { overview } = lesson;
  if (overview && (overviewOpen ?? !progress.overviewSeen)) {
    const nextSection = next === null ? undefined : lesson.sections[next];
    const started = progress.sections.some((s) => s.state !== "not_started");
    return (
      <>
        <PageTopBar
          childId={profile.id}
          feedback={lessonFeedbackContext(lesson, "overview")}
        >
          <BackLink subjectId={lesson.subject} />
        </PageTopBar>
        <LessonOverviewView
          lesson={{
            title: lesson.title,
            number: lesson.number,
            part: lesson.part,
            overview,
          }}
          startLabel={
            nextSection === undefined
              ? "Xem các phần của bài"
              : started
                ? "Học tiếp"
                : "Bắt đầu học"
          }
          onStart={() => {
            void setOverviewSeen(profile.id, lesson.id);
            if (nextSection)
              router.push(sectionPath(lesson.id, nextSection.id));
            else setOverviewOpen(false);
          }}
          onBrowse={
            nextSection === undefined
              ? undefined
              : () => {
                  void setOverviewSeen(profile.id, lesson.id);
                  setOverviewOpen(false);
                }
          }
        />
      </>
    );
  }

  const stateOf = new Map(progress.sections.map((s) => [s.sectionId, s.state]));
  const earned = progress.sticker !== undefined;
  const fill = stickerFill(lesson.sections, progress.sections, earned);
  const left = fill.total - fill.done;
  const scope = {
    now: now(),
    lessonId: lesson.id,
    states: progress.cardStates,
    index,
  };
  return (
    <>
      {/* The list of parts is an outer screen; the overview above is not. */}
      <OuterScreenMusic />
      <PageTopBar
        childId={profile.id}
        feedback={lessonFeedbackContext(lesson, "lesson")}
      >
        <BackLink subjectId={lesson.subject} />
      </PageTopBar>
      <header className="flex flex-col gap-1">
        <h1 className="text-title font-bold md:text-title-lg">
          {lessonHeading(lesson)}
        </h1>
        {lessonPlacement(lesson) && (
          <p className="font-semibold text-caption">
            {lessonPlacement(lesson)}
          </p>
        )}
        <p className="text-caption text-muted-foreground">{lesson.sourceRef}</p>
      </header>

      {overview && (
        <button
          type="button"
          data-overview-open
          onClick={() => setOverviewOpen(true)}
          className={bigButtonClassName("secondary", "md:w-fit")}
        >
          <BookOpenText aria-hidden className="size-6" />
          Giới thiệu bài
        </button>
      )}

      {tipCount > 0 && (
        <Link
          href={tipsPath(lesson.id)}
          data-tips-open
          className={bigButtonClassName("secondary", "md:w-fit")}
        >
          <Lightbulb aria-hidden className="size-6" />
          Mẹo hay
        </Link>
      )}

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
                  className={`relative flex min-h-24 items-center gap-4 overflow-hidden rounded-lg bg-surface p-4 shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:p-6 ${
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
                      <RichText text={section.title} />
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <StateBadge state={state} />
                      <span className="text-caption text-muted-foreground">
                        {section.minutes} phút
                      </span>
                    </div>
                  </div>
                  {/* The card's sky: a column of its own at the right end,
                      reaching the card's edges, with the chevron in its
                      free middle. */}
                  <span className="relative -my-4 -mr-4 flex w-24 shrink-0 items-center justify-center self-stretch md:-my-6 md:-mr-6 md:w-32">
                    <SectionCardArt position={i} />
                    <ChevronRight
                      aria-hidden
                      className="relative size-6 shrink-0 text-muted-foreground"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section
        aria-label="Sticker của bài"
        className="relative isolate flex items-center gap-4 overflow-hidden rounded-lg bg-surface p-4 shadow-card md:p-6"
      >
        <PanelArt />
        <Sticker
          visualId={lesson.sticker.visualId}
          name={lesson.sticker.name}
          done={fill.done}
          total={fill.total}
          className="size-20 shrink-0"
        />
        {/* The sticker name on its own line, so no line ends on a lone
            "sticker" and a long name wraps as a whole. */}
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-balance">
            {earned
              ? "Bạn đã nhận sticker"
              : fill.done === 0
                ? "Học xong mọi phần để nhận sticker"
                : `Còn ${left} phần nữa là có\u00a0sticker`}
          </p>
          <p className="font-semibold">{`“${lesson.sticker.name}”`}</p>
        </div>
      </section>
      {/* The end of the page: its own band of sky, like the home screen. */}
      <CosmosHorizon className="mt-auto -mx-gutter -mb-6 md:-mx-gutter-lg md:-mb-10" />
    </>
  );
}

export function LessonScreen({ lessonId }: { lessonId: string }) {
  return (
    // The overview ends in the sticky bottom bar, which brings its own
    // bottom padding.
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-6 px-gutter py-6 md:px-gutter-lg md:py-10 has-[[data-lesson-overview]]:pb-0">
      <LessonGate lessonId={lessonId}>
        {(index, profile) => (
          <ChildSounds childId={profile.id}>
            <LessonBody index={index} profile={profile} />
          </ChildSounds>
        )}
      </LessonGate>
    </main>
  );
}

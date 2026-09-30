"use client";

import { UsersRound } from "lucide-react";
import Link from "next/link";
import { SoundToggle } from "@/components/sound-toggle";
import { StreakFlame } from "@/components/streak-flame";
import {
  SUBJECT_TILE_CELL,
  SUBJECT_TILE_GRID,
  SubjectTile,
} from "@/components/subject-tile";
import {
  continueTarget,
  subjectProgress,
  subjectStatus,
} from "@/learn/next-step";
import { PROFILES_PATH, subjectPath } from "@/lib/routes";
import { now, vnDayKey } from "@/lib/time";
import type { MascotExpression } from "@/mascot/expressions";
import { Owl } from "@/mascot/owl";
import type { ProfileRecord } from "@/progress/db";
import {
  type ChildProgress,
  useChildProgress,
  useContentIndex,
} from "@/progress/hooks";
import { computeStreak } from "@/progress/streak";
import {
  homeMascotExpression,
  lastStudiedBySubject,
  lessonsForSubject,
  subjectNudgeDays,
} from "@/progress/summary";
import type { ContentIndex } from "@/schema/content";
import { ContentError } from "./content-error";
import { ContinueCard } from "./continue-card";
import { StickerStrip } from "./sticker-strip";
import { useRequiredProfile } from "./use-required-profile";

// What the owl says next to its expression on the home screen.
const OWL_SPEECH: Partial<Record<MascotExpression, string>> = {
  welcome: "Mừng bạn quay lại! Mình nhớ bạn lắm.",
  happy: "Hôm nay bạn học chăm quá!",
};
const DEFAULT_SPEECH = "Hôm nay mình học môn nào?";

function OwlGreeting({ progress }: { progress: ChildProgress }) {
  const today = vnDayKey(now());
  const expression = homeMascotExpression(progress.activityDays, today);
  return (
    // Phones put the streak on its own full-width row under the owl and its
    // words; tablets keep it beside the owl.
    <section
      className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3"
      aria-label="Bạn cú"
    >
      <Owl
        expression={expression}
        size="home"
        className="md:row-span-2 md:self-center"
      />
      <p className="font-semibold md:self-end">
        {OWL_SPEECH[expression] ?? DEFAULT_SPEECH}
      </p>
      <div className="col-span-2 md:col-span-1 md:col-start-2 md:self-start md:justify-self-start">
        <StreakFlame streak={computeStreak(progress.activityDays, today)} />
      </div>
    </section>
  );
}

function HomeLessons({
  index,
  profile,
  progress,
}: {
  index: ContentIndex;
  profile: ProfileRecord;
  progress: ChildProgress;
}) {
  const lessonsOf = (subjectId: string) =>
    lessonsForSubject(index, subjectId, profile.series[subjectId]);
  const lastStudied = lastStudiedBySubject(
    index.lessons,
    progress.attempts,
    progress.sections,
  );
  const today = now();
  const target = continueTarget(index, profile.series, progress);
  const targetSubject =
    target && index.subjects.find((s) => s.id === target.lesson.subject);
  const earned = new Set(progress.stickers.map((s) => s.lessonId));
  return (
    <>
      {target && targetSubject && (
        <ContinueCard
          target={target}
          subject={targetSubject}
          overviewSeen={progress.overviewsSeen.includes(target.lesson.id)}
        />
      )}
      <ul className={SUBJECT_TILE_GRID}>
        {index.subjects.map((subject) => {
          const lessons = lessonsOf(subject.id);
          return (
            <li key={subject.id} className={SUBJECT_TILE_CELL}>
              <SubjectTile
                subject={subject}
                href={subjectPath(subject.id)}
                progress={subjectProgress(lessons, progress)}
                status={subjectStatus(lessons, progress)}
                nudgeDays={subjectNudgeDays(lastStudied.get(subject.id), today)}
              />
            </li>
          );
        })}
      </ul>
      <StickerStrip
        lessons={index.subjects.flatMap((s) => lessonsOf(s.id))}
        earnedLessonIds={earned}
        sections={progress.sections}
      />
    </>
  );
}

function HomeBody({
  profile,
  progress,
}: {
  profile: ProfileRecord;
  progress: ChildProgress;
}) {
  const content = useContentIndex();
  return (
    <>
      <OwlGreeting progress={progress} />
      {content.status === "error" && <ContentError />}
      {content.status === "ready" && (
        <HomeLessons
          index={content.index}
          profile={profile}
          progress={progress}
        />
      )}
    </>
  );
}

function HomeContent({ profile }: { profile: ProfileRecord }) {
  const progress = useChildProgress(profile.id);
  return (
    <>
      <header className="flex items-start justify-between gap-3">
        <h1 className="min-w-0 break-words text-title font-bold md:text-title-lg">
          Chào {profile.name}!
        </h1>
        {/* The sound switch ends the row, where every screen keeps it. */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={PROFILES_PATH}
            className="flex h-12 shrink-0 items-center gap-2 rounded-full border-2 border-border bg-surface px-3 text-caption font-semibold transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
          >
            <UsersRound aria-hidden className="size-5" />
            Đổi hồ sơ
          </Link>
          <SoundToggle childId={profile.id} />
        </div>
      </header>
      {progress && <HomeBody profile={profile} progress={progress} />}
    </>
  );
}

export function HomeScreen() {
  const profile = useRequiredProfile();
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-6 px-gutter py-6 md:px-gutter-lg md:py-10 tall:gap-8">
      {profile && <HomeContent profile={profile} />}
    </main>
  );
}

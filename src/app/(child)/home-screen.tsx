"use client";

import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AVATARS, Avatar } from "@/components/avatar";
import { CosmosHorizon } from "@/components/cosmos-background";
import { SoundToggle } from "@/components/sound-toggle";
import {
  SUBJECT_TILE_CELL,
  SUBJECT_TILE_GRID,
  SubjectTile,
} from "@/components/subject-tile";
import { subjectsOfGrade } from "@/content/grades";
import { ChildSounds } from "@/learn/child-sounds";
import {
  continueTarget,
  subjectProgress,
  subjectStatus,
} from "@/learn/next-step";
import { avatarClipId, useSayClip } from "@/lib/avatar-sounds";
import { useFeedbackSoundsContext } from "@/lib/feedback-sounds";
import { GRADES_PATH, PROFILES_PATH, subjectPath } from "@/lib/routes";
import { now, vnDayKey } from "@/lib/time";
import type { MascotExpression } from "@/mascot/expressions";
import { OWL_TAP_LINE } from "@/mascot/lines";
import { Owl } from "@/mascot/owl";
import type { ProfileRecord } from "@/progress/db";
import {
  type ChildProgress,
  useChildProgress,
  useContentIndex,
} from "@/progress/hooks";
import {
  homeMascotExpression,
  lastStudiedBySubject,
  lessonsForSubject,
  subjectNudgeDays,
} from "@/progress/summary";
import type { ContentIndex } from "@/schema/content";
import { ContentError } from "./content-error";
import { ContinueCard } from "./continue-card";
import { StickerShelf } from "./sticker-shelf";
import { useRequiredProfile } from "./use-required-profile";

// What the owl says next to its expression on the home screen.
const OWL_SPEECH: Partial<Record<MascotExpression, string>> = {
  welcome: "Mừng bạn quay lại! Mình nhớ bạn lắm.",
  happy: "Hôm nay bạn học chăm quá!",
};
const DEFAULT_SPEECH = "Hôm nay mình học môn nào?";

// How long the owl cheers after a tap.
const OWL_REACTION_MS = 1200;

function OwlGreeting({
  progress,
  childId,
}: {
  progress: ChildProgress;
  childId: string;
}) {
  const today = vnDayKey(now());
  const expression = homeMascotExpression(progress.activityDays, today);
  const say = useSayClip(childId);
  // A tap makes the owl cheer (wings up, a hop) and hoot for a moment.
  const [cheering, setCheering] = useState(false);
  useEffect(() => {
    if (!cheering) return undefined;
    const timer = setTimeout(() => setCheering(false), OWL_REACTION_MS);
    return () => clearTimeout(timer);
  }, [cheering]);
  return (
    <section className="flex items-center gap-3" aria-label="Bạn cú">
      <button
        type="button"
        aria-label="Chạm vào bạn cú"
        data-owl-tap
        // Makes its own sound, so the soft button press stays out.
        data-own-sound
        className="-m-1 shrink-0 rounded-full p-1 transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
        onClick={() => {
          say?.(OWL_TAP_LINE.id);
          setCheering(false);
          // A new reaction restarts the pose even on a quick second tap.
          requestAnimationFrame(() => setCheering(true));
        }}
      >
        <Owl expression={cheering ? "cheer" : expression} size="home" loop />
      </button>
      <p className="font-semibold">
        {OWL_SPEECH[expression] ?? DEFAULT_SPEECH}
      </p>
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
    lessonsForSubject(index, subjectId, profile);
  const lastStudied = lastStudiedBySubject(
    index.lessons,
    progress.attempts,
    progress.sections,
  );
  const today = now();
  const target = continueTarget(index, profile, progress);
  const targetSubject =
    target && index.subjects.find((s) => s.id === target.lesson.subject);
  const subjects = subjectsOfGrade(index.subjects, profile.grade);
  const sounds = useFeedbackSoundsContext();
  return (
    <>
      <StickerShelf
        childId={profile.id}
        lessons={subjects.flatMap((s) => lessonsOf(s.id))}
        stickers={progress.stickers}
        sections={progress.sections}
        sounds={sounds}
      />
      {target && targetSubject && (
        <ContinueCard
          target={target}
          subject={targetSubject}
          overviewSeen={progress.overviewsSeen.includes(target.lesson.id)}
        />
      )}
      <ul className={SUBJECT_TILE_GRID}>
        {subjects.map((subject) => {
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
      <OwlGreeting progress={progress} childId={profile.id} />
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

// The child's own avatar beside the greeting: tapping it plays its sound.
function AvatarButton({
  avatar,
  childId,
}: {
  avatar: string;
  childId: string;
}) {
  const say = useSayClip(childId);
  const label = AVATARS.find((a) => a.id === avatar)?.label;
  return (
    <button
      type="button"
      aria-label={label ? `Nghe tiếng ${label}` : "Nghe tiếng hình đại diện"}
      data-avatar-tap
      data-own-sound
      className="shrink-0 rounded-full transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
      onClick={() => say?.(avatarClipId(avatar))}
    >
      <Avatar avatar={avatar} className="size-12 md:size-14" />
    </button>
  );
}

function HomeContent({ profile }: { profile: ProfileRecord }) {
  return (
    <ChildSounds childId={profile.id}>
      <HomeHeaderAndBody profile={profile} />
    </ChildSounds>
  );
}

function HomeHeaderAndBody({ profile }: { profile: ProfileRecord }) {
  const progress = useChildProgress(profile.id);
  return (
    <>
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AvatarButton avatar={profile.avatar} childId={profile.id} />
          <div className="flex min-w-0 flex-col items-start gap-1">
            <h1 className="min-w-0 break-words text-title font-bold md:text-title-lg">
              Chào {profile.name}!
            </h1>
            <Link
              href={GRADES_PATH}
              aria-label={`Lớp ${profile.grade}, đổi lớp`}
              data-grade-chip
              className="flex min-h-touch w-fit shrink-0 items-center justify-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 text-caption font-semibold transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
            >
              <GraduationCap aria-hidden className="size-5 shrink-0" />
              <span aria-hidden>Lớp {profile.grade}</span>
            </Link>
          </div>
        </div>
        {/* The sound switch ends the row, where every screen keeps it. */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={PROFILES_PATH}
            // Avatar only on a phone, so the greeting keeps one line; the name
            // stays for screen readers and shows from tablet width.
            aria-label="Đổi hồ sơ"
            className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-caption font-semibold transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none sm:w-auto sm:justify-start sm:gap-2 sm:pr-3 sm:pl-1.5"
          >
            <Avatar avatar={profile.avatar} className="size-8 shrink-0" />
            <span className="hidden sm:inline">Đổi hồ sơ</span>
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
      {/* The end of the page: its own band of sky, below the last content. */}
      <CosmosHorizon className="mt-auto -mx-gutter -mb-6 md:-mx-gutter-lg md:-mb-10" />
    </main>
  );
}

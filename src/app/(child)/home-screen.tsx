"use client";

import { UsersRound } from "lucide-react";
import Link from "next/link";
import { SoundToggle } from "@/components/sound-toggle";
import { StreakFlame } from "@/components/streak-flame";
import { SubjectTile } from "@/components/subject-tile";
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
  subjectProgress,
} from "@/progress/summary";
import { ContentError } from "./content-error";
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
    <section className="flex items-center gap-4" aria-label="Bạn cú">
      <Owl expression={expression} size="home" />
      <div className="flex min-w-0 flex-col items-start gap-3">
        <p className="font-semibold">
          {OWL_SPEECH[expression] ?? DEFAULT_SPEECH}
        </p>
        <StreakFlame streak={computeStreak(progress.activityDays, today)} />
      </div>
    </section>
  );
}

function SubjectGrid({
  profile,
  progress,
}: {
  profile: ProfileRecord;
  progress: ChildProgress;
}) {
  const content = useContentIndex();
  if (content.status === "error") return <ContentError />;
  if (content.status === "loading") return null;

  const { index } = content;
  const lastStudied = lastStudiedBySubject(
    index.lessons,
    progress.attempts,
    progress.sections,
  );
  const today = now();
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {index.subjects.map((subject) => (
        <li key={subject.id}>
          <SubjectTile
            subject={subject}
            href={subjectPath(subject.id)}
            progress={subjectProgress(
              lessonsForSubject(index, subject.id, profile.series[subject.id]),
              progress.stickers,
            )}
            nudgeDays={subjectNudgeDays(lastStudied.get(subject.id), today)}
          />
        </li>
      ))}
    </ul>
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
        <div className="flex shrink-0 items-center gap-3">
          <SoundToggle childId={profile.id} />
          <Link
            href={PROFILES_PATH}
            className="flex h-12 shrink-0 items-center gap-2 rounded-full border-2 border-border bg-surface px-3 text-caption font-semibold transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
          >
            <UsersRound aria-hidden className="size-5" />
            Đổi hồ sơ
          </Link>
        </div>
      </header>
      {progress && (
        <>
          <OwlGreeting progress={progress} />
          <SubjectGrid profile={profile} progress={progress} />
        </>
      )}
    </>
  );
}

export function HomeScreen() {
  const profile = useRequiredProfile();
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-8 px-gutter py-6 md:px-gutter-lg md:py-10">
      {profile && <HomeContent profile={profile} />}
    </main>
  );
}

"use client";

import { UsersRound } from "lucide-react";
import Link from "next/link";
import { SubjectTile } from "@/components/subject-tile";
import { PROFILES_PATH, subjectPath } from "@/lib/routes";
import { now } from "@/lib/time";
import type { ProfileRecord } from "@/progress/db";
import { useChildProgress, useContentIndex } from "@/progress/hooks";
import {
  lastStudiedBySubject,
  lessonsForSubject,
  subjectNudgeDays,
  subjectProgress,
} from "@/progress/summary";
import { ContentError } from "./content-error";
import { useRequiredProfile } from "./use-required-profile";

function SubjectGrid({ profile }: { profile: ProfileRecord }) {
  const content = useContentIndex();
  const progress = useChildProgress(profile.id);
  if (content.status === "error") return <ContentError />;
  if (content.status === "loading" || !progress) return null;

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

export function HomeScreen() {
  const profile = useRequiredProfile();
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-8 px-gutter py-6 md:px-gutter-lg md:py-10">
      {profile && (
        <>
          <header className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="break-words text-title font-bold md:text-title-lg">
                Chào {profile.name}!
              </h1>
              <p className="text-muted-foreground">Hôm nay mình học môn nào?</p>
            </div>
            <Link
              href={PROFILES_PATH}
              className="flex h-12 shrink-0 items-center gap-2 rounded-full border-2 border-border bg-surface px-3 text-caption font-semibold transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
            >
              <UsersRound aria-hidden className="size-5" />
              Đổi hồ sơ
            </Link>
          </header>
          <SubjectGrid profile={profile} />
        </>
      )}
    </main>
  );
}

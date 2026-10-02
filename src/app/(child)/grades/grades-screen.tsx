"use client";

import { Check, ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CosmosHorizon } from "@/components/cosmos-background";
import { gradeIcon } from "@/components/grade-style";
import { PageTopBar } from "@/components/page-top-bar";
import { openGrades, visibleGrades } from "@/content/grades";
import { ChildSounds } from "@/learn/child-sounds";
import { HOME_PATH } from "@/lib/routes";
import type { ProfileRecord } from "@/progress/db";
import { setProfileGrade, useContentIndex } from "@/progress/hooks";
import { GRADES } from "@/schema/content";
import { requestSync } from "@/sync/request";
import { ContentError } from "../content-error";
import { useRequiredProfile } from "../use-required-profile";

const TILE =
  "relative flex min-h-32 flex-col items-center justify-center gap-1 rounded-lg border-2 p-3 text-center md:min-h-44";

function GradeTile({
  grade,
  open,
  current,
  busy,
  onPick,
}: {
  grade: number;
  open: boolean;
  current: boolean;
  busy: boolean;
  onPick: () => void;
}) {
  const Icon = gradeIcon(grade);
  const face = (
    <>
      <span
        className={`flex size-12 items-center justify-center rounded-full md:size-14 ${
          open ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon aria-hidden className="size-7 md:size-8" strokeWidth={2.25} />
      </span>
      <span className="font-heading font-bold text-title leading-none md:text-title-lg">
        {grade}
      </span>
      <span className="sr-only">Lớp {grade}</span>
      {open ? (
        current && (
          <span
            data-current-mark
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-primary-foreground text-primary"
          >
            <Check aria-hidden className="size-5" strokeWidth={3} />
          </span>
        )
      ) : (
        <>
          <span
            data-lock
            className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <Lock aria-hidden className="size-4" strokeWidth={2.5} />
          </span>
          <span className="whitespace-nowrap text-caption text-muted-foreground">
            Sắp ra mắt
          </span>
        </>
      )}
    </>
  );
  if (!open) {
    return (
      <div
        data-grade={grade}
        data-locked
        className={`${TILE} border-border bg-surface`}
      >
        {face}
      </div>
    );
  }
  return (
    <button
      type="button"
      data-grade={grade}
      aria-pressed={current}
      disabled={busy}
      onClick={onPick}
      className={`${TILE} border-primary bg-primary text-primary-foreground shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none ${
        current ? "ring-4 ring-ring ring-offset-2" : ""
      }`}
    >
      {face}
    </button>
  );
}

function GradeGrid({ profile }: { profile: ProfileRecord }) {
  const content = useContentIndex();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (content.status === "error") return <ContentError />;
  if (content.status === "loading") return null;
  const open = new Set(openGrades(content.index));

  async function pick(grade: number) {
    setBusy(true);
    if (grade !== profile.grade) {
      await setProfileGrade(profile.id, grade);
      requestSync();
    }
    router.replace(HOME_PATH);
  }

  return (
    <ul className="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4">
      {visibleGrades(GRADES).map((grade) => (
        <li key={grade} className="contents">
          <GradeTile
            grade={grade}
            open={open.has(grade)}
            current={grade === profile.grade}
            busy={busy}
            onPick={() => pick(grade)}
          />
        </li>
      ))}
    </ul>
  );
}

export function GradesScreen() {
  const profile = useRequiredProfile();
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
          <header className="flex flex-col gap-1">
            <h1 className="text-title font-bold md:text-title-lg">Chọn lớp</h1>
            <p className="text-muted-foreground">
              Bạn đang học lớp nào? Những lớp có khoá là sắp ra mắt.
            </p>
          </header>
          <GradeGrid profile={profile} />
        </ChildSounds>
      )}
      {/* The end of the page: its own band of sky, like the home screen. */}
      <CosmosHorizon className="mt-auto -mx-gutter -mb-6 md:-mx-gutter-lg md:-mb-10" />
    </main>
  );
}

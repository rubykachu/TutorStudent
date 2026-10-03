"use client";

import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { PROFILES_PATH } from "@/lib/routes";
import { useProfiles } from "@/progress/hooks";
import { closeParentSession } from "@/progress/parent-session";
import { ChildReport } from "./child-report";
import { FamilyCodePanel } from "./family-code-panel";
import { OfflineStatus } from "./offline-status";
import { ReportSourceNote } from "./progress-location";
import { SyncStatus } from "./sync-status";

const HEADER_ACTION =
  "flex h-12 shrink-0 items-center gap-2 rounded-full border-2 border-border bg-surface px-3 text-caption font-semibold transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none";

// The parent page once unlocked: one child at a time, picked with a
// segmented control when the device holds several.
export function ParentDashboard() {
  const profiles = useProfiles();
  const [pickedId, setPickedId] = useState<string | null>(null);
  const profile =
    profiles?.find((p) => p.id === pickedId) ?? profiles?.[0] ?? null;

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-6 px-gutter py-6 md:px-gutter-lg md:py-10">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="min-w-0 text-title font-bold md:text-title-lg">
          Trang phụ huynh
        </h1>
        <div className="flex shrink-0 items-center gap-3">
          <Link href={PROFILES_PATH} className={HEADER_ACTION}>
            <ArrowLeft aria-hidden className="size-5" />
            Về app
          </Link>
          <button
            type="button"
            onClick={closeParentSession}
            className={HEADER_ACTION}
          >
            <Lock aria-hidden className="size-5" />
            Khoá lại
          </button>
        </div>
      </header>
      <ReportSourceNote />
      <SyncStatus />
      <OfflineStatus />
      <FamilyCodePanel />
      {profiles && profiles.length === 0 && (
        <p className="rounded-lg bg-surface p-4 shadow-card md:p-6">
          Máy này chưa có hồ sơ con nào.
        </p>
      )}
      {profiles && profiles.length > 1 && (
        <fieldset
          className="flex flex-wrap gap-2 rounded-lg bg-muted p-1"
          aria-label="Chọn con"
        >
          {profiles.map((p) => {
            const active = p.id === profile?.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                onClick={() => setPickedId(p.id)}
                className={`flex min-h-touch min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 font-semibold ${active ? "bg-surface shadow-card" : "text-muted-foreground"}`}
              >
                <Avatar avatar={p.avatar} className="size-8 shrink-0" />
                <span className="min-w-0 break-words">{p.name}</span>
              </button>
            );
          })}
        </fieldset>
      )}
      {profile && (
        <>
          {profiles?.length === 1 && (
            <div className="flex items-center gap-3">
              <Avatar avatar={profile.avatar} className="size-12" />
              <h2 className="min-w-0 break-words font-heading text-block font-bold md:text-block-lg">
                {profile.name}
              </h2>
            </div>
          )}
          <ChildReport key={profile.id} profile={profile} />
        </>
      )}
    </main>
  );
}

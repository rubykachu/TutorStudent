"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { ProfileForm } from "@/components/profile-form";
import { ProfilePicker } from "@/components/profile-picker";
import { HOME_PATH, PARENT_PATH } from "@/lib/routes";
import type { ProfileRecord } from "@/progress/db";
import {
  createProfile,
  type NewProfile,
  setActiveProfile,
  useProfiles,
} from "@/progress/hooks";
import type { Subject } from "@/schema/content";

type ProfilesScreenProps = {
  // Subjects from the build, so a profile can be created before (or without)
  // the content index loading.
  subjects: Subject[];
};

export function ProfilesScreen({ subjects }: ProfilesScreenProps) {
  const router = useRouter();
  const profiles = useProfiles();
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleCreate(input: NewProfile) {
    setBusy(true);
    await createProfile(input, subjects);
    router.replace(HOME_PATH);
  }

  async function handlePick(profile: ProfileRecord) {
    setBusy(true);
    await setActiveProfile(profile.id);
    router.replace(HOME_PATH);
  }

  const hasProfiles = profiles !== undefined && profiles.length > 0;
  const showForm = profiles !== undefined && (adding || !hasProfiles);

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-8 px-gutter py-6 md:px-gutter-lg md:py-10">
      {showForm && (
        <>
          <h1 className="text-title font-bold md:text-title-lg">
            Chào bạn mới!
          </h1>
          <ProfileForm onSubmit={handleCreate} submitting={busy} />
          {hasProfiles && (
            <BigButton variant="secondary" onClick={() => setAdding(false)}>
              <ArrowLeft aria-hidden className="size-6" />
              Quay lại
            </BigButton>
          )}
        </>
      )}
      {hasProfiles && !showForm && (
        <>
          <h1 className="text-title font-bold md:text-title-lg">
            Ai đang học đấy?
          </h1>
          <ProfilePicker profiles={profiles} onPick={handlePick} />
          <BigButton variant="secondary" onClick={() => setAdding(true)}>
            <Plus aria-hidden className="size-6" />
            Thêm bạn mới
          </BigButton>
        </>
      )}
      <Link
        href={PARENT_PATH}
        className="mt-auto inline-flex min-h-touch items-center self-center px-4 text-caption text-muted-foreground underline underline-offset-4"
      >
        Phụ huynh
      </Link>
    </main>
  );
}

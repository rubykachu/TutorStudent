"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { CosmosHorizon } from "@/components/cosmos-background";
import { ProfileForm } from "@/components/profile-form";
import { ProfilePicker } from "@/components/profile-picker";
import { openGrades } from "@/content/grades";
import { DEFAULT_GRADE } from "@/lib/config";
import { HOME_PATH, PARENT_PATH } from "@/lib/routes";
import type { ProfileRecord } from "@/progress/db";
import {
  createProfile,
  type NewProfile,
  setActiveProfile,
  updateProfile,
  useContentIndex,
  useProfiles,
} from "@/progress/hooks";
import type { Subject } from "@/schema/content";

type ProfilesScreenProps = {
  // Subjects from the build, so a profile can be created before (or without)
  // the content index loading.
  subjects: Subject[];
};

// What the screen shows: the list to pick from, the form for a new child, or
// the same form filled in for one child.
type Mode = { kind: "pick" } | { kind: "add" } | { kind: "edit"; id: string };

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <BigButton variant="secondary" onClick={onClick}>
      <ArrowLeft aria-hidden className="size-6" />
      Quay lại
    </BigButton>
  );
}

export function ProfilesScreen({ subjects }: ProfilesScreenProps) {
  const router = useRouter();
  const profiles = useProfiles();
  const [mode, setMode] = useState<Mode>({ kind: "pick" });
  const [busy, setBusy] = useState(false);
  // Until the content index is read, only the default grade can be chosen.
  const content = useContentIndex();
  const pickableGrades =
    content.status === "ready" ? openGrades(content.index) : [DEFAULT_GRADE];

  async function handleCreate(input: NewProfile) {
    setBusy(true);
    await createProfile(input, subjects);
    router.replace(HOME_PATH);
  }

  function backToPicker() {
    setMode({ kind: "pick" });
  }

  async function handleEdit(id: string, input: NewProfile) {
    setBusy(true);
    await updateProfile(id, input);
    setBusy(false);
    setMode({ kind: "pick" });
  }

  async function handlePick(profile: ProfileRecord) {
    setBusy(true);
    await setActiveProfile(profile.id);
    router.replace(HOME_PATH);
  }

  const hasProfiles = profiles !== undefined && profiles.length > 0;
  const editing =
    mode.kind === "edit"
      ? profiles?.find((profile) => profile.id === mode.id)
      : undefined;
  const view: "loading" | "add" | "edit" | "pick" =
    profiles === undefined
      ? "loading"
      : editing
        ? "edit"
        : mode.kind === "add" || !hasProfiles
          ? "add"
          : "pick";

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-8 px-gutter py-6 md:px-gutter-lg md:py-10">
      {view === "add" && (
        <>
          <h1 className="text-title font-bold md:text-title-lg">
            Chào bạn mới!
          </h1>
          <ProfileForm
            onSubmit={handleCreate}
            submitting={busy}
            openGrades={pickableGrades}
          />
          {hasProfiles && <BackButton onClick={backToPicker} />}
        </>
      )}
      {view === "edit" && editing && (
        <>
          <h1 className="text-title font-bold md:text-title-lg">Sửa hồ sơ</h1>
          <ProfileForm
            // A fresh form per child, so one child's name never carries over.
            key={editing.id}
            initial={{
              name: editing.name,
              avatar: editing.avatar,
              grade: editing.grade,
            }}
            openGrades={pickableGrades}
            submitLabel="Lưu"
            onSubmit={(input) => handleEdit(editing.id, input)}
            submitting={busy}
          />
          <BackButton onClick={backToPicker} />
        </>
      )}
      {view === "pick" && profiles && (
        <>
          <h1 className="text-title font-bold md:text-title-lg">
            Ai đang học đấy?
          </h1>
          <ProfilePicker
            profiles={profiles}
            onPick={handlePick}
            onEdit={(profile) => setMode({ kind: "edit", id: profile.id })}
          />
          <BigButton
            variant="secondary"
            onClick={() => setMode({ kind: "add" })}
          >
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
      {/* The end of the page: its own band of sky, like the home screen. */}
      <CosmosHorizon className="-mx-gutter -mb-6 md:-mx-gutter-lg md:-mb-10" />
    </main>
  );
}

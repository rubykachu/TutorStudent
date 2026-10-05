"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BigButton } from "@/components/big-button";
import { CosmosHorizon } from "@/components/cosmos-background";
import { ProfileForm } from "@/components/profile-form";
import { ProfilePicker } from "@/components/profile-picker";
import { openGrades } from "@/content/grades";
import { markLaunched } from "@/lib/cold-launch";
import { DEFAULT_GRADE } from "@/lib/config";
import { HOME_PATH, PARENT_PATH } from "@/lib/routes";
import { playSequence, preloadSounds } from "@/lib/sound";
import { soundUrl } from "@/lib/sound-manifest";
import { OWL_TAP_LINE } from "@/mascot/lines";
import {
  OuterScreenMusic,
  unlockAudioFromTap,
} from "@/music/background-music-runner";
import type { ProfileRecord } from "@/progress/db";
import {
  appDb,
  createProfile,
  type NewProfile,
  readSoundEnabled,
  setActiveProfile,
  updateProfile,
  useContentIndex,
  useProfiles,
} from "@/progress/hooks";
import type { Subject } from "@/schema/content";
import { requestSync } from "@/sync/request";

type ProfilesScreenProps = {
  // Subjects from the build, so a profile can be created before (or without)
  // the content index loading.
  subjects: Subject[];
};

// What the screen shows: the list to pick from, the form for a new child, or
// the same form filled in for one child.
type Mode = { kind: "pick" } | { kind: "add" } | { kind: "edit"; id: string };

// The owl's hello when a child picks themselves, unless that child turned
// sound off. Audio is already unlocked by the tap, so it may start after the
// setting is read.
async function greet(childId: string): Promise<void> {
  const url = soundUrl(OWL_TAP_LINE.id);
  if (!url || !(await readSoundEnabled(appDb(), childId))) return;
  void playSequence([url]);
}

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

  // Decoded once audio is unlocked, so the hello plays at once.
  useEffect(() => {
    const url = soundUrl(OWL_TAP_LINE.id);
    if (url) preloadSounds([url]);
  }, []);

  async function handleCreate(input: NewProfile) {
    markLaunched();
    setBusy(true);
    await createProfile(input, subjects);
    requestSync();
    router.replace(HOME_PATH);
  }

  function backToPicker() {
    setMode({ kind: "pick" });
  }

  async function handleEdit(id: string, input: NewProfile) {
    setBusy(true);
    await updateProfile(id, input);
    requestSync();
    setBusy(false);
    setMode({ kind: "pick" });
  }

  async function handlePick(profile: ProfileRecord) {
    // Inside the tap, before any await: iOS lets audio start only here. The
    // music starts and the owl says hello as the child enters home.
    unlockAudioFromTap();
    void greet(profile.id);
    markLaunched();
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
      <OuterScreenMusic />
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
            {profiles.length === 1 && profiles[0]
              ? `Chào ${profiles[0].name}! Học thôi nào`
              : "Hôm nay ai học?"}
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

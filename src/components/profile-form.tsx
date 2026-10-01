"use client";

import { Lock } from "lucide-react";
import { type FormEvent, useEffect, useId, useState } from "react";
import {
  AVATARS,
  Avatar,
  type AvatarId,
  DEFAULT_AVATAR,
  isAvatarId,
} from "@/components/avatar";
import { BigButton } from "@/components/big-button";
import { avatarSoundUrls, playAvatarSound } from "@/lib/avatar-sounds";
import { DEFAULT_GRADE, PROFILE_NAME_MAX_LENGTH } from "@/lib/config";
import { preloadSounds } from "@/lib/sound";
import type { NewProfile } from "@/progress/hooks";
import { GRADES } from "@/schema/content";

type ProfileFormProps = {
  onSubmit: (profile: NewProfile) => void;
  submitting: boolean;
  // The profile being edited; empty for a new child.
  initial?: NewProfile;
  submitLabel?: string;
  // Grades a child can pick (those with published lessons); the others show
  // locked.
  openGrades: readonly number[];
};

export function ProfileForm({
  onSubmit,
  submitting,
  initial,
  submitLabel = "Bắt đầu học",
  openGrades,
}: ProfileFormProps) {
  const nameId = useId();
  const [name, setName] = useState(initial?.name ?? "");
  // An id from a newer app version shows the default face, as `Avatar` does.
  const [avatar, setAvatar] = useState<AvatarId>(
    initial && isAvatarId(initial.avatar) ? initial.avatar : DEFAULT_AVATAR,
  );
  const [grade, setGrade] = useState(initial?.grade ?? DEFAULT_GRADE);
  const trimmed = name.trim();

  // Each avatar says its own sound when chosen, so they load up front.
  useEffect(() => preloadSounds(avatarSoundUrls()), []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (trimmed && !submitting) onSubmit({ name: trimmed, avatar, grade });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <label
          htmlFor={nameId}
          className="font-heading text-block font-semibold md:text-block-lg"
        >
          Bạn tên là gì?
        </label>
        <input
          id={nameId}
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={PROFILE_NAME_MAX_LENGTH}
          autoComplete="off"
          enterKeyHint="done"
          className="h-14 w-full rounded-lg border-2 border-border bg-surface px-4 text-body focus-visible:border-primary md:h-16 md:text-body-lg"
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-heading text-block font-semibold md:text-block-lg">
          Chọn hình đại diện
        </legend>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {AVATARS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-border bg-surface p-2 transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none has-checked:border-primary has-checked:ring-2 has-checked:ring-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
            >
              <input
                type="radio"
                name="avatar"
                value={option.id}
                checked={avatar === option.id}
                onChange={() => setAvatar(option.id)}
                // A click, not the change, so choosing the same avatar again
                // plays its sound again.
                onClick={() => playAvatarSound(option.id)}
                data-own-sound
                className="sr-only"
              />
              <Avatar avatar={option.id} className="size-16 md:size-20" />
              <span className="text-caption">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-heading text-block font-semibold md:text-block-lg">
          Bạn học lớp mấy?
        </legend>
        <div className="grid grid-cols-6 gap-2 md:gap-3">
          {GRADES.map((option) => {
            const open = openGrades.includes(option);
            return (
              <label
                key={option}
                data-grade-option={option}
                className={`flex min-h-touch items-center justify-center rounded-lg border-2 font-heading font-bold text-block md:text-block-lg ${
                  open
                    ? "cursor-pointer border-border bg-surface transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
                    : "relative border-border border-dashed bg-muted text-muted-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="grade"
                  value={option}
                  checked={grade === option}
                  disabled={!open}
                  onChange={() => setGrade(option)}
                  className="sr-only"
                  aria-label={`Lớp ${option}${open ? "" : ", sắp ra mắt"}`}
                />
                <span aria-hidden>{option}</span>
                {!open && (
                  <Lock
                    aria-hidden
                    data-lock
                    className="absolute top-1 right-1 size-3"
                    strokeWidth={2.5}
                  />
                )}
              </label>
            );
          })}
        </div>
      </fieldset>

      <BigButton type="submit" disabled={!trimmed || submitting}>
        {submitLabel}
      </BigButton>
    </form>
  );
}

import { Pencil } from "lucide-react";
import { useId } from "react";
import { Avatar } from "@/components/avatar";
import { PanelArt } from "@/components/panel-art";
import type { ProfileRecord } from "@/progress/db";

type ProfilePickerProps = {
  profiles: readonly ProfileRecord[];
  onPick: (profile: ProfileRecord) => void;
  onEdit: (profile: ProfileRecord) => void;
};

// Large avatar buttons so a child who cannot read yet still finds their own.
// Under each one a smaller "Sửa" opens the profile for a new name or avatar.
export function ProfilePicker({
  profiles,
  onPick,
  onEdit,
}: ProfilePickerProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onPick={onPick}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

function ProfileCard({
  profile,
  onPick,
  onEdit,
}: {
  profile: ProfileRecord;
  onPick: (profile: ProfileRecord) => void;
  onEdit: (profile: ProfileRecord) => void;
}) {
  const nameId = useId();
  return (
    <li
      data-profile={profile.id}
      className="relative isolate flex flex-col overflow-hidden rounded-lg border-2 border-border bg-surface shadow-card"
    >
      <PanelArt />
      <button
        type="button"
        onClick={() => onPick(profile)}
        className="flex flex-1 flex-col items-center gap-3 p-4 pb-2 transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:p-6 md:pb-3"
      >
        <Avatar avatar={profile.avatar} className="size-24 md:size-28" />
        <span
          id={nameId}
          className="w-full break-words text-center text-block font-bold font-heading md:text-block-lg"
        >
          {profile.name}
        </span>
      </button>
      {/* Named "Sửa", with the child's name as its description, so the
          picking button keeps the name as its own. */}
      <button
        type="button"
        onClick={() => onEdit(profile)}
        aria-describedby={nameId}
        className="mx-auto mb-2 inline-flex min-h-touch items-center gap-1.5 rounded-full px-4 text-caption font-semibold text-muted-foreground transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none"
      >
        <Pencil aria-hidden className="size-4" />
        Sửa
      </button>
    </li>
  );
}

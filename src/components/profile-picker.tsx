import { Avatar } from "@/components/avatar";
import { PanelArt } from "@/components/panel-art";
import type { ProfileRecord } from "@/progress/db";

type ProfilePickerProps = {
  profiles: readonly ProfileRecord[];
  onPick: (profile: ProfileRecord) => void;
};

// Large avatar buttons so a child who cannot read yet still finds their own.
export function ProfilePicker({ profiles, onPick }: ProfilePickerProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {profiles.map((profile) => (
        <li key={profile.id}>
          <button
            type="button"
            onClick={() => onPick(profile)}
            className="relative isolate flex h-full w-full flex-col overflow-hidden items-center gap-3 rounded-lg border-2 border-border bg-surface p-4 shadow-card transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none md:p-6"
          >
            <PanelArt />
            <Avatar avatar={profile.avatar} className="size-24 md:size-28" />
            <span className="w-full break-words text-center text-block font-bold font-heading md:text-block-lg">
              {profile.name}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

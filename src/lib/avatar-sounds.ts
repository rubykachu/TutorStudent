import { AVATARS, DEFAULT_AVATAR, isAvatarId } from "@/components/avatar";
import { useSoundEnabled } from "@/progress/hooks";
import { playSequence, preloadSounds, unlockAudio } from "./sound";
import { AVATAR_CLIP_IDS, soundUrl } from "./sound-manifest";

// The clip id of an avatar's sound. Unknown ids use the default avatar's,
// like `Avatar` draws the default face.
export function avatarClipId(avatar: string): string {
  return AVATAR_CLIP_IDS[isAvatarId(avatar) ? avatar : DEFAULT_AVATAR];
}

// Urls of every avatar's clip, to preload before the child picks one.
export function avatarSoundUrls(): string[] {
  return AVATARS.flatMap((a) => soundUrl(avatarClipId(a.id)) ?? []);
}

// Plays an avatar's sound from a tap handler, for screens with no child yet
// (the profile form), where there is no sound setting to ask: sound is on
// until a child turns it off. Screens of a child use `FeedbackSounds.say`.
export function playAvatarSound(avatar: string): void {
  const url = soundUrl(avatarClipId(avatar));
  if (!url) return;
  preloadSounds([url]);
  unlockAudio();
  void playSequence([url]);
}

// Plays a shared clip by id for one child, or nothing when that child turned
// sound off; `undefined` while the setting loads. The clips are already
// preloaded by `ChildSounds` while sound is on.
export function useSayClip(
  childId: string,
): ((clipId: string) => void) | undefined {
  const enabled = useSoundEnabled(childId) === true;
  return enabled
    ? (clipId) => {
        const url = soundUrl(clipId);
        if (url) void playSequence([url]);
      }
    : undefined;
}

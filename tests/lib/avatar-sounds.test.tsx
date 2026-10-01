import { describe, expect, it } from "vitest";
import { AVATARS, DEFAULT_AVATAR } from "@/components/avatar";
import { avatarClipId, avatarSoundUrls } from "@/lib/avatar-sounds";
import { AVATAR_CLIP_IDS, soundUrl } from "@/lib/sound-manifest";

describe("avatar sounds", () => {
  it("maps every avatar id to its own clip, found in the manifest", () => {
    for (const { id } of AVATARS) {
      expect(avatarClipId(id)).toBe(AVATAR_CLIP_IDS[id]);
      expect(soundUrl(avatarClipId(id)), id).toBeDefined();
    }
    expect(avatarSoundUrls()).toHaveLength(AVATARS.length);
  });

  it("uses the default avatar's clip for an id this version does not know", () => {
    expect(avatarClipId("from-a-newer-app")).toBe(avatarClipId(DEFAULT_AVATAR));
  });
});

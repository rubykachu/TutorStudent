import { describe, expect, it } from "vitest";
import { soundUrl } from "@/lib/sound-manifest";
import {
  countDoneSections,
  FIRST_SONG_AFTER_SECTIONS,
  newlyUnlocked,
  SECTIONS_PER_EXTRA_SONG,
  SONGS,
  sectionsToUnlock,
  unlockedCount,
} from "@/music/songs";

describe("music box unlock rule", () => {
  it("opens nothing before the first finished section, then one song", () => {
    expect(unlockedCount(0)).toBe(0);
    expect(unlockedCount(FIRST_SONG_AFTER_SECTIONS)).toBe(1);
  });

  it("opens one more song every SECTIONS_PER_EXTRA_SONG sections, up to all of them", () => {
    expect(SONGS).toHaveLength(3);
    const thresholds = SONGS.map((_, i) => sectionsToUnlock(i));
    expect(thresholds).toEqual([1, 4, 7]);
    for (const [position, needed] of thresholds.entries()) {
      expect(unlockedCount(needed - 1)).toBe(position);
      expect(unlockedCount(needed)).toBe(position + 1);
    }
    expect(unlockedCount(1000)).toBe(SONGS.length);
    expect(SECTIONS_PER_EXTRA_SONG).toBe(3);
  });

  it("names the songs a finished section won", () => {
    expect(newlyUnlocked(0, 1).map((s) => s.id)).toEqual([SONGS[0]?.id]);
    expect(newlyUnlocked(1, 3)).toEqual([]);
    expect(newlyUnlocked(3, 4).map((s) => s.id)).toEqual([SONGS[1]?.id]);
    // Redoing a finished section changes nothing.
    expect(newlyUnlocked(5, 5)).toEqual([]);
    expect(newlyUnlocked(7, 8)).toEqual([]);
  });

  it("derives the count from finished sections only", () => {
    expect(
      countDoneSections([
        { state: "done" },
        { state: "in_progress" },
        { state: "done" },
        { state: "not_started" },
      ]),
    ).toBe(2);
  });

  it("gives every song a title, a unique id and a clip in the manifest", () => {
    expect(new Set(SONGS.map((s) => s.id)).size).toBe(SONGS.length);
    for (const song of SONGS) {
      expect(song.title.length).toBeGreaterThan(0);
      expect(soundUrl(song.id), song.id).toBeDefined();
    }
  });
});

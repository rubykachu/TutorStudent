import "fake-indexeddb/auto";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SectionPlayer } from "@/learn/section-player";
import { LOCAL_FAMILY_ID } from "@/lib/config";
import {
  BUTTON_ID,
  LEAVE_ID,
  LESSON_END_ID,
  soundUrl,
} from "@/lib/sound-manifest";
import { STICKER_EARNED_LINE } from "@/mascot/lines";
import { type ChildScope, TutorDb } from "@/progress/db";
import { setSoundEnabled } from "@/progress/hooks";
import type { Lesson } from "@/schema/content";
import { LESSON_ID, learnIndex, learnLesson, SECTION_ID } from "./helpers";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/lib/sound", () => ({
  playSequence: vi.fn(async () => undefined),
  playSound: vi.fn(async () => undefined),
  preloadSounds: vi.fn(),
  installAudioUnlock: vi.fn(() => () => undefined),
}));
const sound = await import("@/lib/sound");

const scope: ChildScope = { familyId: LOCAL_FAMILY_ID, childId: "kid-1" };
let db: TutorDb;

beforeEach(() => {
  db = new TutorDb();
});

afterEach(async () => {
  await db.delete();
  vi.clearAllMocks();
});

// The last step of the section (the recap), with `others` further sections
// in the lesson.
function renderAtRecap(overrides: Partial<Lesson> = {}) {
  const index = learnIndex(overrides);
  const section = index.sectionById.get(SECTION_ID);
  if (!section) throw new Error("section missing");
  return render(
    <SectionPlayer
      db={db}
      index={index}
      section={section}
      scope={scope}
      initialPosition={{ phase: "recap", index: 0 }}
    />,
  );
}

function twoSections(): Partial<Lesson> {
  const [first] = learnLesson().sections;
  if (!first) throw new Error("no section");
  return { sections: [first, { ...first, id: `${LESSON_ID}.section.two` }] };
}

async function finishSection() {
  fireEvent.click(screen.getByRole("button", { name: "Xong phần" }));
}

const played = () =>
  vi.mocked(sound.playSequence).mock.calls.map((call) => call[0]);

describe("finishing a section", () => {
  it("plays the finish fanfare alone once", async () => {
    renderAtRecap(twoSections());
    await finishSection();
    expect(await screen.findByText("Xong phần này!")).toBeInTheDocument();
    await waitFor(() => expect(played()).toEqual([[soundUrl(LESSON_END_ID)]]));
  });

  it("plays the fanfare then the owl's congratulation when the sticker is won, never both at once", async () => {
    renderAtRecap();
    await finishSection();
    expect(await screen.findByText("Giỏi quá!")).toBeInTheDocument();
    await waitFor(() =>
      expect(played()).toEqual([
        [soundUrl(LESSON_END_ID), soundUrl(STICKER_EARNED_LINE.id)],
      ]),
    );
  });

  it("is silent with sound off", async () => {
    await setSoundEnabled(scope.childId, false);
    renderAtRecap(twoSections());
    await finishSection();
    expect(await screen.findByText("Xong phần này!")).toBeInTheDocument();
    expect(sound.playSequence).not.toHaveBeenCalled();
  });
});

describe("leaving with the × control", () => {
  it("says goodbye through a sequence, not the plain button press", async () => {
    renderAtRecap(twoSections());
    const leave = await screen.findByRole("link", { name: "Về trang bài" });
    // Sound settings load asynchronously; wait until they are on.
    await waitFor(() => expect(sound.preloadSounds).toHaveBeenCalled());
    fireEvent.click(leave);
    expect(sound.playSequence).toHaveBeenCalledWith([soundUrl(LEAVE_ID)]);
    expect(sound.playSound).not.toHaveBeenCalledWith(soundUrl(BUTTON_ID));
  });

  it("makes no sound with sound off", async () => {
    await setSoundEnabled(scope.childId, false);
    renderAtRecap(twoSections());
    fireEvent.click(await screen.findByRole("link", { name: "Về trang bài" }));
    expect(sound.playSequence).not.toHaveBeenCalled();
    expect(sound.playSound).not.toHaveBeenCalled();
  });
});

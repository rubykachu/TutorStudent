import "fake-indexeddb/auto";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProfilesScreen } from "@/app/(child)/profiles/profiles-screen";
import { LOCAL_FAMILY_ID, PROFILE_NAME_MAX_LENGTH } from "@/lib/config";
import { AVATAR_CLIP_IDS, soundUrl } from "@/lib/sound-manifest";
import { markActivityDay } from "@/progress/db";
import {
  appDb,
  readActiveProfile,
  readChildProgress,
  resetAppDbForTesting,
  setActiveProfile,
} from "@/progress/hooks";

const playSequence = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock("@/lib/sound", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/sound")>()),
  playSequence,
}));

const replace = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
}));

afterEach(async () => {
  playSequence.mockClear();
  replace.mockClear();
  await appDb().delete();
  resetAppDbForTesting();
});

async function seedProfile(id: string, name: string, avatar: string) {
  await appDb().profiles.put({
    id,
    familyId: LOCAL_FAMILY_ID,
    name,
    avatar,
    grade: 6,
    series: { math: "kntt" },
    createdAt: `2026-01-0${id === "na" ? 1 : 2}T00:00:00.000Z`,
    updatedAt: `2026-01-0${id === "na" ? 1 : 2}T00:00:00.000Z`,
  });
}

async function openEditOf(name: string) {
  render(<ProfilesScreen subjects={[]} />);
  await screen.findByRole("heading", { name: "Ai đang học đấy?" });
  const card = screen.getByRole("button", { name }).closest("li");
  if (!card) throw new Error("profile card not found");
  fireEvent.click(within(card).getByRole("button", { name: "Sửa" }));
  await screen.findByRole("heading", { name: "Sửa hồ sơ" });
}

describe("ProfilesScreen: editing a profile", () => {
  it("opens the create form filled with the child's name and avatar", async () => {
    await seedProfile("na", "Bé Na", "fox");
    await openEditOf("Bé Na");

    expect(screen.getByLabelText("Bạn tên là gì?")).toHaveValue("Bé Na");
    expect(screen.getByRole("radio", { name: "Cáo" })).toBeChecked();
    expect(screen.getByRole("button", { name: "Lưu" })).toBeEnabled();
    expect(playSequence).not.toHaveBeenCalled();
  });

  it("saves a new name and avatar, keeps progress and the active child, and returns to the list", async () => {
    await seedProfile("na", "Bé Na", "fox");
    await seedProfile("bin", "Bin", "bear");
    await setActiveProfile("bin");
    await markActivityDay(
      appDb(),
      { familyId: LOCAL_FAMILY_ID, childId: "na" },
      "2026-03-02",
    );
    await openEditOf("Bé Na");

    const name = screen.getByLabelText("Bạn tên là gì?");
    fireEvent.change(name, { target: { value: "  Na Na " } });
    fireEvent.click(screen.getByRole("radio", { name: "Xe đua" }));
    // The avatar says its own sound, as on the create form.
    expect(playSequence).toHaveBeenLastCalledWith([
      soundUrl(AVATAR_CLIP_IDS.racecar),
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));

    await screen.findByRole("heading", { name: "Ai đang học đấy?" });
    expect(screen.getByRole("button", { name: "Na Na" })).toBeInTheDocument();
    expect(await appDb().profiles.get("na")).toMatchObject({
      id: "na",
      name: "Na Na",
      avatar: "racecar",
      grade: 6,
      series: { math: "kntt" },
    });
    expect((await readChildProgress(appDb(), "na")).activityDays).toEqual([
      "2026-03-02",
    ]);
    expect((await readActiveProfile(appDb()))?.id).toBe("bin");
    expect(replace).not.toHaveBeenCalled();
  });

  it("does not save an empty name and limits the name length like the create form", async () => {
    await seedProfile("na", "Bé Na", "fox");
    await openEditOf("Bé Na");

    expect(screen.getByLabelText("Bạn tên là gì?")).toHaveAttribute(
      "maxlength",
      String(PROFILE_NAME_MAX_LENGTH),
    );
    fireEvent.change(screen.getByLabelText("Bạn tên là gì?"), {
      target: { value: "   " },
    });
    expect(screen.getByRole("button", { name: "Lưu" })).toBeDisabled();
  });

  it("goes back to the list without saving", async () => {
    await seedProfile("na", "Bé Na", "fox");
    await openEditOf("Bé Na");
    fireEvent.change(screen.getByLabelText("Bạn tên là gì?"), {
      target: { value: "Khác" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Quay lại" }));

    await screen.findByRole("heading", { name: "Ai đang học đấy?" });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Bé Na" })).toBeInTheDocument(),
    );
    expect((await appDb().profiles.get("na"))?.name).toBe("Bé Na");
  });

  it("still creates a new child with the empty form", async () => {
    await seedProfile("na", "Bé Na", "fox");
    render(<ProfilesScreen subjects={[]} />);
    fireEvent.click(
      await screen.findByRole("button", { name: "Thêm bạn mới" }),
    );
    expect(
      await screen.findByRole("heading", { name: "Chào bạn mới!" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Bạn tên là gì?")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Bắt đầu học" })).toBeDisabled();
  });
});

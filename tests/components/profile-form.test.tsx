import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AVATARS } from "@/components/avatar";
import { ProfileForm } from "@/components/profile-form";
import { AVATAR_CLIP_IDS, soundUrl } from "@/lib/sound-manifest";

const playSequence = vi.hoisted(() => vi.fn(async () => undefined));
const gradesVisible = vi.hoisted(() => ({ list: [6] as number[] }));
vi.mock("@/lib/config", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/config")>()),
  get VISIBLE_GRADES() {
    return gradesVisible.list;
  },
}));

// Shows every grade, as when the owner publishes more than grade 6.
const ALL_GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

vi.mock("@/lib/sound", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/sound")>()),
  playSequence,
}));

afterEach(() => {
  playSequence.mockClear();
  gradesVisible.list = [6];
});

describe("ProfileForm", () => {
  it("titles the avatar choice 'Chọn hình đại diện'", () => {
    render(
      <ProfileForm onSubmit={vi.fn()} submitting={false} openGrades={[6]} />,
    );
    expect(
      screen.getByRole("group", { name: "Chọn hình đại diện" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/bạn thú/)).toBeNull();
  });

  it("plays each avatar's own sound when it is chosen, again on a repeat tap", () => {
    render(
      <ProfileForm onSubmit={vi.fn()} submitting={false} openGrades={[6]} />,
    );
    for (const { id, label } of AVATARS) {
      fireEvent.click(screen.getByRole("radio", { name: label }));
      expect(playSequence).toHaveBeenLastCalledWith([
        soundUrl(AVATAR_CLIP_IDS[id]),
      ]);
    }
    const before = playSequence.mock.calls.length;
    fireEvent.click(screen.getByRole("radio", { name: "Xe đua" }));
    expect(playSequence).toHaveBeenCalledTimes(before + 1);
  });

  it("marks the radios as making their own sound, so no button press doubles it", () => {
    render(
      <ProfileForm onSubmit={vi.fn()} submitting={false} openGrades={[6]} />,
    );
    const avatars = screen.getByRole("group", { name: "Chọn hình đại diện" });
    for (const radio of within(avatars).getAllByRole("radio")) {
      expect(radio).toHaveAttribute("data-own-sound");
    }
  });

  it("starts from the profile being edited and submits its changes with the given label", () => {
    const onSubmit = vi.fn();
    render(
      <ProfileForm
        initial={{ name: "Bé Na", avatar: "panda", grade: 6 }}
        submitLabel="Lưu"
        onSubmit={onSubmit}
        submitting={false}
        openGrades={[6]}
      />,
    );
    expect(screen.getByRole("radio", { name: "Gấu trúc" })).toBeChecked();
    fireEvent.change(screen.getByLabelText("Bạn tên là gì?"), {
      target: { value: " Na " },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Gà con" }));
    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Na",
      avatar: "chick",
      grade: 6,
    });
  });

  it("shows the default face selected for an avatar id this version does not know", () => {
    render(
      <ProfileForm
        initial={{ name: "Bé Na", avatar: "dragon", grade: 6 }}
        onSubmit={vi.fn()}
        submitting={false}
        openGrades={[6]}
      />,
    );
    expect(screen.getByRole("radio", { name: "Mèo" })).toBeChecked();
  });

  it("asks no grade while one grade is visible, and submits it", () => {
    const onSubmit = vi.fn();
    render(
      <ProfileForm
        onSubmit={onSubmit}
        submitting={false}
        openGrades={[6, 7]}
      />,
    );
    expect(
      screen.queryByRole("group", { name: "Bạn học lớp mấy?" }),
    ).toBeNull();
    fireEvent.change(screen.getByLabelText("Bạn tên là gì?"), {
      target: { value: "Na" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Bắt đầu học" }));
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Na",
      avatar: expect.any(String),
      grade: 6,
    });
  });

  it("submits the visible grade for a profile saved with a hidden one", () => {
    const onSubmit = vi.fn();
    render(
      <ProfileForm
        initial={{ name: "Na", avatar: "fox", grade: 9 }}
        onSubmit={onSubmit}
        submitting={false}
        openGrades={[6]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Bắt đầu học" }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ grade: 6 }),
    );
  });

  it("lets the child pick only open grades, and submits the one chosen", () => {
    gradesVisible.list = ALL_GRADES;
    const onSubmit = vi.fn();
    render(
      <ProfileForm
        onSubmit={onSubmit}
        submitting={false}
        openGrades={[6, 7]}
      />,
    );
    const grades = screen.getByRole("group", { name: "Bạn học lớp mấy?" });
    expect(within(grades).getAllByRole("radio")).toHaveLength(12);
    // Grade 6 is where a new child starts.
    expect(within(grades).getByRole("radio", { name: "Lớp 6" })).toBeChecked();
    for (const locked of [1, 5, 8, 12]) {
      expect(
        within(grades).getByRole("radio", {
          name: `Lớp ${locked}, sắp ra mắt`,
        }),
      ).toBeDisabled();
    }
    fireEvent.click(within(grades).getByRole("radio", { name: "Lớp 7" }));
    fireEvent.change(screen.getByLabelText("Bạn tên là gì?"), {
      target: { value: "Na" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Bắt đầu học" }));
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Na",
      avatar: expect.any(String),
      grade: 7,
    });
  });
});

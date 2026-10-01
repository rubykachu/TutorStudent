import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AVATARS } from "@/components/avatar";
import { ProfileForm } from "@/components/profile-form";
import { AVATAR_CLIP_IDS, soundUrl } from "@/lib/sound-manifest";

const playSequence = vi.hoisted(() => vi.fn(async () => undefined));
vi.mock("@/lib/sound", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/sound")>()),
  playSequence,
}));

afterEach(() => playSequence.mockClear());

describe("ProfileForm", () => {
  it("titles the avatar choice 'Chọn hình đại diện'", () => {
    render(<ProfileForm onSubmit={vi.fn()} submitting={false} />);
    expect(
      screen.getByRole("group", { name: "Chọn hình đại diện" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/bạn thú/)).toBeNull();
  });

  it("plays each avatar's own sound when it is chosen, again on a repeat tap", () => {
    render(<ProfileForm onSubmit={vi.fn()} submitting={false} />);
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
    render(<ProfileForm onSubmit={vi.fn()} submitting={false} />);
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("data-own-sound");
    }
  });

  it("starts from the profile being edited and submits its changes with the given label", () => {
    const onSubmit = vi.fn();
    render(
      <ProfileForm
        initial={{ name: "Bé Na", avatar: "panda" }}
        submitLabel="Lưu"
        onSubmit={onSubmit}
        submitting={false}
      />,
    );
    expect(screen.getByRole("radio", { name: "Gấu trúc" })).toBeChecked();
    fireEvent.change(screen.getByLabelText("Bạn tên là gì?"), {
      target: { value: " Na " },
    });
    fireEvent.click(screen.getByRole("radio", { name: "Gà con" }));
    fireEvent.click(screen.getByRole("button", { name: "Lưu" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Na", avatar: "chick" });
  });

  it("shows the default face selected for an avatar id this version does not know", () => {
    render(
      <ProfileForm
        initial={{ name: "Bé Na", avatar: "dragon" }}
        onSubmit={vi.fn()}
        submitting={false}
      />,
    );
    expect(screen.getByRole("radio", { name: "Mèo" })).toBeChecked();
  });
});

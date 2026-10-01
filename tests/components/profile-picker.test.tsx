import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfilePicker } from "@/components/profile-picker";
import type { ProfileRecord } from "@/progress/db";

function profile(id: string, name: string): ProfileRecord {
  return {
    id,
    familyId: "f",
    name,
    avatar: "cat",
    series: {},
    createdAt: "",
  };
}

const na = profile("na", "Bé Na");
const bin = profile("bin", "Bin");

describe("ProfilePicker", () => {
  it("picks a child by the card and edits the same child by its 'Sửa'", () => {
    const onPick = vi.fn();
    const onEdit = vi.fn();
    render(
      <ProfilePicker profiles={[na, bin]} onPick={onPick} onEdit={onEdit} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Bin" }));
    expect(onPick).toHaveBeenCalledWith(bin);
    expect(onEdit).not.toHaveBeenCalled();

    const [naCard] = screen.getAllByRole("listitem");
    fireEvent.click(within(naCard).getByRole("button", { name: "Sửa" }));
    expect(onEdit).toHaveBeenCalledWith(na);
    expect(onPick).toHaveBeenCalledTimes(1);
  });

  it("names each 'Sửa' by the child it belongs to for a screen reader", () => {
    render(
      <ProfilePicker profiles={[na, bin]} onPick={vi.fn()} onEdit={vi.fn()} />,
    );
    const edits = screen.getAllByRole("button", { name: "Sửa" });
    expect(edits).toHaveLength(2);
    expect(edits[0]).toHaveAccessibleDescription("Bé Na");
    expect(edits[1]).toHaveAccessibleDescription("Bin");
  });
});

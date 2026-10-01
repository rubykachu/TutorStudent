import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  AVATARS,
  Avatar,
  DEFAULT_AVATAR,
  isAvatarId,
} from "@/components/avatar";

describe("Avatar", () => {
  it("offers the spider hero and the race car beside the animals", () => {
    const ids = AVATARS.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(["spider", "racecar"]));
    expect(new Set(ids).size).toBe(ids.length);
    expect(AVATARS.find((a) => a.id === "spider")?.label).toBe("Người nhện");
    expect(AVATARS.find((a) => a.id === "racecar")?.label).toBe("Xe đua");
    expect(isAvatarId("spider")).toBe(true);
  });

  it("draws every avatar as its own picture in the shared 100x100 box", () => {
    const markup = new Set<string>();
    for (const { id } of AVATARS) {
      const { container, unmount } = render(<Avatar avatar={id} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 100 100");
      expect(svg).toHaveAttribute("data-avatar", id);
      expect(svg).toHaveAttribute("aria-hidden", "true");
      markup.add(svg?.innerHTML ?? "");
      unmount();
    }
    expect(markup.size).toBe(AVATARS.length);
  });

  it("falls back to the default face for an unknown id", () => {
    const { container } = render(<Avatar avatar="dragon" />);
    expect(container.querySelector("svg")).toHaveAttribute(
      "data-avatar",
      DEFAULT_AVATAR,
    );
  });
});

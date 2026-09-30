import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sticker, stickerFillRatio } from "@/components/sticker";

const VISUAL = "fixture.visual.star-sticker";

function colourLayer(): HTMLElement | null {
  return document.querySelector("[data-sticker-colour]");
}

describe("stickerFillRatio", () => {
  it("is the share of sections done, kept within 0 and 1", () => {
    expect(stickerFillRatio(1, 4)).toBe(0.25);
    expect(stickerFillRatio(0, 3)).toBe(0);
    expect(stickerFillRatio(5, 3)).toBe(1);
    expect(stickerFillRatio(1, 0)).toBe(0);
  });
});

describe("Sticker", () => {
  it("is a grey silhouette before any section is done", () => {
    render(<Sticker visualId={VISUAL} name="Sao" done={0} total={3} />);
    const sticker = screen.getByRole("img", { name: "Sticker Sao, chưa nhận" });
    expect(sticker).toHaveAttribute("data-sticker-earned", "false");
    expect(sticker).toHaveAttribute("data-sticker-fill", "0/3");
    expect(colourLayer()).toBeNull();
  });

  it("colours the lower part matching the sections done", () => {
    render(<Sticker visualId={VISUAL} name="Sao" done={1} total={4} />);
    const sticker = screen.getByRole("img", {
      name: "Sticker Sao, đã tô 1/4 phần",
    });
    expect(sticker).toHaveAttribute("data-sticker-earned", "false");
    expect(sticker).toHaveAttribute("data-sticker-fill", "1/4");
    // Three quarters cut from the top: the bottom quarter is in colour.
    expect(colourLayer()?.style.clipPath).toBe("inset(75% 0 0 0)");
  });

  it("is fully coloured once every section is done", () => {
    render(<Sticker visualId={VISUAL} name="Sao" done={3} total={3} />);
    const sticker = screen.getByRole("img", { name: "Sticker Sao" });
    expect(sticker).toHaveAttribute("data-sticker-earned", "true");
    expect(colourLayer()?.style.clipPath).toBe("");
    expect(sticker.querySelector(".grayscale")).toBeNull();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockView } from "@/components/blocks/block-view";
import { TipCard } from "@/components/blocks/tip-card";
import { BlockStage } from "@/learn/block-stage";
import { TIP_KINDS, type Tip } from "@/schema/content";

const TIP: Tip = {
  id: "fixture.tip.nhan-9",
  kind: "làm nhanh",
  title: "Nhân với 9",
  text: "Nhân với 10 rồi bớt đi một lần số đó.",
  tex: "9 \\cdot 7 = 70 - 7 = 63",
};

describe("TipCard", () => {
  it("shows the kind, the problem type, the trick and its formula", () => {
    const { container } = render(<TipCard tip={TIP} />);
    expect(container.querySelector("[data-block=tip]")).toHaveAttribute(
      "data-tip-kind",
      "làm nhanh",
    );
    expect(screen.getByText("Mẹo làm nhanh")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Nhân với 9" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nhân với 10 rồi bớt đi/)).toBeVisible();
    expect(container.querySelector("[data-tip-formula] .katex")).not.toBeNull();
    expect(container.querySelector("[data-tip-visual]")).toBeNull();
  });

  it("draws a picture only when the tip has one", () => {
    const { container } = render(
      <TipCard
        tip={{ ...TIP, tex: undefined, visualId: "fixture.visual.dot-grid" }}
      />,
    );
    expect(container.querySelector("[data-tip-formula]")).toBeNull();
    expect(container.querySelector("[data-tip-visual]")).not.toBeNull();
  });

  it("names every kind in words and with an icon", () => {
    for (const kind of TIP_KINDS) {
      const { container, unmount } = render(<TipCard tip={{ ...TIP, kind }} />);
      const badge = container.querySelector("[data-tip-badge]");
      expect(badge?.textContent).toMatch(/^Mẹo /);
      expect(badge?.querySelector("svg")).not.toBeNull();
      unmount();
    }
  });

  it("is what a tip block renders, without a second card around it", () => {
    const block = { ...TIP, type: "tip" as const };
    const { container } = render(<BlockStage block={block} />);
    expect(container.querySelector("[data-block=tip]")).not.toBeNull();
    expect(container.querySelector(".shadow-card")).toBeNull();
    const view = render(<BlockView block={block} />);
    expect(view.container.querySelector("[data-block=tip]")).not.toBeNull();
  });
});

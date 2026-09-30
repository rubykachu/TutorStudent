import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BlockView } from "@/components/blocks/block-view";
import { BlockStage } from "@/learn/block-stage";
import type { SectionBlock } from "@/schema/content";

const GROUP: SectionBlock = {
  type: "group",
  children: [
    { type: "note", text: "Nhân hai luỹ thừa cùng cơ số: cộng các số mũ." },
    { type: "formula", tex: "5^{2} \\cdot 5^{4} = 5^{6}" },
    { type: "visual", visualId: "fixture.visual.dot-grid", caption: "Ví dụ" },
  ],
};

describe("BlockView", () => {
  it("draws a group's parts together, in order, with the sentence first", () => {
    const { container } = render(<BlockView block={GROUP} />);
    const group = container.querySelector('[data-block="group"]');
    expect(group).not.toBeNull();
    expect(
      [...(group?.children ?? [])].map((el) => el.getAttribute("data-block")),
    ).toEqual(["note", "formula", "visual"]);
    expect(group?.querySelector(".katex")).not.toBeNull();
    expect(group).toHaveClass("gap-6");
  });

  it("keeps a group's sentence body-sized where a lone note grows", () => {
    const { container } = render(<BlockStage block={GROUP} />);
    const card = container.querySelector("[data-block-stage] > div");
    // Only a note directly on the card grows on a tall screen.
    expect(card?.className).toContain(
      "tall:[&>[data-block=note]]:text-block-lg",
    );
    expect(card?.className).not.toContain("[&_[data-block=note]]");
  });

  it("reads a recap visual's caption as the sentence above the example", () => {
    const recap: SectionBlock = {
      type: "visual",
      visualId: "fixture.visual.dot-grid",
      caption: "Số mũ bằng 1 thì luỹ thừa bằng chính cơ số.",
    };
    const lead = render(<BlockStage block={recap} recap />).container;
    const caption = lead.querySelector("figcaption");
    expect(caption).toHaveAttribute("data-lead-caption");
    expect(caption?.parentElement?.firstElementChild).toBe(caption);
    expect(caption).not.toHaveClass("text-caption");

    const plain = render(<BlockView block={recap} />).container;
    const grey = plain.querySelector("figcaption");
    expect(grey).not.toHaveAttribute("data-lead-caption");
    expect(grey).toHaveClass("text-caption", "text-muted-foreground");
  });

  it("marks a guide screen's demo picture as a sample that takes no touch", () => {
    const guide: SectionBlock = {
      type: "group",
      guide: "tapRegion",
      children: [
        { type: "note", text: "Chạm vào hình." },
        { type: "visual", visualId: "fixture.visual.shapes" },
      ],
    };
    const { container } = render(<BlockView block={guide} />);
    const demo = container.querySelector("[data-guide-demo]");
    expect(demo).not.toBeNull();
    expect(demo).toHaveTextContent("Hình mẫu, chưa cần chạm");
    expect(demo?.querySelector("[inert]")).not.toBeNull();
    // A group that is not a guide keeps its picture as it is.
    const plain = render(<BlockView block={{ ...guide, guide: undefined }} />);
    expect(plain.container.querySelector("[data-guide-demo]")).toBeNull();
  });
});

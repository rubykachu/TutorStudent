import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PassageReader } from "@/components/passage-reader";
import type { HighlightSpec } from "@/exercises/feedback";
import type { PassageBlock } from "@/schema/content";

const PASSAGE: PassageBlock = {
  type: "passage",
  paragraphs: [
    {
      sentences: [
        { id: "s1", text: "Minh có một người bạn tên là Lan." },
        { id: "s2", text: "Hai bạn thường cùng nhau đi học." },
      ],
    },
    {
      sentences: [
        { id: "s3", text: "Một hôm, Lan bị ốm và phải nghỉ học." },
        { id: "s4", text: "Minh chép bài giúp Lan và mang sang nhà bạn." },
      ],
    },
  ],
  annotations: [
    { sentenceId: "s4", label: "Theo dõi", text: "Chú ý việc làm của Minh." },
    { sentenceId: "s4", label: "Theo dõi", text: "Minh là người bạn tốt." },
  ],
  source: "Đoạn văn mẫu do nhóm soạn bài viết",
};

function sentence(container: HTMLElement, id: string): HTMLElement {
  const element = container.querySelector<HTMLElement>(
    `[data-sentence-id="${id}"]`,
  );
  if (!element) throw new Error(`sentence ${id} missing`);
  return element;
}

describe("PassageReader in reading mode", () => {
  it("renders every sentence with its id and cites the source", () => {
    const { container } = render(<PassageReader passage={PASSAGE} />);
    expect(container.querySelectorAll("[data-paragraph]")).toHaveLength(2);
    expect(sentence(container, "s3")).toHaveTextContent(
      "Một hôm, Lan bị ốm và phải nghỉ học.",
    );
    expect(container.querySelector("p")?.textContent).toBe(
      "Minh có một người bạn tên là Lan. Hai bạn thường cùng nhau đi học.",
    );
    expect(
      screen.getByText(PASSAGE.source ?? "").closest("figcaption"),
    ).not.toBeNull();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(container.querySelector("[data-passage] p")).not.toHaveClass(
      "leading-tap",
    );
  });

  it("puts margin notes in the margin column on tablets and under their paragraph on phones", () => {
    const { container } = render(<PassageReader passage={PASSAGE} />);
    const [first, second] = container.querySelectorAll("[data-paragraph]");
    expect(first?.querySelector("[data-annotations]")).toBeNull();

    const aside = second?.querySelector("[data-annotations]");
    // One grid row per paragraph: stacked below the text by default, moved
    // into the second (margin) column from the md breakpoint up.
    expect(second).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-[minmax(0,1fr)_12rem]",
    );
    expect(aside).toHaveClass("md:col-start-2", "md:row-start-1");
    expect(aside?.previousElementSibling?.tagName).toBe("P");

    const cards = aside?.querySelectorAll("[data-annotation-for='s4']") ?? [];
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Theo dõi");
    expect(cards[0]).toHaveTextContent("Chú ý việc làm của Minh.");
    const describedBy = sentence(container, "s4").getAttribute(
      "aria-describedby",
    );
    expect(describedBy?.split(" ")).toEqual([cards[0]?.id, cards[1]?.id]);
    expect(sentence(container, "s1")).not.toHaveAttribute("aria-describedby");
  });

  it("omits the citation when the passage has no source", () => {
    const { container } = render(
      <PassageReader passage={{ ...PASSAGE, source: undefined }} />,
    );
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("lights up hinted sentences with the hint colour and strength", () => {
    const highlight = new Map<string, HighlightSpec>([
      ["s1", { color: "highlight", strong: false }],
      ["s2", { color: "pink", strong: true }],
    ]);
    const { container } = render(
      <PassageReader passage={PASSAGE} highlight={highlight} />,
    );
    const plain = sentence(container, "s1");
    expect(plain).toHaveAttribute("data-highlighted", "true");
    expect(plain).toHaveClass("bg-highlight");
    expect(plain).not.toHaveAttribute("data-highlight-strong");

    const concept = sentence(container, "s2");
    expect(concept).toHaveClass("decoration-concept-pink", "outline-3");
    expect(concept).toHaveAttribute("data-highlight-strong", "true");

    expect(sentence(container, "s3")).not.toHaveAttribute("data-highlighted");
    expect(sentence(container, "s3")).not.toHaveClass("bg-highlight");
  });
});

describe("PassageReader in tap mode", () => {
  it("turns each whole sentence into a toggle with tall lines", () => {
    const onToggle = vi.fn();
    const { container } = render(
      <PassageReader
        passage={PASSAGE}
        selectable
        selected={["s2"]}
        onToggle={onToggle}
      />,
    );
    expect(container.querySelector("[data-passage]")).toHaveAttribute(
      "data-selectable",
    );
    for (const p of container.querySelectorAll("[data-paragraph] > p")) {
      expect(p).toHaveClass("leading-tap");
    }

    const toggles = screen.getAllByRole("button");
    expect(toggles).toHaveLength(4);
    const picked = screen.getByRole("button", {
      name: "Hai bạn thường cùng nhau đi học.",
    });
    expect(picked).toHaveAttribute("aria-pressed", "true");
    expect(picked).toHaveClass("bg-highlight");
    const other = screen.getByRole("button", {
      name: "Minh có một người bạn tên là Lan.",
    });
    expect(other).toHaveAttribute("aria-pressed", "false");
    expect(other).not.toHaveClass("bg-highlight");

    fireEvent.click(other);
    fireEvent.keyDown(picked, { key: "Enter" });
    fireEvent.keyDown(picked, { key: " " });
    fireEvent.keyDown(picked, { key: "a" });
    expect(onToggle.mock.calls).toEqual([["s1"], ["s2"], ["s2"]]);
  });

  it("ignores taps while disabled", () => {
    const onToggle = vi.fn();
    render(
      <PassageReader
        passage={PASSAGE}
        selectable
        selected={[]}
        onToggle={onToggle}
        disabled
      />,
    );
    const toggle = screen.getByRole("button", {
      name: "Một hôm, Lan bị ốm và phải nghỉ học.",
    });
    expect(toggle).toHaveAttribute("aria-disabled", "true");
    expect(toggle).toHaveAttribute("tabindex", "-1");
    fireEvent.click(toggle);
    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(onToggle).not.toHaveBeenCalled();
  });
});

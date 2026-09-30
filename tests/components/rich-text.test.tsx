import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichText, splitSuperscripts } from "@/components/rich-text";

describe("splitSuperscripts", () => {
  it("turns Unicode exponents into raised plain runs", () => {
    expect(splitSuperscripts("aⁿ = a · a, 10³ và 2¹⁰")).toEqual([
      { text: "a", raised: false },
      { text: "n", raised: true },
      { text: " = a · a, 10", raised: false },
      { text: "3", raised: true },
      { text: " và 2", raised: false },
      { text: "10", raised: true },
    ]);
  });

  it("leaves text without exponents whole", () => {
    expect(splitSuperscripts("Luỹ thừa")).toEqual([
      { text: "Luỹ thừa", raised: false },
    ]);
  });
});

describe("RichText", () => {
  it("sets exponents as readable superscripts", () => {
    const { container } = render(
      <p>
        <RichText text="Đọc 5³ là năm mũ ba." />
      </p>,
    );
    const sup = container.querySelector("sup[data-exponent]");
    expect(sup).toHaveTextContent("3");
    expect(sup).toHaveClass("text-[max(0.75em,1rem)]", "font-semibold");
    expect(container).toHaveTextContent("Đọc 53 là năm mũ ba.");
  });

  it("renders plain text unchanged", () => {
    const { container } = render(
      <p>
        <RichText text="Không có số mũ" />
      </p>,
    );
    expect(container.querySelector("sup")).toBeNull();
    expect(container).toHaveTextContent("Không có số mũ");
  });
});

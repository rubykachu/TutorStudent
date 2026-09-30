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

  it("sets membership signs in the maths font, enlarged", () => {
    const { container } = render(
      <p>
        <RichText text="Kí hiệu 2 ∈ A và 5 ∉ A." />
      </p>,
    );
    const signs = container.querySelectorAll("[data-set-sign]");
    expect([...signs].map((sign) => sign.textContent)).toEqual(["∈", "∉"]);
    expect(signs[0]).toHaveClass("font-[KaTeX_Main]", "text-[1.3em]");
    expect(container).toHaveTextContent("Kí hiệu 2 ∈ A và 5 ∉ A.");
  });

  it("enlarges a chip that is one sign, so , and ; differ clearly", () => {
    const { container } = render(
      <p>
        <RichText text=";" />
        <RichText text="{" />
        <RichText text="5" />
      </p>,
    );
    const signs = container.querySelectorAll("[data-set-sign]");
    expect([...signs].map((sign) => sign.textContent)).toEqual([";", "{"]);
    expect(signs[0]).toHaveClass("text-[1.5em]");
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

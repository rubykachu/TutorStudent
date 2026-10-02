import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SectionStepper } from "@/components/section-stepper";

const LABELS = ["Lý thuyết 1", "Câu 1", "Câu 2", "Nhớ nhé"];

describe("SectionStepper", () => {
  it("makes the dots up to the furthest screen reached buttons with their names", () => {
    const onSelect = vi.fn();
    render(
      <SectionStepper
        total={4}
        current={1}
        labels={LABELS}
        reached={2}
        onSelect={onSelect}
      />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: "Nhớ nhé" })).toBeNull();
    expect(screen.getByRole("button", { name: "Câu 1" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    fireEvent.click(screen.getByRole("button", { name: "Lý thuyết 1" }));
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("stays a plain row of marks without a way to select", () => {
    render(<SectionStepper total={3} current={0} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("draws a long section's dots dense so the whole row fits", () => {
    const { container, rerender } = render(
      <SectionStepper total={24} current={0} />,
    );
    const stepper = container.querySelector("[data-section-stepper]");
    expect(stepper).toHaveAttribute("data-dense");
    rerender(<SectionStepper total={8} current={0} />);
    expect(stepper).not.toHaveAttribute("data-dense");
  });
});

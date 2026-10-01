import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MASCOT_EXPRESSIONS } from "@/mascot/expressions";
import { Owl } from "@/mascot/owl";

const defaultMatchMedia = window.matchMedia;

function preferReducedMotion() {
  window.matchMedia = (query: string) => ({
    ...defaultMatchMedia(query),
    matches: query.includes("prefers-reduced-motion"),
  });
}

afterEach(() => {
  window.matchMedia = defaultMatchMedia;
});

function owl(container: HTMLElement): SVGSVGElement {
  const svg = container.querySelector("svg[data-mascot]");
  if (!(svg instanceof SVGSVGElement)) throw new Error("owl missing");
  return svg;
}

describe("Owl", () => {
  it.each(MASCOT_EXPRESSIONS)("draws the %s expression", (expression) => {
    const { container } = render(<Owl expression={expression} size="home" />);
    const svg = owl(container);
    expect(svg).toHaveAttribute("data-mascot", expression);
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("size-20");
    const eyes = svg.querySelector("[data-mascot-eyes]");
    expect(eyes).toHaveAttribute(
      "data-mascot-eyes",
      expression === "happy" || expression === "welcome" ? "smile" : "open",
    );
    expect(svg.querySelector("[data-mascot-sparkles]") !== null).toBe(
      expression === "welcome",
    );
  });

  it("is 56px beside an exercise", () => {
    const { container } = render(<Owl expression="idle" size="exercise" />);
    expect(owl(container)).toHaveClass("size-14");
  });

  it("animates unless reduced motion is requested", () => {
    const { container } = render(<Owl expression="cheer" size="home" />);
    expect(owl(container)).not.toHaveAttribute("data-mascot-still");
  });

  it("holds each pose still under reduced motion, without blinking", async () => {
    preferReducedMotion();
    const { container, rerender } = render(
      <Owl expression="cheer" size="home" />,
    );
    const svg = owl(container);
    expect(svg).toHaveAttribute("data-mascot-still", "true");
    // Both wings are raised straight away: the end pose, no keyframes.
    await waitFor(() => {
      const wings = svg.querySelectorAll("path[style]");
      const transforms = [...wings].map(
        (w) => (w as SVGPathElement).style.transform,
      );
      expect(transforms).toEqual(
        expect.arrayContaining(["rotate(115deg)", "rotate(-115deg)"]),
      );
    });
    const eyes = svg.querySelector<SVGGElement>('[data-mascot-eyes="open"]');
    expect(eyes?.style.transform ?? "").not.toMatch(/scaleY\(0\.1\)/);

    rerender(<Owl expression="hint" size="home" />);
    await waitFor(() =>
      expect(owl(container)).toHaveAttribute("data-mascot", "hint"),
    );
  });

  it("loops gently only when asked to, and not under reduced motion", () => {
    const still = render(<Owl expression="idle" size="home" />);
    expect(still.container.querySelector("[data-mascot-loop]")).toBeNull();
    still.unmount();
    const looping = render(<Owl expression="idle" size="home" loop />);
    expect(
      looping.container.querySelector("[data-mascot-loop]"),
    ).not.toBeNull();
    looping.unmount();
    preferReducedMotion();
    const reduced = render(<Owl expression="idle" size="home" loop />);
    expect(reduced.container.querySelector("[data-mascot-loop]")).toBeNull();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReviewButton } from "@/components/review-button";

describe("ReviewButton", () => {
  it("links to the review and shows how many cards are fading", () => {
    render(<ReviewButton href="/lessons/x/review" forgetting={6} />);
    const link = screen.getByRole("link", { name: /Ôn bài này/ });
    expect(link).toHaveAttribute("href", "/lessons/x/review");
    expect(link).toHaveTextContent("6 thẻ sắp quên");
  });

  it("leaves the hint out when nothing is fading", () => {
    render(<ReviewButton href="/lessons/x/review" forgetting={0} />);
    expect(screen.getByRole("link")).not.toHaveTextContent("sắp quên");
  });
});

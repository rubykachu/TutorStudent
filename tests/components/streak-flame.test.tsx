import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StreakFlame } from "@/components/streak-flame";

describe("StreakFlame", () => {
  it("invites the child to start a chain instead of showing 0 days", () => {
    render(
      <StreakFlame
        streak={{ days: 0, studiedToday: false, restDaysLeft: 1 }}
      />,
    );
    expect(
      screen.getByText("Bắt đầu chuỗi ngày học hôm nay nhé"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/0 ngày/)).toBeNull();
  });

  it("counts the days of a running chain with the rest days left", () => {
    render(
      <StreakFlame streak={{ days: 3, studiedToday: true, restDaysLeft: 1 }} />,
    );
    expect(screen.getByText("3 ngày")).toBeInTheDocument();
    expect(screen.getByText("Còn 1 ngày nghỉ")).toBeInTheDocument();
  });

  it("says when the week's rest day is used", () => {
    render(
      <StreakFlame
        streak={{ days: 2, studiedToday: false, restDaysLeft: 0 }}
      />,
    );
    expect(screen.getByText("Hết ngày nghỉ")).toBeInTheDocument();
  });
});

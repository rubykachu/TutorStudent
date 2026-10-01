import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TryIt } from "@/visuals/math/thu-tu-thuc-hien-phep-tinh/try-it";
import { CutTry } from "@/visuals/math/uoc-chung-uoc-chung-lon-nhat/cut-bars";
import {
  GuidedStepProvider,
  useGuidedHold,
  useGuidedTask,
} from "@/visuals/shared/guided-step";

function Held() {
  return <output>{useGuidedHold() ? "waiting" : "free"}</output>;
}

function Task({ finished }: { finished: boolean }) {
  useGuidedTask(finished);
  return null;
}

describe("guided step", () => {
  it("waits from the first render until every task is finished, and stays free after", () => {
    const { rerender } = render(
      <GuidedStepProvider>
        <Task finished={false} />
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("waiting")).toBeInTheDocument();
    rerender(
      <GuidedStepProvider>
        <Task finished />
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("free")).toBeInTheDocument();
    // Playing it over does not lock the screen again.
    rerender(
      <GuidedStepProvider>
        <Task finished={false} />
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("free")).toBeInTheDocument();
  });

  it("does not wait on a screen without a task or when switched off", () => {
    const { rerender } = render(
      <GuidedStepProvider>
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("free")).toBeInTheDocument();
    rerender(
      <GuidedStepProvider enabled={false}>
        <Task finished={false} />
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("free")).toBeInTheDocument();
  });
});

describe("try-it screen as a guided task", () => {
  it("waits for the result and lets Xem cách làm work the whole expression out", () => {
    render(
      <GuidedStepProvider>
        <TryIt source="8+6·2" />
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("waiting")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Phép cộng" }));
    expect(screen.getByText("waiting")).toBeInTheDocument();
    expect(screen.getByText("Chưa phải. Thử phép khác.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Xem cách làm" }));
    expect(screen.getByText("Xong rồi.")).toBeInTheDocument();
    expect(screen.getByText("free")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Xem cách làm" })).toBeNull();
  });

  it("is free when the child works it out alone, and stays free after starting over", () => {
    render(
      <GuidedStepProvider>
        <TryIt source="8+6·2" />
        <Held />
      </GuidedStepProvider>,
    );
    for (const sign of ["Phép nhân", "Phép cộng"]) {
      fireEvent.click(screen.getByRole("button", { name: sign }));
      fireEvent.click(
        screen.getByRole("button", { name: /Tiếp theo|Xem kết quả/ }),
      );
    }
    expect(screen.getByText("free")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));
    expect(screen.getByText("free")).toBeInTheDocument();
  });
});

describe("cut screen as a guided task", () => {
  it("waits for the longest piece that fits, or Xem cách làm", () => {
    render(
      <GuidedStepProvider>
        <CutTry totals={[12, 18]} goal="largest" />
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("waiting")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Xem cách làm" }));
    expect(screen.getByText("free")).toBeInTheDocument();
    expect(
      screen.getByText(/Đoạn dài nhất cắt vừa hết cả hai dải là 6 dm/),
    ).toBeInTheDocument();
  });

  it("is a plain playground without a goal", () => {
    render(
      <GuidedStepProvider>
        <CutTry totals={[12, 18]} />
        <Held />
      </GuidedStepProvider>,
    );
    expect(screen.getByText("free")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Xem cách làm" })).toBeNull();
  });
});

import "fake-indexeddb/auto";
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HistoryLoading } from "@/components/parent/history-loading";
import { appDb, resetAppDbForTesting } from "@/progress/hooks";
import { childStateScope, PENDING_MONTH, updateSyncState } from "@/sync/state";

const CHILD = "kid-1";
const APPLIED = { hash: "h", parts: {}, etag: "e", applied: true };

afterEach(async () => {
  await appDb().delete();
  resetAppDbForTesting();
});

const setMonths = (months: Record<string, typeof APPLIED>) =>
  updateSyncState(appDb(), childStateScope(CHILD), (state) => ({
    ...state,
    months,
  }));

describe("HistoryLoading", () => {
  it("shows nothing for a device with no listed months", async () => {
    const { container } = render(<HistoryLoading childId={CHILD} />);
    await act(async () => undefined);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the line with the earliest month held while months are missing, and drops it when all are applied", async () => {
    await setMonths({
      "2026-10": APPLIED,
      "2026-09": APPLIED,
      "2026-07": PENDING_MONTH as typeof APPLIED,
    });
    render(<HistoryLoading childId={CHILD} />);
    expect(
      await screen.findByText("Đang tải lịch sử học… (đã có từ tháng 9/2026)"),
    ).toBeInTheDocument();

    await act(async () => {
      await setMonths({
        "2026-10": APPLIED,
        "2026-09": APPLIED,
        "2026-07": APPLIED,
      });
    });
    await act(async () => undefined);
    expect(screen.queryByText(/Đang tải lịch sử học/)).toBeNull();
  });

  it("shows the line alone before any month has arrived", async () => {
    await setMonths({ "2026-07": PENDING_MONTH as typeof APPLIED });
    render(<HistoryLoading childId={CHILD} />);
    expect(
      await screen.findByText("Đang tải lịch sử học…"),
    ).toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SYNC_DEBOUNCE_MS, SYNC_INTERVAL_MINUTES } from "@/lib/config";

const run = vi.fn(async (_options?: { full?: boolean }) => ({
  status: "synced",
}));

vi.mock("@/sync/engine", () => ({ createSyncEngine: () => ({ run }) }));
vi.mock("@/sync/clock", () => ({ restoreClockOffset: async () => undefined }));
vi.mock("@/progress/hooks", () => ({ appDb: () => ({}) }));

import { SyncRunner } from "@/sync/runner";

const MINUTE = 60_000;

function setVisibility(state: "hidden" | "visible") {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

beforeEach(() => {
  vi.useFakeTimers();
  run.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  setVisibility("visible");
});

async function mount() {
  const view = render(<SyncRunner />);
  await vi.advanceTimersByTimeAsync(0);
  return view;
}

describe("SyncRunner", () => {
  it("draws nothing", async () => {
    const { container } = await mount();
    expect(container).toBeEmptyDOMElement();
  });

  it("runs one full sync when the app starts", async () => {
    await mount();
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({ full: true });
  });

  it("syncs on the interval", async () => {
    await mount();
    run.mockClear();
    await vi.advanceTimersByTimeAsync(SYNC_INTERVAL_MINUTES * MINUTE);
    expect(run).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({});
  });

  it("syncs when the network comes back, once for repeated events", async () => {
    await mount();
    run.mockClear();
    for (let i = 0; i < 3; i++) window.dispatchEvent(new Event("online"));
    await vi.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("syncs when the page is hidden and not when it is shown", async () => {
    await mount();
    run.mockClear();
    setVisibility("visible");
    await vi.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);
    expect(run).not.toHaveBeenCalled();
    setVisibility("hidden");
    await vi.advanceTimersByTimeAsync(SYNC_DEBOUNCE_MS);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("stops listening when it unmounts", async () => {
    const { unmount } = await mount();
    run.mockClear();
    unmount();
    window.dispatchEvent(new Event("online"));
    await vi.advanceTimersByTimeAsync(SYNC_INTERVAL_MINUTES * MINUTE * 2);
    expect(run).not.toHaveBeenCalled();
  });
});

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  OFFLINE_STATUS_POLL_MS,
  OfflineStatus,
} from "@/components/parent/offline-status";
import { PRECACHE_STATUS_MESSAGE } from "@/offline/config";

type Answer = { state: string; cached: number; total: number };

// A worker that answers PRECACHE_STATUS with whatever `answer` holds now.
function fakeWorker(answer: () => Answer) {
  return {
    postMessage: vi.fn((message: { type: string }, transfer: MessagePort[]) => {
      if (message.type === PRECACHE_STATUS_MESSAGE) {
        transfer[0]?.postMessage(answer());
      }
    }),
  };
}

type Registration = {
  installing: ReturnType<typeof fakeWorker> | null;
  waiting: null;
  active: ReturnType<typeof fakeWorker> | null;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

let registration: Registration | undefined;
let container: {
  getRegistration: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  registration = undefined;
  container = {
    getRegistration: vi.fn(async () => registration),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  Object.defineProperty(navigator, "serviceWorker", {
    configurable: true,
    value: container,
  });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  delete (navigator as unknown as Record<string, unknown>).serviceWorker;
});

function reg(partial: Partial<Registration>): Registration {
  return {
    installing: null,
    waiting: null,
    active: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    ...partial,
  };
}

// Lets the awaits and message-port deliveries of one refresh finish.
async function settle() {
  await act(async () => {
    for (let i = 0; i < 10; i++) {
      await vi.advanceTimersByTimeAsync(0);
      await new Promise((r) => setImmediate(r));
    }
  });
}

describe("OfflineStatus", () => {
  it("says not ready when no worker is installed (development, or not yet)", async () => {
    render(<OfflineStatus />);
    await settle();
    expect(screen.getByText(/^Dùng khi không có mạng:/).textContent).toBe(
      "Dùng khi không có mạng: chưa sẵn sàng",
    );
  });

  it("says ready when the active worker holds every file", async () => {
    registration = reg({
      active: fakeWorker(() => ({ state: "ready", cached: 340, total: 340 })),
    });
    render(<OfflineStatus />);
    await settle();
    expect(screen.getByText(/^Dùng khi không có mạng:/).textContent).toBe(
      "Dùng khi không có mạng: sẵn sàng",
    );
  });

  it("shows the download count from the installing worker and goes to ready by itself", async () => {
    let answer: Answer = { state: "installing", cached: 120, total: 340 };
    const installing = fakeWorker(() => answer);
    registration = reg({ installing });
    render(<OfflineStatus />);
    await settle();
    expect(screen.getByText(/^Dùng khi không có mạng:/).textContent).toBe(
      "Dùng khi không có mạng: đang tải (120/340)",
    );
    // The install finishes: no worker installing, the active one is ready.
    answer = { state: "ready", cached: 340, total: 340 };
    registration = reg({ active: fakeWorker(() => answer) });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(OFFLINE_STATUS_POLL_MS);
    });
    await settle();
    expect(screen.getByText(/^Dùng khi không có mạng:/).textContent).toBe(
      "Dùng khi không có mạng: sẵn sàng",
    );
  });

  it("refreshes when the controller changes and stops listening on unmount", async () => {
    registration = reg({});
    const { unmount } = render(<OfflineStatus />);
    await settle();
    const handler = container.addEventListener.mock.calls.find(
      (c) => c[0] === "controllerchange",
    )?.[1] as () => void;
    registration = reg({
      active: fakeWorker(() => ({ state: "ready", cached: 1, total: 1 })),
    });
    handler();
    await settle();
    expect(screen.getByText(/^Dùng khi không có mạng:/).textContent).toContain(
      "sẵn sàng",
    );
    unmount();
    expect(container.removeEventListener).toHaveBeenCalledWith(
      "controllerchange",
      handler,
    );
  });
});

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OfflineManager } from "@/offline/register";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

class FakeWorker {
  state = "installing";
  messages: unknown[] = [];
  private listeners: (() => void)[] = [];
  postMessage(m: unknown) {
    this.messages.push(m);
  }
  addEventListener(_t: string, l: () => void) {
    this.listeners.push(l);
  }
  become(state: string) {
    this.state = state;
    for (const l of this.listeners) l();
  }
}

class FakeRegistration {
  waiting: FakeWorker | null = null;
  installing: FakeWorker | null = null;
  update = vi.fn(async () => undefined);
  unregister = vi.fn(async () => true);
  private listeners: (() => void)[] = [];
  addEventListener(_t: string, l: () => void) {
    this.listeners.push(l);
  }
  found(worker: FakeWorker) {
    this.installing = worker;
    for (const l of this.listeners) l();
  }
}

let registration: FakeRegistration;
let container: {
  controller: unknown;
  register: ReturnType<typeof vi.fn>;
  getRegistrations: ReturnType<typeof vi.fn>;
  ready: Promise<unknown>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  pathname = "/";
  registration = new FakeRegistration();
  container = {
    controller: {},
    register: vi.fn(async () => registration),
    getRegistrations: vi.fn(async () => [registration]),
    ready: Promise.resolve({}),
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
  vi.unstubAllEnvs();
  delete (navigator as unknown as Record<string, unknown>).serviceWorker;
});

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("OfflineManager", () => {
  it("unregisters instead of registering outside production", async () => {
    render(<OfflineManager />);
    await flush();
    expect(container.register).not.toHaveBeenCalled();
    expect(registration.unregister).toHaveBeenCalledOnce();
    expect(screen.queryByText("Có bài mới, tải lại")).toBeNull();
  });

  it("registers in production, shows the banner for a new build and activates it on a tap", async () => {
    vi.stubEnv("NODE_ENV", "production");
    render(<OfflineManager />);
    await flush();
    expect(container.register).toHaveBeenCalledOnce();
    const worker = new FakeWorker();
    await act(async () => {
      registration.found(worker);
      worker.become("installed");
    });
    const banner = screen.getByRole("button", { name: "Có bài mới, tải lại" });
    fireEvent.click(banner);
    expect(worker.messages).toEqual([{ type: "SKIP_WAITING" }]);
  });

  it("keeps the banner hidden inside a player and shows it after the child leaves", async () => {
    vi.stubEnv("NODE_ENV", "production");
    pathname = "/lessons/a/sections/s1";
    const { rerender } = render(<OfflineManager />);
    await flush();
    const worker = new FakeWorker();
    await act(async () => {
      registration.found(worker);
      worker.become("installed");
    });
    expect(screen.queryByText("Có bài mới, tải lại")).toBeNull();
    pathname = "/lessons/a";
    rerender(<OfflineManager />);
    await flush();
    expect(screen.getByText("Có bài mới, tải lại")).toBeTruthy();
  });
});

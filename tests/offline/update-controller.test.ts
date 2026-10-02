import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CACHE_PREFIX, SKIP_WAITING_MESSAGE } from "@/offline/config";
import {
  createUpdateController,
  isPlayerPath,
  type UpdateDeps,
} from "@/offline/update-controller";

class FakeWorker {
  state = "installed";
  messages: unknown[] = [];
  private listeners: (() => void)[] = [];
  postMessage(message: unknown) {
    this.messages.push(message);
  }
  addEventListener(_type: "statechange", listener: () => void) {
    this.listeners.push(listener);
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
  addEventListener(_type: "updatefound", listener: () => void) {
    this.listeners.push(listener);
  }
  found(worker: FakeWorker) {
    this.installing = worker;
    for (const l of this.listeners) l();
  }
}

type Setup = {
  controller: ReturnType<typeof createUpdateController>;
  registration: FakeRegistration;
  reload: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  persist: ReturnType<typeof vi.fn>;
  clock: { now: number };
  visibility: { state: string; fire: () => void };
  changeController: () => void;
  caches: Map<string, boolean>;
};

function setup(
  options: {
    enabled?: boolean;
    pathname?: string;
    hasController?: boolean;
    waiting?: FakeWorker;
    others?: FakeRegistration[];
  } = {},
): Setup {
  const registration = new FakeRegistration();
  registration.waiting = options.waiting ?? null;
  const controllerListeners: (() => void)[] = [];
  const container = {
    controller: options.hasController === false ? null : {},
    register: vi.fn(async () => registration),
    getRegistrations: vi.fn(async () => options.others ?? []),
    ready: Promise.resolve({}),
    addEventListener: (_t: "controllerchange", l: () => void) => {
      controllerListeners.push(l);
    },
    removeEventListener: (_t: "controllerchange", l: () => void) => {
      controllerListeners.splice(controllerListeners.indexOf(l), 1);
    },
  };
  const visibilityListeners: (() => void)[] = [];
  const visibility = {
    state: "visible",
    fire: () => {
      for (const l of visibilityListeners) l();
    },
  };
  const clock = { now: 1_000_000 };
  const reload = vi.fn();
  const persist = vi.fn(async () => true);
  const cacheMap = new Map<string, boolean>([
    [`${CACHE_PREFIX}B0`, true],
    ["other", true],
  ]);
  const deps: UpdateDeps = {
    serviceWorker: container as unknown as UpdateDeps["serviceWorker"],
    caches: {
      keys: async () => [...cacheMap.keys()],
      delete: async (name: string) => cacheMap.delete(name),
    },
    storage: { persist },
    visibility: {
      state: () => visibility.state,
      subscribe: (l) => {
        visibilityListeners.push(l);
        return () => {
          visibilityListeners.splice(visibilityListeners.indexOf(l), 1);
        };
      },
    },
    now: () => clock.now,
    reload,
    setInterval: (cb, ms) => setInterval(cb, ms),
    clearInterval: (h) => clearInterval(h as ReturnType<typeof setInterval>),
    enabled: options.enabled ?? true,
    pathname: options.pathname ?? "/",
  };
  return {
    controller: createUpdateController(deps),
    registration,
    reload,
    register: container.register,
    persist,
    clock,
    visibility,
    changeController: () => {
      for (const l of [...controllerListeners]) l();
    },
    caches: cacheMap,
  };
}

// Lets the registration promise chain settle.
const settle = () => vi.advanceTimersByTimeAsync(0);

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("isPlayerPath", () => {
  it("is true for a section and the review of a lesson only", () => {
    expect(isPlayerPath("/lessons/a/sections/s1")).toBe(true);
    expect(isPlayerPath("/lessons/a/sections/s1/")).toBe(true);
    expect(isPlayerPath("/lessons/a/review")).toBe(true);
    expect(isPlayerPath("/lessons/a")).toBe(false);
    expect(isPlayerPath("/lessons/a/tips")).toBe(false);
    expect(isPlayerPath("/lessons/a/sections")).toBe(false);
    expect(isPlayerPath("/")).toBe(false);
    expect(isPlayerPath("/parent")).toBe(false);
  });
});

describe("when the worker is off (development or the kill switch)", () => {
  it("registers nothing, unregisters every registration and deletes the offline caches only", async () => {
    const others = [new FakeRegistration(), new FakeRegistration()];
    const s = setup({ enabled: false, others });
    s.controller.start();
    await settle();
    expect(s.register).not.toHaveBeenCalled();
    for (const r of others) expect(r.unregister).toHaveBeenCalledOnce();
    expect([...s.caches.keys()]).toEqual(["other"]);
  });
});

describe("registration", () => {
  it("registers /sw.js at scope / without the HTTP cache and checks for an update at start", async () => {
    const s = setup();
    s.controller.start();
    await settle();
    expect(s.register).toHaveBeenCalledWith("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    expect(s.registration.update).toHaveBeenCalledTimes(1);
  });

  it("checks again when the page becomes visible and every hour while visible", async () => {
    const s = setup();
    s.controller.start();
    await settle();
    s.registration.update.mockClear();
    s.visibility.state = "hidden";
    s.visibility.fire();
    expect(s.registration.update).not.toHaveBeenCalled();
    s.visibility.state = "visible";
    s.visibility.fire();
    expect(s.registration.update).toHaveBeenCalledTimes(1);
    s.registration.update.mockClear();
    await vi.advanceTimersByTimeAsync(60 * 60_000);
    expect(s.registration.update).toHaveBeenCalledTimes(1);
    s.visibility.state = "hidden";
    await vi.advanceTimersByTimeAsync(60 * 60_000);
    expect(s.registration.update).toHaveBeenCalledTimes(1);
  });

  it("asks for persistent storage once, after the worker is active", async () => {
    const s = setup();
    s.controller.start();
    await settle();
    s.visibility.fire();
    expect(s.persist).toHaveBeenCalledTimes(1);
  });

  it("stops checking when stopped", async () => {
    const s = setup();
    const stop = s.controller.start();
    await settle();
    stop();
    s.registration.update.mockClear();
    await vi.advanceTimersByTimeAsync(2 * 60 * 60_000);
    expect(s.registration.update).not.toHaveBeenCalled();
  });
});

describe("a worker already waiting when the page loads", () => {
  it("is activated at once outside a player, and the page reloads when it takes over", async () => {
    const waiting = new FakeWorker();
    const s = setup({ waiting });
    s.controller.start();
    await settle();
    expect(waiting.messages).toEqual([{ type: SKIP_WAITING_MESSAGE }]);
    s.changeController();
    expect(s.reload).toHaveBeenCalledTimes(1);
  });

  it("is left alone inside a player, and shown on the banner after the child leaves", async () => {
    const waiting = new FakeWorker();
    const s = setup({ waiting, pathname: "/lessons/a/sections/s1" });
    s.controller.start();
    await settle();
    expect(waiting.messages).toEqual([]);
    expect(s.controller.bannerVisible()).toBe(false);
    s.controller.setPathname("/lessons/a");
    expect(s.controller.bannerVisible()).toBe(true);
    expect(waiting.messages).toEqual([]);
  });

  it("is not a boot apply on a first install (the page has no controller)", async () => {
    const waiting = new FakeWorker();
    const s = setup({ waiting, hasController: false });
    s.controller.start();
    await settle();
    expect(waiting.messages).toEqual([]);
    expect(s.controller.bannerVisible()).toBe(false);
  });
});

describe("a worker that finishes installing while the page is open", () => {
  async function withNewWorker(pathname: string) {
    const s = setup({ pathname });
    s.controller.start();
    await settle();
    const worker = new FakeWorker();
    worker.state = "installing";
    s.registration.found(worker);
    worker.become("installed");
    return { s, worker };
  }

  it("shows the banner outside a player and activates nothing by itself", async () => {
    const { s, worker } = await withNewWorker("/");
    expect(s.controller.bannerVisible()).toBe(true);
    expect(worker.messages).toEqual([]);
  });

  it("shows nothing inside a player, then the banner when the child leaves", async () => {
    const { s } = await withNewWorker("/lessons/a/review");
    expect(s.controller.bannerVisible()).toBe(false);
    s.controller.setPathname("/");
    expect(s.controller.bannerVisible()).toBe(true);
  });

  it("activates it when the banner is tapped, then reloads on controllerchange", async () => {
    const { s, worker } = await withNewWorker("/");
    s.controller.tapBanner();
    expect(worker.messages).toEqual([{ type: SKIP_WAITING_MESSAGE }]);
    s.changeController();
    expect(s.reload).toHaveBeenCalledTimes(1);
    expect(s.controller.bannerVisible()).toBe(false);
  });

  it("notifies subscribers when the banner appears and goes away", async () => {
    const s = setup();
    const seen: boolean[] = [];
    s.controller.subscribe(() => seen.push(s.controller.bannerVisible()));
    s.controller.start();
    await settle();
    const worker = new FakeWorker();
    s.registration.found(worker);
    worker.become("installed");
    s.controller.setPathname("/lessons/a/review");
    expect(seen).toEqual([true, false]);
  });
});

describe("activation after the device was away", () => {
  async function waitingWorker(pathname = "/") {
    const s = setup({ pathname });
    s.controller.start();
    await settle();
    const worker = new FakeWorker();
    s.registration.found(worker);
    worker.become("installed");
    return { s, worker };
  }

  function away(s: Setup, minutes: number) {
    s.visibility.state = "hidden";
    s.visibility.fire();
    s.clock.now += minutes * 60_000;
    s.visibility.state = "visible";
    s.visibility.fire();
  }

  it("activates a waiting worker after 15 minutes hidden", async () => {
    const { s, worker } = await waitingWorker();
    away(s, 15);
    expect(worker.messages).toEqual([{ type: SKIP_WAITING_MESSAGE }]);
  });

  it("does nothing after 14 minutes", async () => {
    const { s, worker } = await waitingWorker();
    away(s, 14);
    expect(worker.messages).toEqual([]);
  });

  it("does nothing inside a player", async () => {
    const { s, worker } = await waitingWorker("/lessons/a/sections/s1");
    away(s, 60);
    expect(worker.messages).toEqual([]);
  });
});

describe("controllerchange", () => {
  it("does not reload on a first install", async () => {
    const s = setup({ hasController: false });
    s.controller.start();
    await settle();
    s.changeController();
    expect(s.reload).not.toHaveBeenCalled();
    expect(s.controller.bannerVisible()).toBe(false);
  });

  it("waits for the child to leave a player, then reloads", async () => {
    const s = setup({ pathname: "/lessons/a/sections/s1" });
    s.controller.start();
    await settle();
    s.changeController();
    expect(s.reload).not.toHaveBeenCalled();
    s.controller.setPathname("/lessons/a/sections/s2");
    expect(s.reload).not.toHaveBeenCalled();
    s.controller.setPathname("/lessons/a");
    expect(s.reload).toHaveBeenCalledTimes(1);
  });

  it("reloads from a tap on the banner while a reload is pending", async () => {
    const s = setup({ pathname: "/lessons/a/review" });
    s.controller.start();
    await settle();
    s.changeController();
    s.controller.tapBanner();
    expect(s.reload).toHaveBeenCalledTimes(1);
  });
});

import {
  CACHE_PREFIX,
  SKIP_WAITING_MESSAGE,
  UPDATE_CHECK_MINUTES,
  UPDATE_IDLE_MINUTES,
  WORKER_PATH,
  WORKER_SCOPE,
} from "./config";

// Registers the service worker and decides when a new build takes over,
// without a framework so Vitest drives it with a fake `navigator`. The page
// reads `bannerVisible` and calls `tapBanner`; `register.tsx` wires it up.
//
// Why a new worker waits: activating it deletes the old build's cache, while
// the open page may still lazy-load a chunk of the old build (a visual, a
// player). So it takes over only at a safe moment: right at boot, on the
// banner, or after the device was away for a while, and a page inside a lesson
// player never reloads until the child leaves it.

// `/lessons/<id>/sections/<id>` and `/lessons/<id>/review`: where a reload
// would interrupt a lesson.
const PLAYER_PATH = /^\/lessons\/[^/]+\/(sections\/[^/]+|review)\/?$/;

export function isPlayerPath(pathname: string): boolean {
  return PLAYER_PATH.test(pathname);
}

type Listener = () => void;

type WorkerLike = {
  state: string;
  postMessage(message: unknown): void;
  addEventListener(type: "statechange", listener: Listener): void;
};

type RegistrationLike = {
  waiting: WorkerLike | null;
  installing: WorkerLike | null;
  update(): Promise<unknown>;
  unregister(): Promise<boolean>;
  addEventListener(type: "updatefound", listener: Listener): void;
};

export type UpdateDeps = {
  serviceWorker: {
    controller: unknown;
    register(
      url: string,
      options: { scope: string; updateViaCache: "none" },
    ): Promise<RegistrationLike>;
    getRegistrations(): Promise<RegistrationLike[]>;
    ready: Promise<unknown>;
    addEventListener(type: "controllerchange", listener: Listener): void;
    removeEventListener(type: "controllerchange", listener: Listener): void;
  };
  caches: Pick<CacheStorage, "keys" | "delete">;
  storage: { persist?: () => Promise<boolean> };
  visibility: {
    state: () => string;
    subscribe: (listener: Listener) => () => void;
  };
  now: () => number;
  reload: () => void;
  setInterval: (callback: Listener, ms: number) => unknown;
  clearInterval: (handle: unknown) => void;
  // False in `next dev` and when the kill switch is on: no worker may run,
  // and any that is installed is removed.
  enabled: boolean;
  pathname: string;
};

export type UpdateController = {
  start: () => () => void;
  setPathname: (pathname: string) => void;
  tapBanner: () => void;
  bannerVisible: () => boolean;
  subscribe: (listener: Listener) => () => void;
};

export function createUpdateController(deps: UpdateDeps): UpdateController {
  const sw = deps.serviceWorker;
  const listeners = new Set<Listener>();
  let inPlayer = isPlayerPath(deps.pathname);
  let waiting: WorkerLike | null = null;
  // The controller changed while the child was inside a player.
  let reloadPending = false;
  let hadController = sw.controller !== null;
  let registration: RegistrationLike | null = null;
  let hiddenAt: number | null = null;
  let persisted = false;

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const bannerVisible = () => (waiting !== null || reloadPending) && !inPlayer;

  const apply = () => {
    waiting?.postMessage({ type: SKIP_WAITING_MESSAGE });
  };

  // Asked once the worker is active: Safari 17+ and Chromium decide without a
  // prompt, and a granted request also protects the child's progress (Dexie)
  // from eviction.
  const requestPersist = () => {
    if (persisted) return;
    persisted = true;
    void Promise.resolve(deps.storage.persist?.()).catch(() => undefined);
  };

  const check = () => {
    registration?.update().catch(() => undefined);
  };

  const onWaiting = (worker: WorkerLike, atBoot: boolean) => {
    waiting = worker;
    notify();
    // Right after a page loads no lazy chunk is in use yet, so the new build
    // can take over at once (this covers a browser that never activates it
    // by itself, such as iOS after it killed the suspended app).
    if (atBoot && !inPlayer) apply();
  };

  const watch = (reg: RegistrationLike) => {
    if (reg.waiting && hadController) onWaiting(reg.waiting, true);
    reg.addEventListener("updatefound", () => {
      const installing = reg.installing;
      installing?.addEventListener("statechange", () => {
        if (installing.state === "installed" && hadController) {
          onWaiting(installing, false);
        }
      });
    });
  };

  const onControllerChange = () => {
    if (!hadController) {
      // The first install claims the page: it is already running the new
      // build, so there is nothing to reload.
      hadController = true;
      return;
    }
    waiting = null;
    if (inPlayer) {
      reloadPending = true;
      notify();
    } else {
      deps.reload();
    }
  };

  const retire = async () => {
    const registrations = await sw.getRegistrations();
    await Promise.all(registrations.map((r) => r.unregister()));
    const names = await deps.caches.keys();
    await Promise.all(
      names
        .filter((n) => n.startsWith(CACHE_PREFIX))
        .map((n) => deps.caches.delete(n)),
    );
  };

  const start = () => {
    if (!deps.enabled) {
      void retire().catch(() => undefined);
      return () => {};
    }
    sw.addEventListener("controllerchange", onControllerChange);
    void sw
      .register(WORKER_PATH, { scope: WORKER_SCOPE, updateViaCache: "none" })
      .then((reg) => {
        registration = reg;
        watch(reg);
        check();
      })
      .catch(() => undefined);
    void sw.ready.then(requestPersist).catch(() => undefined);

    const unsubscribeVisibility = deps.visibility.subscribe(() => {
      if (deps.visibility.state() === "hidden") {
        hiddenAt = deps.now();
        return;
      }
      check();
      const away = hiddenAt === null ? 0 : deps.now() - hiddenAt;
      hiddenAt = null;
      if (waiting && !inPlayer && away >= UPDATE_IDLE_MINUTES * 60_000) {
        apply();
      }
    });
    const timer = deps.setInterval(() => {
      if (deps.visibility.state() === "visible") check();
    }, UPDATE_CHECK_MINUTES * 60_000);

    return () => {
      sw.removeEventListener("controllerchange", onControllerChange);
      unsubscribeVisibility();
      deps.clearInterval(timer);
    };
  };

  return {
    start,
    setPathname(pathname) {
      inPlayer = isPlayerPath(pathname);
      if (!inPlayer && reloadPending) {
        deps.reload();
        return;
      }
      notify();
    },
    tapBanner() {
      if (reloadPending) deps.reload();
      else apply();
    },
    bannerVisible,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

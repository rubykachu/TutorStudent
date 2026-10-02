"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UpdateBanner } from "@/components/update-banner";
import { INSTALL_BACKOFF_KEY } from "./config";
import { offlineWorkerOn } from "./flags";
import {
  createUpdateController,
  type InstallBackoff,
  type UpdateController,
  type UpdateDeps,
} from "./update-controller";

// The install backoff in `localStorage`; a missing, unreadable or malformed
// value means no backoff.
function loadBackoff(): InstallBackoff | null {
  try {
    const value = JSON.parse(
      window.localStorage.getItem(INSTALL_BACKOFF_KEY) ?? "null",
    ) as Partial<InstallBackoff> | null;
    return typeof value?.failures === "number" &&
      typeof value.retryAt === "number"
      ? { failures: value.failures, retryAt: value.retryAt }
      : null;
  } catch {
    return null;
  }
}

function saveBackoff(value: InstallBackoff | null): void {
  try {
    if (value === null) window.localStorage.removeItem(INSTALL_BACKOFF_KEY);
    else
      window.localStorage.setItem(INSTALL_BACKOFF_KEY, JSON.stringify(value));
  } catch {
    // Storage is blocked: the next load has no backoff.
  }
}

// What the update controller needs from the browser.
function browserDeps(pathname: string): UpdateDeps {
  return {
    serviceWorker:
      navigator.serviceWorker as unknown as UpdateDeps["serviceWorker"],
    // Absent on a page that is not a secure context.
    caches: window.caches ?? {
      keys: async () => [],
      delete: async () => false,
    },
    storage: navigator.storage,
    visibility: {
      state: () => document.visibilityState,
      subscribe: (listener) => {
        document.addEventListener("visibilitychange", listener);
        return () => document.removeEventListener("visibilitychange", listener);
      },
    },
    installBackoff: { load: loadBackoff, save: saveBackoff },
    now: () => Date.now(),
    reload: () => window.location.reload(),
    setInterval: (callback, ms) => window.setInterval(callback, ms),
    clearInterval: (handle) => window.clearInterval(handle as number),
    // Production only: a worker on a dev origin would serve stale pages to the
    // dev server. Off unless the build turned offline support on, and off
    // for everyone under the kill switch (`flags.ts`).
    enabled: process.env.NODE_ENV === "production" && offlineWorkerOn(),
    pathname,
  };
}

// Mounted by the child layout and the parent screen, never on `/unlock`: the
// worker installs only on a device that already has the family-code cookie.
// Draws the "new build" banner outside the lesson players.
export function OfflineManager() {
  const pathname = usePathname() ?? "";
  const startPath = useRef(pathname);
  const controller = useRef<UpdateController | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const created = createUpdateController(browserDeps(startPath.current));
    controller.current = created;
    const unsubscribe = created.subscribe(() =>
      setVisible(created.bannerVisible()),
    );
    const stop = created.start();
    return () => {
      stop();
      unsubscribe();
      controller.current = null;
    };
  }, []);

  useEffect(() => {
    controller.current?.setPathname(pathname);
  }, [pathname]);

  return visible ? (
    <UpdateBanner onTap={() => controller.current?.tapBanner()} />
  ) : null;
}

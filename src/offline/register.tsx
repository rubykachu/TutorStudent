"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UpdateBanner } from "@/components/update-banner";
import { offlineWorkerOn } from "./flags";
import {
  createUpdateController,
  type UpdateController,
  type UpdateDeps,
} from "./update-controller";

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

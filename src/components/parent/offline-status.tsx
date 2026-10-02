"use client";

import { useEffect, useState } from "react";
import { offlineWorkerOn } from "@/offline/flags";
import {
  type OfflineReadiness,
  offlineStatusText,
  readOfflineReadiness,
} from "@/offline/status";
import { CARD } from "./panel";

// How often the line asks again while the device is not ready yet.
export const OFFLINE_STATUS_POLL_MS = 3000;

// One line on the parent page: whether this device can open the app with no
// network. This is how the owner checks an iPad before relying on offline.
export function OfflineStatus() {
  const [readiness, setReadiness] = useState<OfflineReadiness | null>(null);

  useEffect(() => {
    // Nothing to wait for: the build registers no worker.
    if (!offlineWorkerOn()) {
      setReadiness({ kind: "off" });
      return;
    }
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const container =
      "serviceWorker" in navigator ? navigator.serviceWorker : undefined;

    const refresh = async () => {
      clearTimeout(timer);
      const registration = await container?.getRegistration();
      const next = await readOfflineReadiness(registration);
      if (!live) return;
      setReadiness(next);
      if (next.kind !== "ready") {
        timer = setTimeout(() => void refresh(), OFFLINE_STATUS_POLL_MS);
      }
    };

    const onUpdateFound = () => void refresh();
    void refresh();
    container?.addEventListener("controllerchange", onUpdateFound);
    let registration: ServiceWorkerRegistration | undefined;
    void container?.getRegistration().then((found) => {
      registration = found;
      found?.addEventListener("updatefound", onUpdateFound);
    });
    return () => {
      live = false;
      clearTimeout(timer);
      container?.removeEventListener("controllerchange", onUpdateFound);
      registration?.removeEventListener("updatefound", onUpdateFound);
    };
  }, []);

  if (readiness === null) return null;
  return (
    <section
      className={CARD}
      aria-label="Dùng khi không có mạng"
      data-parent-panel="Dùng khi không có mạng"
    >
      <p
        aria-live="polite"
        data-offline-status={readiness.kind}
        className="font-semibold"
      >
        {offlineStatusText(readiness)}
      </p>
    </section>
  );
}

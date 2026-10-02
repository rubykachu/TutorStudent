"use client";

import { useEffect } from "react";
import { SYNC_INTERVAL_MINUTES } from "@/lib/config";
import { appDb } from "@/progress/hooks";
import { restoreClockOffset } from "@/sync/clock";
import { requestSync, startSync, syncNow } from "@/sync/request";

// Starts syncing while a screen of the app is open: one full sync at start
// (every local month is checked for unsent records), then one every few
// minutes, when the network comes back and when the page is hidden. Draws
// nothing: the child never sees sync.
export function SyncRunner() {
  useEffect(() => {
    const stop = startSync();
    let live = true;
    // The offset is restored first so the sync, like every write after it,
    // uses the corrected time.
    void restoreClockOffset(appDb())
      .catch(() => undefined)
      .then(() => {
        if (live) void syncNow({ full: true });
      });
    const timer = setInterval(requestSync, SYNC_INTERVAL_MINUTES * 60_000);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") requestSync();
    };
    window.addEventListener("online", requestSync);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      live = false;
      stop();
      clearInterval(timer);
      window.removeEventListener("online", requestSync);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return null;
}

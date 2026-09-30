"use client";

import { useEffect, useSyncExternalStore } from "react";
import { now } from "@/lib/time";
import {
  closeParentSession,
  openParentSession,
  parentSessionRemainingMs,
  parentSessionSnapshot,
  subscribeParentSession,
} from "@/progress/parent-session";
import { ParentDashboard } from "./parent-dashboard";
import { PinGate } from "./pin-gate";

// The parent page: the PIN gate until a correct PIN opens the in-memory
// session, then the dashboard until the session expires or is locked.
export function ParentScreen() {
  const until = useSyncExternalStore(
    subscribeParentSession,
    parentSessionSnapshot,
    () => null,
  );
  const remaining = until === null ? 0 : parentSessionRemainingMs(now());

  useEffect(() => {
    if (until === null) return;
    const timer = setTimeout(
      closeParentSession,
      Math.max(0, until - now().getTime()),
    );
    return () => clearTimeout(timer);
  }, [until]);

  if (remaining > 0) return <ParentDashboard />;
  return <PinGate onUnlock={() => openParentSession(now())} />;
}

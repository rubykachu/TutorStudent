"use client";

import { useEffect } from "react";
import { appDb } from "@/progress/hooks";
import { flushOutbox } from "./outbox";

// Sends the feedback reports left on the device: once when a child screen
// opens and again when the network comes back. Draws nothing.
export function FeedbackOutboxRunner() {
  useEffect(() => {
    const flush = () => {
      void flushOutbox(appDb());
    };
    flush();
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, []);
  return null;
}

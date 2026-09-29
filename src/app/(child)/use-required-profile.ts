"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PROFILES_PATH } from "@/lib/routes";
import type { ProfileRecord } from "@/progress/db";
import { useActiveProfile } from "@/progress/hooks";

// Child screens need to know who is learning; without an active profile the
// device is sent to the profile picker. Returns null until a profile is known.
export function useRequiredProfile(): ProfileRecord | null {
  const state = useActiveProfile();
  const router = useRouter();
  const missing = state.status === "none";
  useEffect(() => {
    if (missing) router.replace(PROFILES_PATH);
  }, [missing, router]);
  return state.status === "ready" ? state.profile : null;
}

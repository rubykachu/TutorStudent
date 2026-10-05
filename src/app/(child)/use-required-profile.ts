"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { isColdLaunch, markLaunched } from "@/lib/cold-launch";
import { PROFILES_PATH } from "@/lib/routes";
import type { ProfileRecord } from "@/progress/db";
import { useActiveProfile } from "@/progress/hooks";

const noSubscribe = () => () => undefined;

// Child screens need to know who is learning; without an active profile the
// device is sent to the profile picker. Returns null until a profile is known.
//
// Home passes `pickOnColdLaunch`: when the app was just opened
// (`isColdLaunch`), it goes to the picker even with a remembered child, and
// the child's tap there starts the music. Every other screen opened first
// (a link into a lesson) is shown as asked and marks the launch, so going
// home from it does not stop on the picker.
export function useRequiredProfile({
  pickOnColdLaunch = false,
}: {
  pickOnColdLaunch?: boolean;
} = {}): ProfileRecord | null {
  const state = useActiveProfile();
  const router = useRouter();
  // sessionStorage exists only in the browser: null on the server.
  const cold = useSyncExternalStore(noSubscribe, isColdLaunch, () => null);
  const ready = state.status === "ready";
  const waitForPicker = pickOnColdLaunch && cold !== false;
  const toPicker =
    state.status === "none" || (pickOnColdLaunch && ready && cold === true);
  useEffect(() => {
    if (toPicker) router.replace(PROFILES_PATH);
    else if (ready && !pickOnColdLaunch) markLaunched();
  }, [toPicker, ready, pickOnColdLaunch, router]);
  return ready && !waitForPicker ? state.profile : null;
}

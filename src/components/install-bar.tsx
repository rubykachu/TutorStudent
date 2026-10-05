"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { INSTALL_SECONDARY, InstallButton } from "@/components/install-app";
import {
  installOfferedThisSession,
  markInstallOffered,
  readHiddenUntil,
  snoozeInstall,
  useInstallAction,
} from "@/install/browser";
import {
  homeBarDue,
  homeOffersInstall,
  INSTALL_BAR_DELAY_MS,
} from "@/install/platform";
import { APP_NAME } from "@/lib/brand";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Owl } from "@/mascot/owl";
import { useAudioUnlocked } from "@/music/background-music-runner";
import { useBackgroundMusicAllowed } from "@/progress/hooks";

// The home screen's "install the app" bar, for a browser visitor only. It
// slides in once home has been on screen for `INSTALL_BAR_DELAY_MS` after the
// first tap that lets the music start (so it never competes with the owl's
// "Chạm vào tớ nào!"), at most once per tab session, and not for a week after
// "Để sau". A direct child of home's `<main>`, pushed to the bottom: sticky,
// so it stays in reach while home scrolls and ends the page in its own space
// below the last content, never over it.
export function InstallBar() {
  const action = useInstallAction();
  const musicAllowed = useBackgroundMusicAllowed();
  const ready = useAudioUnlocked() || musicAllowed === false;
  const reducedMotion = usePrefersReducedMotion();
  const [shown, setShown] = useState(false);
  const offered = homeOffersInstall(action);

  useEffect(() => {
    if (!ready || !offered || shown) return undefined;
    const timer = setTimeout(() => {
      const due = homeBarDue({
        hiddenUntil: readHiddenUntil(),
        offeredThisSession: installOfferedThisSession(),
        nowMs: Date.now(),
      });
      if (!due) return;
      markInstallOffered();
      setShown(true);
    }, INSTALL_BAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready, offered, shown]);

  // Installed meanwhile (the prompt accepted, or `appinstalled`): gone.
  if (!shown || !homeOffersInstall(action)) return null;
  return (
    <motion.aside
      aria-label={`Cài ${APP_NAME}`}
      data-install-bar
      initial={reducedMotion ? false : { y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky mt-auto bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 flex flex-col gap-3 rounded-xl border-2 border-border bg-surface p-3 shadow-card md:p-4 lg:flex-row lg:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Owl expression="happy" size="exercise" className="shrink-0" />
        <p className="min-w-0 text-caption font-semibold md:text-body">
          Cài {APP_NAME} lên máy để học như app thật, dùng được cả khi không có
          mạng
        </p>
      </div>
      <div className="flex shrink-0 gap-3 md:justify-end [&>*]:flex-auto md:[&>*]:flex-none">
        <InstallButton action={action} onDone={() => setShown(false)} />
        <button
          type="button"
          data-install-later
          className={INSTALL_SECONDARY}
          onClick={() => {
            snoozeInstall(Date.now());
            setShown(false);
          }}
        >
          Để sau
        </button>
      </div>
    </motion.aside>
  );
}

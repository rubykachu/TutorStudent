"use client";

import { useEffect } from "react";
import { mediaUrl } from "@/lib/media";
import { downloadMedia, storePreloaded } from "@/lib/media-download";
import {
  isNetworkError,
  reportMediaNetworkFailure,
  useNetworkStatus,
} from "@/lib/network-status";
import type { Video } from "@/schema/content";

// Fetches the video of the next screen while the child reads this one, so
// play starts at once when they get there. The file waits in memory (one
// video at most, `storePreloaded`) for the player that needs it; leaving the
// screen before it finished stops the download; nothing is written to the
// device. Waits while the network is not there and starts when it is back.
// Shows nothing.
export function VideoPreload({ video }: { video: Video }) {
  const url = mediaUrl(video.url);
  const { offline } = useNetworkStatus();
  useEffect(() => {
    if (offline) return undefined;
    const controller = new AbortController();
    downloadMedia(url, { signal: controller.signal })
      .then((result) => {
        if (result.kind === "blob" && !controller.signal.aborted) {
          storePreloaded(url, result.blob);
        }
      })
      .catch((error: unknown) => {
        // Wifi without internet: tell the players, which then wait too.
        if (!controller.signal.aborted && isNetworkError(error)) {
          reportMediaNetworkFailure();
        }
      });
    return () => controller.abort();
  }, [url, offline]);
  return <span hidden aria-hidden data-video-preload={video.id} />;
}

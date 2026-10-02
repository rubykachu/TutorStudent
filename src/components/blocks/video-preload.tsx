"use client";

import { useEffect } from "react";
import { mediaUrl } from "@/lib/media";
import { downloadMedia, storePreloaded } from "@/lib/media-download";
import type { Video } from "@/schema/content";

// Fetches the video of the next screen while the child reads this one, so
// play starts at once when they get there. The file waits in memory (one
// video at most, `storePreloaded`) for the player that needs it; leaving the
// screen before it finished stops the download; nothing is written to the
// device. Shows nothing.
export function VideoPreload({ video }: { video: Video }) {
  const url = mediaUrl(video.url);
  useEffect(() => {
    const controller = new AbortController();
    downloadMedia(url, { signal: controller.signal })
      .then((result) => {
        if (result.kind === "blob" && !controller.signal.aborted) {
          storePreloaded(url, result.blob);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [url]);
  return <span hidden aria-hidden data-video-preload={video.id} />;
}

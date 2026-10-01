"use client";

import { useEffect, useRef } from "react";
import { mediaUrl } from "@/lib/media";
import type { Video } from "@/schema/content";

// Fetches the video of the next screen while the child reads this one, so
// play starts at once when they get there. The element is never shown and
// mirrors the player's attributes (address, CORS mode) so both ask for the
// same resource. Leaving the screen stops the download; nothing is kept.
export function VideoPreload({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = ref.current;
    return () => {
      if (!element) return;
      element.removeAttribute("src");
      element.load();
    };
  }, []);
  return (
    <video
      ref={ref}
      src={mediaUrl(video.url)}
      preload="auto"
      muted
      playsInline
      crossOrigin="anonymous"
      hidden
      aria-hidden
      tabIndex={-1}
      data-video-preload={video.id}
    />
  );
}

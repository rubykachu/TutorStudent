"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type DownloadProgress,
  downloadFraction,
  downloadMedia,
  takePreloaded,
} from "@/lib/media-download";
import {
  clearMediaNetworkFailure,
  isNetworkError,
  reportMediaNetworkFailure,
} from "@/lib/network-status";

export type MediaSourcePhase = "idle" | "loading" | "ready" | "error";

export type MediaSource = {
  // What the element plays: undefined before `request`, then a blob URL (the
  // file is in memory) or the remote address (streamed by the element).
  src: string | undefined;
  phase: MediaSourcePhase;
  // 0–1 while loading; undefined when the file's length is unknown.
  progress: number | undefined;
  // The element streams the file itself (its length was unknown), so the
  // percentage has to come from `bufferedFraction`.
  streamed: boolean;
  // The last download failed because the network was not there (not because
  // the server said no); `useNetworkStatus` tells the player to wait for it.
  networkFailed: boolean;
  receivedBytes: number;
  // Starts the download, or starts it again after an error; a no-op while
  // loading or once ready.
  request: () => void;
};

// The source of a media element, fetched whole so the page can show a real
// percentage. The blob URL is revoked when the source changes or the
// component goes away, and a download in flight is aborted then.
export function useMediaSource(url: string): MediaSource {
  const [src, setSrc] = useState<string | undefined>();
  const [phase, setPhase] = useState<MediaSourcePhase>("idle");
  const [progress, setProgress] = useState<DownloadProgress>({
    receivedBytes: 0,
  });
  const [networkFailed, setNetworkFailed] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const phaseRef = useRef<MediaSourcePhase>("idle");
  const blobUrlRef = useRef<string | null>(null);

  const setPhaseBoth = useCallback((next: MediaSourcePhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const release = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = null;
  }, []);

  const adoptBlob = useCallback(
    (blob: Blob) => {
      blobUrlRef.current = URL.createObjectURL(blob);
      setSrc(blobUrlRef.current);
      setPhaseBoth("ready");
    },
    [setPhaseBoth],
  );

  const start = useCallback(() => {
    const kept = takePreloaded(url);
    if (kept) {
      adoptBlob(kept);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setPhaseBoth("loading");
    setProgress({ receivedBytes: 0 });
    downloadMedia(url, { signal: controller.signal, onProgress: setProgress })
      .then((result) => {
        if (controller.signal.aborted) return;
        setNetworkFailed(false);
        clearMediaNetworkFailure();
        if (result.kind === "blob") {
          adoptBlob(result.blob);
        } else {
          setSrc(url);
          setPhaseBoth("ready");
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const network = isNetworkError(error);
        setNetworkFailed(network);
        if (network) reportMediaNetworkFailure();
        setPhaseBoth("error");
      });
  }, [url, setPhaseBoth, adoptBlob]);

  const request = useCallback(() => {
    if (phaseRef.current === "error") release();
    else if (phaseRef.current !== "idle") return;
    start();
  }, [release, start]);

  // A different file starts over; leaving revokes the blob.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `url` is the trigger, the cleanup resets for the new file
  useEffect(() => {
    return () => {
      release();
      setSrc(undefined);
      setNetworkFailed(false);
      phaseRef.current = "idle";
      setPhase("idle");
    };
  }, [release, url]);

  return {
    src,
    phase,
    progress: phase === "ready" ? 1 : downloadFraction(progress),
    streamed: phase === "ready" && src === url,
    networkFailed,
    receivedBytes: progress.receivedBytes,
    request,
  };
}

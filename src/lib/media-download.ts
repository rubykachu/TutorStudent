// Downloads a media file into memory with a true percentage, so a slow
// network shows "Đang tải… 45%" instead of a frozen spinner. The file is
// played from a blob URL and never stored on the device (no Cache Storage,
// IndexedDB or service worker); the one thing kept beyond a player is the
// single preloaded file of the next screen, in `preloaded` below.

export type DownloadProgress = {
  receivedBytes: number;
  // Undefined when the server did not say how long the file is.
  totalBytes?: number;
};

export type DownloadResult =
  // The whole file, ready to play from memory.
  | { kind: "blob"; blob: Blob }
  // The percentage cannot be byte-accurate here (no Content-Length, or no
  // streamed body): the caller lets the element stream the file itself and
  // reports `bufferedFraction` instead.
  | { kind: "direct" };

// 0–1 through a download; undefined while the total is unknown.
export function downloadFraction({
  receivedBytes,
  totalBytes,
}: DownloadProgress): number | undefined {
  if (!totalBytes || totalBytes <= 0) return undefined;
  return Math.min(1, Math.max(0, receivedBytes / totalBytes));
}

// 0–1: how much of the media the element has buffered ahead of nothing, i.e.
// the end of the buffered range that holds the playhead over the duration.
// Undefined while the duration is unknown.
export function bufferedFraction(
  media: Pick<HTMLMediaElement, "buffered" | "currentTime" | "duration">,
): number | undefined {
  const { duration, currentTime, buffered } = media;
  if (!Number.isFinite(duration) || duration <= 0) return undefined;
  let end = 0;
  for (let i = 0; i < buffered.length; i++) {
    if (buffered.start(i) <= currentTime + 0.5) {
      end = Math.max(end, buffered.end(i));
    }
  }
  return Math.min(1, Math.max(0, end / duration));
}

// The child's number: whole percent.
export function percentLabel(fraction: number): number {
  return Math.round(fraction * 100);
}

export async function downloadMedia(
  url: string,
  {
    signal,
    onProgress,
  }: {
    signal?: AbortSignal;
    onProgress?: (progress: DownloadProgress) => void;
  },
): Promise<DownloadResult> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const length = Number(response.headers.get("Content-Length"));
  const reader = response.body?.getReader();
  if (!reader || !Number.isFinite(length) || length <= 0) {
    // Stop this download; the element streams the file itself.
    await response.body?.cancel().catch(() => undefined);
    return { kind: "direct" };
  }
  const chunks: Uint8Array<ArrayBuffer>[] = [];
  let receivedBytes = 0;
  onProgress?.({ receivedBytes, totalBytes: length });
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value as Uint8Array<ArrayBuffer>);
    receivedBytes += value.byteLength;
    onProgress?.({ receivedBytes, totalBytes: length });
  }
  const type = response.headers.get("Content-Type") ?? undefined;
  return { kind: "blob", blob: new Blob(chunks, type ? { type } : undefined) };
}

// The one file the next screen's preload finished, held in memory until the
// player that needs it takes it (or a newer preload replaces it). At most one
// video, so memory stays bounded and nothing is written to the device.
let preloaded: { url: string; blob: Blob } | undefined;

export function storePreloaded(url: string, blob: Blob): void {
  preloaded = { url, blob };
}

export function takePreloaded(url: string): Blob | undefined {
  if (preloaded?.url !== url) return undefined;
  const { blob } = preloaded;
  preloaded = undefined;
  return blob;
}

export function clearPreloaded(): void {
  preloaded = undefined;
}

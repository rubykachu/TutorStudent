import { MEDIA_BASE_URL } from "@/lib/config";

// The URL of a file in the media store (`MediaPathSchema`).
export function mediaUrl(path: string): string {
  return `${MEDIA_BASE_URL}/${path}`;
}

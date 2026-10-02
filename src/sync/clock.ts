import { setClockOffset } from "@/lib/time";
import {
  DEVICE_SCOPE,
  getSetting,
  setSetting,
  type TutorDb,
} from "@/progress/db";

// Device setting holding how far the device clock is behind the server's.
export const CLOCK_OFFSET_KEY = "clockOffsetMs";

// The offset from the server's `serverTime`, measured right after a response
// (the request's round trip is small next to the errors this corrects).
export function offsetFromServerTime(
  serverTime: string,
  deviceNow: Date,
): number {
  return Date.parse(serverTime) - deviceNow.getTime();
}

// Makes `now()` use the stored offset; call once when the app starts, before
// anything records a time. 0 until a sync has measured one.
export async function restoreClockOffset(db: TutorDb): Promise<void> {
  const stored = await getSetting(db, DEVICE_SCOPE, CLOCK_OFFSET_KEY);
  setClockOffset(
    typeof stored === "number" && Number.isFinite(stored) ? stored : 0,
  );
}

// Applies a freshly measured offset and keeps it for the next start.
export async function storeClockOffset(
  db: TutorDb,
  offsetMs: number,
): Promise<void> {
  setClockOffset(offsetMs);
  await setSetting(db, DEVICE_SCOPE, CLOCK_OFFSET_KEY, offsetMs);
}

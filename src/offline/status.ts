import { PRECACHE_STATUS_MESSAGE, type PrecacheStatus } from "./config";

// What the parent page says about using the app with no network: asks the
// worker that is installing (it knows how far it got), else the active one
// (it knows its cache is whole), and turns the answer into one line.

export type OfflineReadiness =
  // No worker: development, a browser without workers, or not installed yet.
  | { kind: "none" }
  | { kind: "installing"; cached: number; total: number }
  | { kind: "ready" };

type WorkerLike = {
  postMessage(message: unknown, transfer: Transferable[]): void;
};

type RegistrationLike = {
  installing: WorkerLike | null;
  waiting: WorkerLike | null;
  active: WorkerLike | null;
};

// How long to wait for a worker's answer: a stopped worker starts for the
// message, which takes well under a second.
export const STATUS_TIMEOUT_MS = 3000;

// Sends `PRECACHE_STATUS` and resolves with the answer, or null when the
// worker does not answer in time.
export function askWorker(
  worker: WorkerLike,
  timeoutMs: number = STATUS_TIMEOUT_MS,
): Promise<PrecacheStatus | null> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => resolve(null), timeoutMs);
    channel.port1.onmessage = (event: MessageEvent<PrecacheStatus>) => {
      clearTimeout(timer);
      resolve(event.data);
    };
    worker.postMessage({ type: PRECACHE_STATUS_MESSAGE }, [channel.port2]);
  });
}

export async function readOfflineReadiness(
  registration: RegistrationLike | undefined,
  ask: (worker: WorkerLike) => Promise<PrecacheStatus | null> = askWorker,
): Promise<OfflineReadiness> {
  if (!registration) return { kind: "none" };
  const worker = registration.installing ?? registration.active;
  if (!worker) return { kind: "none" };
  const status = await ask(worker);
  if (!status) return { kind: "none" };
  if (status.state === "installing") {
    return { kind: "installing", cached: status.cached, total: status.total };
  }
  return status.state === "ready" ? { kind: "ready" } : { kind: "none" };
}

export function offlineStatusText(readiness: OfflineReadiness): string {
  const label = "Dùng khi không có mạng:";
  switch (readiness.kind) {
    case "ready":
      return `${label} sẵn sàng`;
    case "installing":
      return `${label} đang tải (${readiness.cached}/${readiness.total})`;
    case "none":
      return `${label} chưa sẵn sàng`;
  }
}

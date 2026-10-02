import { describe, expect, it, vi } from "vitest";
import { PRECACHE_STATUS_MESSAGE } from "@/offline/config";
import {
  askWorker,
  offlineStatusText,
  readOfflineReadiness,
} from "@/offline/status";

const worker = () => ({ postMessage: vi.fn() });

describe("readOfflineReadiness", () => {
  it("is none without a registration or a worker", async () => {
    const ask = vi.fn();
    expect(await readOfflineReadiness(undefined, ask)).toEqual({
      kind: "none",
    });
    expect(
      await readOfflineReadiness(
        { installing: null, waiting: null, active: null },
        ask,
      ),
    ).toEqual({ kind: "none" });
    expect(ask).not.toHaveBeenCalled();
  });

  it("asks the installing worker before the active one", async () => {
    const installing = worker();
    const active = worker();
    const ask = vi.fn(async (w: unknown) =>
      w === installing
        ? { state: "installing" as const, cached: 120, total: 340 }
        : { state: "ready" as const, cached: 340, total: 340 },
    );
    expect(
      await readOfflineReadiness({ installing, waiting: null, active }, ask),
    ).toEqual({ kind: "installing", cached: 120, total: 340 });
    expect(ask).toHaveBeenCalledWith(installing);
  });

  it("asks the active worker when none is installing", async () => {
    const active = worker();
    const ask = vi.fn(async () => ({
      state: "ready" as const,
      cached: 340,
      total: 340,
    }));
    expect(
      await readOfflineReadiness(
        { installing: null, waiting: null, active },
        ask,
      ),
    ).toEqual({ kind: "ready" });
    expect(ask).toHaveBeenCalledWith(active);
  });

  it("is none for an incomplete or failed cache and for a worker that does not answer", async () => {
    const active = worker();
    for (const answer of [
      { state: "incomplete" as const, cached: 3, total: 340 },
      { state: "failed" as const, cached: 3, total: 340 },
      null,
    ]) {
      expect(
        await readOfflineReadiness(
          { installing: null, waiting: null, active },
          async () => answer,
        ),
      ).toEqual({ kind: "none" });
    }
  });
});

describe("offlineStatusText", () => {
  it("says ready, how far the download is, or not ready", () => {
    expect(offlineStatusText({ kind: "ready" })).toBe(
      "Dùng khi không có mạng: sẵn sàng",
    );
    expect(
      offlineStatusText({ kind: "installing", cached: 120, total: 340 }),
    ).toBe("Dùng khi không có mạng: đang tải (120/340)");
    expect(offlineStatusText({ kind: "none" })).toBe(
      "Dùng khi không có mạng: chưa sẵn sàng",
    );
  });
});

describe("askWorker", () => {
  it("sends PRECACHE_STATUS with a reply port and resolves with the answer", async () => {
    const w = {
      postMessage: vi.fn((_message: unknown, transfer: MessagePort[]) => {
        transfer[0]?.postMessage({ state: "ready", cached: 1, total: 1 });
      }),
    };
    const answer = await askWorker(w, 1000);
    expect(w.postMessage.mock.calls[0]?.[0]).toEqual({
      type: PRECACHE_STATUS_MESSAGE,
    });
    expect(answer).toEqual({ state: "ready", cached: 1, total: 1 });
  });

  it("resolves null when the worker stays silent", async () => {
    expect(await askWorker(worker(), 20)).toBeNull();
  });
});

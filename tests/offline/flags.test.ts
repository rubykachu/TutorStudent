// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  offlineEnabled,
  offlineKillSwitch,
  offlineWorkerOn,
} from "@/offline/flags";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("offline flags", () => {
  it("are off when nothing is set", () => {
    vi.stubEnv("NEXT_PUBLIC_OFFLINE_ENABLED", undefined);
    vi.stubEnv("NEXT_PUBLIC_OFFLINE_KILL_SWITCH", undefined);
    expect(offlineEnabled()).toBe(false);
    expect(offlineKillSwitch()).toBe(false);
    expect(offlineWorkerOn()).toBe(false);
  });

  it("run the worker only with offline support on and the kill switch off", () => {
    vi.stubEnv("NEXT_PUBLIC_OFFLINE_ENABLED", "1");
    expect(offlineWorkerOn()).toBe(true);
    vi.stubEnv("NEXT_PUBLIC_OFFLINE_KILL_SWITCH", "1");
    expect(offlineWorkerOn()).toBe(false);
  });

  it("take only the exact value 1 as on", () => {
    for (const value of ["", "0", "true", "yes", " 1"]) {
      vi.stubEnv("NEXT_PUBLIC_OFFLINE_ENABLED", value);
      expect(offlineEnabled()).toBe(false);
    }
  });
});

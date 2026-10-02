import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from "vitest";
import { createSyncScheduler } from "@/sync/scheduler";

const DEBOUNCE = 2_000;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function make(run: Mock<() => Promise<unknown>> = vi.fn(async () => 1)) {
  const scheduler = createSyncScheduler({ run, debounceMs: DEBOUNCE });
  return { scheduler, run };
}

describe("sync scheduler", () => {
  it("does nothing on a request until a runner has started it", async () => {
    const { scheduler, run } = make();
    scheduler.request();
    await vi.advanceTimersByTimeAsync(DEBOUNCE * 2);
    expect(run).not.toHaveBeenCalled();
  });

  it("runs once for a burst of requests inside the debounce", async () => {
    const { scheduler, run } = make();
    scheduler.start();
    scheduler.request();
    await vi.advanceTimersByTimeAsync(DEBOUNCE - 1);
    scheduler.request();
    scheduler.request();
    await vi.advanceTimersByTimeAsync(DEBOUNCE - 1);
    expect(run).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({});
  });

  it("drops a pending request when the last runner stops", async () => {
    const { scheduler, run } = make();
    const stopA = scheduler.start();
    const stopB = scheduler.start();
    scheduler.request();
    stopA();
    stopA();
    stopB();
    await vi.advanceTimersByTimeAsync(DEBOUNCE * 2);
    expect(run).not.toHaveBeenCalled();
  });

  it("runs one sync at a time and follows a request made during a run with one more", async () => {
    let release: () => void = () => undefined;
    const run = vi.fn(
      () =>
        new Promise<void>((done) => {
          release = done;
        }),
    );
    const { scheduler } = make(run);
    const first = scheduler.now({ full: true });
    expect(run).toHaveBeenCalledTimes(1);
    const second = scheduler.now();
    const third = scheduler.now();
    expect(run).toHaveBeenCalledTimes(1);
    release();
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(2);
    expect(run).toHaveBeenLastCalledWith({ full: false });
    release();
    await Promise.all([first, second, third]);
    expect(run).toHaveBeenCalledTimes(2);
    // Free again afterwards.
    void scheduler.now();
    expect(run).toHaveBeenCalledTimes(3);
  });

  it("keeps a full check asked for during a run", async () => {
    let release: () => void = () => undefined;
    const run = vi.fn(
      () =>
        new Promise<void>((done) => {
          release = done;
        }),
    );
    const { scheduler } = make(run);
    void scheduler.now();
    void scheduler.now({ full: true });
    void scheduler.now();
    release();
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenLastCalledWith({ full: true });
    release();
  });

  it("goes on after a run throws", async () => {
    const run = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue(undefined);
    const { scheduler } = make(run);
    await scheduler.now();
    await scheduler.now();
    expect(run).toHaveBeenCalledTimes(2);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { PARENT_SESSION_MINUTES } from "@/lib/config";
import {
  closeParentSession,
  openParentSession,
  parentSessionRemainingMs,
  parentSessionSnapshot,
  subscribeParentSession,
} from "@/progress/parent-session";

const START = new Date("2026-09-30T02:00:00Z");
const SESSION_MS = PARENT_SESSION_MINUTES * 60_000;

afterEach(() => {
  closeParentSession();
});

describe("the parent session", () => {
  it("is closed until a PIN opens it", () => {
    expect(parentSessionSnapshot()).toBeNull();
    expect(parentSessionRemainingMs(START)).toBe(0);
  });

  it("stays open for the configured minutes, then expires", () => {
    openParentSession(START);
    expect(parentSessionSnapshot()).toBe(START.getTime() + SESSION_MS);
    expect(parentSessionRemainingMs(START)).toBe(SESSION_MS);
    expect(
      parentSessionRemainingMs(new Date(START.getTime() + SESSION_MS - 1)),
    ).toBe(1);
    expect(
      parentSessionRemainingMs(new Date(START.getTime() + SESSION_MS + 1)),
    ).toBe(0);
  });

  it("notifies subscribers on open and close until they unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeParentSession(listener);
    openParentSession(START);
    closeParentSession();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(parentSessionRemainingMs(START)).toBe(0);
    unsubscribe();
    openParentSession(START);
    expect(listener).toHaveBeenCalledTimes(2);
  });
});

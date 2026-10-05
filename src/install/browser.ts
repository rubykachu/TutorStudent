"use client";

import { useSyncExternalStore } from "react";
import {
  HIDDEN_FOR_GOOD,
  type InstallAction,
  installAction,
  snoozeUntil,
} from "./platform";

// The browser side of "install the app": keeps the browser's install prompt,
// reads the facts `installAction` needs, and remembers a dismissal.

// Chrome's `beforeinstallprompt` event (not in the DOM typings).
export type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// Device setting in `localStorage` (never synced): the time until which the
// home bar stays hidden, `HIDDEN_FOR_GOOD` once the app is installed.
export const INSTALL_HIDDEN_UNTIL_KEY = "tutor.install-hidden-until";
// sessionStorage mark: the home bar has shown in this tab's session.
export const INSTALL_OFFERED_KEY = "tutor.install-offered";

let captured: InstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function hideInstallForGood(): void {
  try {
    window.localStorage.setItem(
      INSTALL_HIDDEN_UNTIL_KEY,
      String(HIDDEN_FOR_GOOD),
    );
  } catch {
    // Blocked storage: the bar never shows there anyway.
  }
}

function onBeforeInstallPrompt(event: Event): void {
  // Keeps Chrome's own mini bar away; the app asks at a calm moment instead.
  event.preventDefault();
  captured = event as InstallPromptEvent;
  notify();
}

function onAppInstalled(): void {
  captured = null;
  installed = true;
  hideInstallForGood();
  notify();
}

// Listens from the moment this module loads (the root layout imports it
// through `InstallPromptCapture`), before any screen hydrates, so an early
// event is not missed. Idempotent.
let listening = false;
export function listenForInstallPrompt(): void {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  window.addEventListener("appinstalled", onAppInstalled);
}
listenForInstallPrompt();

// Mounted once by the root layout so every page loads this module (and its
// listeners) from its first script, `/unlock` included. Draws nothing.
export function InstallPromptCapture(): null {
  return null;
}

// Shows the browser's install dialog. Must run inside the tap's handler.
// Resolves true when the user accepted; the event is single use either way.
export async function promptInstall(): Promise<boolean> {
  const event = captured;
  if (!event) return false;
  captured = null;
  notify();
  await event.prompt();
  const { outcome } = await event.userChoice;
  if (outcome === "accepted") onAppInstalled();
  return outcome === "accepted";
}

function isStandalone(): boolean {
  return (
    installed ||
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readAction(): InstallAction {
  return installAction({
    userAgent: navigator.userAgent,
    maxTouchPoints: navigator.maxTouchPoints ?? 0,
    standalone: isStandalone(),
    canPrompt: captured !== null,
  });
}

// The install action for this device, null on the server and before
// hydration.
export function useInstallAction(): InstallAction | null {
  return useSyncExternalStore(subscribe, readAction, () => null);
}

// The stored hide time: 0 when never set, null when storage is blocked.
export function readHiddenUntil(): number | null {
  try {
    const value = Number(
      window.localStorage.getItem(INSTALL_HIDDEN_UNTIL_KEY) ?? 0,
    );
    return Number.isFinite(value) ? value : 0;
  } catch {
    return null;
  }
}

export function snoozeInstall(nowMs: number): void {
  try {
    window.localStorage.setItem(
      INSTALL_HIDDEN_UNTIL_KEY,
      String(snoozeUntil(nowMs)),
    );
  } catch {
    // Blocked storage: the bar never shows there anyway.
  }
}

// True once marked, and when sessionStorage is blocked (never nag).
export function installOfferedThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(INSTALL_OFFERED_KEY) !== null;
  } catch {
    return true;
  }
}

export function markInstallOffered(): void {
  try {
    window.sessionStorage.setItem(INSTALL_OFFERED_KEY, "1");
  } catch {
    // Blocked storage: `installOfferedThisSession` is already true.
  }
}

// Copies the page's address. False when the browser refuses (some in-app
// browsers), so the caller shows the address to copy by hand.
export async function copyCurrentLink(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}

export function resetInstallStateForTesting(): void {
  captured = null;
  installed = false;
  notify();
}

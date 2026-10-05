import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InstallBar } from "@/components/install-bar";
import { InstallAppPanel } from "@/components/parent/install-app-panel";
import {
  INSTALL_HIDDEN_UNTIL_KEY,
  INSTALL_OFFERED_KEY,
  resetInstallStateForTesting,
} from "@/install/browser";
import { HIDDEN_FOR_GOOD, INSTALL_BAR_DELAY_MS } from "@/install/platform";

vi.mock("@/music/background-music-runner", () => ({
  useAudioUnlocked: () => true,
}));
vi.mock("@/progress/hooks", () => ({
  useBackgroundMusicAllowed: () => true,
}));

const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.71 Mobile Safari/537.36";
const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

function setUserAgent(value: string, touchPoints = 0) {
  Object.defineProperty(navigator, "userAgent", { value, configurable: true });
  Object.defineProperty(navigator, "maxTouchPoints", {
    value: touchPoints,
    configurable: true,
  });
}

// Opened from the Home Screen: `display-mode: standalone` matches.
function setStandalone() {
  const original = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    ...original(query),
    matches: query === "(display-mode: standalone)",
  }));
}

// What Chrome fires when the page can be installed.
function fireInstallPrompt(outcome: "accepted" | "dismissed") {
  const event = new Event("beforeinstallprompt", { cancelable: true });
  const prompt = vi.fn(async () => undefined);
  Object.assign(event, {
    prompt,
    userChoice: Promise.resolve({ outcome }),
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return { event, prompt };
}

async function waitDelay() {
  await act(async () => {
    vi.advanceTimersByTime(INSTALL_BAR_DELAY_MS);
  });
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] });
  localStorage.clear();
  sessionStorage.clear();
  resetInstallStateForTesting();
  setUserAgent(ANDROID_CHROME);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

const bar = () => document.querySelector("[data-install-bar]");

describe("InstallBar", () => {
  it("keeps the browser's prompt and shows it from the tap on Cài app", async () => {
    const { event, prompt } = fireInstallPrompt("accepted");
    expect(event.defaultPrevented).toBe(true);
    render(<InstallBar />);
    expect(bar()).toBeNull();
    await act(async () => {
      vi.advanceTimersByTime(INSTALL_BAR_DELAY_MS - 1);
    });
    expect(bar()).toBeNull();
    await act(async () => {
      vi.advanceTimersByTime(1);
    });
    expect(bar()).not.toBeNull();
    expect(sessionStorage.getItem(INSTALL_OFFERED_KEY)).toBe("1");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cài app" }));
    });
    expect(prompt).toHaveBeenCalledOnce();
    expect(bar()).toBeNull();
    expect(Number(localStorage.getItem(INSTALL_HIDDEN_UNTIL_KEY))).toBe(
      HIDDEN_FOR_GOOD,
    );
  });

  it("snoozes for a week on Để sau", async () => {
    fireInstallPrompt("dismissed");
    render(<InstallBar />);
    await waitDelay();
    const now = Date.now();
    fireEvent.click(screen.getByRole("button", { name: "Để sau" }));
    expect(bar()).toBeNull();
    expect(Number(localStorage.getItem(INSTALL_HIDDEN_UNTIL_KEY))).toBe(
      now + 7 * 24 * 60 * 60 * 1000,
    );
  });

  it("shows at most once per session", async () => {
    sessionStorage.setItem(INSTALL_OFFERED_KEY, "1");
    fireInstallPrompt("dismissed");
    render(<InstallBar />);
    await waitDelay();
    expect(bar()).toBeNull();
  });

  it("never shows when the app runs standalone", async () => {
    setStandalone();
    fireInstallPrompt("dismissed");
    render(<InstallBar />);
    await waitDelay();
    expect(bar()).toBeNull();
  });

  it("never shows when storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    fireInstallPrompt("dismissed");
    render(<InstallBar />);
    await waitDelay();
    expect(bar()).toBeNull();
  });

  it("stays away on Android Chrome without a prompt", async () => {
    render(<InstallBar />);
    await waitDelay();
    expect(bar()).toBeNull();
  });

  it("opens the Share steps on iPhone Safari", async () => {
    setUserAgent(IPHONE_SAFARI, 5);
    render(<InstallBar />);
    await waitDelay();
    fireEvent.click(screen.getByRole("button", { name: "Xem cách cài" }));
    const sheet = screen.getByRole("dialog");
    expect(sheet).toHaveTextContent("Chia sẻ");
    expect(sheet).toHaveTextContent("Thêm vào Màn hình chính");
  });
});

describe("InstallAppPanel", () => {
  it("says Đã cài when standalone", () => {
    setStandalone();
    render(<InstallAppPanel />);
    expect(screen.getByText(/^Đã cài/)).toBeInTheDocument();
  });

  it("offers the browser's prompt, whatever the home bar did", () => {
    localStorage.setItem(INSTALL_HIDDEN_UNTIL_KEY, String(HIDDEN_FOR_GOOD - 1));
    fireInstallPrompt("dismissed");
    render(<InstallAppPanel />);
    expect(screen.getByRole("button", { name: "Cài app" })).toBeInTheDocument();
  });
});

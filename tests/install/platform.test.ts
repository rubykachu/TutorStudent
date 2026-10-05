import { describe, expect, it } from "vitest";
import {
  chromeIntentUrl,
  HIDDEN_FOR_GOOD,
  homeBarDue,
  homeOffersInstall,
  type InstallAction,
  type InstallFacts,
  installAction,
  snoozeUntil,
} from "@/install/platform";

const USER_AGENTS = {
  iphoneSafari:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  // iPadOS Safari in its default desktop mode: a Mac user agent.
  ipadDesktopSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  iosChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1",
  iosZalo:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Zalo iOS/536 ZaloTheme/light ZaloLanguage/vn",
  iosFacebook:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0.40.97;FBBV/600000000;FBDV/iPhone15,2;FBMD/iPhone;FBSN/iOS;FBSV/17.5;FBSS/3;FBLC/vi_VN]",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 14; SM-A546E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.71 Mobile Safari/537.36",
  androidZalo:
    "Mozilla/5.0 (Linux; Android 13; SM-A325F Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.71 Mobile Safari/537.36 Zalo android/12100700 ZaloTheme/light ZaloLanguage/vi",
  androidFacebook:
    "Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/AP2A.240605.024; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.71 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/470.0.0.43.108;]",
  desktopChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  desktopFirefox:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
} as const;

function facts(over: Partial<InstallFacts>): InstallFacts {
  return {
    userAgent: USER_AGENTS.desktopChrome,
    maxTouchPoints: 0,
    standalone: false,
    canPrompt: false,
    ...over,
  };
}

describe("installAction", () => {
  const cases: [string, Partial<InstallFacts>, InstallAction][] = [
    [
      "iPhone Safari",
      { userAgent: USER_AGENTS.iphoneSafari, maxTouchPoints: 5 },
      "ios-steps",
    ],
    [
      "iPad Safari in desktop mode",
      { userAgent: USER_AGENTS.ipadDesktopSafari, maxTouchPoints: 5 },
      "ios-steps",
    ],
    [
      "iOS Chrome (CriOS)",
      { userAgent: USER_AGENTS.iosChrome, maxTouchPoints: 5 },
      "open-safari",
    ],
    [
      "Zalo on iOS",
      { userAgent: USER_AGENTS.iosZalo, maxTouchPoints: 5 },
      "open-safari",
    ],
    [
      "Facebook in-app on iOS",
      { userAgent: USER_AGENTS.iosFacebook, maxTouchPoints: 5 },
      "open-safari",
    ],
    [
      "Android Chrome with a prompt",
      { userAgent: USER_AGENTS.androidChrome, canPrompt: true },
      "prompt",
    ],
    [
      "Android Chrome without a prompt",
      { userAgent: USER_AGENTS.androidChrome },
      "menu",
    ],
    [
      "Zalo on Android, even if a prompt fired",
      { userAgent: USER_AGENTS.androidZalo, canPrompt: true },
      "open-chrome",
    ],
    [
      "Facebook in-app on Android",
      { userAgent: USER_AGENTS.androidFacebook },
      "open-chrome",
    ],
    [
      "desktop Chrome with a prompt",
      { userAgent: USER_AGENTS.desktopChrome, canPrompt: true },
      "prompt",
    ],
    ["desktop Chrome without a prompt", {}, "menu"],
    ["desktop Firefox", { userAgent: USER_AGENTS.desktopFirefox }, "none"],
    // Same user agent as the iPad, but a Mac has no touch points.
    ["Mac Safari", { userAgent: USER_AGENTS.macSafari }, "none"],
    [
      "standalone iPhone",
      {
        userAgent: USER_AGENTS.iphoneSafari,
        maxTouchPoints: 5,
        standalone: true,
      },
      "installed",
    ],
    [
      "standalone Android",
      {
        userAgent: USER_AGENTS.androidChrome,
        standalone: true,
        canPrompt: true,
      },
      "installed",
    ],
  ];
  it.each(cases)("%s", (_, over, expected) => {
    expect(installAction(facts(over))).toBe(expected);
  });

  it("offers a button on home only where one can help", () => {
    expect(homeOffersInstall("prompt")).toBe(true);
    expect(homeOffersInstall("ios-steps")).toBe(true);
    expect(homeOffersInstall("open-safari")).toBe(true);
    expect(homeOffersInstall("open-chrome")).toBe(true);
    expect(homeOffersInstall("menu")).toBe(false);
    expect(homeOffersInstall("none")).toBe(false);
    expect(homeOffersInstall("installed")).toBe(false);
    expect(homeOffersInstall(null)).toBe(false);
  });
});

describe("homeBarDue", () => {
  const nowMs = Date.UTC(2026, 9, 5);
  it("shows when never snoozed and not yet offered this session", () => {
    expect(
      homeBarDue({ hiddenUntil: 0, offeredThisSession: false, nowMs }),
    ).toBe(true);
  });
  it("shows at most once per session", () => {
    expect(
      homeBarDue({ hiddenUntil: 0, offeredThisSession: true, nowMs }),
    ).toBe(false);
  });
  it("stays hidden for 7 days after Để sau", () => {
    const until = snoozeUntil(nowMs);
    const day = 24 * 60 * 60 * 1000;
    expect(until - nowMs).toBe(7 * day);
    for (const [at, due] of [
      [nowMs + 6 * day, false],
      [nowMs + 7 * day, true],
    ] as const) {
      expect(
        homeBarDue({
          hiddenUntil: until,
          offeredThisSession: false,
          nowMs: at,
        }),
      ).toBe(due);
    }
  });
  it("never shows once installed or when storage is blocked", () => {
    expect(
      homeBarDue({
        hiddenUntil: HIDDEN_FOR_GOOD,
        offeredThisSession: false,
        nowMs,
      }),
    ).toBe(false);
    expect(
      homeBarDue({ hiddenUntil: null, offeredThisSession: false, nowMs }),
    ).toBe(false);
  });
});

it("builds a Chrome intent link to the same page", () => {
  expect(chromeIntentUrl("https://owlyeah.vercel.app/unlock?next=%2F")).toBe(
    "intent://owlyeah.vercel.app/unlock?next=%2F#Intent;scheme=https;package=com.android.chrome;end",
  );
});

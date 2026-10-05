// What "install the app" means on the device in hand. Pure: the browser facts
// come in, one action comes out, so every platform is covered by unit tests.
// `src/install/browser.ts` reads the facts; the home bar and the parent page
// draw the action.

export type InstallAction =
  // Opened from the Home Screen or as an installed app: nothing to offer.
  | "installed"
  // The browser handed over its install prompt (`beforeinstallprompt`):
  // Chrome, Edge and Samsung Internet on Android and desktop.
  | "prompt"
  // Safari on iPhone or iPad: no install API; show the Share, "Thêm vào Màn
  // hình chính" steps.
  | "ios-steps"
  // A browser on iOS that cannot add to the Home Screen (an app's built-in
  // browser, Chrome, Firefox, the Google app): open the link in Safari.
  | "open-safari"
  // An app's built-in browser on Android: open the link in Chrome.
  | "open-chrome"
  // A browser that installs from its own menu but has not handed over a
  // prompt (it was dismissed, or the app is already installed there).
  // Offered on the parent page only.
  | "menu"
  // No install path (desktop Firefox, desktop Safari).
  | "none";

export type InstallFacts = {
  userAgent: string;
  // iPadOS Safari in its default desktop mode reports a Mac user agent; only
  // the touch points tell it apart.
  maxTouchPoints: number;
  // `display-mode: standalone` or iOS `navigator.standalone`.
  standalone: boolean;
  // A captured `beforeinstallprompt` is waiting to be used.
  canPrompt: boolean;
};

// Apps whose built-in browser cannot install a web app: Zalo, Facebook and
// Messenger (FBAN/FBAV/FB_IAB), Instagram, Line, TikTok (musical_ly,
// BytedanceWebview), and a bare Android WebView (`; wv)`).
const IN_APP =
  /Zalo|FBAN|FBAV|FB_IAB|FBIOS|Instagram|\bLine\/|musical_ly|TikTok|BytedanceWebview|; wv\)/i;

// iOS browsers other than Safari: all WebKit, none can add to the Home Screen
// on the iOS versions this app has to support.
const IOS_OTHER_BROWSER = /CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|YaBrowser|DuckDuckGo/;

const CHROMIUM = /Chrome\/|Chromium\/|CriOS|EdgA?\//;

export function isIos({ userAgent, maxTouchPoints }: InstallFacts): boolean {
  return (
    /iPhone|iPad|iPod/.test(userAgent) ||
    (/Macintosh/.test(userAgent) && maxTouchPoints > 1)
  );
}

export function installAction(facts: InstallFacts): InstallAction {
  const { userAgent: ua, standalone, canPrompt } = facts;
  if (standalone) return "installed";
  if (isIos(facts)) {
    // An app's web view drops the "Safari/" token.
    if (IN_APP.test(ua) || IOS_OTHER_BROWSER.test(ua) || !/Safari\//.test(ua))
      return "open-safari";
    return "ios-steps";
  }
  if (/Android/.test(ua) && IN_APP.test(ua)) return "open-chrome";
  if (canPrompt) return "prompt";
  // Firefox on Android installs from its menu; on desktop it cannot.
  if (/Android/.test(ua)) return "menu";
  if (CHROMIUM.test(ua) && !/Firefox\//.test(ua)) return "menu";
  return "none";
}

// The actions with a button (and the ones the home bar offers); "menu" and
// "none" are only a line of text on the parent page.
export type OfferedAction = Extract<
  InstallAction,
  "prompt" | "ios-steps" | "open-safari" | "open-chrome"
>;

export function homeOffersInstall(
  action: InstallAction | null,
): action is OfferedAction {
  return (
    action === "prompt" ||
    action === "ios-steps" ||
    action === "open-safari" ||
    action === "open-chrome"
  );
}

// "Để sau" hides the home bar this long.
export const INSTALL_SNOOZE_DAYS = 7;
// Home must have been on screen this long (after the first tap that lets the
// music start) before the bar slides in.
export const INSTALL_BAR_DELAY_MS = 4000;
// Stored instead of a time once the app is installed: hidden for good.
export const HIDDEN_FOR_GOOD = Number.MAX_SAFE_INTEGER;

export function snoozeUntil(nowMs: number): number {
  return nowMs + INSTALL_SNOOZE_DAYS * 24 * 60 * 60 * 1000;
}

// Whether the home bar may show now. `hiddenUntil` is the stored time, 0 when
// never snoozed, null when storage cannot be read (then it never shows, so a
// dismissal that cannot be remembered never nags); `offeredThisSession` is
// true once the bar has shown in this tab's session, or when that cannot be
// known.
export function homeBarDue({
  hiddenUntil,
  offeredThisSession,
  nowMs,
}: {
  hiddenUntil: number | null;
  offeredThisSession: boolean;
  nowMs: number;
}): boolean {
  return hiddenUntil !== null && !offeredThisSession && nowMs >= hiddenUntil;
}

// An Android `intent:` link that opens the same page in Chrome, out of an
// app's built-in browser.
export function chromeIntentUrl(href: string): string {
  const url = new URL(href);
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=${url.protocol.replace(":", "")};package=com.android.chrome;end`;
}

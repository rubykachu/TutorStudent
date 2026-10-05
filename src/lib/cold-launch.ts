// Whether the app was just opened: a new tab, a new browser session or a new
// launch of the installed app. Home then shows the profile picker first
// ("Hôm nay ai học?"), so the child's first tap is picking themselves, the
// tap that lets audio start on iOS.
//
// The mark lives in sessionStorage, which survives a reload and in-app
// navigation but starts empty in every new tab and every launch of the
// installed app. It is set when the child picks or creates a profile, and
// when the app is opened straight on another screen (a link into a lesson),
// so going back home from there does not stop on the picker.

const LAUNCHED_KEY = "tutor.launched";

// True until this tab's session is marked. Without sessionStorage (blocked
// storage) it is false: the picker is a welcome, never a wall.
export function isColdLaunch(): boolean {
  try {
    return sessionStorage.getItem(LAUNCHED_KEY) === null;
  } catch {
    return false;
  }
}

export function markLaunched(): void {
  try {
    sessionStorage.setItem(LAUNCHED_KEY, "1");
  } catch {
    // Blocked storage: `isColdLaunch` is already false.
  }
}

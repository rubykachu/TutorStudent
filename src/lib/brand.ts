// How the app presents itself outside its own screens: the browser tab, "Add
// to Home Screen" and a link pasted into a chat. `src/app/manifest.ts` and
// the root layout build the manifest, the icons and the share card from this
// one place; the family-code gate lets exactly `BRAND_PUBLIC_PATHS` through
// without the cookie; `scripts/brand-images.ts` draws the image files.

// What the child sees: the tab, the Home Screen label, the share card.
export const APP_NAME = "Owl Yeah";
// The label under the Home Screen icon (manifest `short_name`): the full name
// is 8 characters and fits under an iOS icon in one line, so it is not cut.
export const APP_SHORT_NAME = APP_NAME;
// A page that sets its own title gets the app's name after it.
export const TITLE_TEMPLATE = `%s | ${APP_NAME}`;
export const APP_DESCRIPTION = "Học từng bước cùng cú";

// Public address of the production app: the base of every absolute URL in
// the share card, and the origin `pnpm deploy:prod` smoke-checks.
export const SITE_URL = "https://owlyeah.vercel.app";

// Same values as the `--background` and `--primary` tokens in
// `src/app/globals.css` (a test compares them): the splash screen and the
// status bar match the app's page, so opening it from the Home Screen shows
// no coloured band; the owl stands out on the primary blue of the icons.
export const BACKGROUND_COLOR = "#f8fafc";
export const THEME_COLOR = "#f8fafc";
export const ICON_BACKGROUND_COLOR = "#2563eb";

export const MANIFEST_PATH = "/manifest.webmanifest";

// How much of an icon's height the owl fills. A maskable icon is cropped to
// any shape down to a circle of 80% of its width, so the owl has to stay
// inside it; the others only get the rounded square the OS applies.
export const OWL_SHARE_OF_ICON = { any: 0.72, maskable: 0.55 } as const;

export type AppIcon = {
  path: string;
  size: number;
  purpose: keyof typeof OWL_SHARE_OF_ICON;
};

export const APP_ICONS: readonly AppIcon[] = [
  { path: "/brand/icon-192.png", size: 192, purpose: "any" },
  { path: "/brand/icon-512.png", size: 512, purpose: "any" },
  { path: "/brand/icon-maskable-512.png", size: 512, purpose: "maskable" },
];

// iOS ignores the manifest's icons and takes this one (180px, no transparency).
export const APPLE_TOUCH_ICON: AppIcon = {
  path: "/brand/apple-touch-icon.png",
  size: 180,
  purpose: "any",
};

// The owl on a rounded square for browser tabs; `src/app/favicon.ico` holds
// the same drawing for the browsers that ask for `/favicon.ico`.
export const FAVICON_SVG_PATH = "/brand/favicon.svg";
export const FAVICON_ICO_SIZES = [16, 32, 48] as const;

// The card a chat app shows for a pasted link (Open Graph and Twitter use
// the same file): 1200×630, the owl and the app's name on the cosmos.
export const SHARE_IMAGE = {
  path: "/brand/share.png",
  width: 1200,
  height: 630,
  alt: `Bạn cú giữa bầu trời sao, cạnh chữ ${APP_NAME}: tự học lớp 6`,
} as const;
// The image as the metadata API takes it.
export const SHARE_IMAGE_TAG = {
  url: SHARE_IMAGE.path,
  width: SHARE_IMAGE.width,
  height: SHARE_IMAGE.height,
  alt: SHARE_IMAGE.alt,
} as const;
export const SHARE_TITLE = `${APP_NAME}: tự học lớp 6 cùng bạn cú`;
export const SHARE_DESCRIPTION =
  "Học bài cùng bạn cú: hình động dễ hiểu, bài tập vui và ôn lại đúng lúc để nhớ lâu.";

// Public, carry no family data and have to load before anyone has unlocked
// the app: a browser finds the manifest and icons, and a chat app's crawler
// (which has no cookie) the share image, only if none of them is a redirect.
export const BRAND_PUBLIC_PATHS: readonly string[] = [
  MANIFEST_PATH,
  ...APP_ICONS.map((icon) => icon.path),
  APPLE_TOUCH_ICON.path,
  FAVICON_SVG_PATH,
  SHARE_IMAGE.path,
];

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import {
  APP_ICONS,
  APP_NAME,
  APP_SHORT_NAME,
  APP_TAGLINE,
  APPLE_TOUCH_ICON,
  BACKGROUND_COLOR,
  BRAND_PUBLIC_PATHS,
  FAVICON_ICO_SIZES,
  FAVICON_SVG_PATH,
  ICON_BACKGROUND_COLOR,
  MANIFEST_PATH,
  SHARE_DESCRIPTION,
  SHARE_IMAGE,
  SHARE_IMAGE_TAG,
  SHARE_TITLE,
  SITE_URL,
  THEME_COLOR,
  TITLE_TEMPLATE,
} from "@/lib/brand";
import {
  faviconSvg,
  iconSvg,
  owlReach,
  packIco,
  readOwlSvg,
  SHARE_COLORS,
  shareImageHtml,
} from "../../scripts/lib/brand-art";
import { PROD_URL } from "../../scripts/lib/release-config";

const root = process.cwd();
const globals = readFileSync(path.join(root, "src/app/globals.css"), "utf8");

function token(name: string): string {
  const match = new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(globals);
  if (!match) throw new Error(`token --${name} not found in globals.css`);
  return match[1].toLowerCase();
}

// Width and height from a PNG's header.
function pngSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(path.join(root, "public", file));
  expect(bytes.subarray(1, 4).toString("ascii")).toBe("PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe("the web app manifest", () => {
  const m = manifest();

  it("opens the app on its own, from its root, in the app's language", () => {
    expect(m).toMatchObject({
      id: "/",
      start_url: "/",
      scope: "/",
      display: "standalone",
      lang: "vi",
      name: APP_NAME,
      short_name: APP_SHORT_NAME,
    });
  });

  it("is called Owl Yeah on the Home Screen and everywhere else", () => {
    expect(m.name).toBe("Owl Yeah");
    expect(m.short_name).toBe("Owl Yeah");
    // An iOS icon label holds about this many characters before it is cut.
    expect(APP_SHORT_NAME.length).toBeLessThanOrEqual(14);
    expect(TITLE_TEMPLATE).toBe("%s | Owl Yeah");
    expect(SHARE_TITLE).toBe("Owl Yeah: Học vui, nhớ lâu, giỏi mau");
    expect(SHARE_DESCRIPTION).toBe(
      "Mỗi ngày một chút, mỗi bước một vui. Bạn cú cùng bé, học đâu nhớ đó.",
    );
    expect(m.description).toBe(SHARE_DESCRIPTION);
    expect(SHARE_IMAGE_TAG.url).toBe("/brand/share.png?v=2");
    expect(SHARE_IMAGE.alt).toContain(APP_NAME);
    expect(JSON.stringify(m)).not.toContain("Tutor");
  });

  it("takes its colours from the design tokens", () => {
    expect(m.background_color).toBe(token("background"));
    expect(m.theme_color).toBe(token("background"));
    expect(BACKGROUND_COLOR).toBe(token("background"));
    expect(THEME_COLOR).toBe(token("background"));
    expect(ICON_BACKGROUND_COLOR).toBe(token("primary"));
  });

  it("lists a 192, a 512 and a maskable 512 icon that exist at their size", () => {
    expect(m.icons?.map((i) => [i.sizes, i.purpose])).toEqual([
      ["192x192", "any"],
      ["512x512", "any"],
      ["512x512", "maskable"],
    ]);
    for (const icon of APP_ICONS) {
      expect(pngSize(icon.path)).toEqual({
        width: icon.size,
        height: icon.size,
      });
    }
    expect(pngSize(APPLE_TOUCH_ICON.path)).toEqual({ width: 180, height: 180 });
  });

  it("names no service worker: the app registers it itself", () => {
    expect(JSON.stringify(m)).not.toMatch(/serviceworker|offline/i);
  });
});

describe("public brand paths", () => {
  it("are the manifest, every icon and the share image, and nothing else", () => {
    expect(BRAND_PUBLIC_PATHS).toEqual([
      MANIFEST_PATH,
      ...APP_ICONS.map((i) => i.path),
      APPLE_TOUCH_ICON.path,
      FAVICON_SVG_PATH,
      SHARE_IMAGE.path,
    ]);
    for (const p of BRAND_PUBLIC_PATHS) expect(p.startsWith("/")).toBe(true);
  });

  it("exist: every file is under public/ or is the manifest route", () => {
    for (const p of BRAND_PUBLIC_PATHS.filter((x) => x !== MANIFEST_PATH)) {
      expect(() => readFileSync(path.join(root, "public", p)), p).not.toThrow();
    }
  });
});

describe("the share image", () => {
  it("is 1200×630, the size every chat app shows in full", () => {
    expect(pngSize(SHARE_IMAGE.path)).toEqual({ width: 1200, height: 630 });
    expect([SHARE_IMAGE.width, SHARE_IMAGE.height]).toEqual([1200, 630]);
  });

  it("is drawn in colours of the design tokens", () => {
    const tokens: Record<keyof typeof SHARE_COLORS, string> = {
      night: "foreground",
      violet: "color-concept-violet",
      blue: "primary",
      pink: "color-concept-pink",
      amber: "color-concept-amber",
      teal: "color-concept-teal",
      beak: "color-mascot-beak",
      cream: "color-mascot-belly",
      sky: "color-reading",
      white: "card",
    };
    for (const [name, tokenName] of Object.entries(tokens)) {
      expect(SHARE_COLORS[name as keyof typeof SHARE_COLORS], name).toBe(
        token(tokenName),
      );
    }
  });

  it("names the app and says what it is, in Vietnamese", () => {
    const html = shareImageHtml(readOwlSvg(root), []);
    expect(html).toContain(`>${APP_NAME}<`);
    expect(html).toContain(APP_TAGLINE);
    expect(APP_TAGLINE).toBe("Học vui – nhớ lâu – giỏi mau");
  });
});

describe("one production address", () => {
  it("is the app's own constant, which the deploy smoke check reuses", () => {
    expect(PROD_URL).toBe(SITE_URL);
    expect(SITE_URL).toMatch(/^https:\/\/[^/]+$/);
  });
});

describe("the icon drawing", () => {
  const owl = readOwlSvg(root);

  it("uses only colours of the design tokens", () => {
    const allowed = new Set(
      [
        "color-mascot-body",
        "color-mascot-shade",
        "color-mascot-belly",
        "color-mascot-beak",
        "color-avatar-cheek",
        "foreground",
        "card",
      ].map(token),
    );
    const used = new Set(
      [...owl.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0].toLowerCase()),
    );
    expect([...used].filter((c) => !allowed.has(c))).toEqual([]);
  });

  it("keeps the owl of a maskable icon inside the circle every mask keeps", () => {
    const maskable = APP_ICONS.find((i) => i.purpose === "maskable");
    if (!maskable) throw new Error("no maskable icon");
    expect(owlReach(maskable)).toBeLessThanOrEqual(0.4);
    for (const icon of APP_ICONS) expect(owlReach(icon)).toBeLessThan(0.5);
  });

  it("paints the whole square, so no transparency shows black on iOS", () => {
    expect(iconSvg(APPLE_TOUCH_ICON, owl)).toContain(
      `<rect width="180" height="180" fill="${ICON_BACKGROUND_COLOR}"/>`,
    );
  });

  it("draws the tab icon as the same owl on a rounded square", () => {
    const svg = faviconSvg(owl);
    expect(svg).toContain(`fill="${ICON_BACKGROUND_COLOR}"`);
    expect(svg).toContain("rx=");
    expect(svg).toContain("#c08457");
  });
});

describe("the favicon.ico", () => {
  it("packs a PNG per size, and the committed file holds exactly those sizes", () => {
    const png = Buffer.from("png-bytes");
    const ico = packIco([
      { size: 16, png },
      { size: 32, png },
    ]);
    expect(ico.readUInt16LE(2)).toBe(1);
    expect(ico.readUInt16LE(4)).toBe(2);
    expect(ico.readUInt8(6)).toBe(16);
    expect(ico.readUInt8(22)).toBe(32);
    expect(ico.readUInt32LE(6 + 8)).toBe(png.length);
    expect(ico.readUInt32LE(6 + 12)).toBe(6 + 32);

    const file = readFileSync(path.join(root, "src/app/favicon.ico"));
    const count = file.readUInt16LE(4);
    const sizes = Array.from({ length: count }, (_, i) =>
      file.readUInt8(6 + 16 * i),
    );
    expect(sizes).toEqual([...FAVICON_ICO_SIZES]);
  });
});

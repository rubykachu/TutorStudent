import { readFileSync } from "node:fs";
import path from "node:path";
import {
  type AppIcon,
  ICON_BACKGROUND_COLOR,
  OWL_SHARE_OF_ICON,
  SHARE_IMAGE,
} from "../../src/lib/brand";

export const OWL_SVG_PATH = path.join("assets", "brand", "owl.svg");

// The owl's drawn extent inside its 120×120 box (see the comment in owl.svg).
const OWL_BOX = { x: 21, y: 15, width: 78, height: 91 };

export function readOwlSvg(root: string): string {
  return readFileSync(path.join(root, OWL_SVG_PATH), "utf8");
}

// The owl's drawing without its outer <svg> tag.
function owlBody(owlSvg: string): string {
  const match = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(owlSvg);
  if (!match) throw new Error("owl.svg has no <svg> element");
  return match[1];
}

// The owl's box centred on `(cx, cy)` with its drawn height `height`.
function placeOwl(
  owlSvg: string,
  cx: number,
  cy: number,
  height: number,
): string {
  const scale = height / OWL_BOX.height;
  const x = cx - (OWL_BOX.x + OWL_BOX.width / 2) * scale;
  const y = cy - (OWL_BOX.y + OWL_BOX.height / 2) * scale;
  return `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})">${owlBody(owlSvg)}</g>`;
}

// A square app icon: the owl, centred and sized for the icon's purpose, on
// the full-bleed brand colour (no transparency: iOS paints black behind it).
export function iconSvg(icon: AppIcon, owlSvg: string): string {
  const { size } = icon;
  const owl = placeOwl(
    owlSvg,
    size / 2,
    size / 2,
    OWL_SHARE_OF_ICON[icon.purpose] * size,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${ICON_BACKGROUND_COLOR}"/>${owl}</svg>`;
}

// The browser-tab icon: the owl on a rounded square, larger than in an app
// icon because a tab shows it at 16px.
const FAVICON_SIZE = 64;
const FAVICON_OWL_SHARE = 0.84;
const FAVICON_CORNER = 14;

export function faviconSvg(owlSvg: string): string {
  const owl = placeOwl(
    owlSvg,
    FAVICON_SIZE / 2,
    FAVICON_SIZE / 2,
    FAVICON_OWL_SHARE * FAVICON_SIZE,
  );
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FAVICON_SIZE} ${FAVICON_SIZE}"><title>Tutor</title><rect width="${FAVICON_SIZE}" height="${FAVICON_SIZE}" rx="${FAVICON_CORNER}" fill="${ICON_BACKGROUND_COLOR}"/>${owl}</svg>`;
}

// How far the owl's corner farthest from its centre sits from the icon's
// centre, as a share of the icon's width: a maskable icon keeps it inside the
// 40% radius of the circle every mask keeps.
export function owlReach(icon: AppIcon): number {
  const height = OWL_SHARE_OF_ICON[icon.purpose] * icon.size;
  const scale = height / OWL_BOX.height;
  return ((Math.hypot(OWL_BOX.width, OWL_BOX.height) / 2) * scale) / icon.size;
}

// An .ico file holding one PNG per size (PNG entries are valid since
// Windows Vista and every browser reads them).
export function packIco(images: { size: number; png: Buffer }[]): Buffer {
  const headerBytes = 6 + 16 * images.length;
  const header = Buffer.alloc(headerBytes);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = headerBytes;
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, entry); // width
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1); // height
    header.writeUInt8(0, entry + 2); // palette size
    header.writeUInt8(0, entry + 3); // reserved
    header.writeUInt16LE(1, entry + 4); // colour planes
    header.writeUInt16LE(32, entry + 6); // bits per pixel
    header.writeUInt32LE(png.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  });
  return Buffer.concat([header, ...images.map(({ png }) => png)]);
}

// Colours of the share image, from the design tokens in `src/app/globals.css`
// (`--foreground`, `--primary`, `--color-concept-*`, `--color-mascot-*`,
// `--color-reading`). A test checks each against the file.
export const SHARE_COLORS = {
  night: "#1e293b",
  violet: "#7c3aed",
  blue: "#2563eb",
  pink: "#db2777",
  amber: "#b45309",
  teal: "#0f766e",
  beak: "#f59e0b",
  cream: "#fdf0dc",
  sky: "#bae6fd",
  white: "#ffffff",
} as const;

// Star positions in the 1200×630 card: [x, y, radius].
const SHARE_STARS: readonly (readonly [number, number, number])[] = [
  [60, 60, 2.2],
  [170, 130, 1.4],
  [300, 48, 1.8],
  [420, 96, 1.2],
  [520, 36, 2],
  [610, 150, 1.4],
  [720, 70, 1.6],
  [820, 30, 1.2],
  [930, 120, 2],
  [1040, 40, 1.4],
  [1150, 170, 1.8],
  [90, 250, 1.4],
  [210, 340, 2],
  [330, 270, 1.2],
  [560, 300, 1.6],
  [690, 250, 1.2],
  [1100, 330, 1.4],
  [1160, 440, 2],
  [980, 560, 1.4],
  [880, 600, 1.8],
  [640, 580, 1.2],
  [520, 540, 1.6],
  [60, 440, 1.8],
  [150, 580, 1.2],
];

export type ShareFont = { family: string; weight: number; dataUrl: string };

// The share card as a page to screenshot at 1200×630: a night sky with
// nebula glows and stars, a ringed planet and a banded moon, the owl on a
// glow to the right, "Tutor" and the line under it to the left.
export function shareImageHtml(owlSvg: string, fonts: ShareFont[]): string {
  const c = SHARE_COLORS;
  const { width, height } = SHARE_IMAGE;
  const faces = fonts
    .map(
      (f) =>
        `@font-face{font-family:"${f.family}";font-weight:${f.weight};src:url(${f.dataUrl}) format("woff2")}`,
    )
    .join("");
  const stars = SHARE_STARS.map(
    ([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.white}" opacity="0.8"/>`,
  ).join("");
  const owl = placeOwl(owlSvg, 930, 365, 440);
  const art = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="position:absolute;inset:0">
<defs>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c.cream}" stop-opacity="0.34"/><stop offset="1" stop-color="${c.cream}" stop-opacity="0"/></radialGradient>
  <clipPath id="moon"><circle cx="110" cy="590" r="120"/></clipPath>
</defs>
<rect width="${width}" height="${height}" fill="${c.night}"/>
<ellipse cx="1100" cy="40" rx="620" ry="420" fill="${c.violet}" opacity="0.4"/>
<ellipse cx="60" cy="640" rx="560" ry="360" fill="${c.blue}" opacity="0.38"/>
${stars}
<g transform="translate(1110 62) rotate(-18)">
  <ellipse rx="160" ry="40" fill="none" stroke="${c.beak}" stroke-width="10" opacity="0.5"/>
  <circle r="72" fill="${c.amber}"/>
  <circle cx="-26" cy="-22" r="72" fill="${c.pink}" opacity="0.18"/>
  <path d="M-160 0 A160 40 0 0 0 160 0" fill="none" stroke="${c.beak}" stroke-width="10" opacity="0.9"/>
</g>
<g clip-path="url(#moon)">
  <circle cx="110" cy="590" r="120" fill="${c.teal}"/>
  <rect x="-20" y="520" width="260" height="22" fill="${c.sky}" opacity="0.28"/>
  <rect x="-20" y="568" width="260" height="30" fill="${c.sky}" opacity="0.2"/>
  <rect x="-20" y="620" width="260" height="22" fill="${c.sky}" opacity="0.28"/>
</g>
<circle cx="930" cy="365" r="290" fill="url(#glow)"/>
${owl}
</svg>`;
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>${faces}
html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${c.night}}
.title{position:absolute;left:84px;top:150px;margin:0;font:700 210px/1 "Baloo 2",sans-serif;color:${c.white};letter-spacing:-2px}
.line{position:absolute;left:90px;top:372px;margin:0;font:700 56px/1.2 "Baloo 2",sans-serif;color:${c.sky}}
.hint{position:absolute;left:90px;top:446px;margin:0;font:600 34px/1.3 "Baloo 2",sans-serif;color:${c.cream};opacity:.9}
</style></head><body>${art}
<h1 class="title">Tutor</h1>
<p class="line">Tự học lớp 6 cùng bạn cú</p>
<p class="hint">Hình động · Bài tập vui · Ôn lại đúng lúc</p>
</body></html>`;
}

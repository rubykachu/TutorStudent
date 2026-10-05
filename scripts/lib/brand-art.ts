import { readFileSync } from "node:fs";
import path from "node:path";
import {
  APP_NAME,
  APP_TAGLINE,
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

// The owl's box centred on `(cx, cy)` with its drawn height `height`,
// turned by `degrees` around that centre.
function placeOwl(
  owlSvg: string,
  cx: number,
  cy: number,
  height: number,
  degrees = 0,
): string {
  const scale = height / OWL_BOX.height;
  const x = -(OWL_BOX.x + OWL_BOX.width / 2);
  const y = -(OWL_BOX.y + OWL_BOX.height / 2);
  return `<g transform="translate(${cx} ${cy}) rotate(${degrees}) scale(${scale.toFixed(4)}) translate(${x} ${y})">${owlBody(owlSvg)}</g>`;
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
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FAVICON_SIZE} ${FAVICON_SIZE}"><title>${APP_NAME}</title><rect width="${FAVICON_SIZE}" height="${FAVICON_SIZE}" rx="${FAVICON_CORNER}" fill="${ICON_BACKGROUND_COLOR}"/>${owl}</svg>`;
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
  [170, 130, 1.5],
  [110, 300, 1.8],
  [220, 420, 2],
  [70, 520, 1.6],
  [200, 580, 1.4],
  [240, 40, 1.6],
  [1140, 70, 2],
  [1030, 150, 1.6],
  [1100, 300, 1.8],
  [990, 450, 2],
  [1150, 540, 1.6],
  [1050, 590, 1.4],
  [950, 40, 1.4],
  [260, 230, 1.3],
  [940, 260, 1.3],
];

// Sparks the owl leaves behind: [x, y, radius].
const SHARE_SPARKS: readonly (readonly [number, number, number])[] = [
  [430, 395, 5],
  [480, 365, 4],
  [520, 337, 3],
  [390, 435, 3.5],
];

export type ShareFont = { family: string; weight: number; dataUrl: string };

// A planet at `(x, y)` of radius `r`, tilted, with or without a ring.
function planet(x: number, y: number, r: number, fill: string, ring: boolean) {
  const c = SHARE_COLORS;
  const rx = r * 2.2;
  const ry = r * 0.55;
  const stroke = `fill="none" stroke="${c.beak}" stroke-width="${r * 0.14}"`;
  return `<g transform="translate(${x} ${y}) rotate(-18)">${ring ? `<ellipse rx="${rx}" ry="${ry}" ${stroke} opacity="0.5"/>` : ""}<circle r="${r}" fill="${fill}"/><circle cx="${-r * 0.35}" cy="${-r * 0.3}" r="${r}" fill="${c.pink}" opacity="0.16"/>${ring ? `<path d="M${-rx} 0 A${rx} ${ry} 0 0 0 ${rx} 0" ${stroke} opacity="0.9"/>` : ""}</g>`;
}

// A moon with two light bands, clipped to its disc.
function bandedMoon(x: number, y: number, r: number) {
  const c = SHARE_COLORS;
  const band = (top: number, h: number, opacity: number) =>
    `<rect x="${x - r}" y="${y + r * top}" width="${r * 2}" height="${r * h}" fill="${c.sky}" opacity="${opacity}"/>`;
  return `<clipPath id="moon"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath><g clip-path="url(#moon)"><circle cx="${x}" cy="${y}" r="${r}" fill="${c.teal}"/>${band(-0.3, 0.18, 0.28)}${band(0.15, 0.25, 0.2)}</g>`;
}

// The share card as a page to screenshot at 1200×630: a night sky with
// nebula glows and stars, planets and a moon, the owl flying through them
// with a trail of sparks, the app's name and its tagline under it. Chat apps
// crop the card to a square in the middle (x 285..915), so the name, the
// tagline and the owl all sit inside it.
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
  const sparks = SHARE_SPARKS.map(
    ([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${c.beak}" opacity="0.85"/>`,
  ).join("");
  const owl = placeOwl(owlSvg, 620, 195, 280, -14);
  const art = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="position:absolute;inset:0">
<defs>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c.cream}" stop-opacity="0.34"/><stop offset="1" stop-color="${c.cream}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${width}" height="${height}" fill="${c.night}"/>
<ellipse cx="1100" cy="40" rx="620" ry="420" fill="${c.violet}" opacity="0.4"/>
<ellipse cx="60" cy="640" rx="560" ry="360" fill="${c.blue}" opacity="0.38"/>
${stars}
${planet(1010, 150, 70, c.amber, true)}
${planet(190, 470, 46, c.violet, false)}
${bandedMoon(1040, 560, 70)}
<circle cx="600" cy="240" r="300" fill="url(#glow)"/>
<path d="M300 440 Q420 410 500 350" stroke="${c.sky}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.35" stroke-dasharray="2 22"/>
${sparks}
${owl}
</svg>`;
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><style>${faces}
html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${c.night}}
.text{position:absolute;left:0;width:${width}px;margin:0;text-align:center;font-family:"Baloo 2",sans-serif;font-weight:700;line-height:1}
.title{top:385px;font-size:124px;letter-spacing:-2px;color:${c.white}}
.line{top:530px;font-size:50px;font-weight:600;white-space:nowrap;color:${c.sky}}
</style></head><body>${art}
<h1 class="text title">${APP_NAME}</h1>
<p class="text line">${APP_TAGLINE}</p>
</body></html>`;
}

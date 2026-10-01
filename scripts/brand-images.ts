import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium, type Page } from "@playwright/test";
import {
  APP_ICONS,
  APPLE_TOUCH_ICON,
  FAVICON_ICO_SIZES,
  FAVICON_SVG_PATH,
  SHARE_IMAGE,
} from "../src/lib/brand";
import {
  faviconSvg,
  iconSvg,
  packIco,
  readOwlSvg,
  type ShareFont,
  shareImageHtml,
} from "./lib/brand-art";

// Usage: brand-images
// Draws every image of `src/lib/brand.ts` from `assets/brand/owl.svg`: the
// app icons, the browser-tab icon (`src/app/favicon.ico` and the SVG) and the
// share card, into `public/brand/` (committed: they are public files). Run it
// after changing the owl, the brand colour, the icon list or the card.
const root = process.cwd();
const owl = readOwlSvg(root);

function writePublic(urlPath: string, data: Buffer | string) {
  const file = path.join(root, "public", urlPath);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, data);
}

async function shoot(
  page: Page,
  html: string,
  width: number,
  height: number,
): Promise<Buffer> {
  await page.setViewportSize({ width, height });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  return page.screenshot({ type: "png" });
}

// The share card's font, Baloo 2 as on the app's headings, read from the
// package the app already depends on so the build needs no network.
function shareFonts(): ShareFont[] {
  const dir = path.join(root, "node_modules/@fontsource/baloo-2/files");
  return ["latin", "vietnamese"].flatMap((subset) =>
    [600, 700].map((weight) => {
      const file = path.join(dir, `baloo-2-${subset}-${weight}-normal.woff2`);
      return {
        family: "Baloo 2",
        weight,
        dataUrl: `data:font/woff2;base64,${readFileSync(file).toString("base64")}`,
      };
    }),
  );
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const body = (svg: string) => `<body style="margin:0">${svg}</body>`;

  for (const icon of [...APP_ICONS, APPLE_TOUCH_ICON]) {
    const png = await shoot(
      page,
      body(iconSvg(icon, owl)),
      icon.size,
      icon.size,
    );
    writePublic(icon.path, png);
    console.log(`${icon.path} ${icon.size}x${icon.size} ${icon.purpose}`);
  }

  const favicon = faviconSvg(owl);
  writePublic(FAVICON_SVG_PATH, favicon);
  const tabIcons = [];
  for (const size of FAVICON_ICO_SIZES) {
    const svg = favicon.replace(
      "<svg ",
      `<svg width="${size}" height="${size}" `,
    );
    // Transparent corners: the rounded square is the icon's shape.
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<body style="margin:0;background:transparent">${svg}</body>`,
    );
    tabIcons.push({
      size,
      png: await page.screenshot({ type: "png", omitBackground: true }),
    });
  }
  writeFileSync(path.join(root, "src/app/favicon.ico"), packIco(tabIcons));
  console.log(`${FAVICON_SVG_PATH} and src/app/favicon.ico`);

  const share = await shoot(
    page,
    shareImageHtml(owl, shareFonts()),
    SHARE_IMAGE.width,
    SHARE_IMAGE.height,
  );
  writePublic(SHARE_IMAGE.path, share);
  console.log(`${SHARE_IMAGE.path} ${SHARE_IMAGE.width}x${SHARE_IMAGE.height}`);
} finally {
  await browser.close();
}

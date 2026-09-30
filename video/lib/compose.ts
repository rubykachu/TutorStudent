import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Owl } from "@/mascot/owl";
import { COMPOSITION_DIR, GLOBALS_CSS, RENDER } from "../config";

// Builds the folder HyperFrames renders: the project's composition with its
// timing, the shared runtime and styles, and local copies of everything the
// page loads (GSAP, fonts, the owl), so a render never depends on the network
// and always matches the app's look.

const require = createRequire(import.meta.url);

// Colour tokens from the app's stylesheet, with var() references resolved,
// as CSS variables plus the fill/stroke utilities the owl markup uses.
function tokensCss(): string {
  const css = readFileSync(GLOBALS_CSS, "utf8");
  const raw = new Map<string, string>();
  for (const [, name, value] of css.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)) {
    if (name && value) raw.set(name, value.trim());
  }
  const resolve = (value: string, depth = 0): string => {
    const ref = value.match(/^var\(--([a-z0-9-]+)\)$/);
    return ref && depth < 10
      ? resolve(raw.get(ref[1] as string) ?? value, depth + 1)
      : value;
  };
  const colors = [...raw.keys()]
    .filter((name) => name.startsWith("color-"))
    .map(
      (name) =>
        [
          name.slice("color-".length),
          resolve(raw.get(name) as string),
        ] as const,
    )
    .filter(([, value]) => /^#[0-9a-f]{3,8}$/i.test(value));
  const vars = colors
    .map(([name, value]) => `  --color-${name}: ${value};`)
    .join("\n");
  const utilities = colors
    .map(
      ([name]) =>
        `.fill-${name} { fill: var(--color-${name}); }\n.stroke-${name} { stroke: var(--color-${name}); }`,
    )
    .join("\n");
  return `:root {\n${vars}\n}\n.fill-none { fill: none; }\n${utilities}\n`;
}

// The app's fonts, from their @fontsource packages: every subset of each
// weight, with `font-display: block` so no frame renders a fallback face.
const FONTS: Record<string, readonly number[]> = {
  "@fontsource/be-vietnam-pro": [500, 700, 800],
  "@fontsource/baloo-2": [600, 700, 800],
};

function copyFonts(site: string): string {
  const out = path.join(site, "fonts");
  mkdirSync(out, { recursive: true });
  let css = "";
  for (const [pkg, weights] of Object.entries(FONTS)) {
    const dir = path.dirname(require.resolve(`${pkg}/package.json`));
    for (const weight of weights) {
      css += readFileSync(path.join(dir, `${weight}.css`), "utf8")
        .replace(/font-display:\s*swap/g, "font-display: block")
        // woff2 only: the renderer's Chrome reads it, the woff fallback is noise.
        .replace(/,\s*url\([^)]*\.woff\) format\('woff'\)/g, "")
        .replace(/url\(\.\/files\//g, "url(./fonts/");
    }
    for (const file of readdirSync(path.join(dir, "files"))) {
      const weight = Number(file.match(/-(\d{3})-normal\.woff2$/)?.[1]);
      if (weights.includes(weight))
        copyFileSync(path.join(dir, "files", file), path.join(out, file));
    }
  }
  return css;
}

// The mascot as the app draws it, one still SVG per pose the videos use.
function owlScript(): string {
  const poses = ["idle", "happy", "cheer"] as const;
  const markup = Object.fromEntries(
    poses.map((expression) => [
      expression,
      renderToStaticMarkup(
        createElement(Owl, { expression, size: "preview" }),
      ).replace(/class="[^"]*shrink-0[^"]*"/, 'class="owl"'),
    ]),
  );
  return `window.OWL_SVG = ${JSON.stringify(markup)};\n`;
}

// Writes the render folder for one video and returns its path.
export function buildSite(
  projectDir: string,
  site: string,
  timing: { duration: number },
): string {
  rmSync(site, { recursive: true, force: true });
  mkdirSync(site, { recursive: true });
  const html = readFileSync(path.join(projectDir, "index.html"), "utf8");
  const withTiming = html
    .replace(
      /\/\*TIMING:BEGIN\*\/[\s\S]*?\/\*TIMING:END\*\//,
      `/*TIMING:BEGIN*/window.TIMING=${JSON.stringify(timing)};/*TIMING:END*/`,
    )
    .replace(
      /(<div id="root"[^>]*?data-duration=")[^"]*"/,
      `$1${timing.duration}"`,
    )
    // Inlined: HyperFrames' lint looks for the timeline registration in the
    // page itself.
    .replace(
      '<script src="runtime.js"></script>',
      () =>
        `<script>\n${readFileSync(path.join(COMPOSITION_DIR, "runtime.js"), "utf8")}</script>`,
    );
  if (withTiming === html)
    throw new Error(`${projectDir}/index.html has no TIMING block`);
  writeFileSync(path.join(site, "index.html"), withTiming);
  copyFileSync(
    path.join(COMPOSITION_DIR, "base.css"),
    path.join(site, "base.css"),
  );
  copyFileSync(
    require.resolve("gsap/dist/gsap.min.js"),
    path.join(site, "gsap.min.js"),
  );
  writeFileSync(
    path.join(site, "tokens.css"),
    `${tokensCss()}${copyFonts(site)}`,
  );
  writeFileSync(path.join(site, "owl.js"), owlScript());
  console.log(
    `video: composition at ${path.relative(process.cwd(), site)} (${RENDER.width}×${RENDER.height})`,
  );
  return site;
}

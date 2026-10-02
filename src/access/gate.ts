import { BRAND_PUBLIC_PATHS } from "@/lib/brand";
import { WORKER_PATH } from "@/offline/config";
import type { AccessConfig } from "./env";
import { verifySessionToken } from "./session";

export const UNLOCK_PATH = "/unlock";
export const SESSION_API_PATH = "/api/session";
export const NEXT_PARAM = "next";

// Files served without the cookie: the brand files above, and the service
// worker script, which carries no family data and has to load on every update
// check, which may run without the cookie.
export const PUBLIC_FILE_PATHS: readonly string[] = [
  ...BRAND_PUBLIC_PATHS,
  WORKER_PATH,
];

// What the proxy does with one request.
export type GateDecision =
  | { kind: "allow" }
  | { kind: "redirect"; to: string }
  // A file or an API call without a valid cookie: a status, not a page.
  | { kind: "deny" }
  // Production without a valid setup: nothing is served.
  | { kind: "unavailable"; reason: string };

// Where to go after unlocking: a path inside the app, never another site and
// never the unlock page or an API again.
export function safeNextPath(next: string | null | undefined): string {
  if (!next?.startsWith("/") || next.startsWith("//")) return "/";
  if (next.includes("\\")) return "/";
  const [path] = next.split(/[?#]/);
  if (path === UNLOCK_PATH || path.startsWith("/api/")) return "/";
  return next;
}

// A path whose last segment has an extension (`/content/x.json`) or an API
// path is fetched by code, which cannot follow a redirect to a page.
function isFetchedByCode(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return true;
  const last = pathname.slice(pathname.lastIndexOf("/") + 1);
  return last.includes(".");
}

export async function decideAccess(
  request: { pathname: string; search: string; token: string | undefined },
  config: AccessConfig,
  nowMs: number = Date.now(),
): Promise<GateDecision> {
  const { pathname, search, token } = request;
  if (config.mode === "closed") {
    return { kind: "unavailable", reason: config.reason };
  }
  if (pathname === SESSION_API_PATH) return { kind: "allow" };
  // The manifest, icons and share image are fetched before the app is open (by
  // a browser, or by a chat app's crawler with no cookie) and say nothing about
  // a family.
  if (PUBLIC_FILE_PATHS.includes(pathname)) return { kind: "allow" };

  const unlocked =
    config.mode === "open" ||
    (await verifySessionToken(config.secret, config.codes, token, nowMs));

  if (pathname === UNLOCK_PATH) {
    if (!unlocked) return { kind: "allow" };
    const next = new URLSearchParams(search).get(NEXT_PARAM);
    return { kind: "redirect", to: safeNextPath(next) };
  }
  if (unlocked) return { kind: "allow" };
  if (isFetchedByCode(pathname)) return { kind: "deny" };
  const back = new URLSearchParams({ [NEXT_PARAM]: `${pathname}${search}` });
  return { kind: "redirect", to: `${UNLOCK_PATH}?${back}` };
}

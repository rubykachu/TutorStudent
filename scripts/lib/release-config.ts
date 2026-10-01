// The one place that names the production targets used by `pnpm media:upload`
// and `pnpm deploy:prod`. Secret values never live here: the family code and
// the media base URL are read from ENV_FILE at run time.

// Cloudflare R2 bucket holding the lesson videos, subtitles and narration.
export const R2_BUCKET = "tutor-media";
// Vercel project (account `rubykachu`) that serves the app.
export const VERCEL_PROJECT = "tutor";
// Public address of the production app; origin of the smoke checks.
export const PROD_URL = "https://nhaky.vercel.app";
// Untracked file with FAMILY_CODES, SESSION_SECRET, NEXT_PUBLIC_MEDIA_BASE_URL.
export const ENV_FILE = ".env.production.local";

// Local media tree; its sub-paths are the object keys in the bucket.
export const MEDIA_ROOT = "public/media";
// Folders under each media kind that are named after a lesson.
export const MEDIA_KINDS = ["video", "narration"] as const;
// Media folders that belong to the test fixture lesson, never shipped.
export const MEDIA_EXCLUDED_LESSONS: readonly string[] = ["fixture"];
export const MEDIA_CACHE_CONTROL = "public,max-age=3600";

// Content-Type per extension. Safari refuses subtitles served as text/plain,
// so every extension that can appear under MEDIA_ROOT is listed explicitly.
export const MEDIA_CONTENT_TYPES: Readonly<Record<string, string>> = {
  ".mp4": "video/mp4",
  ".vtt": "text/vtt",
  ".jpg": "image/jpeg",
  ".m4a": "audio/mp4",
};

// Commands run through npx so no global install is needed.
export const WRANGLER = ["npx", "wrangler"] as const;
export const VERCEL = ["npx", "vercel"] as const;

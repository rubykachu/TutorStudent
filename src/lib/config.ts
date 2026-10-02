export const TIMEZONE = "Asia/Ho_Chi_Minh";

export const FSRS_REQUEST_RETENTION = 0.9;
// Reviews happen on demand, not within minutes, so FSRS learning steps are off.
export const FSRS_ENABLE_SHORT_TERM = false;

export const REVIEW_SESSION_SIZE = 10;
// Review avoids exercises the child answered within this many minutes (for
// example the section practice just finished) whenever the card has another.
export const REVIEW_RECENT_MINUTES = 30;
// A card whose predicted recall drops below this counts as "about to be forgotten".
export const FORGETTING_THRESHOLD = 0.7;

// When false, a lesson publishes as soon as the automated review passes.
export const REQUIRE_OWNER_APPROVAL = false;

// The fixture lesson is served only in dev/E2E runs that opt in explicitly.
export const CONTENT_INCLUDE_FIXTURE: boolean =
  process.env.CONTENT_INCLUDE_FIXTURE === "1";

// Draft lessons are served too, so an author can walk a lesson in `pnpm dev`
// before its review. Never in a production build (the build script emits
// content with NODE_ENV=production), so a draft cannot ship.
export const CONTENT_INCLUDE_DRAFT: boolean =
  process.env.CONTENT_INCLUDE_DRAFT === "1" &&
  process.env.NODE_ENV !== "production";

// How long an explainer animation shows each step before auto-advancing.
export const VISUAL_STEP_MS = 1800;

// Progress stays on the device until family sync exists; every local record
// still carries a family id so it can later be claimed by a real family.
export const LOCAL_FAMILY_ID = "local";

// Home nudges a subject once more than this many Vietnam days have passed
// since the child last studied it.
export const SUBJECT_NUDGE_AFTER_DAYS = 3;

// The grade a profile starts on, and the one a profile saved before grades
// existed is moved to.
export const DEFAULT_GRADE = 6;

// Grades a child can see and pick, ascending, and the only ones any screen
// lists; routes of the others stay. Must include DEFAULT_GRADE. A profile with
// no grade, or one of a hidden grade, studies DEFAULT_GRADE, and with a single
// visible grade no screen asks which grade the child is in. To show a grade,
// add it here.
export const VISIBLE_GRADES: readonly number[] = [6];

// Longest child name the profile form accepts, so it fits the home greeting.
export const PROFILE_NAME_MAX_LENGTH = 20;

// Missed days per Monday–Sunday week that keep the study streak alive.
export const STREAK_REST_DAYS_PER_WEEK = 1;

// The home owl says "good to see you again" once the child comes back after
// at least this many Vietnam days without studying.
export const MASCOT_WELCOME_AFTER_DAYS = 3;

// Parent page PIN: digits only, entered on the device that holds the progress.
export const PARENT_PIN_MIN_LENGTH = 4;
export const PARENT_PIN_MAX_LENGTH = 6;
// Wrong PINs in a row that lock the parent page, and for how long.
export const PARENT_PIN_MAX_FAILS = 5;
export const PARENT_PIN_LOCK_MINUTES = 15;
// PBKDF2-SHA256 rounds for the stored PIN hash. A short PIN can never resist
// an offline search, so this only keeps it from being read off the device;
// it is sized to stay well under a second on an older iPad in plain JS.
export const PARENT_PIN_HASH_ITERATIONS = 20_000;
// How long one correct PIN keeps the parent page open (in memory only).
export const PARENT_SESSION_MINUTES = 30;

// Estimated study time, from answer timestamps: the gap to the previous
// answer counts when it is at most this long (a longer gap is a break)...
export const STUDY_GAP_MAX_MINUTES = 5;
// ...and every answer counts for at least this many seconds, so the first
// answer after a break (whose own time is unknown) is not worth nothing.
export const STUDY_ATTEMPT_FLOOR_SECONDS = 30;
// Days shown in the parent page's daily study time chart, ending today.
export const PARENT_RECENT_DAYS = 7;
// "Câu hay sai" looks at answers from this many recent days.
export const PARENT_WRONG_WINDOW_DAYS = 14;
// Rows in the parent page's "Thẻ hay quên" and "Câu hay sai" lists.
export const PARENT_TOP_COUNT = 5;

// A section stays a few minutes long for a child who tires quickly: at most
// this many explanation screens (entries of `blocks`, a group counts as one)
// and this many exercises (checks and practice together), before its recap.
// `content:check` reports a section over either limit.
export const MAX_SECTION_SCREENS = 4;
export const MAX_SECTION_EXERCISES = 4;
// A lesson video retells a section's idea and the child may skip it with
// "Tiếp", so it is not counted as an explanation screen; a section holds at
// most this many video blocks.
export const MAX_SECTION_VIDEOS = 1;

// Lesson videos (and other media files) are paths under this base URL. Until
// the media bucket goes live they are served from public/media; switching to
// the bucket means setting NEXT_PUBLIC_MEDIA_BASE_URL to its public URL.
export const MEDIA_BASE_URL: string = (
  process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "/media"
).replace(/\/+$/, "");

// Family-code gate (`src/access/`, `src/proxy.ts`). The cookie that proves a
// device entered a valid code, and how long it stays valid.
export const ACCESS_COOKIE_NAME = "tutor_family";
// A family id: the name before the colon in a `FAMILY_CODES` entry; it names
// the family's folder in the progress store.
export const FAMILY_ID_PATTERN = /^[a-z0-9-]{3,32}$/;
export const ACCESS_SESSION_DAYS = 365;
// A code is compared after `normalizeCode`; shorter ones are refused when the
// environment is read, because a short code can be guessed.
export const ACCESS_MIN_CODE_LENGTH = 10;
export const ACCESS_MIN_SECRET_LENGTH = 32;
// Wrong codes in a row from one address that lock it out, and for how long.
// Counted in the memory of one server instance, so it slows guessing down;
// the length of the code is what makes guessing hopeless.
export const ACCESS_MAX_FAILS = 5;
export const ACCESS_LOCK_MINUTES = 10;

// Progress sync (`src/sync/`, `src/app/api/sync/`). A synced doc may be at
// most this many bytes (family profile doc and a child's main doc), and the
// history doc of one month at most the second figure. The parent page warns
// once a doc reaches the ratio of its cap. Nothing is ever trimmed to fit.
export const SYNC_DOC_MAX_BYTES = 1_000_000;
export const SYNC_HISTORY_MAX_BYTES = 512_000;
export const SYNC_DOC_WARN_RATIO = 0.7;
// Children one family may hold; it also bounds how many child docs a family
// code can create.
export const SYNC_MAX_PROFILES = 12;
// Longest writing a doc may carry, and the most records of one kind in a doc.
export const SYNC_WRITING_MAX_CHARS = 5_000;
export const SYNC_MAX_DOC_RECORDS = 10_000;
// Longest name a synced profile may carry. Looser than the form's
// PROFILE_NAME_MAX_LENGTH so lowering the form limit later never makes a
// stored profile invalid.
export const SYNC_PROFILE_NAME_MAX_CHARS = 40;
// How often an open app syncs, how many conflicting rounds one doc is retried
// in a single sync, and how far into the future (server clock) a stored time
// may lie before the server clamps it.
export const SYNC_INTERVAL_MINUTES = 5;
export const SYNC_MAX_RETRIES = 3;
export const SYNC_FUTURE_SKEW_MINUTES = 10;

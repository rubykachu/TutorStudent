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

// Longest child name the profile form accepts, so it fits the home greeting.
export const PROFILE_NAME_MAX_LENGTH = 20;

// Missed days per Monday–Sunday week that keep the study streak alive.
export const STREAK_REST_DAYS_PER_WEEK = 1;

// The home owl says "good to see you again" once the child comes back after
// at least this many Vietnam days without studying.
export const MASCOT_WELCOME_AFTER_DAYS = 3;

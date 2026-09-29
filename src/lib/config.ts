export const TIMEZONE = "Asia/Ho_Chi_Minh";

export const FSRS_REQUEST_RETENTION = 0.9;
// Reviews happen on demand, not within minutes, so FSRS learning steps are off.
export const FSRS_ENABLE_SHORT_TERM = false;

export const REVIEW_SESSION_SIZE = 10;
// A card whose predicted recall drops below this counts as "about to be forgotten".
export const FORGETTING_THRESHOLD = 0.7;

// When false, a lesson publishes as soon as the automated review passes.
export const REQUIRE_OWNER_APPROVAL = false;

// The fixture lesson is served only in dev/E2E runs that opt in explicitly.
export const CONTENT_INCLUDE_FIXTURE: boolean =
  process.env.CONTENT_INCLUDE_FIXTURE === "1";

// How long an explainer animation shows each step before auto-advancing.
export const VISUAL_STEP_MS = 1800;

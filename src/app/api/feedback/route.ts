import { after, type NextRequest } from "next/server";
import { FEEDBACK_REPO } from "@/lib/config";
import { openSyncStore, readSyncStoreConfig } from "@/sync/store/config";
import { syncEnvPrefix } from "@/sync/store/keys";
import { createGithubIssues } from "@/user-feedback/github";
import { appVersion } from "@/user-feedback/identity";
import { createFeedbackService } from "@/user-feedback/server";

// In-app feedback: one report per request. The checks, storage and the
// forwarding to GitHub live in `src/user-feedback/`; this file only wires
// them to the environment.

// Forwarding runs in `after()`, which the platform keeps alive for at most
// this many seconds; a pass stops starting new reports well before it.
export const maxDuration = 60;

let service: ReturnType<typeof createFeedbackService> | null = null;

function feedbackService() {
  if (service === null) {
    const config = readSyncStoreConfig();
    const token = (process.env.GITHUB_FEEDBACK_TOKEN ?? "").trim();
    service = createFeedbackService({
      store: openSyncStore(config),
      prefix: syncEnvPrefix(),
      app: appVersion(),
      github:
        token === ""
          ? null
          : createGithubIssues({ token, repo: FEEDBACK_REPO }),
      after,
    });
  }
  return service;
}

export async function POST(request: NextRequest) {
  return feedbackService().post(request);
}

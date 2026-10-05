import { appDb } from "@/progress/hooks";
import { addToOutbox, flushOutbox } from "./outbox";
import type { FeedbackRequest } from "./schema";

// Sends one report from the app: it is in the device outbox when this
// resolves (the moment the thank-you shows); the network part runs after,
// never awaited by the screen.
export async function sendFeedback(
  report: FeedbackRequest,
  db = appDb(),
): Promise<void> {
  await addToOutbox(db, report);
  void flushOutbox(db);
}

import { CosmosBackground } from "@/components/cosmos-background";
import { BackgroundMusicRunner } from "@/music/background-music-runner";
import { OfflineManager } from "@/offline/register";
import { SyncRunner } from "@/sync/runner";
import { FeedbackOutboxRunner } from "@/user-feedback/outbox-runner";

// Every screen of the child (home, subjects, lessons, players, profiles) sits
// on the same faint cosmic backdrop. The parent page is outside this group
// and keeps a plain background. The sync runner is mounted here and on the
// parent page, so every screen keeps the device in step with the cloud; the offline
// manager (service worker registration and update banner) sits beside it,
// and so does the background music runner, so the parent page has no music.
// The feedback outbox runner sends the reports left on the device.
export default function ChildLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <CosmosBackground />
      <SyncRunner />
      <FeedbackOutboxRunner />
      <OfflineManager />
      <BackgroundMusicRunner />
      {children}
    </>
  );
}

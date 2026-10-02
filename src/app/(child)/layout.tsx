import { CosmosBackground } from "@/components/cosmos-background";
import { OfflineManager } from "@/offline/register";
import { SyncRunner } from "@/sync/runner";

// Every screen of the child (home, subjects, lessons, players, profiles) sits
// on the same faint cosmic backdrop. The parent page is outside this group
// and keeps a plain background. The sync runner is mounted here and on the
// parent page, so every screen keeps the device in step with the cloud; the offline
// manager (service worker registration and update banner) sits beside it.
export default function ChildLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <CosmosBackground />
      <SyncRunner />
      <OfflineManager />
      {children}
    </>
  );
}

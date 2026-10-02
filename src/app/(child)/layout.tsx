import { CosmosBackground } from "@/components/cosmos-background";
import { SyncRunner } from "@/sync/runner";

// Every screen of the child (home, subjects, lessons, players, profiles) sits
// on the same faint cosmic backdrop. The parent page is outside this group
// and keeps a plain background. The sync runner is mounted here and on the
// parent page, so every screen keeps the device in step with the cloud.
export default function ChildLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <CosmosBackground />
      <SyncRunner />
      {children}
    </>
  );
}

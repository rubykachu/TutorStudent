import type { Metadata } from "next";
import { CosmosBackground } from "@/components/cosmos-background";
import { OfflineScreen } from "./offline-screen";

export const metadata: Metadata = { title: "Cần mạng" };

// What the service worker shows, offline, for a page it has not stored (a
// lesson added after this build, a mistyped address): the URL stays the one
// asked for, this page answers it. It is precached like every page.
export default function OfflinePage() {
  return (
    <>
      <CosmosBackground />
      <OfflineScreen />
    </>
  );
}

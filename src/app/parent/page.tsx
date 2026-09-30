import { ParentScreen } from "@/components/parent/parent-screen";

// The PIN and progress live in this browser (IndexedDB), so the whole page
// renders on the client.
export default function ParentPage() {
  return <ParentScreen />;
}

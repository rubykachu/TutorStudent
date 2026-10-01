import { CosmosBackground } from "@/components/cosmos-background";

// Every screen of the child (home, subjects, lessons, players, profiles) sits
// on the same faint cosmic backdrop. The parent page is outside this group
// and keeps a plain background.
export default function ChildLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <CosmosBackground />
      {children}
    </>
  );
}

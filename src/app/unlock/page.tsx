import type { Metadata } from "next";
import { NEXT_PARAM, safeNextPath } from "@/access/gate";
import { CosmosBackground } from "@/components/cosmos-background";
import { UnlockScreen } from "./unlock-screen";

export const metadata: Metadata = { title: "Mở ứng dụng" };

// Where a device enters the family code once; the cookie it earns lets the
// proxy serve the rest of the app.
export default async function UnlockPage({
  searchParams,
}: PageProps<"/unlock">) {
  const params = await searchParams;
  const next = params[NEXT_PARAM];
  return (
    <>
      <CosmosBackground />
      <UnlockScreen
        next={safeNextPath(typeof next === "string" ? next : null)}
      />
    </>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import { BigButton } from "@/components/big-button";
import { HOME_PATH } from "@/lib/routes";
import { Owl } from "@/mascot/owl";

// How long "Quay lại" waits for the previous screen before it goes home
// instead (no earlier screen in this tab, or one the browser cannot show).
const BACK_WAIT_MS = 1000;

function goBack(): void {
  const home = () => window.location.assign(HOME_PATH);
  if (window.history.length <= 1) {
    home();
    return;
  }
  const timer = window.setTimeout(home, BACK_WAIT_MS);
  const cancel = () => window.clearTimeout(timer);
  // A new document (`pagehide`) or the app's own router (`popstate`) took
  // over: the way back worked.
  window.addEventListener("pagehide", cancel, { once: true });
  window.addEventListener("popstate", cancel, { once: true });
  window.history.back();
}

export function OfflineScreen() {
  return (
    <main
      data-offline-page
      className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center gap-8 px-gutter py-6 md:px-gutter-lg md:py-10"
    >
      <div className="flex items-center gap-4">
        <Owl expression="hint" size="home" />
        <h1 className="text-title font-bold md:text-title-lg">
          Cần mạng để mở trang này
        </h1>
      </div>
      <p className="max-w-xl text-body md:text-body-lg">
        Máy đang không có mạng. Bạn quay lại học bài khác, khi có mạng thì mở
        lại trang này nhé.
      </p>
      <BigButton onClick={goBack} className="max-w-xl">
        <ArrowLeft aria-hidden className="size-6" />
        Quay lại
      </BigButton>
    </main>
  );
}

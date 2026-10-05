"use client";

import {
  Check,
  Copy,
  Download,
  Ellipsis,
  ExternalLink,
  Share,
  SquarePlus,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { Sheet } from "@/components/sheet";
import { copyCurrentLink, promptInstall } from "@/install/browser";
import { chromeIntentUrl, type OfferedAction } from "@/install/platform";
import { APP_NAME } from "@/lib/brand";

// The "install the app" action for the device in hand, shared by the home
// bar and the parent page: one button, and for the platforms with no install
// API a sheet with the steps.

// Rounded pill buttons of the install bar and panel: 48px tall.
export const INSTALL_BUTTON =
  "inline-flex min-h-touch items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 text-body font-semibold select-none md:px-5 transition-transform duration-100 ease-out active:scale-[0.97] motion-reduce:transition-none";
export const INSTALL_PRIMARY = `${INSTALL_BUTTON} bg-primary text-primary-foreground shadow-card`;
export const INSTALL_SECONDARY = `${INSTALL_BUTTON} border-2 border-border bg-surface text-foreground`;

const BUTTON_LABEL: Record<OfferedAction, string> = {
  prompt: "Cài app",
  "ios-steps": "Xem cách cài",
  "open-safari": "Mở bằng Safari",
  "open-chrome": "Mở bằng Chrome",
};

function Step({
  n,
  icon,
  children,
}: {
  n: number;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-3" data-install-step={n}>
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted font-semibold"
      >
        {n}
      </span>
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-lg border-2 border-border bg-surface text-primary"
      >
        {icon}
      </span>
      <span className="min-w-0">{children}</span>
    </li>
  );
}

function IosSteps() {
  return (
    <>
      <ol className="flex flex-col gap-4">
        <Step n={1} icon={<Share className="size-7" />}>
          Chạm nút <strong>Chia sẻ</strong> của Safari.
        </Step>
        <Step n={2} icon={<SquarePlus className="size-7" />}>
          Chọn <strong>Thêm vào Màn hình chính</strong>, rồi{" "}
          <strong>Thêm</strong>.
        </Step>
      </ol>
      <p className="flex items-center gap-2 text-caption text-muted-foreground">
        <Ellipsis aria-hidden className="size-5 shrink-0" />
        Không thấy nút Chia sẻ thì chạm nút ba chấm trước.
      </p>
      <p className="text-caption text-muted-foreground">
        Sau đó mở {APP_NAME} từ màn hình chính và nhập mã gia đình một lần.
      </p>
    </>
  );
}

function CopyLink() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <>
      <button
        type="button"
        data-install-copy
        className={INSTALL_SECONDARY}
        onClick={async () =>
          setState((await copyCurrentLink()) ? "copied" : "failed")
        }
      >
        {state === "copied" ? (
          <Check aria-hidden className="size-5" />
        ) : (
          <Copy aria-hidden className="size-5" />
        )}
        {state === "copied" ? "Đã chép link" : "Chép link"}
      </button>
      {state === "failed" && (
        // The browser refused the clipboard: the address to copy by hand.
        <input
          readOnly
          aria-label="Link của app"
          value={window.location.href}
          onFocus={(event) => event.currentTarget.select()}
          className="min-h-touch w-full rounded-lg border-2 border-border bg-surface px-3 text-caption"
        />
      )}
    </>
  );
}

function OpenInBrowser({ browser }: { browser: "Safari" | "Chrome" }) {
  return (
    <>
      <p>
        Trình duyệt trong app này không cài được. Mở link bằng{" "}
        <strong>{browser}</strong> rồi cài từ đó.
      </p>
      {browser === "Chrome" && (
        <a
          href={chromeIntentUrl(window.location.href)}
          className={INSTALL_PRIMARY}
        >
          <ExternalLink aria-hidden className="size-5" />
          Mở bằng Chrome
        </a>
      )}
      <CopyLink />
      <p className="flex items-center gap-2 text-caption text-muted-foreground">
        <Ellipsis aria-hidden className="size-5 shrink-0" />
        Hoặc chạm nút ba chấm ở góc trên, chọn mở bằng trình duyệt.
      </p>
    </>
  );
}

const SHEET_TITLE: Record<Exclude<OfferedAction, "prompt">, string> = {
  "ios-steps": `Cài ${APP_NAME} lên máy`,
  "open-safari": "Mở bằng Safari",
  "open-chrome": "Mở bằng Chrome",
};

// The action's button. `onDone` runs once the browser's install dialog was
// accepted.
export function InstallButton({
  action,
  onDone,
}: {
  action: OfferedAction;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = action === "prompt" || action === "ios-steps" ? Download : Share;
  return (
    <>
      <button
        type="button"
        data-install-action={action}
        className={INSTALL_PRIMARY}
        onClick={() => {
          if (action !== "prompt") {
            setOpen(true);
            return;
          }
          // Inside the tap: the browser shows its dialog only from a gesture.
          void promptInstall().then((accepted) => {
            if (accepted) onDone?.();
          });
        }}
      >
        <Icon aria-hidden className="size-5" />
        {BUTTON_LABEL[action]}
      </button>
      {open && action !== "prompt" && (
        <Sheet label={SHEET_TITLE[action]} onClose={() => setOpen(false)}>
          <div className="flex flex-col gap-4" data-install-sheet={action}>
            <h2 className="pr-12 font-heading text-block font-bold md:text-block-lg">
              {SHEET_TITLE[action]}
            </h2>
            {action === "ios-steps" && <IosSteps />}
            {action === "open-safari" && <OpenInBrowser browser="Safari" />}
            {action === "open-chrome" && <OpenInBrowser browser="Chrome" />}
          </div>
        </Sheet>
      )}
    </>
  );
}

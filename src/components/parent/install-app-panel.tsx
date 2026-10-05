"use client";

import { InstallButton } from "@/components/install-app";
import { useInstallAction } from "@/install/browser";
import { homeOffersInstall, type InstallAction } from "@/install/platform";
import { Panel } from "./panel";

const TITLE = "Cài app lên máy";

// The line for the actions that have no button.
const STATUS: Partial<Record<InstallAction, string>> = {
  installed: "Đã cài: máy này đang mở app từ màn hình chính.",
  menu: "Mở menu của trình duyệt, chọn Cài đặt ứng dụng hoặc Thêm vào màn hình chính.",
  none: "Trình duyệt này không cài được app. Hãy mở bằng Safari trên iPad, iPhone, hoặc Chrome trên Android, máy tính.",
};

// The parent page's way to install the app on this device, whatever the home
// bar did (shown, snoozed or never offered): the right action for this
// browser, or "Đã cài".
export function InstallAppPanel() {
  const action = useInstallAction();
  if (action === null) return null;
  return (
    <Panel
      title={TITLE}
      note="Cài lên máy thì con mở app từ màn hình chính, học được cả khi không có mạng."
      label={TITLE}
    >
      {homeOffersInstall(action) ? (
        <div className="flex flex-col md:flex-row">
          <InstallButton action={action} />
        </div>
      ) : (
        <p className="font-semibold" data-install-status={action}>
          {STATUS[action]}
        </p>
      )}
    </Panel>
  );
}

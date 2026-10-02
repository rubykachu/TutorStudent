"use client";

import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { Sheet } from "@/components/sheet";
import { appDb } from "@/progress/hooks";
import { clearLocalFamilyData } from "@/sync/family-switch";
import { syncNow } from "@/sync/request";

type FamilySwitchDialogProps = {
  onClose: () => void;
};

// Two steps before this device is made blank for another family: first what
// is lost, then a plain yes. Closing at any point deletes nothing. Once
// cleared, the new family's docs are pulled.
export function FamilySwitchDialog({ onClose }: FamilySwitchDialogProps) {
  const [step, setStep] = useState<"explain" | "confirm">("explain");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSwitch() {
    setBusy(true);
    setFailed(false);
    try {
      await clearLocalFamilyData(appDb());
    } catch {
      setFailed(true);
      setBusy(false);
      return;
    }
    void syncNow({ full: true });
    onClose();
  }

  return (
    <Sheet label="Dùng máy này cho gia đình mới" onClose={onClose}>
      {step === "explain" ? (
        <>
          <h2 className="pr-12 font-heading text-block font-bold">
            Dùng máy này cho gia đình mới?
          </h2>
          <p>
            Máy sẽ xoá các hồ sơ con và toàn bộ tiến độ đang lưu trên máy, rồi
            tải tiến độ của gia đình mới về. Tiến độ của gia đình cũ vẫn còn
            trên kho lưu trữ của họ.
          </p>
          <p className="font-semibold">
            Mã PIN của trang phụ huynh vẫn được giữ.
          </p>
          <div className="flex flex-col gap-3">
            <BigButton variant="destructive" onClick={() => setStep("confirm")}>
              Tiếp tục
            </BigButton>
            <BigButton variant="secondary" onClick={onClose}>
              Hủy
            </BigButton>
          </div>
        </>
      ) : (
        <>
          <h2 className="pr-12 font-heading text-block font-bold">
            Xoá dữ liệu trên máy này?
          </h2>
          <p>
            Bạn sắp xoá mọi hồ sơ và tiến độ đang có trên máy này. Việc này
            không hoàn tác được.
          </p>
          {failed && (
            <p role="alert" className="font-semibold text-destructive">
              Chưa xoá được. Bạn thử lại nhé.
            </p>
          )}
          <div className="flex flex-col gap-3">
            <BigButton
              variant="destructive"
              onClick={handleSwitch}
              disabled={busy}
            >
              {busy ? "Đang xoá…" : "Xoá và dùng cho gia đình mới"}
            </BigButton>
            <BigButton variant="secondary" onClick={onClose} disabled={busy}>
              Hủy
            </BigButton>
          </div>
        </>
      )}
    </Sheet>
  );
}

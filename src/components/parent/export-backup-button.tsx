"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { BigButton } from "@/components/big-button";
import { now, vnDayKey } from "@/lib/time";
import type { ProfileRecord } from "@/progress/db";
import { appDb } from "@/progress/hooks";
import {
  buildProgressExport,
  progressExportFileName,
} from "@/progress/parent-data";

function download(fileName: string, text: string): void {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Downloads one child's whole local record as a JSON backup file.
export function ExportBackupButton({
  profile,
  label = "Tải bản sao lưu (JSON)",
}: {
  profile: ProfileRecord;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  async function handleExport() {
    setBusy(true);
    const at = now();
    const backup = await buildProgressExport(appDb(), profile, at);
    download(
      progressExportFileName(profile.name, vnDayKey(at)),
      JSON.stringify(backup, null, 2),
    );
    setBusy(false);
  }
  return (
    <BigButton
      variant="secondary"
      onClick={handleExport}
      disabled={busy}
      className="md:w-auto md:self-start"
    >
      <Download aria-hidden className="size-6" />
      {label}
    </BigButton>
  );
}

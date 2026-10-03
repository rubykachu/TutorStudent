"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { SESSION_API_PATH } from "@/access/gate";
import { BigButton } from "@/components/big-button";
import { Panel } from "./panel";

export const FAMILY_CODE_TITLE = "Mã gia đình";
export const FAMILY_CODE_NOTE =
  "Dùng mã này để đăng nhập trên máy khác của gia đình.";
// How long the button says the code was copied.
const COPIED_MS = 2000;

// The family code of this device's cookie, asked from the server each time
// the parent page opens: the code is made again there from the family id, and
// is never kept on the device. Shown only here, behind the parent PIN; a
// server without the gate (local dev) has no code, so nothing is shown.
export function FamilyCodePanel() {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let live = true;
    void (async () => {
      try {
        const response = await fetch(SESSION_API_PATH, { cache: "no-store" });
        if (!response.ok) return;
        const body = (await response.json()) as { code?: unknown };
        if (live && typeof body.code === "string") setCode(body.code);
      } catch {
        // Offline or no server: the panel stays hidden.
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  if (code === null) return null;

  async function copy() {
    if (code === null) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // No clipboard (plain http on the LAN): the code stays selectable.
    }
  }

  return (
    <Panel
      title={FAMILY_CODE_TITLE}
      note={FAMILY_CODE_NOTE}
      label={FAMILY_CODE_TITLE}
    >
      <p
        data-family-code
        className="select-all break-all font-heading text-title font-bold tracking-wider md:text-title-lg"
      >
        {code}
      </p>
      <BigButton
        variant="secondary"
        onClick={copy}
        className="md:w-auto md:self-start"
      >
        {copied ? (
          <Check aria-hidden className="size-6" />
        ) : (
          <Copy aria-hidden className="size-6" />
        )}
        {copied ? "Đã chép mã" : "Chép mã"}
      </BigButton>
    </Panel>
  );
}

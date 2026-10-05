"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { KeyRound } from "lucide-react";
import { type FormEvent, useState } from "react";
import { BigButton } from "@/components/big-button";
import { PARENT_PIN_MAX_LENGTH, PARENT_PIN_MIN_LENGTH } from "@/lib/config";
import { appDb } from "@/progress/hooks";
import { isValidPin, readPinState, savePin } from "@/progress/parent-pin";
import { PinField, PinPrompt } from "./pin-prompt";

const PIN_RULE = `${PARENT_PIN_MIN_LENGTH}–${PARENT_PIN_MAX_LENGTH} chữ số`;

function ForgotPin() {
  return (
    <details className="rounded-lg bg-muted p-4">
      <summary className="flex min-h-touch cursor-pointer items-center font-semibold">
        Quên PIN?
      </summary>
      <div className="mt-2 flex flex-col gap-2">
        <p>
          PIN chỉ được lưu trên máy này, chưa có cách đặt lại từ xa. Muốn đặt
          PIN mới, hãy xoá dữ liệu trang web của app trong phần cài đặt của
          trình duyệt (trên iPad: Cài đặt → Safari → Nâng cao → Dữ liệu trang
          web).
        </p>
        <p className="font-semibold">
          Việc này cũng xoá hồ sơ và toàn bộ tiến độ học của con trên máy.
        </p>
      </div>
    </details>
  );
}

function SetPin({ onDone }: { onDone: () => void }) {
  const [first, setFirst] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidPin(pin) || busy) return;
    if (first === null) {
      setFirst(pin);
      setPin("");
      setError(null);
      return;
    }
    if (pin !== first) {
      setFirst(null);
      setPin("");
      setError("Hai lần nhập chưa giống nhau. Bạn đặt lại từ đầu nhé.");
      return;
    }
    setBusy(true);
    await savePin(appDb(), pin);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p>
        Đặt một mã PIN ({PIN_RULE}) để con không tự mở trang này. PIN chỉ lưu
        trên máy này.
      </p>
      <PinField
        key={first === null ? "new" : "confirm"}
        label={first === null ? "PIN mới" : "Nhập lại PIN để xác nhận"}
        value={pin}
        onChange={setPin}
        disabled={busy}
      />
      {error && (
        <p role="alert" className="font-semibold text-retry-soft-foreground">
          {error}
        </p>
      )}
      <BigButton type="submit" disabled={!isValidPin(pin) || busy}>
        {first === null ? "Tiếp tục" : "Lưu PIN"}
      </BigButton>
    </form>
  );
}

// First visit sets the PIN (typed twice); later visits ask for it. Five wrong
// PINs in a row lock the page for a while, and the lock survives a reload.
export function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const state = useLiveQuery(() => readPinState(appDb()), []);

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col gap-6 px-gutter py-6 md:px-gutter-lg md:py-10">
      <header className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
          <KeyRound aria-hidden className="size-6" />
        </span>
        <h1 className="text-title font-bold md:text-title-lg">
          Trang phụ huynh
        </h1>
      </header>
      {state && (
        <section className="flex flex-col gap-6 rounded-lg bg-surface p-4 shadow-card md:p-6">
          {state.hash ? (
            <PinPrompt submitLabel="Mở trang phụ huynh" onUnlock={onUnlock} />
          ) : (
            <SetPin onDone={onUnlock} />
          )}
        </section>
      )}
      {state?.hash && <ForgotPin />}
    </main>
  );
}

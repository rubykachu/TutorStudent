"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { KeyRound } from "lucide-react";
import { type FormEvent, useEffect, useId, useState } from "react";
import { BigButton } from "@/components/big-button";
import {
  PARENT_PIN_LOCK_MINUTES,
  PARENT_PIN_MAX_FAILS,
  PARENT_PIN_MAX_LENGTH,
  PARENT_PIN_MIN_LENGTH,
} from "@/lib/config";
import { now } from "@/lib/time";
import { appDb } from "@/progress/hooks";
import {
  isLocked,
  isValidPin,
  readPinState,
  savePin,
  tryUnlock,
} from "@/progress/parent-pin";
import { formatClock } from "./format";

const PIN_RULE = `${PARENT_PIN_MIN_LENGTH}–${PARENT_PIN_MAX_LENGTH} chữ số`;

type PinFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

// Digits only, masked, with the phone's number keyboard.
function PinField({ label, value, onChange, disabled }: PinFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        maxLength={PARENT_PIN_MAX_LENGTH}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, ""))}
        className="h-14 w-full rounded-lg border-2 border-border bg-surface px-4 text-center font-heading text-title tracking-[0.5em] focus-visible:border-primary disabled:bg-muted md:h-16"
      />
    </div>
  );
}

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

function EnterPin({
  lockedUntil,
  onDone,
}: {
  lockedUntil: Date | null;
  onDone: () => void;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const locked = lockedUntil !== null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidPin(pin) || busy || locked) return;
    setBusy(true);
    const result = await tryUnlock(appDb(), pin, now());
    setBusy(false);
    setPin("");
    if (result.status === "ok") {
      onDone();
    } else if (result.status === "wrong") {
      setError(`PIN chưa đúng. Còn ${result.attemptsLeft} lần thử.`);
    } else {
      // A lock is shown from the stored state; no separate message.
      setError(null);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {locked ? (
        <p role="alert" className="font-semibold">
          Đã nhập sai {PARENT_PIN_MAX_FAILS} lần nên trang tạm khoá{" "}
          {PARENT_PIN_LOCK_MINUTES} phút. Bạn thử lại sau{" "}
          {formatClock(lockedUntil)} nhé.
        </p>
      ) : (
        <PinField
          label="Nhập PIN"
          value={pin}
          onChange={setPin}
          disabled={busy}
        />
      )}
      {error && !locked && (
        <p role="alert" className="font-semibold text-retry-soft-foreground">
          {error}
        </p>
      )}
      {!locked && (
        <BigButton type="submit" disabled={!isValidPin(pin) || busy}>
          Mở trang phụ huynh
        </BigButton>
      )}
    </form>
  );
}

// Re-renders once `until` passes, so a lock lifts without a reload.
function useRerenderAt(until: number | null): void {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (until === null) return;
    const timer = setTimeout(
      () => setTick((t) => t + 1),
      Math.max(0, until - now().getTime()) + 50,
    );
    return () => clearTimeout(timer);
  }, [until]);
}

// First visit sets the PIN (typed twice); later visits ask for it. Five wrong
// PINs in a row lock the page for a while, and the lock survives a reload.
export function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const state = useLiveQuery(() => readPinState(appDb()), []);
  const current = now();
  const lockedUntil =
    state && isLocked(state.lock, current) && state.lock.lockedUntil
      ? new Date(state.lock.lockedUntil)
      : null;
  useRerenderAt(lockedUntil?.getTime() ?? null);

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
            <EnterPin lockedUntil={lockedUntil} onDone={onUnlock} />
          ) : (
            <SetPin onDone={onUnlock} />
          )}
        </section>
      )}
      {state?.hash && <ForgotPin />}
    </main>
  );
}

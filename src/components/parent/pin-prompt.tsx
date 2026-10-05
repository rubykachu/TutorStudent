"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { type FormEvent, useEffect, useId, useState } from "react";
import { BigButton } from "@/components/big-button";
import {
  PARENT_PIN_LOCK_MINUTES,
  PARENT_PIN_MAX_FAILS,
  PARENT_PIN_MAX_LENGTH,
} from "@/lib/config";
import { now } from "@/lib/time";
import { appDb } from "@/progress/hooks";
import {
  isLocked,
  isValidPin,
  readPinState,
  tryUnlock,
} from "@/progress/parent-pin";
import { formatClock } from "./format";

// The PIN entry of the parent page, shared with the parent's feedback form:
// the same field, wrong-PIN count and lock (kept on the device). A right PIN
// calls `onUnlock`; this never opens the parent page's session itself.

type PinFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

// Digits only, masked, with the phone's number keyboard.
export function PinField({ label, value, onChange, disabled }: PinFieldProps) {
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

function EnterPin({
  lockedUntil,
  submitLabel,
  onDone,
}: {
  lockedUntil: Date | null;
  submitLabel: string;
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
          {submitLabel}
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

// Asks the stored PIN; nothing while the PIN state loads. The caller shows
// this only once a PIN is set.
export function PinPrompt({
  submitLabel,
  onUnlock,
}: {
  submitLabel: string;
  onUnlock: () => void;
}) {
  const state = useLiveQuery(() => readPinState(appDb()), []);
  const lockedUntil =
    state && isLocked(state.lock, now()) && state.lock.lockedUntil
      ? new Date(state.lock.lockedUntil)
      : null;
  useRerenderAt(lockedUntil?.getTime() ?? null);
  if (!state) return null;
  return (
    <EnterPin
      lockedUntil={lockedUntil}
      submitLabel={submitLabel}
      onDone={onUnlock}
    />
  );
}

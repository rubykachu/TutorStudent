"use client";

import { useId, useState } from "react";
import { SESSION_API_PATH } from "@/access/gate";
import { BigButton } from "@/components/big-button";
import { Owl } from "@/mascot/owl";

type Problem =
  | { kind: "wrong" }
  | { kind: "locked"; retryAfterSeconds: number }
  | { kind: "offline" };

// What the child reads for each problem: calm, never red, and always a next
// step to take.
export function problemMessage(problem: Problem): string {
  switch (problem.kind) {
    case "wrong":
      return "Chưa đúng rồi. Bạn kiểm tra lại mã, hoặc nhờ bố mẹ giúp nhé.";
    case "locked": {
      const minutes = Math.max(1, Math.ceil(problem.retryAfterSeconds / 60));
      return `Bạn đã thử nhiều lần rồi. Nghỉ một chút, khoảng ${minutes} phút nữa thử lại nhé.`;
    }
    case "offline":
      return "Chưa vào được. Bạn kiểm tra mạng rồi thử lại nhé.";
  }
}

type UnlockScreenProps = {
  // Path to open once the code is accepted.
  next: string;
};

export function UnlockScreen({ next }: UnlockScreenProps) {
  const inputId = useId();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || code.trim() === "") return;
    setBusy(true);
    setProblem(null);
    try {
      const response = await fetch(SESSION_API_PATH, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (response.ok) {
        // A full load, so the very first request already carries the cookie.
        window.location.assign(next);
        return;
      }
      if (response.status === 429) {
        const body = (await response.json().catch(() => ({}))) as {
          retryAfterSeconds?: number;
        };
        setProblem({
          kind: "locked",
          retryAfterSeconds: body.retryAfterSeconds ?? 60,
        });
      } else {
        setProblem({ kind: response.status === 401 ? "wrong" : "offline" });
      }
    } catch {
      setProblem({ kind: "offline" });
    }
    setBusy(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col justify-center gap-8 px-gutter py-6 md:px-gutter-lg md:py-10">
      <div className="flex items-center gap-4">
        <Owl expression={problem ? "hint" : "welcome"} size="home" />
        <h1 className="text-title font-bold md:text-title-lg">Chào bạn!</h1>
      </div>
      <form onSubmit={submit} className="flex max-w-xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label
            htmlFor={inputId}
            className="font-heading text-block font-semibold md:text-block-lg"
          >
            Nhập mã của gia đình để vào học
          </label>
          <p className="text-caption text-muted-foreground">
            Mã do bố mẹ giữ. Bạn chỉ cần nhập một lần trên máy này.
          </p>
          <input
            id={inputId}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            maxLength={100}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            className="h-14 w-full rounded-lg border-2 border-border bg-surface px-4 text-body focus-visible:border-primary md:h-16 md:text-body-lg"
          />
        </div>
        <div role="status" aria-live="polite">
          {problem && (
            <p
              data-unlock-problem={problem.kind}
              className="rounded-lg border-2 border-retry bg-retry-soft px-4 py-3 text-body text-retry-soft-foreground"
            >
              {problemMessage(problem)}
            </p>
          )}
        </div>
        <BigButton
          type="submit"
          disabled={busy || code.trim() === ""}
          aria-busy={busy}
        >
          Vào học
        </BigButton>
      </form>
    </main>
  );
}

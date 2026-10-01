"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { PanelArt } from "@/components/panel-art";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

type SheetProps = {
  // Names the dialog for screen readers.
  label: string;
  onClose: () => void;
  children: ReactNode;
};

// A bottom sheet on phones, a centred panel on tablets: dim backdrop,
// closes on a tap outside, on Escape and on its own close button, which
// takes focus when the sheet opens. Its content scrolls over the page's
// "multiverse" decoration, which stays put.
export function Sheet({ label, onClose, children }: SheetProps) {
  const reducedMotion = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 md:items-center">
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative z-10 flex max-h-full w-full max-w-md">
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={reducedMotion ? false : { y: 48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="relative isolate flex max-h-full w-full flex-col overflow-hidden rounded-t-xl bg-surface shadow-card md:rounded-xl"
        >
          <PanelArt />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 flex size-12 items-center justify-center rounded-full text-muted-foreground"
          >
            <X aria-hidden className="size-7" />
          </button>
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-6">
            {children}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

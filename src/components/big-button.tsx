"use client";

import type { ButtonHTMLAttributes } from "react";
import { useButtonSound } from "@/lib/feedback-sounds";

export type BigButtonVariant = "primary" | "secondary";

const BASE =
  "inline-flex h-14 w-full items-center justify-center gap-3 rounded-lg px-6 text-body font-semibold leading-none transition-transform duration-100 ease-out select-none active:scale-[0.97] motion-reduce:transition-none md:h-16 md:text-body-lg disabled:pointer-events-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none";

const VARIANTS: Record<BigButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-card",
  secondary: "border-2 border-border bg-surface text-foreground",
};

// Shared with links that must look like a BigButton (e.g. navigation).
export function bigButtonClassName(
  variant: BigButtonVariant = "primary",
  className = "",
): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`.trim();
}

type BigButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BigButtonVariant;
};

// The main call to action: 56px tall on phones, 64px on tablets. On a
// screen that supplies sounds it plays the soft button press ("Kiểm tra",
// "Bỏ qua", "Tiếp theo"); elsewhere, or with sound off, it stays silent.
export function BigButton({
  variant = "primary",
  className,
  type = "button",
  onClick,
  ...rest
}: BigButtonProps) {
  const playButton = useButtonSound();
  return (
    <button
      type={type}
      className={bigButtonClassName(variant, className)}
      onClick={(event) => {
        playButton();
        onClick?.(event);
      }}
      {...rest}
    />
  );
}

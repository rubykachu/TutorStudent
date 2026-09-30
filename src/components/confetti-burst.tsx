"use client";

import { motion } from "motion/react";
import { hashSeed } from "@/exercises/shuffle";

// Pieces of one burst and how long it lasts; long enough to feel like a
// celebration, short enough to be gone before the child reads the praise.
const PIECES = 28;
const BURST_S = 1;

const COLORS = [
  "bg-concept-blue",
  "bg-concept-pink",
  "bg-concept-amber",
  "bg-concept-teal",
  "bg-concept-violet",
  "bg-highlight",
  "bg-correct",
] as const;

// A deterministic spread (angle, distance, spin) per piece, so a render on
// the server and one on the client agree and tests see the same burst.
function piece(i: number) {
  const r = (salt: string) => (hashSeed(`${i}:${salt}`) % 1000) / 1000;
  const angle = (i / PIECES) * Math.PI * 2 + r("a") * 0.4;
  const distance = 90 + r("d") * 110;
  return {
    x: Math.cos(angle) * distance,
    // Pieces fly up and out, then fall a little.
    y: Math.sin(angle) * distance * 0.7 - 40,
    fall: 60 + r("f") * 60,
    rotate: (r("r") - 0.5) * 720,
    color: COLORS[i % COLORS.length],
    round: i % 3 === 0,
  };
}

const BURST = Array.from({ length: PIECES }, (_, i) => piece(i));

// Confetti bursting from the centre of its positioned parent. Decoration
// only: it never takes a tap and is hidden from screen readers. Callers skip
// it when the child prefers reduced motion.
export function ConfettiBurst() {
  return (
    <div
      aria-hidden
      data-confetti
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible"
    >
      {BURST.map((p, i) => (
        <motion.span
          // Pieces never reorder.
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          className={`absolute ${p.round ? "size-2.5 rounded-full" : "h-3 w-1.5 rounded-sm"} ${p.color}`}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
          animate={{
            x: p.x,
            y: [0, p.y, p.y + p.fall],
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: 1,
          }}
          transition={{ duration: BURST_S, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

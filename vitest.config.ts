import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Reuse the "@/*" alias from tsconfig.json instead of redeclaring it.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      // Only pure logic is held to the threshold; UI is covered by E2E.
      include: [
        "src/schema/**",
        "src/srs/**",
        "src/progress/**",
        "src/sync/**",
        "src/exercises/grade/**",
        "src/content/lint/**",
      ],
      thresholds: { lines: 90 },
    },
  },
});

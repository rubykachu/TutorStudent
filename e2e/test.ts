import { test as base } from "@playwright/test";
import { SILENCE_MEDIA_SCRIPT } from "./silence";

export { expect } from "@playwright/test";

// `test` of every spec: a Playwright test whose browser context is silent
// from its first page on (see `SILENCE_MEDIA_SCRIPT`).
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(SILENCE_MEDIA_SCRIPT);
    await use(context);
  },
});

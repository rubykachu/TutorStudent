import type { GateConfig } from "@/access/env";

// Test values of the two gate secrets and a gate built from them.
export const SESSION_SECRET = "a-secret-of-at-least-thirty-two-characters";
export const CODE_SECRET = "a-code-secret-of-at-least-thirty-two-chars";
export const FAMILY = "OWL4K7MQ";
export const OTHER_FAMILY = "OWL9X2ZB";

export function gateConfig(
  options: {
    sessionSecret?: string;
    codeSecret?: string;
    revoked?: readonly string[];
  } = {},
): GateConfig {
  return {
    mode: "gate",
    sessionSecret: options.sessionSecret ?? SESSION_SECRET,
    codeSecret: options.codeSecret ?? CODE_SECRET,
    revoked: new Set(options.revoked ?? []),
  };
}

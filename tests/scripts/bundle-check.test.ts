// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  findBundleLeaks,
  SERVER_ONLY_ENV_NAMES,
} from "../../scripts/lib/bundle-check";

const ENV = {
  R2_ACCOUNT_ID: "0123456789abcdef0123456789abcdef",
  R2_ACCESS_KEY_ID: "access-key-id-0001",
  R2_SECRET_ACCESS_KEY: "secret-access-key-0001",
  R2_PRIVATE_BUCKET: "tutor-progress",
  SESSION_SECRET: "a-secret-of-at-least-thirty-two-characters",
  FAMILY_CODES: "nha-minh:saobien4k7m,mattroi9x2z",
};

const file = (text: string) => ({ path: "chunks/app.js", text });

describe("findBundleLeaks", () => {
  it("passes a bundle that holds no server variable", () => {
    // The export format string equals the bucket name and must not count.
    expect(
      findBundleLeaks([file('const format="tutor-progress";')], ENV),
    ).toEqual([]);
  });

  it("reports each server-only variable named in browser code", () => {
    for (const name of SERVER_ONLY_ENV_NAMES) {
      expect(findBundleLeaks([file(`process.env.${name}`)], {})).toContainEqual(
        { file: "chunks/app.js", what: `name ${name}` },
      );
    }
  });

  it("reports a secret's value and a family code without printing them", () => {
    const leaks = findBundleLeaks(
      [file(`"${ENV.R2_SECRET_ACCESS_KEY}";"saobien4k7m"`)],
      ENV,
    );
    expect(leaks).toEqual([
      { file: "chunks/app.js", what: "value of R2_SECRET_ACCESS_KEY" },
      { file: "chunks/app.js", what: "a code of FAMILY_CODES" },
    ]);
    expect(JSON.stringify(leaks)).not.toContain(ENV.R2_SECRET_ACCESS_KEY);
  });

  it("skips values too short to tell apart from ordinary text", () => {
    expect(
      findBundleLeaks([file('"short"')], { SESSION_SECRET: "short" }),
    ).toEqual([]);
  });
});

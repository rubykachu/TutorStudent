import { describe, expect, it } from "vitest";
import {
  isSyncPrefix,
  type SyncKeyTarget,
  type SyncPrefix,
  syncEnvPrefix,
  syncKey,
  testPrefix,
} from "@/sync/store/keys";

const CHILD = "0123456789abcdef0123456789abcdef";

const TARGETS: SyncKeyTarget[] = [
  { kind: "profile", familyId: "nha-minh" },
  { kind: "child", familyId: "nha-minh", childId: CHILD },
  { kind: "history", familyId: "nha-minh", childId: CHILD, month: "2026-10" },
  { kind: "snapshot", familyId: "nha-minh", childId: CHILD, day: "2026-10-02" },
];

describe("syncKey", () => {
  it("builds the four kinds of key", () => {
    expect(TARGETS.map((target) => syncKey("dev/", target))).toEqual([
      "dev/progress/nha-minh/profile.json",
      `dev/progress/nha-minh/${CHILD}.json`,
      `dev/progress/nha-minh/${CHILD}/history/2026-10.json`,
      `dev/snapshots/nha-minh/${CHILD}/2026-10-02.json`,
    ]);
  });

  it("puts every key under its family's folder, whatever the input", () => {
    const hostile = [
      "../x",
      "..",
      "a/b",
      "nha-minh/../x",
      "nha-minh/",
      "/nha-minh",
      "%2e%2e",
      "nha-minh\u0000",
      "nha-minh\n",
      "NHA-MINH",
      "..%2fx",
      "",
      `${CHILD}/../x`,
    ];
    const badDates = ["2026-10/../x", "2026-13", "2026-1", "2026-10-32"];
    for (const value of hostile) {
      for (const target of TARGETS) {
        for (const field of ["familyId", "childId", "month", "day"] as const) {
          if (!(field in target)) continue;
          const bad = { ...target, [field]: value } as SyncKeyTarget;
          expect(() => syncKey("dev/", bad), `${field}=${value}`).toThrow();
        }
      }
    }
    for (const value of badDates) {
      for (const field of ["month", "day"] as const) {
        const target = TARGETS.find((t) => field in t) as SyncKeyTarget;
        expect(() =>
          syncKey("dev/", { ...target, [field]: value } as SyncKeyTarget),
        ).toThrow();
      }
    }
    for (const target of TARGETS) {
      const key = syncKey("dev/", target);
      const folder =
        target.kind === "snapshot"
          ? "dev/snapshots/nha-minh/"
          : "dev/progress/nha-minh/";
      expect(key.startsWith(folder)).toBe(true);
      expect(key).not.toContain("..");
    }
  });

  it("refuses a prefix that is not one of the three environments", () => {
    for (const prefix of [
      "",
      "../",
      "prod",
      "prod/x/",
      "other/",
      "test/",
      "test/../prod/",
      "/prod/",
    ]) {
      expect(() =>
        syncKey(prefix as SyncPrefix, TARGETS[0] as SyncKeyTarget),
      ).toThrow();
    }
  });
});

describe("environment prefix", () => {
  const nodeEnvs = [undefined, "development", "test", "production"];
  const vercelEnvs = [
    undefined,
    "",
    "development",
    "preview",
    "Production",
    "production ",
  ];

  it("gives prod/ only when VERCEL_ENV is production, for every NODE_ENV", () => {
    for (const nodeEnv of nodeEnvs) {
      for (const vercelEnv of vercelEnvs) {
        const prefix = syncEnvPrefix({
          NODE_ENV: nodeEnv,
          VERCEL_ENV: vercelEnv,
        } as never);
        expect(prefix).toBe("dev/");
        for (const target of TARGETS) {
          expect(syncKey(prefix, target).startsWith("prod/")).toBe(false);
        }
      }
      expect(
        syncEnvPrefix({ NODE_ENV: nodeEnv, VERCEL_ENV: "production" } as never),
      ).toBe("prod/");
    }
  });

  it("reads the real environment by default", () => {
    expect(["prod/", "dev/"]).toContain(syncEnvPrefix());
  });
});

describe("test prefix", () => {
  it("builds test/<run-id>/ and refuses anything else", () => {
    expect(testPrefix("run-20261002-ab12")).toBe("test/run-20261002-ab12/");
    for (const id of [
      "",
      "x",
      "../prod",
      "a/b",
      "RUN-1234",
      "prod",
      "run id 1",
    ]) {
      expect(() => testPrefix(id)).toThrow();
    }
  });

  it("recognises the three prefixes only", () => {
    expect(isSyncPrefix("prod/")).toBe(true);
    expect(isSyncPrefix("dev/")).toBe(true);
    expect(isSyncPrefix("test/run-abc123/")).toBe(true);
    expect(isSyncPrefix("test/run-abc123")).toBe(false);
    expect(isSyncPrefix("test/run-abc123/../prod/")).toBe(false);
  });
});

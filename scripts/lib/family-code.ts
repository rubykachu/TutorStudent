import { parseArgs } from "node:util";
import {
  familyCode,
  normalizeFamilyId,
  randomFamilyId,
} from "../../src/access/code";
import {
  parseRevokedFamilies,
  readFamilyCodeSecret,
} from "../../src/access/env";
import { ENV_FILE, SMOKE_FAMILY_ID } from "./release-config";

// Most codes one run prints.
export const MAX_CODES_PER_RUN = 200;

export type FamilyCodeArgs =
  | { kind: "new"; count: number }
  | { kind: "existing"; familyId: string };

export function parseFamilyCodeArgs(argv: readonly string[]): FamilyCodeArgs {
  const { values } = parseArgs({
    args: [...argv],
    options: {
      count: { type: "string" },
      id: { type: "string" },
    },
  });
  if (values.id !== undefined && values.count !== undefined) {
    throw new Error("--id and --count cannot be used together");
  }
  if (values.id !== undefined) {
    const familyId = normalizeFamilyId(values.id);
    if (familyId === null) {
      throw new Error(`--id must be a family id such as ${SMOKE_FAMILY_ID}`);
    }
    return { kind: "existing", familyId };
  }
  const count = Number(values.count ?? "1");
  if (!Number.isInteger(count) || count < 1 || count > MAX_CODES_PER_RUN) {
    throw new Error(
      `--count must be a whole number from 1 to ${MAX_CODES_PER_RUN}`,
    );
  }
  return { kind: "new", count };
}

// `count` new family ids, none repeated and none the smoke family's.
export function newFamilyIds(
  count: number,
  draw: () => string = randomFamilyId,
): string[] {
  const ids = new Set<string>();
  while (ids.size < count) {
    const id = draw();
    if (id !== SMOKE_FAMILY_ID) ids.add(id);
  }
  return [...ids];
}

export type FamilyCodeDeps = {
  env: Record<string, string | undefined>;
  // Standard output: the family ids and codes, one family per line.
  out: (line: string) => void;
  // Standard error: messages, never a code or the secret.
  err: (line: string) => void;
  draw?: () => string;
};

// Returns the process exit code.
export async function runFamilyCode(
  argv: readonly string[],
  deps: FamilyCodeDeps,
): Promise<number> {
  let args: FamilyCodeArgs;
  try {
    args = parseFamilyCodeArgs(argv);
  } catch (error) {
    deps.err(error instanceof Error ? error.message : String(error));
    deps.err("usage: pnpm family:code [--count N] | --id <family id>");
    return 2;
  }
  const read = readFamilyCodeSecret(deps.env);
  if ("error" in read) {
    deps.err(`${read.error} (in ${ENV_FILE})`);
    return 1;
  }
  const ids =
    args.kind === "existing"
      ? [args.familyId]
      : newFamilyIds(args.count, deps.draw);
  if (args.kind === "existing") {
    const revoked = parseRevokedFamilies(deps.env.FAMILY_CODES_REVOKED);
    if ("ids" in revoked && revoked.ids.includes(args.familyId)) {
      deps.err(
        `${args.familyId} is in FAMILY_CODES_REVOKED: its code does not open the app`,
      );
    }
  }
  for (const id of ids) {
    deps.out(`${id}\t${await familyCode(read.secret, id)}`);
  }
  return 0;
}

import { runFamilyCode } from "./lib/family-code";
import { readReleaseEnv } from "./lib/run";

// Usage: family:code [--count N]   prints N new families (default 1)
//        family:code --id <id>     prints the code of an existing family
// Each line is `<family id><tab><code>`. The codes are signed with
// FAMILY_CODE_SECRET from .env.production.local, the same key the production
// server checks them with; the secret itself is never printed. Nothing is
// written anywhere: hand each code to one family and keep its family id, which
// is what revoking or re-printing a code needs.
process.exitCode = await runFamilyCode(process.argv.slice(2), {
  env: readReleaseEnv(process.cwd()),
  out: (line) => process.stdout.write(`${line}\n`),
  err: (line) => process.stderr.write(`${line}\n`),
});

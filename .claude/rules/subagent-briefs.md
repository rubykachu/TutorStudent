---
description: What every subagent brief must state (always loaded)
---

# Subagent briefs: state the scope

A subagent does exactly what the prompt says and does not ask back; a vague prompt gets the widest reading. Example: "change the Gemini voice" was meant for new lessons only, but the vague brief made an agent re-synthesize and overwrite the narration audio of the published lessons, which is gitignored media and cannot be restored.

## Every brief states

- **Targets:** named lessons, files, folders or environments. Never "all", "every lesson" or "everywhere" unless the owner asked for exactly that.
- **Out of scope:** what must not be touched, for example "new lessons only; do not rebuild or overwrite media of existing lessons".
- **Side effects:** external API calls (quota or cost), overwriting or deleting files, changing reviewed or published data. For each: which targets, how many at most, what is forbidden.
- **Files outside git** (media, caches, generated output): treat as unrecoverable. Require a backup before overwriting, or forbid it.
- **Stop point:** on a case outside the stated scope, stop and report; do not widen the scope.

## When the owner's request has two readings

- If one reading overwrites, deletes or spends quota on something that already exists, ask the owner before delegating. Do not pick the wide reading.
- Safe default: a new setting applies only to future creation, never re-run over existing data, unless the owner says to re-run.

## Before sending a brief

- Does it list concrete targets?
- Does it have a "do not touch" line?
- Is every API call, overwrite and delete bounded?
- If the subagent takes the widest reading, does anything existing break?

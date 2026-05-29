# Surgical Edits

> Change the minimum number of lines required to satisfy the requirement. A 20-line fix is better than a 100-line fix when both solve the same problem.

This principle applies to **reviewers** (when suggesting fixes), to the **main session** (when applying fixes), and to **all agents** that propose code changes.

## The rule

A proposed change is *surgical* if it:

1. **Touches the minimum number of lines** required for correctness.
2. **Preserves the surrounding code's structure** — no opportunistic rewrites, no "while I'm here" cleanups.
3. **Adds no new abstractions** unless the fix genuinely requires one. Three similar lines beat a premature helper.
4. **Adds no new files** unless the fix cannot fit in an existing one.
5. **Avoids reformatting** lines that didn't need to change.

## Quick thresholds

| Type of change | Surgical | Smell | Stop and ask |
|---|---|---|---|
| Bug fix | ≤ 10 lines | 11–30 lines | > 30 lines |
| New behavior | ≤ 50 lines in one file | 51–100 lines | > 100 lines, or > 1 file |
| Refactor (no behavior change) | not surgical by definition | — | always ask first |

When a fix crosses the **stop-and-ask** threshold, the agent must surface the proposed change and ask the user before applying it. Don't silently expand scope.

## Common anti-patterns

- **Rewriting a function to fix one line in it.** Edit the one line.
- **Extracting a "helper" used in exactly one place.** Inline is fine.
- **Adding a generic abstraction "for the future".** YAGNI.
- **Renaming variables in the same diff as a bug fix.** Two PRs.
- **Reformatting whitespace/braces on lines you didn't need to touch.** Leave them.
- **Adding error handling for cases that can't happen.** Trust framework guarantees and internal callers.
- **Adding comments that restate what the code does.** Only add comments for *why*, when the why is non-obvious.

## For reviewers

When you flag an issue, your **suggested fix** must itself be surgical:

- If the smallest possible fix is ≤ 30 lines, propose that fix inline.
- If the smallest possible fix is > 30 lines, describe the change in prose and say `Suggest: discuss before implementing — fix likely > 30 lines`.
- Do not chain unrelated improvements into one finding ("fix the null check AND extract this to a helper AND rename the param"). One finding = one concern.

## For the main session applying fixes

When you apply a reviewer's fix:

- Apply the **minimum diff** that resolves the finding. Do not opportunistically refactor.
- If the reviewer suggested a large rewrite, prefer the smallest change that closes the issue, even if the reviewer's suggestion was wider.
- If you cannot apply a surgical fix (because the issue genuinely requires structural change), stop and surface that to the user before continuing.

## Why

Large diffs:
- Are harder to review (reviewer fatigue → bugs slip through).
- Conflict with parallel work and produce merge headaches.
- Hide the actual fix inside cosmetic noise.
- Take longer to bisect when something regresses.

Small diffs:
- Are reviewable in one sitting.
- Make `git blame` and `git bisect` work.
- Let the next person see exactly what the bug was.
- Compose cleanly with other in-flight changes.

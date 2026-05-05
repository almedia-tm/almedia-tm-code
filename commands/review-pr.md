---
description: Comprehensive PR review using specialized agents.
---

# Review PR Command

Run a multi-perspective review of a GitHub pull request. Instead of one generalist pass, this command dispatches specialized agents in parallel and aggregates their findings into a single, severity-ranked report.

## Usage

```
/almedia-code:review-pr [PR-number-or-URL] [--focus=<lens>]
```

- `PR-number-or-URL` — optional; defaults to the current branch's open PR if it can be resolved via `gh pr view`.
- `--focus` — optional lens: `comments`, `tests`, `errors`, `types`, `code`, `simplify`. Without `--focus`, the full review stack runs.

## What it does

1. **Fetch PR context** — `gh pr view <num> --json title,body,files,headRefName,baseRefName` plus the diff via `gh pr diff <num>`. Capture changed files, the diff body, and the PR description.
2. **Read repo guidance** — `CLAUDE.md`, the language-appropriate config (`tsconfig.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`), and any `.editorconfig`/lint config. Reviews must respect repo conventions.
3. **Dispatch agents in parallel** — using the `Agent` tool, fire (in a single message, all at once):
   - The language-appropriate reviewer based on the dominant changed-file type: `ts-code-reviewer`, `python-code-reviewer`, `go-code-reviewer`, or `rust-code-reviewer`.
   - `silent-failure-hunter` — always.
   - `tester` — coverage and missing-test review.
   - `security-reviewer` — gated: only if the diff touches auth, payments, webhooks, secrets, or user-data paths.
4. **Deduplicate findings** — multiple agents will surface the same line. Merge by `(file, line, category)` and pick the highest-confidence wording.
5. **Filter by confidence** — keep findings at confidence ≥ 80. Below that, don't speak.
6. **Group and rank** — emit by severity:
   - **Critical** — bugs, security issues, data-loss risks. The PR should not merge until these resolve.
   - **Important** — missing tests, quality issues, style violations.
   - **Advisory** — only included when the user explicitly asks (`--focus=simplify` for example).

## Focus lenses

When `--focus=<lens>` is set, dispatch a narrower agent set:

- `comments` — code-comment quality only (clarity, accuracy, missing rationale).
- `tests` — `tester` solo: coverage, regression-test presence, anti-patterns.
- `errors` — `silent-failure-hunter` solo.
- `types` — language reviewer with focus on type quality only.
- `code` — language reviewer + simplify pass.
- `readability` — language reviewer with focus on readability checks only: long `else if` chains where `switch`/`match` fits, nested ternaries, boolean flag params, cryptic names, deep nesting.
- `simplify` — propose minimal refactors that reduce LOC without behavior change.

## Output shape

```
PR REVIEW — #<num> — <title>
─────────────────────────────────────────────
Files changed: <n>   Diff size: <+a / -d>
Agents run: <list>

CRITICAL (<n>)
  src/auth/session.ts:42 — silent-failure-hunter — `.catch(() => null)` masks DB outage
    Fix: rethrow as `SessionLookupError(err)` and let upstream handle.
  ...

IMPORTANT (<n>)
  src/lib/foo.ts:118 — ts-code-reviewer — function exceeds 50 lines
    Fix: extract `validateFooInput` and `formatFooOutput`.
  ...

ADVISORY (<n>)  (omitted unless --focus=simplify)
  ...

Recommendation: <BLOCK / REQUEST CHANGES / APPROVE WITH NITS / APPROVE>
```

## Rules

- One recommendation at the bottom — do not equivocate.
- Every Critical finding must have a fix suggestion that is a minimal diff.
- Do not propose architectural rewrites in a PR review. Surface them as separate work.
- If `gh` is not authenticated or the PR cannot be fetched, fail loudly with the exact `gh auth login` command.

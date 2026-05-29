---
description: Standard command for any non-trivial change — new projects, new features, modifications to existing features, cross-cutting refactors. Plans the work, then auto-dispatches the right agents in dependency-aware parallel batches with a strict Review → Fix → Docs flow. Bootstraps CLAUDE.md and .claude/ on new projects. Pass --team to upgrade from subagent dispatch to Agent Teams (experimental, opt-in).
---

# Plan + Execute Command

**Use this command for any non-trivial change** — whether you're starting from scratch, adding to an existing feature, modifying a feature already in production, or doing a cross-cutting refactor. It's the standard entry point. The command adapts to what it finds:

- **New project** (no CLAUDE.md, no .claude/) → bootstraps both, then plans Phase 1.
- **New feature on existing project** → reads `/docs/codemaps/` first, then plans against the current architecture.
- **Modification to existing feature** → diff-scoped plan against the affected modules. The dispatch matrix only emits reviewers for languages/domains actually touched by the change.
- **Refactor** → plans the safe ordering (architect → mechanical refactor → review → fix).

Single command that combines planning and content-aware parallel agent dispatch. Decides which agents to dispatch **based on what the plan actually touches** — and runs them in **dependency-aware parallel batches** with a strict `Review → Fix → Docs` ordering.

Unlike `/orchestrate` (sequential, pre-baked workflows) and `/multi-frontend` / `/multi-backend` (parallel but pre-baked roles), `/plan-execute` looks at the plan and picks the right agents per task.

## Usage

```
/plan-execute <task description>             # default: subagent dispatch
/plan-execute --team <task description>      # opt-in: Agent Teams (experimental)
```

## Dispatch backend — subagent (default) vs --team

This command supports two backends. The default works everywhere. The `--team` backend is opt-in and trades more tokens for inter-reviewer messaging.

### Default — subagent backend

- Each parallel batch is dispatched as a **single message with multiple Agent tool calls**.
- Reviewers run in isolation and report findings back to the main session.
- Works on any Claude Code version, no env flag required.
- Lower token cost.

### `--team` backend (opt-in)

- Spawns an **Agent Team** (per [docs](https://code.claude.com/docs/en/agent-teams)) with the main session as team lead and each reviewer/architect/tester as a teammate.
- Teammates can message each other directly — e.g. `security-reviewer` can challenge `ts-code-reviewer`'s "this is fine" finding before it reaches the lead.
- The Dispatch Matrix's batches become entries on the shared task list (with dependencies wired).
- Requires Claude Code **v2.1.32+** and `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in the user's environment.
- **Fallback**: if either prerequisite is missing, fall back to the subagent backend and warn the user.
- Cleanup: at the end, ask the lead to clean up the team (`Clean up the team`) so no orphaned tmux sessions remain.

Both backends use the same Dispatch Matrix emitted by the `plan` agent — only the dispatch mechanism differs.

## Phase 1 — Plan

1. Parse `--team` from the args (strip it before passing the rest to the plan agent).
2. Invoke the `plan` agent with the remaining task description.
3. The plan agent:
   - Detects whether this is a new project (missing CLAUDE.md AND .claude/).
   - Produces phased tasks with dependencies.
   - Emits a **Dispatch Matrix** (batches B0–B5) that this command will execute.
4. Show the matrix to the user (plus a one-line note about which backend will be used).
5. **STOP. Wait for explicit confirmation** (`yes`, `proceed`, or `go`). If the user wants changes, re-invoke `plan` with the feedback.

## Phase 2 — Bootstrap (only if matrix includes B0)

Always executed by the **main session**, regardless of backend, since neither a subagent nor a teammate can reliably scaffold a brand-new repo:

1. Write `CLAUDE.md` at repo root (stack, conventions, key paths from the plan-agent draft).
2. Write `.claude/settings.local.json` (minimal allowlist — leave permissions empty by default so the user can opt in).
3. After both files exist, dispatch the B0 parallel agents (typically `codemap`) using the chosen backend.

## Phase 3 — Batched dispatch (B1 → B2 → B3 → B4 → B5)

For each batch in the matrix, in order. Wait for the entire batch to return before advancing to the next.

### B1 — Pre-implementation (parallel)

Dispatch every agent listed in the batch concurrently:
- **Subagent backend**: single message with multiple Agent tool calls.
- **`--team` backend**: spawn teammates for each role; they self-claim from the shared task list.

### B2 — Implementation (serial, main session)

Main session writes the code, task-by-task in the order shown. Do NOT dispatch agents here.

Apply two principles while implementing:
- [docs/principles/surgical-edits.md](../docs/principles/surgical-edits.md) — minimum-diff, no opportunistic refactors, no abstractions you don't need yet.
- [docs/principles/readability.md](../docs/principles/readability.md) — R1–R8 by default (switch over else-if ladders, guard clauses, name booleans for truth, no magic literals, etc.). Rule of 3 for DRY — extract on the third duplication, not the second.

### B3 — Review (parallel)

Dispatch all reviewer agents listed in the matrix concurrently. Each reviewer returns findings grouped by severity (Critical / High / Medium / Low / Nit).

In `--team` mode, reviewers may message each other before reporting up — e.g. security-reviewer can ping ts-code-reviewer to ask "is this codepath ever reached with untrusted input?" before flagging.

### B4 — Fix (serial, main session)

**This is the new strict ordering.** The main session applies fixes for findings at severity **Critical, High, Medium, and Low**.

- **Skip**: Nits and pure style preferences ("consider renaming X for clarity") — these are taste, not correctness.
- **Surgical**: Every fix follows [docs/principles/surgical-edits.md](../docs/principles/surgical-edits.md). Apply the minimum diff that closes the finding.
- **Threshold**: If a single fix would touch more than 30 lines, **stop and ask the user before applying** — don't silently expand scope.
- **No bundling**: One fix per finding. Do not opportunistically refactor adjacent code while applying a fix.
- **Re-review**: After all in-scope fixes are applied, re-dispatch ONLY the reviewers whose findings were addressed (parallel) to verify the findings are closed. If new findings emerge from the fixes, repeat B4 for those. Cap at 2 re-review cycles to avoid loops — if findings persist past 2 cycles, surface to the user.

### B5 — Docs (parallel)

Only runs after B4 closes out all in-scope findings.

- `codemap` — refresh `/docs/codemaps/` for changed modules.
- `update-docs` (optional) — sync any other docs referencing changed code.

**Do NOT run B5 before B4.** Out-of-date code references in docs are worse than missing references.

## Phase 4 — Aggregate

After B5 returns:

1. Collect each agent's report.
2. Group findings by severity and resolution status (Fixed / Skipped-as-nit / Still-open / Deferred).
3. Emit a single consolidated report with:
   - Files modified / created (from the main session log).
   - Per-agent findings, deduplicated.
   - Open follow-ups (anything deferred or above-threshold).
4. If `--team` mode: instruct the lead to clean up the team.

## Skip conditions

- If the plan agent emits an empty B1 or B3, skip that batch silently.
- If B3 emits zero findings at Low+, skip B4 entirely and go straight to B5.
- If `/docs/codemaps/` doesn't exist and `codemap` is not in B0, add it to B5 automatically.
- If any task `Touches` includes `auth`, `payments`, or `user-data` but `security-reviewer` is not in B3, halt and re-prompt the plan agent — the matrix violated the security rule.

## Failure handling

- If any agent in a parallel batch (B1 / B3 / B5) returns an error, log it but still let the rest of the batch complete (don't short-circuit).
- After the batch finishes, surface the failure in the aggregate report under **Blocked**.
- In B4, if a fix attempt fails (test breaks, type error, build error), stop the fix loop, surface the failure, and let the user decide whether to retry or defer.
- Do not auto-retry. Let the user decide.

## When to use

- **Starting a brand-new project** — auto-bootstraps `.claude/` + `CLAUDE.md`.
- **New feature on an existing project** — 3+ files or multiple domains will change.
- **Modifying an existing feature** — adding/changing/removing behavior in code that already ships. The diff-scoped plan keeps the matrix focused on what's actually touched.
- **Cross-cutting refactor** — same plan/dispatch flow, but the implementation phase (B2) does the refactor and B3 reviewers verify no behavior changed.
- **Anything you'd previously run as `/plan` then manually invoke 3–4 reviewer agents for.**
- Add `--team` when the change is high-stakes and you want reviewers to debate findings (auth changes, payment flows, complex refactors).

## When NOT to use

- Single-file, single-concern edits — overhead isn't worth it. Just edit.
- Pure debugging — use `/debug-bug` or invoke the `debugger` agent directly.
- Pure dead-code removal — use `/refactor-clean` (knip-driven, faster).
- Token-budget-constrained sessions — `--team` significantly multiplies token cost; default to the subagent backend.

## Related

- `/plan` — planning only, no dispatch. Use when you want manual control.
- `/orchestrate` — sequential workflow with handoffs (for tasks that need strict ordering).
- `/multi-frontend`, `/multi-backend` — pre-baked parallel roles. Use when you already know the domain.
- [docs/principles/surgical-edits.md](../docs/principles/surgical-edits.md) — minimum-diff rule that B2 implementation and B4 fixes follow.
- [docs/principles/readability.md](../docs/principles/readability.md) — R1–R8 + Rule-of-3 DRY, enforced by all reviewers.

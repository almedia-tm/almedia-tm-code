---
description: Plan a feature or new project, then auto-dispatch the right agents in dependency-aware parallel batches. Bootstraps CLAUDE.md and .claude/ on new projects before planning.
---

# Plan + Execute Command

Single command that combines planning and content-aware parallel agent dispatch. Unlike `/orchestrate` (sequential, pre-baked workflows) and `/multi-frontend` / `/multi-backend` (parallel but pre-baked roles), `/plan-execute` decides which agents to dispatch **based on what the plan actually touches** — and runs them in **dependency-aware parallel batches**.

## Usage
`/plan-execute <task description>`

## Phase 1 — Plan

1. Invoke the `plan` agent with the task description.
2. The plan agent:
   - Detects whether this is a new project (missing CLAUDE.md AND .claude/).
   - Produces phased tasks with dependencies.
   - Emits a **Dispatch Matrix** (batches B0–B3) that this command will execute.
3. Show the matrix to the user.
4. **STOP. Wait for explicit confirmation** (`yes`, `proceed`, or `go`). If the user wants changes, re-invoke `plan` with the feedback.

## Phase 2 — Bootstrap (only if matrix includes B0)

Executed by the **main session**, not by sub-agents, since sub-agents can't reliably scaffold a brand-new repo:

1. Write `CLAUDE.md` at repo root (stack, conventions, key paths from the plan-agent draft).
2. Write `.claude/settings.local.json` (minimal allowlist — leave permissions empty by default so the user can opt in).
3. After both files exist, dispatch the B0 parallel agents (typically `codemap`) using the Agent tool.

## Phase 3 — Batched parallel dispatch

For each batch in the matrix, in order (B1 → B2 → B3):

1. **Read the batch** from the plan agent's matrix.
2. **B2 (Implementation)**: main session writes the code, task-by-task in the order shown. Do NOT dispatch agents here.
3. **B1 / B3 (parallel)**: dispatch every agent listed in the batch using **a single message with multiple Agent tool calls** so they execute concurrently. Wait for the entire batch to return before advancing to the next batch.

### Dispatch pattern (parallel)

Use this pattern for B1 and B3:

```
# ONE message with N parallel Agent tool calls
- Agent: <agent-1> — "<task description from matrix>"
- Agent: <agent-2> — "<task description from matrix>"
- Agent: <agent-3> — "<task description from matrix>"
```

Do NOT chain them sequentially. The whole point of the matrix is that intra-batch tasks have no inter-dependency and are safe to fan out.

## Phase 4 — Aggregate

After B3 returns:

1. Collect each agent's report.
2. Group findings by severity (Critical → High → Medium → Low).
3. Emit a single consolidated report with:
   - Files modified / created (from the main session log).
   - Per-agent findings, deduplicated.
   - Open follow-ups.

## Skip conditions

- If the plan agent emits an empty B1 or B3, skip that batch silently.
- If `/docs/codemaps/` doesn't exist and `codemap` is not in B0, add it to B3 automatically.
- If any task `Touches` includes `auth`, `payments`, or `user-data` but `security-reviewer` is not in B3, halt and re-prompt the plan agent — the matrix violated the security rule.

## When to use
- Starting a brand-new project (auto-bootstraps `.claude/` + `CLAUDE.md`).
- New feature where 3+ files / multiple domains will change.
- Anything you'd previously run as `/plan` then manually invoke 3-4 reviewer agents for.

## When NOT to use
- Single-file edits or trivial changes — overhead isn't worth it. Just edit.
- Pure debugging — use `/debug-bug` or invoke the `debugger` agent directly.
- Pure refactor with no new behavior — use `/refactor-clean`.

## Failure handling

- If any agent in a parallel batch returns an error, log it but still let the rest of the batch complete (don't short-circuit).
- After the batch finishes, surface the failure in the aggregate report under **Blocked**.
- Do not auto-retry. Let the user decide whether to re-dispatch the failed agent manually.

## Related
- `/plan` — planning only, no dispatch. Use when you want manual control.
- `/orchestrate` — sequential workflow with handoffs (for tasks that need strict ordering).
- `/multi-frontend`, `/multi-backend` — pre-baked parallel roles. Use when you already know the domain.

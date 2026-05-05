---
description: Dispatch multiple Claude Code agents in parallel for large API/DB/Server-Action tasks. Splits work across architect, db-reviewer, security-reviewer, and tester agents.
---

# Multi-Backend Command

Coordinate parallel Claude Code agents for large backend work.

## Usage
`/multi-backend <task description>`

## How It Works
1. Read the task description.
2. Split it into independent sub-tasks:
   - **Architecture** → `architect` agent (service boundaries, data flow)
   - **Schema/DB** → `db-reviewer` agent (review proposed migrations/queries)
   - **Implementation** → main session (writes the code)
   - **Security** → `security-reviewer` agent (post-implementation auth/payment audit)
   - **Tests** → `tester` agent (write Vitest tests for new logic)
3. Dispatch agents in parallel using the `Agent` tool.
4. Aggregate results.

## Dispatch Pattern
```
# Single message with parallel Agent calls
- Agent: architect — "Design service boundaries for <task>"
- Agent: db-reviewer — "Review the proposed schema changes"
- Agent: tester — "Write tests for <new functions>"
(Implementation happens in main session)
```

## Output
A consolidated report covering: architecture, DB review, test scaffolding, security checklist, implementation plan.

## When to Use
- Backend tasks affecting 3+ files
- New API endpoints with associated schema changes
- Refactors crossing service boundaries
- Anything touching auth, payments, or user data (security-reviewer mandatory)

## When NOT to Use
- Single-file edits
- Frontend-heavy work (use `/multi-frontend` instead)

---
description: Dispatch multiple Claude Code agents in parallel for large UI/UX tasks. Splits work across architect, ts-code-reviewer, e2e, and tester agents.
---

# Multi-Frontend Command

Coordinate parallel Claude Code agents for large frontend work. Unlike sequential workflows, this command dispatches multiple specialized agents to work concurrently on independent parts of a UI/UX task.

## Usage
`/multi-frontend <task description>`

## How It Works
1. Read the task description.
2. Split it into independent sub-tasks based on responsibility:
   - **Architecture** → `architect` agent (component tree, module boundaries)
   - **Implementation** → main session (writes the code)
   - **Review** → `ts-code-reviewer` agent (post-implementation review)
   - **E2E** → `e2e` agent (write Playwright tests for new flows)
3. Dispatch agents in parallel using the `Agent` tool — multiple tool calls in a single message.
4. Aggregate results.

## Dispatch Pattern
```
# Single message with parallel Agent calls
- Agent: architect — "Design component hierarchy for <task>"
- Agent: e2e — "Write Playwright tests for <flows>"
(Implementation happens in main session in parallel)
```

## Output
A consolidated report:
- Architecture decisions
- Test scaffolding
- Implementation plan
- Review checklist for post-implementation

## When to Use
- Frontend tasks affecting 3+ files
- New feature pages with multiple components
- Refactors crossing component boundaries
- Tasks where review/testing can run alongside implementation

## When NOT to Use
- Single-file edits (overhead not worth it)
- Tasks requiring strict sequential dependency
- Backend-heavy work (use `/multi-backend` instead)

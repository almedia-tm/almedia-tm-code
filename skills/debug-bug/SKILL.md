---
name: debug-bug
description: Use when a stack trace appears, a test fails, code throws unexpectedly, or the user says something is broken. Triggers on phrases like "error", "broken", "isn't working", "failing", "why does X", "this used to work".
---

# Debug Bug Skill

The user has a bug. Apply the systematic debugging methodology.

## Action
Invoke the `debugger` agent. Provide:
- The exact error message and stack trace (if available)
- The reproduction steps
- Recent file changes (`git log --oneline -10`)

The `debugger` agent will:
1. Reproduce the bug
2. Isolate the layer (UI / API / DB / RLS / external service)
3. Trace the root cause
4. Apply a minimal fix
5. Write a regression test

## Do not
- Guess at fixes without first reproducing.
- Apply broad refactoring while debugging — the fix should be minimal.
- Skip the regression test.

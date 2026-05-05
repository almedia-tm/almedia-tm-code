---
name: verify-done
description: Use when the user is about to claim work is complete or asks if something is done. Triggers on phrases like "is this done", "am I finished", "ready to ship", "all set".
---

# Verify Done Skill

The user is about to declare work complete. Run the verification pipeline.

## Action
Invoke `/verify` slash command (full mode by default). This runs:
1. Build check
2. Type check
3. Lint
4. Test suite + coverage
5. Console.log audit
6. Git status

Output a structured PASS/FAIL report. Do not declare anything "done" until all checks pass.

## Do not
- Mark complete without running tests.
- Mark complete with uncommitted changes you didn't intend.

---
name: pre-commit-check
description: Use before commit, before push, before opening a PR. Triggers on phrases like "ready to commit", "before I push", "ready for PR", "commit this", "push to main".
---

# Pre-Commit Check Skill

The user is about to commit. Run the full quality gate.

## Action
Invoke `/quality-gate` slash command. This runs:
1. Formatter check
2. Lint / type check
3. Language-appropriate code reviewer agent on changed files
4. `security-reviewer` if changed files touch auth/payment/user-data

If anything fails, output the remediation list and BLOCK the commit. If everything passes, output a green summary.

## Do not
- Skip the gate "just this once" — that's how broken commits land on main.

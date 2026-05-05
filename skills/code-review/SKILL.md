---
name: code-review
description: Use when the user asks to review code, check a PR, validate changes before merging, or audit recent edits. Triggers on phrases like "review my code", "is this good", "check this PR", "before I merge", "look over this".
---

# Code Review Skill

The user wants their code reviewed. Run a quality + security review on uncommitted changes.

## Action
1. Detect the primary language of changed files (TypeScript, Python, Go, Rust).
2. Invoke the matching reviewer agent:
   - `.ts/.tsx/.js/.jsx` → `ts-code-reviewer`
   - `.py` → `python-code-reviewer`
   - `.go` → `go-code-reviewer`
   - `.rs` → `rust-code-reviewer`
3. If changed files include auth, payment, webhook, or user-data code paths, ALSO invoke `security-reviewer` (run in parallel with the language reviewer).
4. Aggregate findings by severity (Critical → High → Medium).
5. Output a single consolidated report with file:line references and fix suggestions.

## Do not
- Skip security review on auth/payment/webhook code.
- Auto-fix issues — surface them for the user.

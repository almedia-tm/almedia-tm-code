---
name: fix-build
description: Use when build, compile, or transpile output contains errors. Triggers when the conversation includes build error output (e.g., "error TS2322", "cannot find module", "compilation failed", "build error", red output from npm run build / cargo build / go build / mypy).
---

# Fix Build Skill

The build is failing. Fix it incrementally with minimal diffs.

## Action
Invoke the `build-fixer` agent with the full error output. The agent will:
1. Group errors by file and dependency order
2. Fix one error at a time
3. Re-run the build after each fix
4. Stop and ask if a fix introduces more errors than it resolves

## Do not
- Apply broad refactoring as a "fix".
- Disable lint rules with `// eslint-disable` to silence errors.
- Use `any` to silence TypeScript errors — use `unknown` and narrow.

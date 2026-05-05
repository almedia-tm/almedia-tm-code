---
description: Comprehensive security and quality review of uncommitted changes; blocks commit on critical or high issues.
---

# Code Review

Comprehensive security and quality review of uncommitted changes:

1. Get changed files: git diff --name-only HEAD

2. For each changed file, check for:

**Security Issues (CRITICAL):**
- Hardcoded credentials, API keys, tokens
- SQL injection vulnerabilities
- XSS vulnerabilities
- Missing input validation
- Insecure dependencies
- Path traversal risks

**Code Quality (HIGH):**
- Functions > 50 lines
- Files > 800 lines
- Nesting depth > 4 levels
- Missing error handling
- console.log statements
- TODO/FIXME comments
- Missing JSDoc for public APIs

**Reuse before extract (HIGH):**
- Before recommending "extract to a helper" / "split this" / "move to utils", grep the codebase for an existing function with the same purpose (look in `lib/`, `utils/`, `common/`, shared modules; search by verb prefixes and signature shape).
- If a near-match exists, recommend reusing or extending it — do not propose a duplicate.
- Only recommend a brand-new function when nothing existing fits, and say so explicitly in the recommendation.

**Readability (HIGH):**
- 3+ `else if` (or `elif`) branches dispatching on one value where `switch`/`match`/dispatch-table would be clearer
- Nested ternaries beyond one level
- Boolean flag parameters that toggle behavior — split or replace with a typed enum
- Cryptic identifiers — single letters outside conventional loop counters, unexplained abbreviations
- Deeply nested conditions where guard clauses (early return) would flatten the function

**Best Practices (MEDIUM):**
- Mutation patterns (use immutable instead)
- Emoji usage in code/comments
- Missing tests for new code
- Accessibility issues (a11y)

3. Generate report with:
   - Severity: CRITICAL, HIGH, MEDIUM, LOW
   - File location and line numbers
   - Issue description
   - Suggested fix

4. Block commit if CRITICAL or HIGH issues found

Never approve code with security vulnerabilities!

# Catalog

Everything that ships in `almedia-code`, organized by type. Use this as a reference for what to invoke when.

---

## Agents (17)

You invoke agents explicitly via the `Agent` tool or via slash commands that wrap them.

### Code review (4)
- **`ts-code-reviewer`** — TypeScript: immutability, file size, error handling, no `any`. Use after writing TS.
- **`python-code-reviewer`** — Python: PEP 8, security, type hints, Pythonic patterns.
- **`go-code-reviewer`** — Go: idiomatic patterns, concurrency, error wrapping.
- **`rust-code-reviewer`** — Rust: ownership, lifetimes, unsafe usage, error handling.

### Quality / safety (3)
- **`security-reviewer`** — OWASP, RLS, Stripe webhooks, secrets. Run after any change to auth/payment/user data.
- **`silent-failure-hunter`** — Empty catches, swallowed exceptions, dangerous fallbacks.
- **`db-reviewer`** — Supabase RLS, migrations, Prisma schema/queries.

### Workflow (5)
- **`plan`** — Break a feature/project into phased tasks with dependencies.
- **`architect`** — Define folder structure and module boundaries.
- **`tester`** — Enforce TDD (RED → GREEN → REFACTOR), 80%+ coverage with Vitest.
- **`debugger`** — Root-cause analysis with Supabase RLS silent-failure protocol.
- **`build-fixer`** — Fix build/compile errors across stacks (TS, Python, Go, Rust, Java) with minimal diffs.

### Maintenance (3)
- **`refactor`** — knip dead-code removal, dedup, file splitting.
- **`codemap`** — Maintain `/docs/codemaps/` — file/folder docs.
- **`harness`** — Audit and tune your Claude Code config for cost/reliability.

### Operations (2)
- **`e2e`** — Playwright setup + auth/payment/core flow tests.
- **`loop`** — Manage long-running autonomous multi-agent loops.

---

## Slash commands (23)

Type these in Claude Code with the plugin namespace prefix: `/almedia-code:<name>` (e.g. `/almedia-code:plan`). The bare `/<name>` form below is shown for readability.

### Quality gates
- **`/code-review`** — Quality + security review of uncommitted changes.
- **`/quality-gate`** — Formatter + lint + reviewer + security.
- **`/verify`** — Build + types + lint + tests + console.log audit.
- **`/checkpoint`** — Snapshot mid-session before a risky change.
- **`/test-coverage`** — Coverage analysis with gap detection.

### Workflow
- **`/plan`** — Run plan agent. Emits dispatch matrix. WAITS for user confirm before any code.
- **`/plan-execute`** — Plan + content-aware parallel agent dispatch. Auto-bootstraps `CLAUDE.md` + `.claude/` on new projects, then fans out reviewers/testers in dependency-aware batches.
- **`/tdd`** — RED → GREEN → REFACTOR.
- **`/orchestrate`** — Sequential agent workflow (feature/bugfix/refactor/security).
- **`/multi-frontend`** — Parallel agents for large UI/UX work (pre-baked frontend roles).
- **`/multi-backend`** — Parallel agents for large API/DB work (pre-baked backend roles).

### Operations
- **`/build-fix`** — Invoke build-fixer agent.
- **`/refactor-clean`** — knip + dedup + split.
- **`/e2e`** — Playwright auth/payment/core flows.
- **`/update-codemaps`** — Regenerate codemaps after structural change.
- **`/update-docs`** — Sync docs to code.
- **`/skill-create`** — Author a new skill from git history patterns.
- **`/sessions`** — List recent Claude Code sessions.

### Configuration
- **`/style`** — Switch active style (rigor/caveman/teacher/executive/default).
- **`/style-copy`** — Print active style for paste into Desktop/Web/Mobile.
- **`/harness-audit`** — Score your Claude Code config across 7 dimensions.
- **`/model-route`** — Recommend model tier (haiku/sonnet/opus) for current task.
- **`/review-pr`** — Multi-perspective PR review.

---

## Auto-routing skills (11)

Skills auto-trigger based on what you say to Claude. You don't invoke them directly — Claude picks them.

| Skill | Triggers when you say… | What happens |
|---|---|---|
| `code-review` | "review my code", "check this PR" | Routes to code-reviewer agent |
| `debug-bug` | a stack trace, "X isn't working" | Routes to `debugger` |
| `start-feature` | "add", "build", "implement" | `/plan` → `/tdd` |
| `fix-build` | build error output | Routes to `build-fixer` |
| `pre-commit-check` | "ready to commit" | `/quality-gate` |
| `verify-done` | "is this done?" | `/verify` |
| `update-codemap` | structural change discussed | `/update-codemaps` |
| `switch-style` | "be more concise", "TL;DR" | `/style` |
| `db-change` | new migration, schema diff | Routes to `db-reviewer` |
| `security-check` | auth/payment/webhook code | Routes to `security-reviewer` |
| `freecash-design` | "design X", "mock up Y", "Freecash" + UI intent | Renders Freecash-accurate HTML/React against `tokens.md` + `components.md` + `layouts.md` + reference screens |

---

## Output styles (5)

Pick once, persistent across sessions via `~/.claude/.style-active`. Switch with `/style <name>`.

| Style | When to use |
|---|---|
| `rigor` | You want Claude to question requirements and surface assumptions before implementing. Terse output. |
| `caveman` | You're token-budget-constrained and OK with cave-speak (50-70% output token reduction). |
| `teacher` | You're learning the topic and want walkthroughs. |
| `executive` | You want decisions first, details on demand. |
| `default` | Vanilla Claude Code. No style injection. |

Detailed style guides: [docs/styles.md](styles.md)

---

## Hooks (2, both on by default)

| Hook | Event | What it does |
|---|---|---|
| `style-activate` | SessionStart | Reads `~/.claude/.style-active` and injects the matching style into every session. < 50 ms cold start. |
| `codemap-nudge` | PreToolUse on Bash grep/find | If `docs/codemaps/` exists, nudges Claude to read the codemap before grepping. |

---

## Optional add-ons

Both off by default. Enable during `init` or via `npx @almedia-tm/almedia-code init --reconfigure`.

| Add-on | Source | License | Mechanism |
|---|---|---|---|
| `caveman-shrink` MCP | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | MIT | Compresses input tokens before transmission |
| `claude-mem` | [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | AGPL-3.0 (invoked, not vendored) | Persistent memory across sessions |

---

## Who's this for?

- **Developers** (TS / Python / Go / Rust): use the language reviewers, `/tdd`, `/quality-gate`, `/code-review`, debugger.
- **Database / backend engineers**: `db-reviewer`, `security-reviewer`, `/multi-backend`.
- **Frontend engineers**: `/multi-frontend`, `e2e`, `/update-codemaps`.
- **Designers / frontend on Freecash surfaces**: the `freecash-design` skill auto-triggers on design intent and renders Freecash-accurate HTML/React using the embedded tokens, components, and layout system.
- **Non-technical users / writers / PMs**: pick the `executive` or `teacher` style. The agents and commands are still useful for code-adjacent work; the style takes the technical jargon out of the conversation.
- **Cost-conscious users**: enable `caveman-shrink`, switch to `caveman` style for max savings.

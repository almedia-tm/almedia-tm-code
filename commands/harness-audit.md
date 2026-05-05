---
description: Audit the user's Claude Code harness for inefficiency, scope overlap, vague triggers, hook latency, and unused MCP servers.
---

# Harness Audit Command

Take stock of what you actually have configured. The longer a Claude Code setup runs, the more it accumulates: half-overlapping agents, hooks that quietly add seconds to every Bash call, MCP servers nobody invokes anymore, slash commands shadowing each other across plugins. `/harness-audit` looks at all of it and tells you where the slack is.

## Usage

```
/almedia-code:harness-audit [scope]
```

Where `scope` is one of:

- `all` — default; runs every audit below.
- `agents` — agent inventory and scope-overlap detection.
- `commands` — slash command inventory and namespace collisions.
- `skills` — skill inventory and auto-trigger description quality.
- `hooks` — hook inventory and per-tool-call latency budget.
- `mcp` — MCP server inventory and recent-use check.

## What it does

The slash command delegates to the `harness` agent and passes the chosen scope. The agent does the work below; this command exists to standardise the inputs and the report shape.

1. **Read configuration** — `~/.claude/settings.json` (permissions, hooks, MCP servers), `~/.claude/agents/`, `~/.claude/commands/`, `~/.claude/skills/`, plus every installed plugin's manifest.
2. **Inventory by category** — produce a flat list per category with name, source plugin, file path, and one-line description.
3. **Detect overlaps** — agents with similar `description` fields invoking each other's territory; commands with the same name from different plugins (Claude Code's namespacing avoids collision but it confuses humans); skills whose triggers overlap so the wrong one fires.
4. **Score description quality** — a `description` is "vague" if it lacks at least one trigger phrase and one outcome. Vague descriptions cause wrong invocation, which is more expensive than no invocation at all.
5. **Measure hook latency** — read `hooks` arrays in `settings.json` and across plugins. Flag any `PreToolUse` matcher that runs on every Bash/Edit/Write call without a fast-path early return. Suggest moving `*`-matchers to specific tools.
6. **Check MCP usage** — for each MCP server, look at the most recent transcript (if available) for invocations. Servers untouched in 30+ days are candidates for unload.

## Scoring rubric (0–10 each)

The agent produces a 7-dimension score:

- **Tool Coverage** — does the catalog cover the user's actual stack? (Detected from recent file types in transcripts.)
- **Context Efficiency** — average per-prompt context size; load-bearing skills compact; auto-injected context kept lean.
- **Quality Gates** — pre-commit / pre-PR review coverage; presence of language-appropriate reviewer agents.
- **Memory Persistence** — claude-mem health if installed; `N/A` if not.
- **Eval Coverage** — presence of `tester` invocations on recent feature work; coverage thresholds enforced.
- **Security Guardrails** — `security-reviewer` invoked on auth/payment/user-data paths; secret-scanning hooks present.
- **Cost Efficiency** — model routing alignment with task complexity; absence of Opus-on-trivial-tasks patterns.

## Output shape

```
HARNESS AUDIT — scope: <scope>
─────────────────────────────────────────────
Tool Coverage          : 8/10  — TS, Python covered; Rust catalog thin
Context Efficiency     : 6/10  — three skills auto-load > 4kB on every session
Quality Gates          : 9/10  — ts-code-reviewer + security-reviewer wired
Memory Persistence     : N/A
Eval Coverage          : 5/10  — tester invoked on 40% of recent features
Security Guardrails    : 8/10
Cost Efficiency        : 7/10  — opus pinned on debugger; consider sonnet

Overall                : 7.2/10

Top 3 Actions
1. Drop the `*`-matcher PreToolUse hook adding ~120ms per Bash call → move to specific tools.
2. Disable two MCP servers untouched in 30+ days (linear-old, jira-test).
3. Tighten the `silent-failure-hunter` description — currently overlaps with `ts-code-reviewer`.
```

## Notes

- The audit reads files; it does not modify configuration. Apply recommendations manually.
- Scores are heuristic. They surface attention, not absolute truth.
- Re-run after applying changes to confirm the trend is improving.

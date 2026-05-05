---
name: update-codemap
description: Use after a structural codebase change — new top-level directory, deleted module, moved files, renamed packages. Triggers when the conversation discusses architectural changes that would invalidate existing codemaps.
---

# Update Codemap Skill

The codebase structure changed. Codemaps need updating.

## Action
Invoke `/update-codemaps` slash command. The `codemap` agent will:
1. Scan project structure
2. Diff against existing `docs/codemaps/`
3. Update or create folder-level READMEs
4. Update the project-level `docs/codemaps/README.md`
5. Add a freshness header

## Do not
- Skip codemap updates — stale codemaps mislead future agents.
- Hand-edit codemaps — let the agent regenerate them.

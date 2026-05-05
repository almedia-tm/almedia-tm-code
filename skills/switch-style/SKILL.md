---
name: switch-style
description: Use when the user asks for a different output style — shorter, longer, more concise, more verbose, in a specific tone, or "talk like X". Triggers on phrases like "be more concise", "give me TL;DR", "explain like a teacher", "talk like an exec", "be terse".
---

# Switch Style Skill

The user wants a different output style. Map their request to one of the 5 style profiles and switch.

## Action
1. Map intent to profile:
   - "concise", "terse", "main points only", "no fluff" → `rigor`
   - "TL;DR", "executive summary", "decision first" → `executive`
   - "explain", "verbose", "walk me through" → `teacher`
   - "compress", "save tokens", "ultra terse" → `caveman`
   - "normal", "default", "vanilla" → `default`
2. Invoke `/style <profile>` to set the active style.
3. Tell the user the new style takes effect on the next session.
4. Optionally suggest `/style-copy` if they're using Claude Desktop / Web / Mobile.

## Do not
- Switch styles silently — confirm the choice.
- Apply the new style retroactively in the current session — only `SessionStart` injects it.

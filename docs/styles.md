# Output Styles — Detailed Guide

`almedia-code` ships 5 output styles. The active style is set via `/style <name>` and persists in `~/.claude/.style-active`. The `style-activate` SessionStart hook injects the corresponding style markdown into every new session.

---

## rigor

**Use when:** You want a thinking partner that pushes back on your specs before writing code.

**Behavior:**
- Asks clarifying questions before implementing.
- Numbers and surfaces assumptions explicitly. Waits for confirmation.
- For design tasks: visualizes (ASCII diagrams, mockups, file-tree previews) before code.
- Output is bullet-style, terse, no preamble.

**Example output:**
> 1. Assumption: you want this in TypeScript, not Python. Confirm?
> 2. Trade-off: this can be a server action OR a route handler. Server action is simpler; route handler is reusable from external clients. Which?
> 3. Open question: where does the auth check live — middleware or inside the action?

---

## caveman

**Use when:** Token budget is tight and you accept compressed cave-speak in exchange for ~50-70% fewer output tokens.

**Behavior:**
- Drops articles (a/an/the) and most pronouns.
- Short sentences. Period.
- Code stays correct and complete — caveman does NOT mangle code.

**Example output:**
> check file. function exist. fix import. test pass.

---

## teacher

**Use when:** You're learning the topic and want walkthroughs.

**Behavior:**
- Output structure: Goal → Walkthrough → Code → Common pitfalls → Next step.
- Explains the *why* before the *what*.
- Defines jargon parenthetically on first use.
- Encourages experimentation.

---

## executive

**Use when:** You want decisions first, details on demand.

**Behavior:**
- Output structure: TL;DR (≤20 words) → Why this matters (≤25 words) → Details (only if asked).
- Decision before reasoning. Numbers and dates beat adjectives.
- No preamble. No recap.

---

## default

**Use when:** You don't want any style override. Vanilla Claude Code with your CLAUDE.md instructions.

**Behavior:** No style markdown is injected. The `style-activate` hook treats `default` as a no-op.

---

## Custom styles

Want your own style? Author a markdown file at `~/.claude/plugins/cache/almedia-code/almedia-code/<version>/styles/<your-name>.md`. The format is loose — anything you write becomes the SessionStart context.

Note: custom styles are not (yet) automatically picked up by `/style`. Edit the `VALID` list in `bin/almedia-code.js` and the `style.md` slash command. v1.1 will support per-user style files in `~/.claude/styles/` directly.

---

## Using styles outside Claude Code (Desktop / Web / Mobile)

Plugins don't run there. Get the style content with `/style-copy <name>` (or `npx @almedia-tm/almedia-code style <name>` then copy the file content) and paste into:

- **Claude Desktop:** Settings → Personalization → Custom Style
- **Claude.ai (Web):** Settings → custom style, OR Project → Custom Instructions
- **iOS / Android:** Account Settings → custom style

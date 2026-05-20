# almedia-code

> Token-optimized Claude Code bootstrap: 17 agents, 22 commands, 11 auto-routing skills (incl. Freecash design system), 5 output styles, 2 hooks.

Built for technical and non-technical users who want a working Claude Code setup without the bloat.

## Quickstart

```bash
npx @almedia-tm/almedia-code init
```

That's it. The installer:
1. Installs Claude Code if you don't have it
2. Registers this repo as a plugin marketplace
3. Installs the plugin
4. Walks you through a 30-second setup (style picker, optional add-ons, tour)

## Requirements

- **Node 18+** (only requirement). We auto-install Claude Code for you.
- **macOS, Linux, or Windows** — fully OS-agnostic, no bash required.

## What you get

| Type | Count | Purpose |
|---|---|---|
| Agents | 17 | Specialized assistants you invoke for review, debug, plan, build-fix, etc. |
| Slash commands | 22 | One-keystroke workflows (`/plan`, `/tdd`, `/code-review`, …) |
| Skills | 11 | Auto-routing wrappers — Claude picks the right tool based on what you ask (incl. `freecash-design`) |
| Output styles | 5 | Choose how Claude talks to you: rigor, caveman, teacher, executive, default |
| Hooks | 2 | Style activator + codemap nudge — both Node, both fast |

Full catalog with descriptions: [docs/catalog.md](docs/catalog.md)

## Output styles

The signature feature. Pick once, persistent across sessions.

```bash
/style rigor       # terse, asks first, surfaces assumptions
/style caveman     # compressed cave-speak (max token savings)
/style teacher     # verbose, walks reasoning
/style executive   # TL;DR + Why this matters + details
/style default     # vanilla Claude Code
```

Using **Claude Desktop / Web / Mobile**? Plugins don't run there. Use `/style-copy` to print the active style markdown to stdout (and clipboard) — paste into your custom-instructions field.

## Optional add-ons

Off by default. Enable with flags during init:

```bash
npx @almedia-tm/almedia-code init --with-shrink   # input-token compression MCP
npx @almedia-tm/almedia-code init --with-memory   # persistent memory (claude-mem, AGPL, uses Anthropic API tokens)
```

## Update

```bash
npx @almedia-tm/almedia-code update                # pull latest plugin
npx @almedia-tm/almedia-code update --reconfigure  # also re-run the wizard
```

## Uninstall

```bash
npx @almedia-tm/almedia-code uninstall
```

## License

Almedia Proprietary License v1.0 (German jurisdiction). See [LICENSE](LICENSE).

Non-Almedia parties may install and execute the unmodified Software and view source for evaluation, but may not copy, fork, modify, redistribute, sublicense, or build a substantially similar product. No third-party content is vendored. Optional add-ons (`caveman-shrink`, `claude-mem`) install from npm at user opt-in time and remain governed by their own licenses.

## Contributing

Issues at https://github.com/almedia-tm/almedia-tm-code. External code contributions are not accepted under the proprietary license; bug reports and feature requests are welcome.

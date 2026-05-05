# Troubleshooting

## `npx @almedia-tm/almedia-code init` fails with "Claude Code not found" after install

The `npm install -g @anthropic-ai/claude-code` step succeeded but the binary isn't on PATH. Solutions:

- **macOS / Linux:** ensure your global npm bin dir is on PATH. Find it: `npm config get prefix`. Add `<prefix>/bin` to your shell rc.
- **Windows:** restart your terminal after global install. Or use `npm root -g` to find where Claude Code was installed and add it manually.

## `claude plugin marketplace add almedia-tm/almedia-tm-code` returns 404

The repo isn't public, or the URL is wrong. Confirm:
- The repo `https://github.com/almedia-tm/almedia-tm-code` exists and is public (Almedia archived the older `almedia-tm/almedia-code` repo).
- You are running an up-to-date Claude Code (`claude --version`).

## Slash commands don't show up after install

Try restarting Claude Code. Plugins are loaded at startup. If still missing:
```bash
claude plugin list
```
should show `almedia-code@almedia-code`. If absent, re-run `npx @almedia-tm/almedia-code init`.

## My custom style isn't loading

The `style-activate` hook only loads styles named in its valid-list. v1 ships only `rigor`, `caveman`, `teacher`, `executive`, `default`. Custom-style support comes in v1.1.

## `caveman-shrink` MCP not compressing anything

Verify the MCP entry was added: `cat ~/.claude/settings.json | grep caveman-shrink`. If missing, run `npx @almedia-tm/almedia-code init --reconfigure` and check the box.

## Hook runs slowly

Time it:
```bash
time node hooks/scripts/style-activate.js
```
Should be under 100ms. If much slower, file an issue with your OS, Node version, and the timing.

## I want to disable the codemap-nudge hook

Edit `~/.claude/settings.json` and remove the `PreToolUse` Bash hook entry, or override its matcher.

## How do I report a bug?

https://github.com/almedia-tm/almedia-tm-code/issues

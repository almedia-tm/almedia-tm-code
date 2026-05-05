---
description: Switch active output style profile. Persistent across sessions.
---

# Style Command

Switch the active output style. The choice persists across sessions via `~/.claude/.style-active` and is injected by the `style-activate` SessionStart hook on every new session.

## Usage
`/style <profile>`

## Available Profiles
- `rigor` — Question requirements, surface assumptions, terse pointer-style output
- `caveman` — Compressed cave-speak for max token savings
- `teacher` — Verbose explanations, walks reasoning
- `executive` — TL;DR + Why this matters + details
- `default` — No style injection (vanilla Claude Code)

## Examples
```bash
/style rigor       # Set rigor as default
/style executive   # Switch to executive
/style default     # Disable style injection
/style             # Show current style
```

## Implementation
```bash
node -e "
const fs = require('fs');
const path = require('path');
const os = require('os');
const flag = path.join(os.homedir(), '.claude', '.style-active');
const arg = process.argv[1];
const valid = ['rigor', 'caveman', 'teacher', 'executive', 'default'];

if (!arg) {
  if (fs.existsSync(flag)) {
    console.log('Active style: ' + fs.readFileSync(flag, 'utf8').trim());
  } else {
    console.log('Active style: default (no flag set)');
  }
  console.log('Available: ' + valid.join(', '));
  process.exit(0);
}

if (!valid.includes(arg)) {
  console.error('Invalid style: ' + arg);
  console.error('Valid: ' + valid.join(', '));
  process.exit(1);
}

fs.mkdirSync(path.dirname(flag), { recursive: true });
fs.writeFileSync(flag, arg + '\n');
console.log('Active style set to: ' + arg);
console.log('Effect applies on next session.');
" "$ARGUMENTS"
```

## Notes
- Style takes effect on the **next** session (the SessionStart hook reads the flag).
- For Claude Desktop / Web / Mobile users, see `/style-copy` to get the style markdown for paste into custom-instructions.

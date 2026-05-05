---
description: Print the markdown content of a style profile for paste into Claude Desktop / Web / Mobile custom instructions.
---

# Style Copy Command

Print a style profile's markdown to stdout (and clipboard if available). Useful for surfaces that don't support Claude Code plugins (Desktop, Web, Mobile).

## Usage
`/style-copy [profile]`

If no profile given, copies the currently-active style.

## Implementation
```bash
node -e "
const fs = require('fs');
const path = require('path');
const os = require('os');

const arg = process.argv[1];
let profile = arg;
if (!profile) {
  const flag = path.join(os.homedir(), '.claude', '.style-active');
  profile = fs.existsSync(flag) ? fs.readFileSync(flag, 'utf8').trim() : 'default';
}

const root = process.env.CLAUDE_PLUGIN_ROOT || path.join(os.homedir(), '.claude');
const candidates = [
  path.join(root, 'styles', profile + '.md'),
  path.join(os.homedir(), '.claude', 'plugins', 'cache', 'almedia-code', 'almedia-code', '*', 'styles', profile + '.md'),
];

let content = null;
for (const p of candidates) {
  if (p.includes('*')) {
    const glob = require('child_process').execSync('ls ' + p + ' 2>/dev/null | head -1', { encoding: 'utf8' }).trim();
    if (glob && fs.existsSync(glob)) { content = fs.readFileSync(glob, 'utf8'); break; }
  } else if (fs.existsSync(p)) {
    content = fs.readFileSync(p, 'utf8');
    break;
  }
}

if (!content) {
  console.error('Style profile not found: ' + profile);
  process.exit(1);
}

console.log(content);

// Try to copy to clipboard
try {
  const clip = require('clipboardy');
  clip.writeSync(content);
  console.error('(also copied to clipboard)');
} catch (_) {
  console.error('(clipboardy not installed; printed to stdout only)');
}
" "$ARGUMENTS"
```

## Where to paste
- **Claude Desktop:** Settings → Personalization → Custom Style
- **Claude.ai (Web):** Settings → custom style, or Project → Custom Instructions
- **Mobile (iOS/Android):** Account Settings → custom style

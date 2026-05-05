---
description: List Claude Code session history files in ~/.claude/sessions/ sorted by modification time (newest first).
---

# Sessions Command

List Claude Code session history files in `~/.claude/sessions/`.

> **Note (v1):** Slim implementation — list-only. Aliases, search, and metadata views are deferred to v1.1.

## Usage
`/sessions [list]`

## What It Does
1. Read `~/.claude/sessions/` directory
2. List session files sorted by modification time (newest first)
3. Show: filename, modified date, size, line count

## Implementation
```bash
node -e "
const fs = require('fs');
const path = require('path');
const os = require('os');
const dir = path.join(os.homedir(), '.claude', 'sessions');
if (!fs.existsSync(dir)) { console.log('No sessions directory at', dir); process.exit(0); }
const files = fs.readdirSync(dir)
  .map(name => {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    return { name, mtime: stat.mtime, size: stat.size };
  })
  .sort((a, b) => b.mtime - a.mtime)
  .slice(0, 20);
console.log('Sessions (newest 20):');
console.log('Date              Size       Filename');
console.log('────────────────────────────────────────────');
for (const f of files) {
  const date = f.mtime.toISOString().slice(0, 16).replace('T', ' ');
  const size = (f.size > 1024*1024) ? (f.size/1024/1024).toFixed(1) + ' MB' : (f.size/1024).toFixed(1) + ' KB';
  console.log(date.padEnd(17) + ' ' + size.padEnd(10) + ' ' + f.name);
}
"
```

## Notes
- Sessions are stored as JSONL/markdown files in `~/.claude/sessions/`
- Aliases will be added in v1.1
- For now, copy the filename from the listing to reference a session

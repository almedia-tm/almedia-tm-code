#!/usr/bin/env node
/**
 * SessionStart hook: read the active style profile from ~/.claude/.style-active,
 * load the matching style markdown from the plugin's styles/ directory, and emit
 * it as additionalContext so it's injected into every session.
 *
 * Cross-platform: pure Node, no shell dependencies.
 * Skip-fast on errors — never crash a session start.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

function emit(obj) {
  // Hook protocol: write JSON to stdout. Empty/no output = no injection.
  try {
    process.stdout.write(JSON.stringify(obj) + '\n');
  } catch (_) {
    // last-ditch: silent
  }
}

function main() {
  const flagPath = path.join(os.homedir(), '.claude', '.style-active');
  let style = 'default';

  try {
    if (fs.existsSync(flagPath)) {
      const raw = fs.readFileSync(flagPath, 'utf8').trim();
      if (raw) style = raw;
    }
  } catch (_) {
    // unreadable flag → fall through to default
  }

  if (style === 'default') {
    // No-op — no injection
    emit({});
    return;
  }

  const valid = ['rigor', 'caveman', 'teacher', 'executive', 'default'];
  if (!valid.includes(style)) {
    // Unknown style — silently degrade to default
    emit({});
    return;
  }

  const root = process.env.CLAUDE_PLUGIN_ROOT;
  if (!root) {
    emit({});
    return;
  }

  const stylePath = path.join(root, 'styles', style + '.md');

  let content = '';
  try {
    if (fs.existsSync(stylePath)) {
      content = fs.readFileSync(stylePath, 'utf8');
    }
  } catch (_) {
    emit({});
    return;
  }

  if (!content || content.length < 10) {
    emit({});
    return;
  }

  emit({ additionalContext: content });
}

try {
  main();
} catch (_) {
  // any uncaught error → no injection, never block the session
  process.stdout.write('{}\n');
  process.exit(0);
}

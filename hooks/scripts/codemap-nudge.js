#!/usr/bin/env node
/**
 * PreToolUse hook (Bash matcher): when Claude is about to run grep/rg/find/fd/ack/ag,
 * check if the project has docs/codemaps/. If yes, inject a hint to read the codemap first.
 *
 * Hook protocol: receive the tool input via stdin as JSON, optionally emit
 * { additionalContext: "..." } to stdout.
 *
 * Cross-platform: pure Node. Skip-fast on errors — never block tool execution.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SEARCH_TOOLS = /\b(grep|rg|ripgrep|find|fd|ack|ag)\b/;

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    let timeout = setTimeout(() => resolve(data), 250);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => { clearTimeout(timeout); resolve(data); });
    process.stdin.on('error', () => { clearTimeout(timeout); resolve(data); });
  });
}

function emit(obj) {
  try {
    process.stdout.write(JSON.stringify(obj) + '\n');
  } catch (_) {
    // silent
  }
}

async function main() {
  const stdinRaw = await readStdin();

  let toolInput;
  try {
    toolInput = JSON.parse(stdinRaw || '{}');
  } catch (_) {
    emit({});
    return;
  }

  // Tool-input shape varies; look for a `command` field anywhere reasonable
  const command =
    (toolInput && toolInput.tool_input && toolInput.tool_input.command) ||
    (toolInput && toolInput.command) ||
    '';

  if (typeof command !== 'string' || !SEARCH_TOOLS.test(command)) {
    emit({});
    return;
  }

  // Check if codemaps exist in cwd
  const cwd = process.cwd();
  const codemapDir = path.join(cwd, 'docs', 'codemaps');

  let codemapExists = false;
  try {
    codemapExists = fs.existsSync(codemapDir) && fs.statSync(codemapDir).isDirectory();
  } catch (_) {
    codemapExists = false;
  }

  if (!codemapExists) {
    emit({});
    return;
  }

  emit({
    additionalContext:
      'Tip: this project has a codemap at docs/codemaps/. ' +
      'Before using grep/find to locate code, consider reading docs/codemaps/README.md first — ' +
      'it summarizes the module structure and may answer your question without a full search.',
  });
}

main().catch(() => {
  process.stdout.write('{}\n');
  process.exit(0);
});

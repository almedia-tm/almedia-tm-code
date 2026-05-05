'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

function settingsPath() {
  return path.join(os.homedir(), '.claude', 'settings.json');
}

function backupPath() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  return path.join(os.homedir(), '.claude', '.almedia-backup-' + ts + '.json');
}

function read() {
  const p = settingsPath();
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    throw new Error('settings.json is invalid JSON: ' + err.message);
  }
}

function write(obj) {
  const p = settingsPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });

  // Backup existing
  if (fs.existsSync(p)) {
    fs.copyFileSync(p, backupPath());
  }

  // Atomic write: tmp file + rename
  const tmp = p + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, p);
}

/**
 * Deep-merge `patch` into the user's settings.json. Existing user keys are
 * preserved unless the patch explicitly overrides them. Arrays are concatenated
 * with deduplication on primitive elements.
 */
function merge(patch) {
  const current = read();
  const merged = deepMerge(current, patch);
  write(merged);
  return merged;
}

function deepMerge(a, b) {
  if (a === null || a === undefined) return b;
  if (b === null || b === undefined) return a;
  if (typeof a !== 'object' || typeof b !== 'object') return b;
  if (Array.isArray(a) && Array.isArray(b)) {
    // dedupe-merge primitives; for objects, append
    const result = a.slice();
    for (const item of b) {
      if (typeof item !== 'object' || item === null) {
        if (!result.includes(item)) result.push(item);
      } else {
        result.push(item);
      }
    }
    return result;
  }
  if (Array.isArray(a) || Array.isArray(b)) return b;
  const out = Object.assign({}, a);
  for (const k of Object.keys(b)) {
    out[k] = deepMerge(a[k], b[k]);
  }
  return out;
}

/**
 * Remove a key path from settings.json. Used by uninstall.
 * Path is a dot-separated string e.g. "mcpServers.caveman-shrink".
 */
function removeKey(keyPath) {
  const current = read();
  const parts = keyPath.split('.');
  let node = current;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!node || typeof node !== 'object') return current;
    node = node[parts[i]];
  }
  if (node && typeof node === 'object') {
    delete node[parts[parts.length - 1]];
    write(current);
  }
  return current;
}

module.exports = { read, write, merge, removeKey, settingsPath };

'use strict';

const { spawnSync } = require('child_process');

async function find() {
  // Try `claude --version` directly. spawnSync with shell:false works on all OSes
  // because the shell isn't needed; node spawns the binary by name.
  const cmd = process.platform === 'win32' ? 'claude.cmd' : 'claude';
  const candidates = [cmd, 'claude'];

  for (const candidate of candidates) {
    const result = spawnSync(candidate, ['--version'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
      timeout: 5000,
    });
    if (result.status === 0) {
      // Resolve actual path via `which` package if available
      try {
        const whichPkg = require('which');
        return whichPkg.sync(candidate, { nothrow: true }) || candidate;
      } catch (_) {
        return candidate;
      }
    }
  }
  return null;
}

module.exports = { find };

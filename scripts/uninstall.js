'use strict';

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const mcpShrink = require(path.join(__dirname, 'lib', 'mcp-shrink.js'));

function runCmd(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  return result.status;
}

async function run(argv) {
  const keepFlags = argv.includes('--keep-flags');
  const keepShrink = argv.includes('--keep-shrink');

  process.stdout.write('Uninstalling plugin almedia-code@almedia-code...\n');
  runCmd('claude', ['plugin', 'uninstall', 'almedia-code@almedia-code']);

  if (!keepFlags) {
    const flagPath = path.join(os.homedir(), '.claude', '.style-active');
    try {
      if (fs.existsSync(flagPath)) {
        fs.unlinkSync(flagPath);
        process.stdout.write('Removed ~/.claude/.style-active\n');
      }
    } catch (err) {
      process.stderr.write('Could not remove style flag: ' + err.message + '\n');
    }
  }

  if (!keepShrink) {
    try {
      mcpShrink.disable();
      process.stdout.write('Removed caveman-shrink MCP entry\n');
    } catch (err) {
      process.stderr.write('Could not remove shrink MCP: ' + err.message + '\n');
    }
  }

  process.stdout.write('Note: claude-mem (if installed) is not removed by this script.\n');
  process.stdout.write('To remove it: see https://github.com/thedotmack/claude-mem\n');
  return 0;
}

module.exports = { run };

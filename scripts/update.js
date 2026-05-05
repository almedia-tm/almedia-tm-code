'use strict';

const { spawnSync } = require('child_process');

function runCmd(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  return result.status;
}

async function run(argv) {
  const reconfigure = argv.includes('--reconfigure');

  // Plugin updates are driven by marketplace refresh in current Claude Code.
  // There is no `claude plugin update` CLI verb — refreshing the marketplace
  // pulls new commits from the source repo and bumps the plugin's resolved
  // version (commit-SHA-based unless plugin.json pins one).
  process.stdout.write('Refreshing marketplace almedia-code...\n');
  const status = runCmd('claude', ['plugin', 'marketplace', 'update', 'almedia-code']);
  if (status !== 0) {
    process.stderr.write('Marketplace refresh failed. Try running it interactively: /plugin marketplace update almedia-code\n');
    return status;
  }

  if (reconfigure) {
    const wizard = require('./wizard.js');
    await wizard.run({ noTour: false });
  }

  process.stdout.write('Update complete. Run /reload-plugins inside Claude Code to apply.\n');
  return 0;
}

module.exports = { run };

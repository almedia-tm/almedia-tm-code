#!/usr/bin/env node
/**
 * almedia-code CLI entry point.
 *
 * Subcommands:
 *   init         First-time setup: install Claude Code (if needed), register
 *                marketplace, install plugin, run wizard.
 *   update       Re-pull plugin from GitHub via Claude Code's plugin manager.
 *                --reconfigure re-runs the wizard.
 *   uninstall    Remove the plugin and (optionally) the style flag and shrink MCP.
 *   style <name> Set the active output style profile.
 *                Run with no argument to see the current style.
 *   help         Show usage.
 *   version      Print version.
 *
 * Cross-platform: pure Node, works on macOS / Linux / Windows.
 */

'use strict';

const path = require('path');
const fs = require('fs');

const PKG = require(path.join(__dirname, '..', 'package.json'));

const HELP = `
almedia-code v${PKG.version}

Usage:
  npx @almedia-tm/almedia-code <command> [options]

Commands:
  init                       First-time setup
    --style <name>           Skip wizard, set style directly (rigor|caveman|teacher|executive|default)
    --with-memory            Install claude-mem (AGPL — uses Anthropic API tokens for compression)
    --with-shrink            Install caveman-shrink MCP for input-token compression
    --no-tour                Skip the 30-second tour
    --non-interactive        Fail rather than prompt; requires --style if a flag isn't already set

  update                     Update plugin via 'claude plugin update'
    --reconfigure            Re-run the wizard after update

  uninstall                  Remove the plugin
    --keep-flags             Don't delete ~/.claude/.style-active
    --keep-shrink            Don't remove the caveman-shrink MCP entry

  style [name]               Get or set the active output style
                             (alias for the /style slash command, usable from shell)

  help                       Show this help
  version                    Print version
`;

function showHelp() {
  process.stdout.write(HELP);
}

function showVersion() {
  process.stdout.write(PKG.version + '\n');
}

async function dispatch(argv) {
  const [, , cmd, ...rest] = argv;

  if (!cmd || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    showHelp();
    return 0;
  }
  if (cmd === 'version' || cmd === '--version' || cmd === '-v') {
    showVersion();
    return 0;
  }

  // Lazy-require so help/version don't pay the import cost.
  switch (cmd) {
    case 'init': {
      const install = require(path.join(__dirname, '..', 'scripts', 'install.js'));
      return install.run(rest);
    }
    case 'update': {
      const update = require(path.join(__dirname, '..', 'scripts', 'update.js'));
      return update.run(rest);
    }
    case 'uninstall': {
      const uninstall = require(path.join(__dirname, '..', 'scripts', 'uninstall.js'));
      return uninstall.run(rest);
    }
    case 'style': {
      const styleCmd = require(path.join(__dirname, '..', 'scripts', 'lib', 'style-cmd.js'));
      return styleCmd.run(rest);
    }
    default: {
      process.stderr.write('Unknown command: ' + cmd + '\n');
      showHelp();
      return 1;
    }
  }
}

dispatch(process.argv).then(
  (code) => process.exit(typeof code === 'number' ? code : 0),
  (err) => {
    process.stderr.write('almedia-code error: ' + (err && err.message ? err.message : String(err)) + '\n');
    process.exit(1);
  }
);

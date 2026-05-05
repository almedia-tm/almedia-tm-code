'use strict';

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const detectClaude = require(path.join(__dirname, 'lib', 'detect-claude.js'));
const wizard = require(path.join(__dirname, 'wizard.js'));
const settingsMerge = require(path.join(__dirname, 'lib', 'settings-merge.js'));
const mcpShrink = require(path.join(__dirname, 'lib', 'mcp-shrink.js'));

const PKG = require(path.join(__dirname, '..', 'package.json'));

// GitHub org that hosts the repo. The repo name (almedia-tm-code) differs
// from the npm package name (@almedia-tm/almedia-code) and the plugin name
// (almedia-code) by design — see spec header for the rationale.
const HANDLE = 'almedia-tm';
const REPO = HANDLE + '/almedia-tm-code';

function parseArgs(argv) {
  const args = {
    style: null,
    withMemory: false,
    withShrink: false,
    noTour: false,
    nonInteractive: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--style') args.style = argv[++i];
    else if (a === '--with-memory') args.withMemory = true;
    else if (a === '--with-shrink') args.withShrink = true;
    else if (a === '--no-tour') args.noTour = true;
    else if (a === '--non-interactive') args.nonInteractive = true;
  }
  return args;
}

function runCmd(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: false,
    ...opts,
  });
  if (result.error) throw result.error;
  return result.status;
}

async function run(argv) {
  const args = parseArgs(argv);

  // Step 1: detect Claude Code
  process.stdout.write('Checking for Claude Code...\n');
  const claudeBin = await detectClaude.find();
  if (!claudeBin) {
    process.stdout.write('Claude Code not found. Installing via npm...\n');
    const status = runCmd('npm', ['install', '-g', '@anthropic-ai/claude-code']);
    if (status !== 0) {
      process.stderr.write('Failed to install Claude Code. Please install manually and re-run.\n');
      return 1;
    }
  } else {
    process.stdout.write('Found Claude Code: ' + claudeBin + '\n');
  }

  // Step 2: register marketplace
  process.stdout.write('Registering plugin marketplace: ' + REPO + '...\n');
  let status = runCmd('claude', ['plugin', 'marketplace', 'add', REPO]);
  if (status !== 0) {
    process.stderr.write('Failed to register marketplace. Continuing — it may already be registered.\n');
  }

  // Step 3: install the plugin
  process.stdout.write('Installing plugin almedia-code@almedia-code...\n');
  status = runCmd('claude', ['plugin', 'install', 'almedia-code@almedia-code']);
  if (status !== 0) {
    process.stderr.write('Failed to install plugin.\n');
    return 1;
  }

  // Step 4: run wizard (or apply flags non-interactively)
  let chosenStyle = args.style;
  let withMemory = args.withMemory;
  let withShrink = args.withShrink;

  if (!args.nonInteractive && !args.style) {
    const wizardResult = await wizard.run({ noTour: args.noTour });
    chosenStyle = wizardResult.style;
    withMemory = wizardResult.withMemory || args.withMemory;
    withShrink = wizardResult.withShrink || args.withShrink;
  }

  // Step 5: write style flag
  if (chosenStyle) {
    const os = require('os');
    const flagDir = path.join(os.homedir(), '.claude');
    fs.mkdirSync(flagDir, { recursive: true });
    fs.writeFileSync(path.join(flagDir, '.style-active'), chosenStyle + '\n');
    process.stdout.write('Active style: ' + chosenStyle + '\n');
  }

  // Step 6: optional add-ons
  if (withMemory) {
    process.stdout.write('Installing claude-mem (AGPL — uses Anthropic API tokens)...\n');
    runCmd('npx', ['claude-mem', 'install']);
  }
  if (withShrink) {
    process.stdout.write('Registering caveman-shrink MCP...\n');
    mcpShrink.enable();
  }

  // Step 7: print summary
  if (!args.noTour && !args.nonInteractive) {
    process.stdout.write('\n==============================\n');
    process.stdout.write('almedia-code v' + PKG.version + ' is ready.\n');
    process.stdout.write('==============================\n');
    process.stdout.write('Try these in your next Claude Code session:\n');
    process.stdout.write('  /plan          break a feature into phases\n');
    process.stdout.write('  /tdd           start TDD on a task\n');
    process.stdout.write('  /code-review   review uncommitted code\n');
    process.stdout.write('  /style <name>  switch output style\n');
    process.stdout.write('Catalog: https://github.com/' + REPO + '/blob/main/docs/catalog.md\n');
  process.stdout.write('Note: slash commands appear as /almedia-code:<name> due to plugin namespacing.\n');
  }

  return 0;
}

module.exports = { run };

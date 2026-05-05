'use strict';

const path = require('path');

const STYLE_OPTIONS = [
  { value: 'rigor',     title: 'rigor — terse, asks first, surfaces assumptions' },
  { value: 'caveman',   title: 'caveman — compressed for max token savings' },
  { value: 'teacher',   title: 'teacher — verbose, walks reasoning' },
  { value: 'executive', title: 'executive — TL;DR + Why this matters + details' },
  { value: 'default',   title: 'default — vanilla Claude Code' },
];

async function run(opts = {}) {
  let prompts;
  try {
    prompts = require('prompts');
  } catch (err) {
    process.stderr.write('The "prompts" package is required for the wizard. Install it: npm install prompts\n');
    return { style: 'default', withMemory: false, withShrink: false };
  }

  process.stdout.write('\n=== almedia-code first-run setup ===\n\n');

  const styleAnswer = await prompts({
    type: 'select',
    name: 'style',
    message: 'Choose your default output style:',
    choices: STYLE_OPTIONS.map((s) => ({ title: s.title, value: s.value })),
    initial: 4, // default
  });

  const addonsAnswer = await prompts({
    type: 'multiselect',
    name: 'addons',
    message: 'Optional add-ons (space to toggle, enter to confirm):',
    choices: [
      { title: 'persistent memory across sessions (claude-mem, AGPL, uses Anthropic API tokens)', value: 'memory' },
      { title: 'input-token compression MCP (caveman-shrink, MIT)', value: 'shrink' },
    ],
    hint: '- Space to toggle. Return to submit.',
    instructions: false,
  });

  const result = {
    style: styleAnswer.style || 'default',
    withMemory: (addonsAnswer.addons || []).includes('memory'),
    withShrink: (addonsAnswer.addons || []).includes('shrink'),
  };

  if (!opts.noTour) {
    process.stdout.write('\nQuick tour:\n');
    process.stdout.write('  Slash commands you will use most: /plan, /tdd, /code-review, /verify\n');
    process.stdout.write('  Switch styles any time: /style <rigor|caveman|teacher|executive|default>\n');
    process.stdout.write('  Catalog: docs/catalog.md\n');
    process.stdout.write('  Uninstall: npx @almedia-tm/almedia-code uninstall\n\n');
  }

  return result;
}

module.exports = { run };

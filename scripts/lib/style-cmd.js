'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const VALID = ['rigor', 'caveman', 'teacher', 'executive', 'default'];

async function run(argv) {
  const flag = path.join(os.homedir(), '.claude', '.style-active');
  const arg = argv[0];

  if (!arg) {
    let current = 'default';
    if (fs.existsSync(flag)) {
      try { current = fs.readFileSync(flag, 'utf8').trim() || 'default'; } catch (_) {}
    }
    process.stdout.write('Active style: ' + current + '\n');
    process.stdout.write('Available: ' + VALID.join(', ') + '\n');
    return 0;
  }

  if (!VALID.includes(arg)) {
    process.stderr.write('Invalid style: ' + arg + '\n');
    process.stderr.write('Valid: ' + VALID.join(', ') + '\n');
    return 1;
  }

  fs.mkdirSync(path.dirname(flag), { recursive: true });
  fs.writeFileSync(flag, arg + '\n');
  process.stdout.write('Active style set to: ' + arg + '\n');
  process.stdout.write('Effect applies on next session.\n');
  return 0;
}

module.exports = { run };

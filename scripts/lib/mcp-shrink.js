'use strict';

const settingsMerge = require('./settings-merge.js');

const SHRINK_MCP_KEY = 'caveman-shrink';

const SHRINK_MCP_CONFIG = {
  command: 'npx',
  args: ['-y', 'caveman-shrink'],
  description: 'Compresses text inputs (file contents, conversation context) before transmission. Saves input tokens.',
};

function enable() {
  settingsMerge.merge({
    mcpServers: {
      [SHRINK_MCP_KEY]: SHRINK_MCP_CONFIG,
    },
  });
}

function disable() {
  settingsMerge.removeKey('mcpServers.' + SHRINK_MCP_KEY);
}

module.exports = { enable, disable, SHRINK_MCP_KEY };

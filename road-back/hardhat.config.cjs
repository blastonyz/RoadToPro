/* Temporary CommonJS wrapper to load TypeScript Hardhat config
   This avoids HH19 when project uses "type": "module" in package.json.
   It registers ts-node and exports the default from hardhat.config.ts.
*/
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs' },
});

// Load the TypeScript config and export its default value for Hardhat
const config = require('./hardhat.config.ts');
module.exports = config && config.default ? config.default : config;

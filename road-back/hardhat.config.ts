import { HardhatUserConfig } from 'hardhat/config.js';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    spicy: {
      url: process.env.RPC_URL || 'https://spicy-rpc.chiliz.com/',
      accounts: ((): string[] => {
        const pk = process.env.CHZ_PK || '';
        if (!pk) return [];
        if (pk.length === 66 && pk.startsWith('0x')) return [pk];
        if (pk.length === 64) return [`0x${pk}`];
        return [];
      })(),
    },
    // Polkadot-compatible EVM parachain (e.g., Moonbase Alpha, Moonbeam, Astar).
    // Set `POLKADOT_RPC_URL` and optional `POLKADOT_CHAIN_ID` in your .env before deploying.
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: './contracts',
    tests: './test/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;

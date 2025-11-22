import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

const ENV_PATH = path.resolve(process.cwd(), '.env');
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 2000;

function parseEnvFile(): Record<string, string> {
  try {
    const content = fs.readFileSync(ENV_PATH, 'utf8');
    return dotenv.parse(content);
  } catch (err) {
    return {};
  }
}

function normalizePrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  const trimmed = key.trim();
  if (trimmed.length === 66 && trimmed.startsWith('0x')) return trimmed;
  if (trimmed.length === 64) return `0x${trimmed}`;
  return trimmed;
}

async function runCommand(cmd: string, args: string[]) {
  return new Promise<number>((resolve) => {
    console.log(`\n> ${cmd} ${args.join(' ')}`);
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
    p.on('close', (code) => resolve(typeof code === 'number' ? code : 1));
  });
}

async function deployWhenReady() {
  const env = parseEnvFile();

  // Accept either POLKADOT_RPC_URL or RPC_URL
  const rpc = (env.POLKADOT_RPC_URL || env.RPC_URL || '').trim();
  const pk = normalizePrivateKey(env.PRIVATE_KEY || env.ARKIV_PRIVATE_KEY);

  if (!rpc || !pk) {
    console.log('Waiting for .env to contain both POLKADOT_RPC_URL (or RPC_URL) and PRIVATE_KEY...');
    return;
  }

  // Export to process.env so hardhat can read it
  process.env.POLKADOT_RPC_URL = rpc;
  process.env.RPC_URL = rpc;
  process.env.PRIVATE_KEY = pk;

  // Determine which scripts to deploy (comma separated names in env DEPLOY_SCRIPTS)
  const defaultScripts = ['deploy.ts', 'deploy-club-token.ts', 'deploy-player-nft.ts'];
  const deployList = env.DEPLOY_SCRIPTS
    ? env.DEPLOY_SCRIPTS.split(',').map((s) => s.trim()).filter(Boolean)
    : defaultScripts;

  console.log('Detected RPC and PRIVATE_KEY. Starting compile + deploy for:', deployList.join(', '));

  // 1) Compile
  const compileCode = await runCommand('npx', ['hardhat', 'compile']);
  if (compileCode !== 0) {
    console.error('Compilation failed; aborting deploy.');
    return;
  }

  // 2) Deploy each script using the polkadotEvm network defined in hardhat.config.ts
  for (const scriptName of deployList) {
    const scriptPath = `scripts/${scriptName}`;
    if (!fs.existsSync(path.resolve(process.cwd(), scriptPath))) {
      console.warn(`Script not found: ${scriptPath} — skipping`);
      continue;
    }

    const code = await runCommand('npx', ['hardhat', 'run', '--network', 'polkadotEvm', scriptPath]);
    if (code !== 0) {
      console.error(`Deploy script ${scriptName} failed (code ${code}). Continuing with next.`);
    }
  }

  console.log('\nAll requested deploy scripts executed. Watching for further changes to .env...');
}

// Initial attempt
deployWhenReady();

// Watch the .env file for changes and debounce deploys
fs.watchFile(ENV_PATH, { interval: 1000 }, () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    deployWhenReady();
  }, DEBOUNCE_MS);
});

console.log('Watching .env for changes. Add POLKADOT_RPC_URL (or RPC_URL) and PRIVATE_KEY to trigger deploys.');

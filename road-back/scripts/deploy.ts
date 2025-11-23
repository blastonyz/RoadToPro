import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Deploying TournamentManager contract...\n');

  // Get deployer signer
  const [deployer] = await ethers.getSigners();
  console.log('📍 Deploying contracts with account:', deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(balance), 'ETH\n');

  // Check if we have enough balance
  if (balance === 0n) {
    throw new Error('❌ Deployer account has no balance. Please fund the account.');
  }

  // Deploy TournamentManager
  console.log('📄 Deploying TournamentManager contract...');
  const TournamentManager = await ethers.getContractFactory('TournamentManager');
  const tournamentManager = await TournamentManager.deploy();
  await tournamentManager.waitForDeployment();

  const address = await tournamentManager.getAddress();
  console.log('✅ TournamentManager deployed to:', address);
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log('\n📋 Deployment Details:');
  console.log('- Network:', network.name);
  console.log('- Chain ID:', network.chainId);
  console.log('- Owner:', await tournamentManager.owner());
  console.log('- Tournament Count:', await tournamentManager.getTournamentCount());

  console.log('\n📝 Save this address to your .env file:');
  console.log(`TOURNAMENT_MANAGER_CONTRACT=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

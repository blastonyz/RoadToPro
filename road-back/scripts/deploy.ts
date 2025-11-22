import { ethers } from 'hardhat';

async function main() {
  console.log('🚀 Deploying TournamentManager contract...');

  const TournamentManager = await ethers.getContractFactory('TournamentManager');
  const tournamentManager = await TournamentManager.deploy();

  await tournamentManager.waitForDeployment();

  const address = await tournamentManager.getAddress();

  console.log('✅ TournamentManager deployed to:', address);
  console.log('\n📝 Save this address to your .env file:');
  console.log(`CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

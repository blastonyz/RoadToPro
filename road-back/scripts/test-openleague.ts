import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🧪 Testing Open League Contracts...\n');

  const [owner, investor1, investor2, player1, player2, sponsor1] = await ethers.getSigners();

  // Get contract addresses from .env
  const openLeagueAddress = process.env.OPENLEAGUE_CONTRACT_ADDRESS;
  const inversionPoolAddress = process.env.OPENLEAGUE_INVERSION_POOL_ADDRESS;
  const leagueCupAddress = process.env.OPENLEAGUE_CUP_ADDRESS;

  if (!openLeagueAddress || !inversionPoolAddress || !leagueCupAddress) {
    console.error('❌ Contract addresses not found in .env file');
    console.log('Please run: npm run hardhat:deploy-openleague first');
    return;
  }

  console.log('📍 Contract Addresses:');
  console.log('   OpenLeague:', openLeagueAddress);
  console.log('   InversionPool:', inversionPoolAddress);
  console.log('   LeagueCup:', leagueCupAddress);
  console.log();

  // Get contract instances
  const openLeague = await ethers.getContractAt('OpenLeague', openLeagueAddress);
  const inversionPool = await ethers.getContractAt('OpenLeagueInversionPool', inversionPoolAddress);
  const leagueCup = await ethers.getContractAt('OpenLeagueCup', leagueCupAddress);

  console.log('='.repeat(60));
  console.log('TEST 1: Investor Deposits to InversionPool');
  console.log('='.repeat(60));

  console.log('\n💰 Investor 1 deposits 10 ETH...');
  await inversionPool.connect(investor1).investorDeposit({ value: ethers.parseEther('10') });
  console.log('✅ Investor 1 balance:', ethers.formatEther(await inversionPool.investorBalances(investor1.address)), 'ETH');

  console.log('\n💰 Investor 2 deposits 5 ETH...');
  await inversionPool.connect(investor2).investorDeposit({ value: ethers.parseEther('5') });
  console.log('✅ Investor 2 balance:', ethers.formatEther(await inversionPool.investorBalances(investor2.address)), 'ETH');

  console.log('\n📊 Pool Stats:');
  console.log('   Total Pool Balance:', ethers.formatEther(await inversionPool.totalPoolBalance()), 'ETH');
  console.log('   Total Investors:', await inversionPool.getTotalInvestors());

  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Pay Player with Automatic 3% Commission');
  console.log('='.repeat(60));

  const playerPayment = ethers.parseEther('2'); // 2 ETH
  const commission = (playerPayment * 3n) / 100n; // 3% = 0.06 ETH

  console.log('\n💸 Paying player 1: 2 ETH (3% commission = 0.06 ETH)...');

  const openLeagueBalanceBefore = await openLeague.totalBalance();
  const player1BalanceBefore = await ethers.provider.getBalance(player1.address);

  await inversionPool.payPlayer(player1.address, playerPayment);

  const openLeagueBalanceAfter = await openLeague.totalBalance();
  const player1BalanceAfter = await ethers.provider.getBalance(player1.address);

  console.log('✅ Player 1 received:', ethers.formatEther(player1BalanceAfter - player1BalanceBefore), 'ETH');
  console.log('✅ OpenLeague received commission:', ethers.formatEther(openLeagueBalanceAfter - openLeagueBalanceBefore), 'ETH');
  console.log('✅ Pool Balance:', ethers.formatEther(await inversionPool.totalPoolBalance()), 'ETH');

  console.log('\n📊 OpenLeague Stats:');
  const stats = await openLeague.getStats();
  console.log('   Total Balance:', ethers.formatEther(stats[0]), 'ETH');
  console.log('   Total Commissions:', ethers.formatEther(stats[1]), 'ETH');

  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Sponsor Contributes to Cup');
  console.log('='.repeat(60));

  console.log('\n🏆 Creating new cup...');
  const now = Math.floor(Date.now() / 1000);
  await leagueCup.createCup('Open League World Cup 2025', now, now + 86400 * 30); // 30 days
  console.log('✅ Cup created:', await leagueCup.currentCupName());

  console.log('\n💰 Sponsor 1 contributes 50 ETH...');
  await leagueCup.connect(sponsor1).sponsorContribute('Nike Sports', { value: ethers.parseEther('50') });

  const sponsorInfo = await leagueCup.getSponsorInfo(sponsor1.address);
  console.log('✅ Sponsor Name:', sponsorInfo[0]);
  console.log('✅ Sponsor Total Contributed:', ethers.formatEther(sponsorInfo[1]), 'ETH');

  console.log('\n📊 Cup Stats:');
  const cupStats = await leagueCup.getCupStats();
  console.log('   Cup Name:', cupStats[0]);
  console.log('   Is Active:', cupStats[3]);
  console.log('   Total Prize Pool:', ethers.formatEther(cupStats[4]), 'ETH');
  console.log('   Sponsor Contributions:', ethers.formatEther(cupStats[5]), 'ETH');

  console.log('\n' + '='.repeat(60));
  console.log('TEST 4: Pay Prize to Winner');
  console.log('='.repeat(60));

  const prizeAmount = ethers.parseEther('10'); // 10 ETH for first place
  const player2BalanceBefore = await ethers.provider.getBalance(player2.address);

  console.log('\n🏆 Paying prize to Player 2 (1st place): 10 ETH...');
  await leagueCup.payPrize(player2.address, 1, prizeAmount);

  const player2BalanceAfter = await ethers.provider.getBalance(player2.address);
  console.log('✅ Player 2 received:', ethers.formatEther(player2BalanceAfter - player2BalanceBefore), 'ETH');

  console.log('\n📊 Winner Info:');
  const winnerInfo = await leagueCup.getWinner(0);
  console.log('   Winner Address:', winnerInfo[0]);
  console.log('   Position:', winnerInfo[1].toString());
  console.log('   Prize Amount:', ethers.formatEther(winnerInfo[2]), 'ETH');
  console.log('   Cup Name:', winnerInfo[4]);

  console.log('\n' + '='.repeat(60));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(60));

  console.log('\n📊 OpenLeague Contract:');
  const finalStats = await openLeague.getStats();
  console.log('   Total Balance:', ethers.formatEther(finalStats[0]), 'ETH');
  console.log('   Total Commissions Received:', ethers.formatEther(finalStats[1]), 'ETH');

  console.log('\n📊 InversionPool Contract:');
  console.log('   Total Pool Balance:', ethers.formatEther(await inversionPool.totalPoolBalance()), 'ETH');
  console.log('   Total Investor Contributions:', ethers.formatEther(await inversionPool.totalInvestorContributions()), 'ETH');
  console.log('   Total Player Payouts:', ethers.formatEther(await inversionPool.totalPlayerPayouts()), 'ETH');

  console.log('\n📊 LeagueCup Contract:');
  const finalCupStats = await leagueCup.getCupStats();
  console.log('   Total Prize Pool:', ethers.formatEther(finalCupStats[4]), 'ETH');
  console.log('   Total Sponsors Contributions:', ethers.formatEther(finalCupStats[5]), 'ETH');
  console.log('   Total Prizes Paid:', ethers.formatEther(finalCupStats[7]), 'ETH');

  console.log('\n✅ All tests completed successfully!\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });

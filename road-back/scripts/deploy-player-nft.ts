import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying PlayerNFT contract...");

  // Get the contract factory
  const PlayerNFT = await ethers.getContractFactory("PlayerNFT");

  // Deploy the contract
  const playerNFT = await PlayerNFT.deploy();
  await playerNFT.waitForDeployment();

  const address = await playerNFT.getAddress();
  console.log("✅ PlayerNFT deployed to:", address);

  // Log deployment details
  console.log("\n📋 Contract Details:");
  console.log("- Name:", await playerNFT.name());
  console.log("- Symbol:", await playerNFT.symbol());
  console.log("- Owner:", await playerNFT.owner());
  console.log("- Total Players:", await playerNFT.totalPlayers());

  console.log("\n💾 Save this address to your .env file:");
  console.log(`PLAYER_NFT_CONTRACT=${address}`);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

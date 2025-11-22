import { ethers } from "hardhat";

async function main() {
  // Parámetros del club (personalizar según necesidad)
  const clubName = process.env.CLUB_NAME || "Real Madrid CF";
  const tokenSymbol = process.env.CLUB_SYMBOL || "RMD"; // 3 letras
  const initialSupply = ethers.parseEther(process.env.INITIAL_SUPPLY || "1000000"); // 1 millón

  console.log("🚀 Deploying ClubToken contract...");
  console.log(`\n⚽ Club Details:`);
  console.log(`- Name: ${clubName}`);
  console.log(`- Symbol: ${tokenSymbol}`);
  console.log(`- Initial Supply: ${ethers.formatEther(initialSupply)} tokens`);

  // Get the contract factory
  const ClubToken = await ethers.getContractFactory("ClubToken");

  // Deploy the contract
  const clubToken = await ClubToken.deploy(clubName, tokenSymbol, initialSupply);
  await clubToken.waitForDeployment();

  const address = await clubToken.getAddress();
  console.log("\n✅ ClubToken deployed to:", address);

  // Log deployment details
  const contractInfo = await clubToken.getContractInfo();
  console.log("\n📋 Contract Details:");
  console.log("- Club Name:", contractInfo[0]);
  console.log("- Token Symbol:", contractInfo[1]);
  console.log("- Total Supply:", ethers.formatEther(contractInfo[2]), "tokens");
  console.log("- Max Supply:", ethers.formatEther(contractInfo[3]), "tokens");
  console.log("- Owner:", await clubToken.owner());
  console.log("- Migration Enabled:", contractInfo[4]);
  console.log("- Is Migrated:", contractInfo[5]);

  console.log("\n💾 Save this address to your .env file:");
  console.log(`CLUB_TOKEN_CONTRACT=${address}`);

  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

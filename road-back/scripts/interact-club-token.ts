import { ethers } from "hardhat";

/**
 * Script de ejemplo para interactuar con ClubToken
 */

async function main() {
  const contractAddress = process.env.CLUB_TOKEN_CONTRACT;
  if (!contractAddress) {
    throw new Error("CLUB_TOKEN_CONTRACT not set in .env");
  }

  console.log("⚽ Interacting with ClubToken at:", contractAddress);

  // Get contract instance
  const ClubToken = await ethers.getContractFactory("ClubToken");
  const clubToken = ClubToken.attach(contractAddress);

  // Get signers
  const [owner, fan1, fan2] = await ethers.getSigners();

  console.log("\n👤 Signers:");
  console.log("- Owner (Club):", owner.address);
  console.log("- Fan 1:", fan1.address);
  console.log("- Fan 2:", fan2.address);

  // Get initial contract info
  const info = await clubToken.getContractInfo();
  console.log("\n📋 Initial Contract Info:");
  console.log("- Club Name:", info[0]);
  console.log("- Token Symbol:", info[1]);
  console.log("- Total Supply:", ethers.formatEther(info[2]), "tokens");
  console.log("- Max Supply:", ethers.formatEther(info[3]), "tokens");

  // Example 1: Transfer tokens to fans
  console.log("\n💸 Transferring tokens to fans...");
  const amount1 = ethers.parseEther("1000"); // 1000 tokens
  const tx1 = await clubToken.transfer(fan1.address, amount1);
  await tx1.wait();
  console.log(`✅ Transferred ${ethers.formatEther(amount1)} tokens to Fan 1`);

  const amount2 = ethers.parseEther("500"); // 500 tokens
  const tx2 = await clubToken.transfer(fan2.address, amount2);
  await tx2.wait();
  console.log(`✅ Transferred ${ethers.formatEther(amount2)} tokens to Fan 2`);

  // Check balances
  console.log("\n💰 Balances:");
  const ownerBalance = await clubToken.balanceOf(owner.address);
  const fan1Balance = await clubToken.balanceOf(fan1.address);
  const fan2Balance = await clubToken.balanceOf(fan2.address);
  console.log("- Owner:", ethers.formatEther(ownerBalance), info[1]);
  console.log("- Fan 1:", ethers.formatEther(fan1Balance), info[1]);
  console.log("- Fan 2:", ethers.formatEther(fan2Balance), info[1]);

  // Example 2: Mint more tokens
  console.log("\n🪙 Minting additional tokens...");
  const mintAmount = ethers.parseEther("50000"); // 50k tokens
  const mintTx = await clubToken.mint(owner.address, mintAmount);
  await mintTx.wait();
  console.log(`✅ Minted ${ethers.formatEther(mintAmount)} new tokens`);

  const newTotalSupply = await clubToken.totalSupply();
  console.log("- New Total Supply:", ethers.formatEther(newTotalSupply), info[1]);

  // Example 3: Update club name
  console.log("\n✏️ Updating club name...");
  const updateTx = await clubToken.updateClubName("Real Madrid Club de Fútbol");
  await updateTx.wait();
  console.log("✅ Club name updated!");

  const newName = await clubToken.clubName();
  console.log("- New Name:", newName);

  // Example 4: Demonstrate migration process
  console.log("\n🔄 Migration Demo:");
  console.log("To migrate to a new token contract:");
  console.log("1. Deploy a new ClubToken with the desired symbol");
  console.log("2. Call enableMigration(newContractAddress) on the old contract");
  console.log("3. Users call migrate() to move their tokens to the new contract");

  // Uncomment to actually enable migration:
  // const newContractAddress = "0x..."; // New contract address
  // const migrationTx = await clubToken.enableMigration(newContractAddress);
  // await migrationTx.wait();
  // console.log("✅ Migration enabled to:", newContractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

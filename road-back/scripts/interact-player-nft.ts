import { ethers } from "hardhat";

/**
 * Script de ejemplo para interactuar con PlayerNFT
 */

async function main() {
  const contractAddress = process.env.PLAYER_NFT_CONTRACT;
  if (!contractAddress) {
    throw new Error("PLAYER_NFT_CONTRACT not set in .env");
  }

  console.log("🎮 Interacting with PlayerNFT at:", contractAddress);

  // Get contract instance
  const PlayerNFT = await ethers.getContractFactory("PlayerNFT");
  const playerNFT = PlayerNFT.attach(contractAddress);

  // Get signers
  const [owner, player1, player2] = await ethers.getSigners();

  console.log("\n👤 Signers:");
  console.log("- Owner:", owner.address);
  console.log("- Player 1:", player1.address);
  console.log("- Player 2:", player2.address);

  // Example 1: Mint a player NFT
  console.log("\n📝 Minting Player NFT for Player 1...");
  const tx1 = await playerNFT.mintPlayer(
    player1.address,
    "Cristiano Ronaldo",
    "Forward",
    7,
    "Portugal",
    "ipfs://QmExampleMetadataURI1"
  );
  await tx1.wait();
  console.log("✅ Player 1 NFT minted!");

  // Example 2: Mint another player
  console.log("\n📝 Minting Player NFT for Player 2...");
  const tx2 = await playerNFT.mintPlayer(
    player2.address,
    "Lionel Messi",
    "Forward",
    10,
    "Argentina",
    "ipfs://QmExampleMetadataURI2"
  );
  await tx2.wait();
  console.log("✅ Player 2 NFT minted!");

  // Get player info
  const tokenId1 = await playerNFT.getPlayerTokenId(player1.address);
  console.log("\n🎫 Player 1 Token ID:", tokenId1.toString());

  const playerInfo1 = await playerNFT.getPlayerInfo(tokenId1);
  console.log("📊 Player 1 Info:");
  console.log("- Name:", playerInfo1[0]);
  console.log("- Position:", playerInfo1[1]);
  console.log("- Jersey Number:", playerInfo1[2].toString());
  console.log("- Nationality:", playerInfo1[3]);
  console.log("- Is Active:", playerInfo1[5]);
  console.log("- Owner:", playerInfo1[6]);

  // Total players
  const total = await playerNFT.totalPlayers();
  console.log("\n📈 Total Players Minted:", total.toString());

  // Example 3: Update player metadata
  console.log("\n✏️ Updating Player 1 metadata...");
  const updateTx = await playerNFT.connect(player1).updatePlayerMetadata(
    tokenId1,
    "Cristiano Ronaldo",
    "Forward/Winger",
    7,
    "Portugal"
  );
  await updateTx.wait();
  console.log("✅ Player metadata updated!");

  // Example 4: Transfer NFT
  console.log("\n🔄 Transferring Player 1 NFT to Player 2...");
  const transferTx = await playerNFT.connect(player1).transferFrom(
    player1.address,
    player2.address,
    tokenId1
  );
  await transferTx.wait();
  console.log("✅ NFT transferred!");

  // Verify new owner
  const newOwner = await playerNFT.ownerOf(tokenId1);
  console.log("🔍 New owner:", newOwner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

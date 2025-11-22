import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🚀 Starting Open League Contracts Deployment...\n');

  const [deployer] = await ethers.getSigners();
  console.log('📍 Deploying contracts with account:', deployer.address);
  console.log('💰 Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'ETH\n');

  // ==========================================
  // 1. Deploy OpenLeague (Contrato principal)
  // ==========================================
  console.log('📄 Deploying OpenLeague contract...');
  const OpenLeague = await ethers.getContractFactory('OpenLeague');
  const openLeague = await OpenLeague.deploy();
  await openLeague.waitForDeployment();
  const openLeagueAddress = await openLeague.getAddress();
  console.log('✅ OpenLeague deployed to:', openLeagueAddress);
  console.log('   Owner:', await openLeague.owner());

  // ==========================================
  // 2. Deploy OpenLeagueInversionPool
  // ==========================================
  console.log('\n📄 Deploying OpenLeagueInversionPool contract...');
  const OpenLeagueInversionPool = await ethers.getContractFactory('OpenLeagueInversionPool');
  const inversionPool = await OpenLeagueInversionPool.deploy(openLeagueAddress);
  await inversionPool.waitForDeployment();
  const inversionPoolAddress = await inversionPool.getAddress();
  console.log('✅ OpenLeagueInversionPool deployed to:', inversionPoolAddress);
  console.log('   Owner:', await inversionPool.owner());
  console.log('   Open League Contract:', await inversionPool.openLeagueContract());

  // ==========================================
  // 3. Authorize InversionPool in OpenLeague
  // ==========================================
  console.log('\n🔗 Authorizing InversionPool in OpenLeague...');
  const authTx = await openLeague.authorizeContract(inversionPoolAddress);
  await authTx.wait();
  console.log('✅ InversionPool authorized to send commissions');

  // ==========================================
  // 4. Deploy OpenLeagueCup
  // ==========================================
  console.log('\n📄 Deploying OpenLeagueCup contract...');
  const OpenLeagueCup = await ethers.getContractFactory('OpenLeagueCup');
  const leagueCup = await OpenLeagueCup.deploy();
  await leagueCup.waitForDeployment();
  const leagueCupAddress = await leagueCup.getAddress();
  console.log('✅ OpenLeagueCup deployed to:', leagueCupAddress);
  console.log('   Owner:', await leagueCup.owner());

  // ==========================================
  // 5. Save addresses to .env file
  // ==========================================
  console.log('\n💾 Saving contract addresses to .env file...');
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';

  // Read existing .env if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }

  // Remove old contract addresses if they exist
  const contractVars = [
    'OPENLEAGUE_CONTRACT_ADDRESS',
    'OPENLEAGUE_INVERSION_POOL_ADDRESS',
    'OPENLEAGUE_CUP_ADDRESS',
  ];

  contractVars.forEach((varName) => {
    const regex = new RegExp(`^${varName}=.*$`, 'gm');
    envContent = envContent.replace(regex, '');
  });

  // Clean up extra newlines
  envContent = envContent.replace(/\n\n+/g, '\n').trim();

  // Add new contract addresses
  const newAddresses = `

# ==========================================
# Open League Smart Contracts
# Deployed on: ${new Date().toISOString()}
# Network: ${(await ethers.provider.getNetwork()).name}
# Chain ID: ${(await ethers.provider.getNetwork()).chainId}
# Deployer: ${deployer.address}
# ==========================================
OPENLEAGUE_CONTRACT_ADDRESS=${openLeagueAddress}
OPENLEAGUE_INVERSION_POOL_ADDRESS=${inversionPoolAddress}
OPENLEAGUE_CUP_ADDRESS=${leagueCupAddress}
`;

  envContent += newAddresses;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Contract addresses saved to .env');

  // ==========================================
  // 6. Save deployment info to JSON
  // ==========================================
  console.log('\n💾 Saving deployment info to JSON...');
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      OpenLeague: {
        address: openLeagueAddress,
        owner: await openLeague.owner(),
      },
      OpenLeagueInversionPool: {
        address: inversionPoolAddress,
        owner: await inversionPool.owner(),
        openLeagueContract: await inversionPool.openLeagueContract(),
        commissionPercentage: Number(await inversionPool.COMMISSION_PERCENTAGE()),
      },
      OpenLeagueCup: {
        address: leagueCupAddress,
        owner: await leagueCup.owner(),
      },
    },
  };

  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFilePath = path.join(
    deploymentsDir,
    `openleague-deployment-${Date.now()}.json`
  );
  fs.writeFileSync(deploymentFilePath, JSON.stringify(deploymentInfo, null, 2));
  console.log('✅ Deployment info saved to:', deploymentFilePath);

  // ==========================================
  // 7. Summary
  // ==========================================
  console.log('\n' + '='.repeat(60));
  console.log('🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(60));
  console.log('\n📋 Contract Addresses:');
  console.log('   OpenLeague:              ', openLeagueAddress);
  console.log('   OpenLeagueInversionPool: ', inversionPoolAddress);
  console.log('   OpenLeagueCup:           ', leagueCupAddress);
  console.log('\n⚙️  Configuration:');
  console.log('   Network:                 ', (await ethers.provider.getNetwork()).name);
  console.log('   Chain ID:                ', (await ethers.provider.getNetwork()).chainId);
  console.log('   Deployer:                ', deployer.address);
  console.log('   Commission Rate:         ', await inversionPool.COMMISSION_PERCENTAGE(), '%');
  console.log('\n🔗 Next Steps:');
  console.log('   1. Verify contracts on block explorer (if on testnet/mainnet)');
  console.log('   2. Test contract interactions');
  console.log('   3. Update frontend with new contract addresses');
  console.log('   4. Configure environment variables in production');
  console.log('\n💡 Important Notes:');
  console.log('   - InversionPool is authorized to send commissions to OpenLeague');
  console.log('   - All contracts are owned by:', deployer.address);
  console.log('   - Contract addresses have been saved to .env file');
  console.log('   - Deployment info saved to deployments/ folder');
  console.log('='.repeat(60) + '\n');

  // ==========================================
  // 8. Create README for contracts
  // ==========================================
  const readmeContent = `# Open League Smart Contracts

## Deployment Information

**Deployed on:** ${new Date().toISOString()}  
**Network:** ${(await ethers.provider.getNetwork()).name}  
**Chain ID:** ${(await ethers.provider.getNetwork()).chainId}  
**Deployer:** ${deployer.address}

---

## Contract Addresses

| Contract | Address |
|----------|---------|
| **OpenLeague** | \`${openLeagueAddress}\` |
| **OpenLeagueInversionPool** | \`${inversionPoolAddress}\` |
| **OpenLeagueCup** | \`${leagueCupAddress}\` |

---

## Contract Overview

### 1. OpenLeague
**Purpose:** Contrato principal de Open League donde se aloja el dinero de la organización.

**Features:**
- Recibe automáticamente el 3% de comisión de las transacciones del InversionPool
- Solo el owner puede retirar o transferir fondos
- Sistema de autorización para contratos que pueden enviar comisiones
- Función de batch transfer para múltiples pagos

**Key Functions:**
- \`authorizeContract(address)\` - Autorizar contrato para enviar comisiones
- \`withdraw(address, uint256)\` - Retirar fondos
- \`transferFunds(address, uint256)\` - Transferir fondos
- \`batchTransfer(address[], uint256[])\` - Transferir a múltiples direcciones

---

### 2. OpenLeagueInversionPool
**Purpose:** Pool de inversión donde inversores añaden fondos y Open League paga a jugadores.

**Features:**
- Inversores pueden depositar fondos (sin poder retirar)
- Solo el owner puede pagar a jugadores, retirar o transferir fondos
- Comisión automática del 3% en cada pago a jugadores (va a OpenLeague)
- Tracking completo de inversiones y pagos

**Key Functions:**
- \`investorDeposit()\` - Inversores depositan fondos (payable)
- \`openLeagueDeposit()\` - Open League deposita fondos (payable, onlyOwner)
- \`payPlayer(address, uint256)\` - Pagar a jugador con comisión automática (onlyOwner)
- \`withdraw(address, uint256)\` - Retirar fondos (onlyOwner)
- \`transferFunds(address, uint256)\` - Transferir fondos (onlyOwner)

**Important:**
- Commission: ${await inversionPool.COMMISSION_PERCENTAGE()}%
- Connected to OpenLeague at: ${openLeagueAddress}

---

### 3. OpenLeagueCup
**Purpose:** Gestiona fondos para la Copa de Open League a nivel mundial.

**Features:**
- Sponsors pueden contribuir con nombre identificatorio
- Cualquier persona puede hacer contribuciones públicas
- Sistema de gestión de copas con fechas de inicio/fin
- Pago de premios a ganadores por posición
- Tracking completo de sponsors, contribuyentes y ganadores

**Key Functions:**
- \`createCup(string, uint256, uint256)\` - Crear nueva copa (onlyOwner)
- \`sponsorContribute(string)\` - Contribución de sponsor (payable)
- \`publicContribute()\` - Contribución pública (payable)
- \`payPrize(address, uint256, uint256)\` - Pagar premio a ganador (onlyOwner)
- \`batchPayPrizes(address[], uint256[], uint256[])\` - Pagar múltiples premios (onlyOwner)

---

## Usage Examples

### Investor deposits to InversionPool
\`\`\`javascript
const inversionPool = await ethers.getContractAt('OpenLeagueInversionPool', '${inversionPoolAddress}');
await inversionPool.investorDeposit({ value: ethers.parseEther('1.0') });
\`\`\`

### Pay player (with automatic 3% commission)
\`\`\`javascript
const inversionPool = await ethers.getContractAt('OpenLeagueInversionPool', '${inversionPoolAddress}');
await inversionPool.payPlayer(playerAddress, ethers.parseEther('100'));
// Player receives 100 ETH, OpenLeague receives 3 ETH automatically
\`\`\`

### Sponsor contributes to Cup
\`\`\`javascript
const leagueCup = await ethers.getContractAt('OpenLeagueCup', '${leagueCupAddress}');
await leagueCup.sponsorContribute('Nike', { value: ethers.parseEther('50') });
\`\`\`

### Pay prize to winner
\`\`\`javascript
const leagueCup = await ethers.getContractAt('OpenLeagueCup', '${leagueCupAddress}');
await leagueCup.payPrize(winnerAddress, 1, ethers.parseEther('1000')); // Position 1 (first place)
\`\`\`

---

## Security Features

All contracts include:
- ✅ OpenZeppelin's Ownable for access control
- ✅ ReentrancyGuard for protection against reentrancy attacks
- ✅ Emergency withdrawal functions
- ✅ Event emission for all important actions
- ✅ Input validation and require checks

---

## Environment Variables

The following variables have been added to your \`.env\` file:

\`\`\`
OPENLEAGUE_CONTRACT_ADDRESS=${openLeagueAddress}
OPENLEAGUE_INVERSION_POOL_ADDRESS=${inversionPoolAddress}
OPENLEAGUE_CUP_ADDRESS=${leagueCupAddress}
\`\`\`

---

## Important Notes

1. **Commission Flow:** When paying a player from InversionPool, 3% automatically goes to OpenLeague contract
2. **Owner Control:** All withdrawal and transfer operations require owner authorization
3. **Investor Protection:** Investors can deposit but cannot withdraw from InversionPool
4. **Cup Management:** Create cups with \`createCup()\` before accepting contributions
5. **Authorization:** InversionPool is pre-authorized to send commissions to OpenLeague

---

## Verification Commands

If deployed on a testnet/mainnet with Etherscan, verify with:

\`\`\`bash
npx hardhat verify --network <network> ${openLeagueAddress}
npx hardhat verify --network <network> ${inversionPoolAddress} "${openLeagueAddress}"
npx hardhat verify --network <network> ${leagueCupAddress}
\`\`\`

---

## Support

For issues or questions, contact the development team.

**Deployment Date:** ${new Date().toLocaleString()}
`;

  const readmePath = path.join(deploymentsDir, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
  console.log('📄 Deployment README created at:', readmePath);
  console.log('\n✨ All done! Check the deployments/ folder for detailed information.\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });

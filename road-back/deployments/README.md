# Open League Smart Contracts

## Deployment Information

**Deployed on:** 2025-11-16T06:53:42.471Z  
**Network:** hardhat  
**Chain ID:** 1337  
**Deployer:** 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

---

## Contract Addresses

| Contract | Address |
|----------|---------|
| **OpenLeague** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **OpenLeagueInversionPool** | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **OpenLeagueCup** | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |

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
- `authorizeContract(address)` - Autorizar contrato para enviar comisiones
- `withdraw(address, uint256)` - Retirar fondos
- `transferFunds(address, uint256)` - Transferir fondos
- `batchTransfer(address[], uint256[])` - Transferir a múltiples direcciones

---

### 2. OpenLeagueInversionPool
**Purpose:** Pool de inversión donde inversores añaden fondos y Open League paga a jugadores.

**Features:**
- Inversores pueden depositar fondos (sin poder retirar)
- Solo el owner puede pagar a jugadores, retirar o transferir fondos
- Comisión automática del 3% en cada pago a jugadores (va a OpenLeague)
- Tracking completo de inversiones y pagos

**Key Functions:**
- `investorDeposit()` - Inversores depositan fondos (payable)
- `openLeagueDeposit()` - Open League deposita fondos (payable, onlyOwner)
- `payPlayer(address, uint256)` - Pagar a jugador con comisión automática (onlyOwner)
- `withdraw(address, uint256)` - Retirar fondos (onlyOwner)
- `transferFunds(address, uint256)` - Transferir fondos (onlyOwner)

**Important:**
- Commission: 3%
- Connected to OpenLeague at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

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
- `createCup(string, uint256, uint256)` - Crear nueva copa (onlyOwner)
- `sponsorContribute(string)` - Contribución de sponsor (payable)
- `publicContribute()` - Contribución pública (payable)
- `payPrize(address, uint256, uint256)` - Pagar premio a ganador (onlyOwner)
- `batchPayPrizes(address[], uint256[], uint256[])` - Pagar múltiples premios (onlyOwner)

---

## Usage Examples

### Investor deposits to InversionPool
```javascript
const inversionPool = await ethers.getContractAt('OpenLeagueInversionPool', '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');
await inversionPool.investorDeposit({ value: ethers.parseEther('1.0') });
```

### Pay player (with automatic 3% commission)
```javascript
const inversionPool = await ethers.getContractAt('OpenLeagueInversionPool', '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');
await inversionPool.payPlayer(playerAddress, ethers.parseEther('100'));
// Player receives 100 ETH, OpenLeague receives 3 ETH automatically
```

### Sponsor contributes to Cup
```javascript
const leagueCup = await ethers.getContractAt('OpenLeagueCup', '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');
await leagueCup.sponsorContribute('Nike', { value: ethers.parseEther('50') });
```

### Pay prize to winner
```javascript
const leagueCup = await ethers.getContractAt('OpenLeagueCup', '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9');
await leagueCup.payPrize(winnerAddress, 1, ethers.parseEther('1000')); // Position 1 (first place)
```

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

The following variables have been added to your `.env` file:

```
OPENLEAGUE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
OPENLEAGUE_INVERSION_POOL_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
OPENLEAGUE_CUP_ADDRESS=0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

---

## Important Notes

1. **Commission Flow:** When paying a player from InversionPool, 3% automatically goes to OpenLeague contract
2. **Owner Control:** All withdrawal and transfer operations require owner authorization
3. **Investor Protection:** Investors can deposit but cannot withdraw from InversionPool
4. **Cup Management:** Create cups with `createCup()` before accepting contributions
5. **Authorization:** InversionPool is pre-authorized to send commissions to OpenLeague

---

## Verification Commands

If deployed on a testnet/mainnet with Etherscan, verify with:

```bash
npx hardhat verify --network <network> 0x5FbDB2315678afecb367f032d93F642f64180aa3
npx hardhat verify --network <network> 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 "0x5FbDB2315678afecb367f032d93F642f64180aa3"
npx hardhat verify --network <network> 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

---

## Support

For issues or questions, contact the development team.

**Deployment Date:** 16/11/2025, 03:53:42

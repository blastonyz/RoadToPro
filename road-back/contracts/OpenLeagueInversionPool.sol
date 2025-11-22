// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title OpenLeagueInversionPool
 * @dev Contrato para gestionar el pool de inversión de Open League
 * Los inversores depositan fondos especificando propósito y jugadores beneficiarios
 * Solo Open League decide cuándo y a quién enviar los fondos (mediante cupones)
 * Se cobra 3% de comisión que va directamente a OpenLeague
 */
contract OpenLeagueInversionPool is Ownable, ReentrancyGuard {
  // Dirección del contrato Open League (recibe el 3% de comisión)
  address public openLeagueContract;

  // Estructura para inversión específica
  struct Investment {
    address investor;
    uint256 amount;
    uint256 amountAfterCommission;
    string purpose; // "fisioterapia", "suplementos", etc.
    address[] targetPlayers;
    uint256 timestamp;
    bool distributed;
  }

  // Estructura para cupón
  struct Coupon {
    uint256 investmentId;
    address player;
    uint256 amount;
    string purpose;
    uint256 createdAt;
    uint256 expiresAt; // 30 días por defecto
    bool redeemed;
    string arkaCdnHash; // Hash del cupón en Arka CDN
  }

  // Tracking de inversiones
  Investment[] public investments;
  mapping(address => uint256[]) public investorInvestments; // investor => investment IDs

  // Tracking de cupones
  Coupon[] public coupons;
  mapping(address => uint256[]) public playerCoupons; // player => coupon IDs
  mapping(string => uint256) public couponHashToId; // arkaCdnHash => coupon ID

  // Estadísticas del pool
  uint256 public totalPoolBalance;
  uint256 public totalInvestorContributions;
  uint256 public totalCommissionsPaid;
  uint256 public totalDistributed;

  // Comisión para Open League (3%)
  uint256 public constant COMMISSION_PERCENTAGE = 3;
  uint256 public constant COUPON_VALIDITY_DAYS = 30;

  // Eventos
  event InvestmentReceived(
    uint256 indexed investmentId,
    address indexed investor,
    uint256 amount,
    uint256 amountAfterCommission,
    string purpose,
    address[] targetPlayers
  );
  event CouponIssued(
    uint256 indexed couponId,
    uint256 indexed investmentId,
    address indexed player,
    uint256 amount,
    string purpose,
    string arkaCdnHash,
    uint256 expiresAt
  );
  event CouponRedeemed(uint256 indexed couponId, address indexed player, address indexed partner);
  event DirectDistribution(uint256 indexed investmentId, address indexed recipient, uint256 amount);
  event OpenLeagueDeposit(uint256 amount);
  event Withdrawal(address indexed to, uint256 amount);
  event OpenLeagueContractUpdated(address indexed newContract);
  event EmergencyWithdrawal(address indexed to, uint256 amount);

  /**
   * @dev Constructor
   * @param _openLeagueContract Dirección del contrato principal de Open League
   */
  constructor(address _openLeagueContract) Ownable(msg.sender) {
    require(_openLeagueContract != address(0), 'Invalid Open League contract address');
    openLeagueContract = _openLeagueContract;
  }

  /**
   * @dev Permite a inversores añadir fondos al pool especificando propósito y jugadores
   * @param purpose Propósito de la inversión (ej: "fisioterapia", "suplementos")
   * @param targetPlayers Array de direcciones de jugadores beneficiarios
   */
  function investorDeposit(
    string memory purpose,
    address[] memory targetPlayers
  ) external payable nonReentrant {
    require(msg.value > 0, 'Deposit amount must be greater than 0');
    require(bytes(purpose).length > 0, 'Purpose cannot be empty');
    require(targetPlayers.length > 0, 'Must specify at least one target player');

    // Calcular comisión (3%)
    uint256 commission = (msg.value * COMMISSION_PERCENTAGE) / 100;
    uint256 amountAfterCommission = msg.value - commission;

    // Transferir comisión al contrato de Open League
    (bool successCommission, ) = openLeagueContract.call{value: commission}('');
    require(successCommission, 'Commission transfer failed');

    // Crear inversión
    Investment memory newInvestment = Investment({
      investor: msg.sender,
      amount: msg.value,
      amountAfterCommission: amountAfterCommission,
      purpose: purpose,
      targetPlayers: targetPlayers,
      timestamp: block.timestamp,
      distributed: false
    });

    investments.push(newInvestment);
    uint256 investmentId = investments.length - 1;
    investorInvestments[msg.sender].push(investmentId);

    totalPoolBalance += amountAfterCommission;
    totalInvestorContributions += msg.value;
    totalCommissionsPaid += commission;

    emit InvestmentReceived(
      investmentId,
      msg.sender,
      msg.value,
      amountAfterCommission,
      purpose,
      targetPlayers
    );
  }

  /**
   * @dev Permite al owner (Open League) añadir fondos al pool
   */
  function openLeagueDeposit() external payable onlyOwner {
    require(msg.value > 0, 'Deposit amount must be greater than 0');

    totalPoolBalance += msg.value;

    emit OpenLeagueDeposit(msg.value);
  }

  /**
   * @dev Emitir cupón temporal (30 días) para un jugador desde una inversión
   * @param investmentId ID de la inversión
   * @param player Dirección del jugador
   * @param amount Cantidad del cupón
   * @param arkaCdnHash Hash del cupón en Arka CDN
   */
  function issueCoupon(
    uint256 investmentId,
    address player,
    uint256 amount,
    string memory arkaCdnHash
  ) external onlyOwner nonReentrant {
    require(investmentId < investments.length, 'Invalid investment ID');
    require(player != address(0), 'Invalid player address');
    require(amount > 0, 'Amount must be greater than 0');
    require(bytes(arkaCdnHash).length > 0, 'Arka CDN hash cannot be empty');
    require(couponHashToId[arkaCdnHash] == 0, 'Coupon hash already exists');

    Investment storage investment = investments[investmentId];
    require(!investment.distributed, 'Investment already distributed');

    // Verificar que el jugador esté en la lista de beneficiarios
    bool isTargetPlayer = false;
    for (uint256 i = 0; i < investment.targetPlayers.length; i++) {
      if (investment.targetPlayers[i] == player) {
        isTargetPlayer = true;
        break;
      }
    }
    require(isTargetPlayer, 'Player not in target players list');
    require(totalPoolBalance >= amount, 'Insufficient pool balance');

    // Crear cupón con 30 días de validez
    Coupon memory newCoupon = Coupon({
      investmentId: investmentId,
      player: player,
      amount: amount,
      purpose: investment.purpose,
      createdAt: block.timestamp,
      expiresAt: block.timestamp + (COUPON_VALIDITY_DAYS * 1 days),
      redeemed: false,
      arkaCdnHash: arkaCdnHash
    });

    coupons.push(newCoupon);
    uint256 couponId = coupons.length - 1;
    playerCoupons[player].push(couponId);
    couponHashToId[arkaCdnHash] = couponId + 1; // +1 para diferenciar de 0

    emit CouponIssued(
      couponId,
      investmentId,
      player,
      amount,
      investment.purpose,
      arkaCdnHash,
      newCoupon.expiresAt
    );
  }

  /**
   * @dev Canjear cupón (llamado por socio autorizado o Open League)
   * @param couponId ID del cupón
   * @param partner Dirección del socio que recibe el pago
   */
  function redeemCoupon(uint256 couponId, address payable partner) external onlyOwner nonReentrant {
    require(couponId < coupons.length, 'Invalid coupon ID');
    require(partner != address(0), 'Invalid partner address');

    Coupon storage coupon = coupons[couponId];
    require(!coupon.redeemed, 'Coupon already redeemed');
    require(block.timestamp <= coupon.expiresAt, 'Coupon expired');
    require(totalPoolBalance >= coupon.amount, 'Insufficient pool balance');

    // Marcar cupón como canjeado
    coupon.redeemed = true;
    totalPoolBalance -= coupon.amount;
    totalDistributed += coupon.amount;

    // Transferir al socio
    (bool success, ) = partner.call{value: coupon.amount}('');
    require(success, 'Transfer to partner failed');

    emit CouponRedeemed(couponId, coupon.player, partner);
  }

  /**
   * @dev Distribución directa (sin cupón) desde una inversión
   * @param investmentId ID de la inversión
   * @param recipient Dirección del destinatario
   * @param amount Cantidad a distribuir
   */
  function directDistribution(
    uint256 investmentId,
    address payable recipient,
    uint256 amount
  ) external onlyOwner nonReentrant {
    require(investmentId < investments.length, 'Invalid investment ID');
    require(recipient != address(0), 'Invalid recipient address');
    require(amount > 0, 'Amount must be greater than 0');
    require(totalPoolBalance >= amount, 'Insufficient pool balance');

    Investment storage investment = investments[investmentId];
    require(!investment.distributed, 'Investment already distributed');

    totalPoolBalance -= amount;
    totalDistributed += amount;

    // Transferir al destinatario
    (bool success, ) = recipient.call{value: amount}('');
    require(success, 'Transfer failed');

    emit DirectDistribution(investmentId, recipient, amount);
  }

  /**
   * @dev Permite al owner retirar fondos del pool
   * @param to Dirección destino
   * @param amount Cantidad a retirar
   */
  function withdraw(address payable to, uint256 amount) external onlyOwner nonReentrant {
    require(to != address(0), 'Invalid destination address');
    require(amount > 0, 'Withdrawal amount must be greater than 0');
    require(totalPoolBalance >= amount, 'Insufficient pool balance');

    totalPoolBalance -= amount;

    (bool success, ) = to.call{value: amount}('');
    require(success, 'Withdrawal transfer failed');

    emit Withdrawal(to, amount);
  }

  /**
   * @dev Permite al owner transferir fondos a otra dirección
   * @param to Dirección destino
   * @param amount Cantidad a transferir
   */
  function transferFunds(address payable to, uint256 amount) external onlyOwner nonReentrant {
    require(to != address(0), 'Invalid destination address');
    require(amount > 0, 'Transfer amount must be greater than 0');
    require(totalPoolBalance >= amount, 'Insufficient pool balance');

    totalPoolBalance -= amount;

    (bool success, ) = to.call{value: amount}('');
    require(success, 'Transfer failed');

    emit Withdrawal(to, amount);
  }

  /**
   * @dev Actualizar la dirección del contrato Open League
   * @param _newContract Nueva dirección del contrato
   */
  function updateOpenLeagueContract(address _newContract) external onlyOwner {
    require(_newContract != address(0), 'Invalid contract address');
    openLeagueContract = _newContract;
    emit OpenLeagueContractUpdated(_newContract);
  }

  /**
   * @dev Retirada de emergencia de todos los fondos
   * Solo puede ser llamado por el owner en caso de emergencia
   */
  function emergencyWithdraw() external onlyOwner nonReentrant {
    uint256 balance = address(this).balance;
    require(balance > 0, 'No funds to withdraw');

    totalPoolBalance = 0;

    (bool success, ) = owner().call{value: balance}('');
    require(success, 'Emergency withdrawal failed');

    emit EmergencyWithdrawal(owner(), balance);
  }

  /**
   * @dev Obtener inversiones de un inversor
   * @param investor Dirección del inversor
   */
  function getInvestorInvestments(address investor) external view returns (uint256[] memory) {
    return investorInvestments[investor];
  }

  /**
   * @dev Obtener detalles de una inversión
   * @param investmentId ID de la inversión
   */
  function getInvestment(
    uint256 investmentId
  )
    external
    view
    returns (
      address investor,
      uint256 amount,
      uint256 amountAfterCommission,
      string memory purpose,
      address[] memory targetPlayers,
      uint256 timestamp,
      bool distributed
    )
  {
    require(investmentId < investments.length, 'Invalid investment ID');
    Investment memory inv = investments[investmentId];
    return (
      inv.investor,
      inv.amount,
      inv.amountAfterCommission,
      inv.purpose,
      inv.targetPlayers,
      inv.timestamp,
      inv.distributed
    );
  }

  /**
   * @dev Obtener cupones de un jugador
   * @param player Dirección del jugador
   */
  function getPlayerCoupons(address player) external view returns (uint256[] memory) {
    return playerCoupons[player];
  }

  /**
   * @dev Obtener detalles de un cupón
   * @param couponId ID del cupón
   */
  function getCoupon(
    uint256 couponId
  )
    external
    view
    returns (
      uint256 investmentId,
      address player,
      uint256 amount,
      string memory purpose,
      uint256 createdAt,
      uint256 expiresAt,
      bool redeemed,
      string memory arkaCdnHash
    )
  {
    require(couponId < coupons.length, 'Invalid coupon ID');
    Coupon memory coupon = coupons[couponId];
    return (
      coupon.investmentId,
      coupon.player,
      coupon.amount,
      coupon.purpose,
      coupon.createdAt,
      coupon.expiresAt,
      coupon.redeemed,
      coupon.arkaCdnHash
    );
  }

  /**
   * @dev Obtener ID de cupón por hash de Arka CDN
   * @param arkaCdnHash Hash del cupón
   */
  function getCouponByHash(string memory arkaCdnHash) external view returns (uint256) {
    uint256 couponIdPlusOne = couponHashToId[arkaCdnHash];
    require(couponIdPlusOne > 0, 'Coupon not found');
    return couponIdPlusOne - 1;
  }

  /**
   * @dev Obtener número total de inversiones
   */
  function getTotalInvestments() external view returns (uint256) {
    return investments.length;
  }

  /**
   * @dev Obtener número total de cupones
   */
  function getTotalCoupons() external view returns (uint256) {
    return coupons.length;
  }

  /**
   * @dev Obtener el balance actual del contrato
   */
  function getContractBalance() external view returns (uint256) {
    return address(this).balance;
  }

  /**
   * @dev Marcar inversión como distribuida
   * @param investmentId ID de la inversión
   */
  function markInvestmentAsDistributed(uint256 investmentId) external onlyOwner {
    require(investmentId < investments.length, 'Invalid investment ID');
    investments[investmentId].distributed = true;
  }

  /**
   * @dev Recibir ETH directamente (depósito de Open League)
   */
  receive() external payable {
    require(msg.sender == owner(), 'Only owner can send ETH directly');
    totalPoolBalance += msg.value;
    emit OpenLeagueDeposit(msg.value);
  }

  /**
   * @dev Fallback function
   */
  fallback() external payable {
    require(msg.sender == owner(), 'Only owner can send ETH directly');
    totalPoolBalance += msg.value;
    emit OpenLeagueDeposit(msg.value);
  }
}

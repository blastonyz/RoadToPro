// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title OpenLeagueCup
 * @dev Contrato para gestionar fondos de la Copa de Open League a nivel mundial
 * Recibe donaciones de sponsors y cualquier persona que quiera contribuir
 * Solo el owner puede distribuir los fondos a los ganadores
 */
contract OpenLeagueCup is Ownable, ReentrancyGuard {
  // Información de la copa actual
  string public currentCupName;
  uint256 public currentCupStartDate;
  uint256 public currentCupEndDate;
  bool public isCupActive;

  // Balance del premio
  uint256 public totalPrizePool;
  uint256 public totalSponsorsContributions;
  uint256 public totalPublicContributions;
  uint256 public totalPrizesPaid;

  // Tracking de sponsors
  struct Sponsor {
    string name;
    uint256 totalContributed;
    uint256 contributionCount;
    bool isActive;
  }

  mapping(address => Sponsor) public sponsors;
  address[] public sponsorAddresses;

  // Tracking de contribuciones públicas
  mapping(address => uint256) public publicContributions;
  address[] public publicContributors;

  // Ganadores
  struct Winner {
    address payable player;
    uint256 position;
    uint256 prizeAmount;
    uint256 paidDate;
    string cupName;
  }

  Winner[] public winners;
  mapping(address => uint256[]) public playerWinnings; // player => array of winner indices

  // Eventos
  event CupCreated(string cupName, uint256 startDate, uint256 endDate);
  event CupEnded(string cupName, uint256 totalPrizePool);
  event SponsorContribution(address indexed sponsor, string sponsorName, uint256 amount);
  event PublicContribution(address indexed contributor, uint256 amount);
  event PrizePaid(address indexed winner, uint256 position, uint256 amount, string cupName);
  event Withdrawal(address indexed to, uint256 amount);
  event EmergencyWithdrawal(address indexed to, uint256 amount);

  /**
   * @dev Constructor
   */
  constructor() Ownable(msg.sender) {
    isCupActive = false;
  }

  /**
   * @dev Crear una nueva copa
   * @param _cupName Nombre de la copa
   * @param _startDate Fecha de inicio (timestamp)
   * @param _endDate Fecha de fin (timestamp)
   */
  function createCup(
    string memory _cupName,
    uint256 _startDate,
    uint256 _endDate
  ) external onlyOwner {
    require(bytes(_cupName).length > 0, 'Cup name cannot be empty');
    require(_startDate < _endDate, 'Invalid dates');
    require(!isCupActive, 'A cup is already active');

    currentCupName = _cupName;
    currentCupStartDate = _startDate;
    currentCupEndDate = _endDate;
    isCupActive = true;

    emit CupCreated(_cupName, _startDate, _endDate);
  }

  /**
   * @dev Finalizar la copa actual
   */
  function endCup() external onlyOwner {
    require(isCupActive, 'No active cup');

    isCupActive = false;

    emit CupEnded(currentCupName, totalPrizePool);
  }

  /**
   * @dev Contribución de un sponsor
   * @param sponsorName Nombre del sponsor
   */
  function sponsorContribute(string memory sponsorName) external payable {
    require(msg.value > 0, 'Contribution amount must be greater than 0');
    require(bytes(sponsorName).length > 0, 'Sponsor name cannot be empty');

    // Si es un nuevo sponsor, añadirlo
    if (!sponsors[msg.sender].isActive) {
      sponsors[msg.sender] = Sponsor({
        name: sponsorName,
        totalContributed: 0,
        contributionCount: 0,
        isActive: true
      });
      sponsorAddresses.push(msg.sender);
    }

    sponsors[msg.sender].totalContributed += msg.value;
    sponsors[msg.sender].contributionCount += 1;

    totalPrizePool += msg.value;
    totalSponsorsContributions += msg.value;

    emit SponsorContribution(msg.sender, sponsorName, msg.value);
  }

  /**
   * @dev Contribución pública (cualquier persona puede donar)
   */
  function publicContribute() external payable {
    require(msg.value > 0, 'Contribution amount must be greater than 0');

    // Si es un nuevo contribuyente, añadirlo
    if (publicContributions[msg.sender] == 0) {
      publicContributors.push(msg.sender);
    }

    publicContributions[msg.sender] += msg.value;
    totalPrizePool += msg.value;
    totalPublicContributions += msg.value;

    emit PublicContribution(msg.sender, msg.value);
  }

  /**
   * @dev Pagar premio a un ganador
   * @param winner Dirección del ganador
   * @param position Posición del ganador (1 = primero, 2 = segundo, etc.)
   * @param amount Cantidad del premio
   */
  function payPrize(
    address payable winner,
    uint256 position,
    uint256 amount
  ) external onlyOwner nonReentrant {
    require(winner != address(0), 'Invalid winner address');
    require(position > 0, 'Position must be greater than 0');
    require(amount > 0, 'Prize amount must be greater than 0');
    require(totalPrizePool >= amount, 'Insufficient prize pool');

    totalPrizePool -= amount;
    totalPrizesPaid += amount;

    // Registrar ganador
    Winner memory newWinner = Winner({
      player: winner,
      position: position,
      prizeAmount: amount,
      paidDate: block.timestamp,
      cupName: currentCupName
    });

    winners.push(newWinner);
    playerWinnings[winner].push(winners.length - 1);

    // Transferir premio
    (bool success, ) = winner.call{value: amount}('');
    require(success, 'Prize transfer failed');

    emit PrizePaid(winner, position, amount, currentCupName);
  }

  /**
   * @dev Pagar múltiples premios en batch
   * @param _winners Array de direcciones ganadoras
   * @param positions Array de posiciones
   * @param amounts Array de cantidades
   */
  function batchPayPrizes(
    address payable[] calldata _winners,
    uint256[] calldata positions,
    uint256[] calldata amounts
  ) external onlyOwner nonReentrant {
    require(
      _winners.length == positions.length && positions.length == amounts.length,
      'Arrays length mismatch'
    );
    require(_winners.length > 0, 'Empty arrays');

    uint256 totalAmount = 0;
    for (uint256 i = 0; i < amounts.length; i++) {
      totalAmount += amounts[i];
    }

    require(totalPrizePool >= totalAmount, 'Insufficient prize pool');

    totalPrizePool -= totalAmount;
    totalPrizesPaid += totalAmount;

    for (uint256 i = 0; i < _winners.length; i++) {
      require(_winners[i] != address(0), 'Invalid winner address');
      require(positions[i] > 0, 'Position must be greater than 0');
      require(amounts[i] > 0, 'Amount must be greater than 0');

      // Registrar ganador
      Winner memory newWinner = Winner({
        player: _winners[i],
        position: positions[i],
        prizeAmount: amounts[i],
        paidDate: block.timestamp,
        cupName: currentCupName
      });

      winners.push(newWinner);
      playerWinnings[_winners[i]].push(winners.length - 1);

      // Transferir premio
      (bool success, ) = _winners[i].call{value: amounts[i]}('');
      require(success, 'Prize transfer failed');

      emit PrizePaid(_winners[i], positions[i], amounts[i], currentCupName);
    }
  }

  /**
   * @dev Retirar fondos no utilizados (solo owner)
   * @param to Dirección destino
   * @param amount Cantidad a retirar
   */
  function withdraw(address payable to, uint256 amount) external onlyOwner nonReentrant {
    require(to != address(0), 'Invalid destination address');
    require(amount > 0, 'Withdrawal amount must be greater than 0');
    require(totalPrizePool >= amount, 'Insufficient balance');

    totalPrizePool -= amount;

    (bool success, ) = to.call{value: amount}('');
    require(success, 'Withdrawal transfer failed');

    emit Withdrawal(to, amount);
  }

  /**
   * @dev Retirada de emergencia de todos los fondos
   */
  function emergencyWithdraw() external onlyOwner nonReentrant {
    uint256 balance = address(this).balance;
    require(balance > 0, 'No funds to withdraw');

    totalPrizePool = 0;

    (bool success, ) = owner().call{value: balance}('');
    require(success, 'Emergency withdrawal failed');

    emit EmergencyWithdrawal(owner(), balance);
  }

  /**
   * @dev Obtener información de un sponsor
   * @param sponsorAddress Dirección del sponsor
   */
  function getSponsorInfo(
    address sponsorAddress
  )
    external
    view
    returns (string memory name, uint256 totalContributed, uint256 contributionCount, bool isActive)
  {
    Sponsor memory sponsor = sponsors[sponsorAddress];
    return (sponsor.name, sponsor.totalContributed, sponsor.contributionCount, sponsor.isActive);
  }

  /**
   * @dev Obtener el número total de sponsors
   */
  function getTotalSponsors() external view returns (uint256) {
    return sponsorAddresses.length;
  }

  /**
   * @dev Obtener todos los sponsors
   */
  function getAllSponsors() external view returns (address[] memory) {
    return sponsorAddresses;
  }

  /**
   * @dev Obtener contribución pública de una dirección
   * @param contributor Dirección del contribuyente
   */
  function getPublicContribution(address contributor) external view returns (uint256) {
    return publicContributions[contributor];
  }

  /**
   * @dev Obtener número total de contribuyentes públicos
   */
  function getTotalPublicContributors() external view returns (uint256) {
    return publicContributors.length;
  }

  /**
   * @dev Obtener número total de ganadores
   */
  function getTotalWinners() external view returns (uint256) {
    return winners.length;
  }

  /**
   * @dev Obtener información de un ganador
   * @param index Índice del ganador
   */
  function getWinner(
    uint256 index
  )
    external
    view
    returns (
      address player,
      uint256 position,
      uint256 prizeAmount,
      uint256 paidDate,
      string memory cupName
    )
  {
    require(index < winners.length, 'Invalid winner index');
    Winner memory winner = winners[index];
    return (winner.player, winner.position, winner.prizeAmount, winner.paidDate, winner.cupName);
  }

  /**
   * @dev Obtener ganancias de un jugador
   * @param player Dirección del jugador
   */
  function getPlayerWinnings(address player) external view returns (uint256[] memory) {
    return playerWinnings[player];
  }

  /**
   * @dev Obtener estadísticas de la copa
   */
  function getCupStats()
    external
    view
    returns (
      string memory cupName,
      uint256 startDate,
      uint256 endDate,
      bool active,
      uint256 prizePool,
      uint256 sponsorsContributions,
      uint256 publicContributions,
      uint256 prizesPaid
    )
  {
    return (
      currentCupName,
      currentCupStartDate,
      currentCupEndDate,
      isCupActive,
      totalPrizePool,
      totalSponsorsContributions,
      totalPublicContributions,
      totalPrizesPaid
    );
  }

  /**
   * @dev Obtener balance del contrato
   */
  function getContractBalance() external view returns (uint256) {
    return address(this).balance;
  }

  /**
   * @dev Recibir ETH directamente
   */
  receive() external payable {
    if (publicContributions[msg.sender] == 0) {
      publicContributors.push(msg.sender);
    }

    publicContributions[msg.sender] += msg.value;
    totalPrizePool += msg.value;
    totalPublicContributions += msg.value;

    emit PublicContribution(msg.sender, msg.value);
  }

  /**
   * @dev Fallback function
   */
  fallback() external payable {
    if (publicContributions[msg.sender] == 0) {
      publicContributors.push(msg.sender);
    }

    publicContributions[msg.sender] += msg.value;
    totalPrizePool += msg.value;
    totalPublicContributions += msg.value;

    emit PublicContribution(msg.sender, msg.value);
  }
}

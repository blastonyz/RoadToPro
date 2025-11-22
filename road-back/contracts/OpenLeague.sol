// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title OpenLeague
 * @dev Contrato principal de Open League donde se aloja el dinero de la organización
 * Recibe automáticamente el 3% de comisión de las transacciones del InversionPool
 */
contract OpenLeague is Ownable, ReentrancyGuard {
  // Balance total de Open League
  uint256 public totalBalance;

  // Tracking de comisiones recibidas
  uint256 public totalCommissionsReceived;
  uint256 public totalWithdrawals;
  uint256 public totalTransfers;

  // Contratos autorizados para enviar comisiones
  mapping(address => bool) public authorizedContracts;
  address[] public authorizedContractsList;

  // Eventos
  event CommissionReceived(address indexed from, uint256 amount);
  event DirectDeposit(address indexed from, uint256 amount);
  event Withdrawal(address indexed to, uint256 amount);
  event Transfer(address indexed to, uint256 amount);
  event ContractAuthorized(address indexed contractAddress);
  event ContractDeauthorized(address indexed contractAddress);
  event EmergencyWithdrawal(address indexed to, uint256 amount);

  /**
   * @dev Constructor
   */
  constructor() Ownable(msg.sender) {
    totalBalance = 0;
  }

  /**
   * @dev Autorizar un contrato para enviar comisiones
   * @param contractAddress Dirección del contrato a autorizar
   */
  function authorizeContract(address contractAddress) external onlyOwner {
    require(contractAddress != address(0), 'Invalid contract address');
    require(!authorizedContracts[contractAddress], 'Contract already authorized');

    authorizedContracts[contractAddress] = true;
    authorizedContractsList.push(contractAddress);

    emit ContractAuthorized(contractAddress);
  }

  /**
   * @dev Desautorizar un contrato
   * @param contractAddress Dirección del contrato a desautorizar
   */
  function deauthorizeContract(address contractAddress) external onlyOwner {
    require(authorizedContracts[contractAddress], 'Contract not authorized');

    authorizedContracts[contractAddress] = false;

    // Remover del array
    for (uint256 i = 0; i < authorizedContractsList.length; i++) {
      if (authorizedContractsList[i] == contractAddress) {
        authorizedContractsList[i] = authorizedContractsList[authorizedContractsList.length - 1];
        authorizedContractsList.pop();
        break;
      }
    }

    emit ContractDeauthorized(contractAddress);
  }

  /**
   * @dev Recibir fondos (puede ser comisión o depósito directo)
   * Los contratos autorizados enviarán comisiones aquí
   */
  function receiveCommission() external payable {
    require(msg.value > 0, 'Amount must be greater than 0');

    totalBalance += msg.value;

    if (authorizedContracts[msg.sender]) {
      totalCommissionsReceived += msg.value;
      emit CommissionReceived(msg.sender, msg.value);
    } else {
      emit DirectDeposit(msg.sender, msg.value);
    }
  }

  /**
   * @dev Depositar fondos directamente
   */
  function deposit() external payable onlyOwner {
    require(msg.value > 0, 'Deposit amount must be greater than 0');

    totalBalance += msg.value;

    emit DirectDeposit(msg.sender, msg.value);
  }

  /**
   * @dev Retirar fondos del contrato
   * @param to Dirección destino
   * @param amount Cantidad a retirar
   */
  function withdraw(address payable to, uint256 amount) external onlyOwner nonReentrant {
    require(to != address(0), 'Invalid destination address');
    require(amount > 0, 'Withdrawal amount must be greater than 0');
    require(totalBalance >= amount, 'Insufficient balance');

    totalBalance -= amount;
    totalWithdrawals += amount;

    (bool success, ) = to.call{value: amount}('');
    require(success, 'Withdrawal transfer failed');

    emit Withdrawal(to, amount);
  }

  /**
   * @dev Transferir fondos a otra dirección
   * @param to Dirección destino
   * @param amount Cantidad a transferir
   */
  function transferFunds(address payable to, uint256 amount) external onlyOwner nonReentrant {
    require(to != address(0), 'Invalid destination address');
    require(amount > 0, 'Transfer amount must be greater than 0');
    require(totalBalance >= amount, 'Insufficient balance');

    totalBalance -= amount;
    totalTransfers += amount;

    (bool success, ) = to.call{value: amount}('');
    require(success, 'Transfer failed');

    emit Transfer(to, amount);
  }

  /**
   * @dev Transferir múltiples pagos en batch
   * @param recipients Array de direcciones receptoras
   * @param amounts Array de cantidades correspondientes
   */
  function batchTransfer(
    address payable[] calldata recipients,
    uint256[] calldata amounts
  ) external onlyOwner nonReentrant {
    require(recipients.length == amounts.length, 'Arrays length mismatch');
    require(recipients.length > 0, 'Empty arrays');

    uint256 totalAmount = 0;
    for (uint256 i = 0; i < amounts.length; i++) {
      totalAmount += amounts[i];
    }

    require(totalBalance >= totalAmount, 'Insufficient balance');

    totalBalance -= totalAmount;
    totalTransfers += totalAmount;

    for (uint256 i = 0; i < recipients.length; i++) {
      require(recipients[i] != address(0), 'Invalid recipient address');
      require(amounts[i] > 0, 'Amount must be greater than 0');

      (bool success, ) = recipients[i].call{value: amounts[i]}('');
      require(success, 'Transfer failed');

      emit Transfer(recipients[i], amounts[i]);
    }
  }

  /**
   * @dev Retirada de emergencia de todos los fondos
   * Solo puede ser llamado por el owner en caso de emergencia
   */
  function emergencyWithdraw() external onlyOwner nonReentrant {
    uint256 balance = address(this).balance;
    require(balance > 0, 'No funds to withdraw');

    totalBalance = 0;

    (bool success, ) = owner().call{value: balance}('');
    require(success, 'Emergency withdrawal failed');

    emit EmergencyWithdrawal(owner(), balance);
  }

  /**
   * @dev Obtener balance del contrato
   */
  function getBalance() external view returns (uint256) {
    return address(this).balance;
  }

  /**
   * @dev Obtener estadísticas del contrato
   */
  function getStats()
    external
    view
    returns (
      uint256 balance,
      uint256 commissions,
      uint256 withdrawals,
      uint256 transfers,
      uint256 authorizedContractsCount
    )
  {
    return (
      totalBalance,
      totalCommissionsReceived,
      totalWithdrawals,
      totalTransfers,
      authorizedContractsList.length
    );
  }

  /**
   * @dev Obtener todos los contratos autorizados
   */
  function getAuthorizedContracts() external view returns (address[] memory) {
    return authorizedContractsList;
  }

  /**
   * @dev Verificar si un contrato está autorizado
   * @param contractAddress Dirección del contrato
   */
  function isContractAuthorized(address contractAddress) external view returns (bool) {
    return authorizedContracts[contractAddress];
  }

  /**
   * @dev Recibir ETH directamente (comisiones)
   */
  receive() external payable {
    totalBalance += msg.value;

    if (authorizedContracts[msg.sender]) {
      totalCommissionsReceived += msg.value;
      emit CommissionReceived(msg.sender, msg.value);
    } else {
      emit DirectDeposit(msg.sender, msg.value);
    }
  }

  /**
   * @dev Fallback function
   */
  fallback() external payable {
    totalBalance += msg.value;

    if (authorizedContracts[msg.sender]) {
      totalCommissionsReceived += msg.value;
      emit CommissionReceived(msg.sender, msg.value);
    } else {
      emit DirectDeposit(msg.sender, msg.value);
    }
  }
}

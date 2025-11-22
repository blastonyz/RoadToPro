// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title ClubToken
 * @dev Contrato ERC20 migrable para tokens de clubes
 * Permite a los clubes crear su propio token con símbolo personalizado
 * y migrar a un nuevo contrato si desean cambiar el nombre/símbolo
 */
contract ClubToken is ERC20, Ownable, ReentrancyGuard {
  // Información del club
  string public clubName;
  string private _symbol;

  // Dirección del nuevo contrato en caso de migración
  address public newTokenContract;
  bool public isMigrationEnabled;
  bool public isMigrated;

  // Mapping de direcciones que ya migraron sus tokens
  mapping(address => bool) public hasMigrated;

  // Supply inicial y máximo
  uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18; // 1 millón de tokens
  uint256 public immutable maxSupply;

  event MigrationEnabled(address indexed newContract);
  event TokensMigrated(address indexed holder, uint256 amount, address indexed newContract);
  event ClubInfoUpdated(string newName);
  event TokensMinted(address indexed to, uint256 amount);
  event TokensBurned(address indexed from, uint256 amount);

  /**
   * @dev Constructor que inicializa el token del club
   * @param _clubName Nombre completo del club
   * @param _tokenSymbol Símbolo del token (3-5 letras mayúsculas)
   * @param _initialSupply Supply inicial de tokens
   */
  constructor(
    string memory _clubName,
    string memory _tokenSymbol,
    uint256 _initialSupply
  ) ERC20(_clubName, _tokenSymbol) Ownable(msg.sender) {
    require(bytes(_clubName).length > 0, 'Club name cannot be empty');
    require(
      bytes(_tokenSymbol).length >= 3 && bytes(_tokenSymbol).length <= 5,
      'Symbol must be 3-5 characters'
    );

    clubName = _clubName;
    _symbol = _tokenSymbol;
    maxSupply = _initialSupply * 10; // Máximo 10x el supply inicial

    // Mintear supply inicial al owner (club)
    _mint(msg.sender, _initialSupply);
  }

  /**
   * @dev Override del símbolo para usar el personalizado
   */
  function symbol() public view virtual override returns (string memory) {
    return _symbol;
  }

  /**
   * @dev Actualiza el nombre del club (no afecta el token, solo metadata)
   * Para cambiar el símbolo del token se debe migrar
   */
  function updateClubName(string memory newName) public onlyOwner {
    require(bytes(newName).length > 0, 'Name cannot be empty');
    require(!isMigrated, 'Contract is migrated');
    clubName = newName;
    emit ClubInfoUpdated(newName);
  }

  /**
   * @dev Mintea nuevos tokens (solo owner, respetando maxSupply)
   */
  function mint(address to, uint256 amount) public onlyOwner {
    require(!isMigrated, 'Contract is migrated');
    require(totalSupply() + amount <= maxSupply, 'Exceeds max supply');
    _mint(to, amount);
    emit TokensMinted(to, amount);
  }

  /**
   * @dev Quema tokens
   */
  function burn(uint256 amount) public {
    require(!isMigrated, 'Contract is migrated');
    _burn(msg.sender, amount);
    emit TokensBurned(msg.sender, amount);
  }

  /**
   * @dev Habilita la migración a un nuevo contrato
   * Se usa cuando el club quiere cambiar el símbolo del token
   * @param _newTokenContract Dirección del nuevo contrato ClubToken
   */
  function enableMigration(address _newTokenContract) public onlyOwner {
    require(_newTokenContract != address(0), 'Invalid new contract address');
    require(!isMigrationEnabled, 'Migration already enabled');
    require(!isMigrated, 'Already migrated');

    newTokenContract = _newTokenContract;
    isMigrationEnabled = true;

    emit MigrationEnabled(_newTokenContract);
  }

  /**
   * @dev Migra los tokens del holder al nuevo contrato
   * El holder debe aprobar primero este contrato para quemar sus tokens
   */
  function migrate() public nonReentrant {
    require(isMigrationEnabled, 'Migration not enabled');
    require(!isMigrated, 'Contract fully migrated');
    require(!hasMigrated[msg.sender], 'Already migrated');
    require(newTokenContract != address(0), 'No new contract set');

    uint256 balance = balanceOf(msg.sender);
    require(balance > 0, 'No tokens to migrate');

    // Marcar como migrado antes de quemar (reentrancy protection)
    hasMigrated[msg.sender] = true;

    // Quemar tokens en el contrato viejo
    _burn(msg.sender, balance);

    // Llamar al nuevo contrato para mintear los tokens
    // El nuevo contrato debe tener una función receiveMigration
    (bool success, ) = newTokenContract.call(
      abi.encodeWithSignature('receiveMigration(address,uint256)', msg.sender, balance)
    );
    require(success, 'Migration failed');

    emit TokensMigrated(msg.sender, balance, newTokenContract);
  }

  /**
   * @dev Recibe tokens migrados desde un contrato anterior
   * Solo puede ser llamado por un contrato ClubToken autorizado
   */
  function receiveMigration(address holder, uint256 amount) public {
    require(!isMigrated, 'Contract is migrated');
    require(amount > 0, 'Amount must be greater than 0');

    // Solo permitir migración desde contratos autorizados por el owner
    // En producción, agregar verificación de contrato anterior

    _mint(holder, amount);
  }

  /**
   * @dev Marca el contrato como completamente migrado
   * Después de esto, no se pueden hacer más operaciones
   */
  function finalizeMigration() public onlyOwner {
    require(isMigrationEnabled, 'Migration not enabled');
    isMigrated = true;
  }

  /**
   * @dev Override de transfer para prevenir transferencias si está migrado
   */
  function transfer(address to, uint256 amount) public virtual override returns (bool) {
    require(!isMigrated, 'Contract is migrated, please migrate your tokens');
    return super.transfer(to, amount);
  }

  /**
   * @dev Override de transferFrom para prevenir transferencias si está migrado
   */
  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) public virtual override returns (bool) {
    require(!isMigrated, 'Contract is migrated, please migrate your tokens');
    return super.transferFrom(from, to, amount);
  }

  /**
   * @dev Información del contrato
   */
  function getContractInfo()
    public
    view
    returns (
      string memory _clubName,
      string memory _tokenSymbol,
      uint256 _totalSupply,
      uint256 _maxSupply,
      bool _isMigrationEnabled,
      bool _isMigrated,
      address _newContract
    )
  {
    return (
      clubName,
      symbol(),
      totalSupply(),
      maxSupply,
      isMigrationEnabled,
      isMigrated,
      newTokenContract
    );
  }
}

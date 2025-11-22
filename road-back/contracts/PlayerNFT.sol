// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
// Counters removed for compatibility with OpenZeppelin v5; use a simple uint256 counter

/**
 * @title PlayerNFT
 * @dev Contrato ERC721 para tokens únicos de jugadores
 * Cada jugador tiene un NFT único que representa su identidad digital
 */
contract PlayerNFT is ERC721, ERC721URIStorage, Ownable {
  uint256 private _tokenIds;

  // Mapping de dirección del jugador a su token ID
  mapping(address => uint256) public playerToToken;

  // Mapping de token ID a dirección del jugador
  mapping(uint256 => address) public tokenToPlayer;

  // Mapping de token ID a metadata del jugador
  mapping(uint256 => PlayerMetadata) public playerMetadata;

  struct PlayerMetadata {
    string name;
    string position;
    uint256 jerseyNumber;
    string nationality;
    uint256 mintedAt;
    bool isActive;
  }

  event PlayerMinted(address indexed player, uint256 indexed tokenId, string name);
  event PlayerMetadataUpdated(uint256 indexed tokenId, string name);
  event PlayerTransferred(address indexed from, address indexed to, uint256 indexed tokenId);

  constructor() ERC721('OpenLeague Player', 'OLPLAYER') Ownable(msg.sender) {}

  /**
   * @dev Mintea un nuevo NFT de jugador
   * @param player Dirección del jugador
   * @param name Nombre del jugador
   * @param position Posición del jugador
   * @param jerseyNumber Número de camiseta
   * @param nationality Nacionalidad
   * @param tokenURI URI de los metadatos del NFT
   */
  function mintPlayer(
    address player,
    string memory name,
    string memory position,
    uint256 jerseyNumber,
    string memory nationality,
    string memory tokenURI
  ) public onlyOwner returns (uint256) {
    require(playerToToken[player] == 0, 'Player already has an NFT');
    require(bytes(name).length > 0, 'Name cannot be empty');

    _tokenIds += 1;
    uint256 newTokenId = _tokenIds;

    _safeMint(player, newTokenId);
    _setTokenURI(newTokenId, tokenURI);

    playerToToken[player] = newTokenId;
    tokenToPlayer[newTokenId] = player;

    playerMetadata[newTokenId] = PlayerMetadata({
      name: name,
      position: position,
      jerseyNumber: jerseyNumber,
      nationality: nationality,
      mintedAt: block.timestamp,
      isActive: true
    });

    emit PlayerMinted(player, newTokenId, name);
    return newTokenId;
  }

  /**
   * @dev Actualiza los metadatos de un jugador
   * Solo el propietario del NFT puede actualizar
   */
  function updatePlayerMetadata(
    uint256 tokenId,
    string memory name,
    string memory position,
    uint256 jerseyNumber,
    string memory nationality
  ) public {
    require(_ownerOf(tokenId) == msg.sender, 'Not the owner');
    require(playerMetadata[tokenId].isActive, 'Player NFT is not active');

    playerMetadata[tokenId].name = name;
    playerMetadata[tokenId].position = position;
    playerMetadata[tokenId].jerseyNumber = jerseyNumber;
    playerMetadata[tokenId].nationality = nationality;

    emit PlayerMetadataUpdated(tokenId, name);
  }

  /**
   * @dev Actualiza el URI de los metadatos
   * Solo el propietario del contrato puede actualizar
   */
  function updateTokenURI(uint256 tokenId, string memory newTokenURI) public onlyOwner {
    require(_ownerOf(tokenId) != address(0), 'Token does not exist');
    _setTokenURI(tokenId, newTokenURI);
  }

  /**
   * @dev Desactiva un NFT de jugador
   * Útil cuando un jugador se retira o es transferido
   */
  function deactivatePlayer(uint256 tokenId) public onlyOwner {
    require(_ownerOf(tokenId) != address(0), 'Token does not exist');
    playerMetadata[tokenId].isActive = false;
  }

  /**
   * @dev Reactiva un NFT de jugador
   */
  function reactivatePlayer(uint256 tokenId) public onlyOwner {
    require(_ownerOf(tokenId) != address(0), 'Token does not exist');
    playerMetadata[tokenId].isActive = true;
  }

  /**
   * @dev Obtiene la información completa de un jugador por su token ID
   */
  function getPlayerInfo(
    uint256 tokenId
  )
    public
    view
    returns (
      string memory name,
      string memory position,
      uint256 jerseyNumber,
      string memory nationality,
      uint256 mintedAt,
      bool isActive,
      address owner
    )
  {
    require(_ownerOf(tokenId) != address(0), 'Token does not exist');
    PlayerMetadata memory metadata = playerMetadata[tokenId];
    return (
      metadata.name,
      metadata.position,
      metadata.jerseyNumber,
      metadata.nationality,
      metadata.mintedAt,
      metadata.isActive,
      _ownerOf(tokenId)
    );
  }

  /**
   * @dev Obtiene el token ID de un jugador por su dirección
   */
  function getPlayerTokenId(address player) public view returns (uint256) {
    return playerToToken[player];
  }

  /**
   * @dev Override para manejar transferencias y actualizar mappings
   */
  function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
    address from = _ownerOf(tokenId);
    address previousOwner = super._update(to, tokenId, auth);

    // Actualizar mappings si no es mint
    if (from != address(0)) {
      delete playerToToken[from];
    }

    if (to != address(0)) {
      playerToToken[to] = tokenId;
      tokenToPlayer[tokenId] = to;
      emit PlayerTransferred(from, to, tokenId);
    }

    return previousOwner;
  }

  /**
   * @dev Total de jugadores minteados
   */
  function totalPlayers() public view returns (uint256) {
    return _tokenIds;
  }

  // Override para ERC721URIStorage
  function tokenURI(
    uint256 tokenId
  ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}

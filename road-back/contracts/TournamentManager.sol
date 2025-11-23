// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

/**
 * @title TournamentManager
 * @dev Contract to manage tournaments and their participants
 */
contract TournamentManager is Ownable, ReentrancyGuard {
  struct Tournament {
    uint256 id;
    string name;
    string description;
    uint256 prizePool;
    address contractAddress;
    bool isActive;
    uint256 createdAt;
  }

  Tournament[] public tournaments;
  mapping(uint256 => address[]) public tournamentParticipants;
  mapping(address => uint256[]) public participantTournaments;

  event TournamentCreated(
    uint256 indexed tournamentId,
    string name,
    address indexed organizer
  );
  event ParticipantAdded(
    uint256 indexed tournamentId,
    address indexed participant
  );
  event PrizePoolUpdated(uint256 indexed tournamentId, uint256 newPrizePool);

  constructor() Ownable(msg.sender) {}

  /**
   * @dev Create a new tournament
   * @param name Tournament name
   * @param description Tournament description
   * @param contractAddress Optional contract address for the tournament
   */
  function createTournament(
    string memory name,
    string memory description,
    address contractAddress
  ) external onlyOwner returns (uint256) {
    uint256 tournamentId = tournaments.length;
    tournaments.push(
      Tournament({
        id: tournamentId,
        name: name,
        description: description,
        prizePool: 0,
        contractAddress: contractAddress,
        isActive: true,
        createdAt: block.timestamp
      })
    );

    emit TournamentCreated(tournamentId, name, msg.sender);
    return tournamentId;
  }

  /**
   * @dev Add a participant to a tournament
   * @param tournamentId Tournament ID
   * @param participant Participant address
   */
  function addParticipant(
    uint256 tournamentId,
    address participant
  ) external onlyOwner {
    require(tournamentId < tournaments.length, 'Tournament does not exist');
    require(tournaments[tournamentId].isActive, 'Tournament is not active');
    require(participant != address(0), 'Invalid participant address');

    tournamentParticipants[tournamentId].push(participant);
    participantTournaments[participant].push(tournamentId);

    emit ParticipantAdded(tournamentId, participant);
  }

  /**
   * @dev Update tournament prize pool
   * @param tournamentId Tournament ID
   * @param newPrizePool New prize pool amount
   */
  function updatePrizePool(
    uint256 tournamentId,
    uint256 newPrizePool
  ) external onlyOwner {
    require(tournamentId < tournaments.length, 'Tournament does not exist');
    tournaments[tournamentId].prizePool = newPrizePool;
    emit PrizePoolUpdated(tournamentId, newPrizePool);
  }

  /**
   * @dev Get tournament count
   * @return count Number of tournaments
   */
  function getTournamentCount() external view returns (uint256) {
    return tournaments.length;
  }

  /**
   * @dev Get tournament participants count
   * @param tournamentId Tournament ID
   * @return count Number of participants
   */
  function getParticipantCount(
    uint256 tournamentId
  ) external view returns (uint256) {
    return tournamentParticipants[tournamentId].length;
  }
}


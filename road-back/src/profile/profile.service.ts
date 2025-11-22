import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePlayerProfileDto, CreateClubProfileDto, CreateCoachProfileDto, CreateFanProfileDto, UpdatePlayerProfileDto } from './dto/index.js';
import { BlockchainService } from '../blockchain/blockchain.service.js';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private prisma: PrismaService, private blockchain: BlockchainService) { }

  // ============================================
  // PLAYER PROFILE
  // ============================================

  async createPlayerProfile(userId: string, dto: CreatePlayerProfileDto) {
    // Verificar que el usuario no tenga ya un perfil de jugador
    const existingProfile = await this.prisma.playerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('User already has a player profile');
    }

    const profile = await this.prisma.playerProfile.create({
      data: {
        userId,
        displayName: dto.displayName,
        position: dto.position,
        jerseyNumber: dto.jerseyNumber,
        height: dto.height,
        weight: dto.weight,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        nationality: dto.nationality,
        biography: dto.biography,
        avatarUrl: dto.avatarUrl,
        statistics: dto.statistics,
        achievements: dto.achievements,
      },
    });

    this.logger.log(`Player profile created for user ${userId}`);

    // Try to deploy PlayerNFT and transfer ownership to the player's EVM wallet
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { wallets: true } });
      // Find EVM-compatible wallet (address starts with 0x)
      const targetWallet = user?.wallets?.find((w) => w.address?.startsWith('0x')) ||
        user?.wallets?.find((w) => w.isDefault && w.address?.startsWith('0x'));

      const { address, contract } = await this.blockchain.deployPlayerNFT();
      await this.prisma.playerProfile.update({ where: { userId }, data: { contractAddress: address } });

      if (targetWallet && targetWallet.address && targetWallet.address.startsWith('0x')) {
        await this.blockchain.transferOwnership(contract, targetWallet.address);
        this.logger.log(`PlayerNFT deployed at ${address} and ownership transferred to ${targetWallet.address}`);
      } else {
        this.logger.log(`PlayerNFT deployed at ${address}. No EVM wallet found - ownership retained by deployer.`);
      }

      return await this.prisma.playerProfile.findUnique({ where: { userId } });
    } catch (err) {
      this.logger.error('Error deploying/transferring PlayerNFT', err as any);
    }

    return profile;
  }

  async getPlayerProfile(userId: string) {
    const profile = await this.prisma.playerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            wallets: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Player profile not found');
    }

    return profile;
  }

  async updatePlayerProfile(userId: string, dto: UpdatePlayerProfileDto) {
    const profile = await this.prisma.playerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Player profile not found');
    }

    const updated = await this.prisma.playerProfile.update({
      where: { userId },
      data: dto,
    });

    this.logger.log(`Player profile updated for user ${userId}`);
    return updated;
  }

  async updatePlayerNFTInfo(userId: string, nftTokenId: string, contractAddress: string) {
    const profile = await this.prisma.playerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Player profile not found');
    }

    return await this.prisma.playerProfile.update({
      where: { userId },
      data: {
        nftTokenId,
        contractAddress,
      },
    });
  }

  async getAllPlayers(skip: number = 0, take: number = 20) {
    return await this.prisma.playerProfile.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // ============================================
  // CLUB PROFILE
  // ============================================

  async createClubProfile(userId: string, dto: CreateClubProfileDto) {
    // Verificar que el usuario no tenga ya un perfil de club
    const existingProfile = await this.prisma.clubProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('User already has a club profile');
    }

    // Verificar que el nombre del club no esté tomado
    const existingClub = await this.prisma.clubProfile.findUnique({
      where: { clubName: dto.clubName },
    });

    if (existingClub) {
      throw new ConflictException('Club name already taken');
    }

    // Verificar que el símbolo del token no esté tomado
    const existingSymbol = await this.prisma.clubProfile.findUnique({
      where: { tokenSymbol: dto.tokenSymbol },
    });

    if (existingSymbol) {
      throw new ConflictException('Token symbol already taken');
    }

    const profile = await this.prisma.clubProfile.create({
      data: {
        userId,
        clubName: dto.clubName,
        shortName: dto.shortName,
        tokenSymbol: dto.tokenSymbol,
        tokenName: dto.tokenName,
        foundedYear: dto.foundedYear,
        country: dto.country,
        city: dto.city,
        stadium: dto.stadium,
        description: dto.description,
        logoUrl: dto.logoUrl,
        bannerUrl: dto.bannerUrl,
        socialLinks: dto.socialLinks,
      },
    });

    this.logger.log(`Club profile created for user ${userId}: ${dto.clubName}`);

    // Try to deploy ClubToken and transfer ownership to the club's EVM wallet
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { wallets: true } });
      // Find EVM-compatible wallet (address starts with 0x)
      const targetWallet = user?.wallets?.find((w) => w.address?.startsWith('0x')) ||
        user?.wallets?.find((w) => w.isDefault && w.address?.startsWith('0x'));

      const { address, contract } = await this.blockchain.deployClubToken(dto.clubName, dto.tokenSymbol, undefined);
      await this.prisma.clubProfile.update({ where: { userId }, data: { tokenAddress: address, tokenSupply: '1000000' } });

      if (targetWallet && targetWallet.address && targetWallet.address.startsWith('0x')) {
        await this.blockchain.transferOwnership(contract, targetWallet.address);
        this.logger.log(`ClubToken deployed at ${address} and ownership transferred to ${targetWallet.address}`);
      } else {
        this.logger.log(`ClubToken deployed at ${address}. No EVM wallet found - ownership retained by deployer.`);
      }
    } catch (err) {
      this.logger.error('Error deploying/transferring ClubToken', err as any);
    }

    return profile;
  }

  async getClubProfile(userId: string) {
    const profile = await this.prisma.clubProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            wallets: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Club profile not found');
    }

    return profile;
  }

  async getClubByName(clubName: string) {
    const profile = await this.prisma.clubProfile.findUnique({
      where: { clubName },
    });

    if (!profile) {
      throw new NotFoundException('Club not found');
    }

    return profile;
  }

  async updateClubTokenInfo(userId: string, tokenAddress: string, tokenSupply: string) {
    const profile = await this.prisma.clubProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Club profile not found');
    }

    return await this.prisma.clubProfile.update({
      where: { userId },
      data: {
        tokenAddress,
        tokenSupply,
      },
    });
  }

  async getAllClubs(skip: number = 0, take: number = 20) {
    return await this.prisma.clubProfile.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // ============================================
  // COACH PROFILE
  // ============================================

  async createCoachProfile(userId: string, dto: CreateCoachProfileDto) {
    const existingProfile = await this.prisma.coachProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('User already has a coach profile');
    }

    const profile = await this.prisma.coachProfile.create({
      data: {
        userId,
        displayName: dto.displayName,
        specialty: dto.specialty,
        licenseLevel: dto.licenseLevel,
        yearsExperience: dto.yearsExperience,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        nationality: dto.nationality,
        biography: dto.biography,
        avatarUrl: dto.avatarUrl,
        achievements: dto.achievements,
      },
    });

    this.logger.log(`Coach profile created for user ${userId}`);
    return profile;
  }

  async getCoachProfile(userId: string) {
    const profile = await this.prisma.coachProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            wallets: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Coach profile not found');
    }

    return profile;
  }

  // ============================================
  // FAN PROFILE
  // ============================================

  async createFanProfile(userId: string, dto: CreateFanProfileDto) {
    const existingProfile = await this.prisma.fanProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('User already has a fan profile');
    }

    const profile = await this.prisma.fanProfile.create({
      data: {
        userId,
        displayName: dto.displayName,
        favoriteClub: dto.favoriteClub,
        favoritePlayer: dto.favoritePlayer,
        country: dto.country,
        avatarUrl: dto.avatarUrl,
        biography: dto.biography,
        nftCollection: dto.nftCollection,
      },
    });

    this.logger.log(`Fan profile created for user ${userId}`);
    return profile;
  }

  async getFanProfile(userId: string) {
    const profile = await this.prisma.fanProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            wallets: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Fan profile not found');
    }

    return profile;
  }

  async updateFanLoyaltyPoints(userId: string, points: number) {
    const profile = await this.prisma.fanProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Fan profile not found');
    }

    return await this.prisma.fanProfile.update({
      where: { userId },
      data: {
        loyaltyPoints: profile.loyaltyPoints + points,
      },
    });
  }

  // ============================================
  // GENERAL
  // ============================================

  async getUserProfiles(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        playerProfile: true,
        clubProfile: true,
        coachProfile: true,
        fanProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      profiles: {
        player: user.playerProfile,
        club: user.clubProfile,
        coach: user.coachProfile,
        fan: user.fanProfile,
      },
    };
  }

  async deleteProfile(userId: string, profileType: 'player' | 'club' | 'coach' | 'fan') {
    switch (profileType) {
      case 'player':
        await this.prisma.playerProfile.delete({ where: { userId } });
        break;
      case 'club':
        await this.prisma.clubProfile.delete({ where: { userId } });
        break;
      case 'coach':
        await this.prisma.coachProfile.delete({ where: { userId } });
        break;
      case 'fan':
        await this.prisma.fanProfile.delete({ where: { userId } });
        break;
      default:
        throw new BadRequestException('Invalid profile type');
    }

    this.logger.log(`${profileType} profile deleted for user ${userId}`);
    return { message: `${profileType} profile deleted successfully` };
  }
}

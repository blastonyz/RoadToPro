import { AxiosInstance } from 'axios';
import {
  AnyProfile,
  PlayerProfile,
  ClubProfile,
  CoachProfile,
  FanProfile,
  CreatePlayerProfileRequest,
  UpdatePlayerProfileRequest,
  CreateClubProfileRequest,
  UpdateClubTokenRequest,
  CreateCoachProfileRequest,
  CreateFanProfileRequest,
  UpdatePlayerNftRequest,
} from './types';

export class ProfilesApi {
  constructor(private http: AxiosInstance) {}

  // General
  async me(): Promise<AnyProfile[]> {
    const { data } = await this.http.get<AnyProfile[]>('/profiles/me');
    return data;
  }

  // Player
  async createPlayer(payload: CreatePlayerProfileRequest): Promise<PlayerProfile> {
    const { data } = await this.http.post<PlayerProfile>('/profiles/player', payload);
    return data;
  }

  async getMyPlayer(): Promise<PlayerProfile> {
    const { data } = await this.http.get<PlayerProfile>('/profiles/player/me');
    return data;
  }

  async updatePlayer(payload: UpdatePlayerProfileRequest): Promise<PlayerProfile> {
    const { data } = await this.http.put<PlayerProfile>('/profiles/player', payload);
    return data;
  }

  async listPlayers(params?: { skip?: number; take?: number }): Promise<PlayerProfile[]> {
    const { data } = await this.http.get<PlayerProfile[]>('/profiles/players', { params });
    return data;
  }

  async updatePlayerNft(payload: UpdatePlayerNftRequest): Promise<{ success: boolean }> {
    const { data } = await this.http.put<{ success: boolean }>('/profiles/player/nft', payload);
    return data;
  }

  // Club
  async createClub(payload: CreateClubProfileRequest): Promise<ClubProfile> {
    const { data } = await this.http.post<ClubProfile>('/profiles/club', payload);
    return data;
  }

  async getMyClub(): Promise<ClubProfile> {
    const { data } = await this.http.get<ClubProfile>('/profiles/club/me');
    return data;
  }

  async listClubs(params?: { skip?: number; take?: number }): Promise<ClubProfile[]> {
    const { data } = await this.http.get<ClubProfile[]>('/profiles/clubs', { params });
    return data;
  }

  async getClubByName(clubName: string): Promise<ClubProfile> {
    const { data } = await this.http.get<ClubProfile>(`/profiles/club/${encodeURIComponent(clubName)}`);
    return data;
  }

  async updateClubToken(payload: UpdateClubTokenRequest): Promise<{ success: boolean }> {
    const { data } = await this.http.put<{ success: boolean }>('/profiles/club/token', payload);
    return data;
  }

  // Coach
  async createCoach(payload: CreateCoachProfileRequest): Promise<CoachProfile> {
    const { data } = await this.http.post<CoachProfile>('/profiles/coach', payload);
    return data;
  }

  async getMyCoach(): Promise<CoachProfile> {
    const { data } = await this.http.get<CoachProfile>('/profiles/coach/me');
    return data;
  }

  // Fan
  async createFan(payload: CreateFanProfileRequest): Promise<FanProfile> {
    const { data } = await this.http.post<FanProfile>('/profiles/fan', payload);
    return data;
  }

  async getMyFan(): Promise<FanProfile> {
    const { data } = await this.http.get<FanProfile>('/profiles/fan/me');
    return data;
  }

  async updateFanLoyalty(points: number): Promise<{ success: boolean }> {
    const { data } = await this.http.put<{ success: boolean }>('/profiles/fan/loyalty', { points });
    return data;
  }

  // Delete any profile
  async delete(type: 'player' | 'club' | 'coach' | 'fan'): Promise<void> {
    await this.http.delete<void>(`/profiles/${type}`);
  }
}

export type {
  AnyProfile,
  PlayerProfile,
  ClubProfile,
  CoachProfile,
  FanProfile,
} from './types';



import { AxiosInstance } from "axios";

export type PlayerLevel = "BASE" | "PRO" | "INVERTIBLE" | "CONTRACT";

export interface RecordPlayerRatingRequest {
  technical: number;
  physical: number;
  commitment: number;
  transparency: number;
  reputation: number;
  source?: string;
}

export interface PlayerLevelResponse {
  level: PlayerLevel;
  overall: number;
  sustainedEligibility: boolean;
  sustainedSince?: string;
}

export interface PlayerRatingSnapshot {
  id: string;
  date: string;
  source: string;
  technical: number;
  physical: number;
  commitment: number;
  transparency: number;
  reputation: number;
  overall: number;
}

export interface PlayerScoreResponse {
  overall: number;
  category: string;
  deltaWeek: number;
  components: {
    technical: number;
    physical: number;
    commitment: number;
    transparency: number;
    reputation: number;
  };
}

export class PlayersApi {
  constructor(private http: AxiosInstance) {}

  async recordRating(
    payload: RecordPlayerRatingRequest
  ): Promise<PlayerLevelResponse> {
    const { data } = await this.http.post<PlayerLevelResponse>(
      "/profiles/player/rating",
      payload
    );
    return data;
  }

  async getLevel(): Promise<PlayerLevelResponse> {
    const { data } = await this.http.get<PlayerLevelResponse>(
      "/profiles/player/level"
    );
    return data;
  }

  async getRatingHistory(params?: {
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<PlayerRatingSnapshot[]> {
    const { data } = await this.http.get<PlayerRatingSnapshot[]>(
      "/profiles/player/rating-history",
      { params }
    );
    return data;
  }

  async getScore(): Promise<PlayerScoreResponse> {
    const { data } = await this.http.get<PlayerScoreResponse>(
      "/profiles/player/score"
    );
    return data;
  }
}

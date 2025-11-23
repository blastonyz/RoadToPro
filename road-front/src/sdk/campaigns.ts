import { AxiosInstance } from 'axios';
import {
  Campaign,
  CampaignStatus,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from './types';

export class CampaignsApi {
  constructor(private http: AxiosInstance) {}

  // Crear campaña (admins / super admins)
  async create(payload: CreateCampaignRequest): Promise<Campaign> {
    const { data } = await this.http.post<Campaign>('/campaigns', payload);
    return data;
  }

  // Listar campañas con filtros opcionales
  async list(params?: { status?: CampaignStatus; playerId?: string }): Promise<Campaign[]> {
    const { data } = await this.http.get<Campaign[]>('/campaigns', { params });
    return data;
  }

  // Obtener campaña por ID
  async getById(id: string): Promise<Campaign> {
    const { data } = await this.http.get<Campaign>(`/campaigns/${id}`);
    return data;
  }

  // Actualizar campaña (solo creador o super admin)
  async update(id: string, payload: UpdateCampaignRequest): Promise<Campaign> {
    const { data } = await this.http.patch<Campaign>(`/campaigns/${id}`, payload);
    return data;
  }

  // Eliminar campaña (solo creador o super admin)
  async delete(id: string): Promise<{ success?: boolean } | Campaign> {
    const { data } = await this.http.delete<{ success?: boolean } | Campaign>(`/campaigns/${id}`);
    return data;
  }

  // Listar campañas de un jugador específico
  async listByPlayer(playerId: string): Promise<Campaign[]> {
    const { data } = await this.http.get<Campaign[]>(`/campaigns/player/${encodeURIComponent(playerId)}`);
    return data;
  }
}

export type {
  Campaign,
  CampaignStatus,
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from './types';

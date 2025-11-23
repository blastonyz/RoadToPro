import { AxiosInstance } from 'axios';
import { Notification } from './types';

export class NotificationsApi {
  constructor(private http: AxiosInstance) {}

  async list(params?: {
    unread?: boolean;
    page?: number;
    limit?: number;
  }): Promise<Notification[]> {
    const { data } = await this.http.get<Notification[]>('/notifications', { params });
    return data;
  }

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const { data } = await this.http.post<{ success: boolean }>(`/notifications/${id}/read`, {});
    return data;
  }

  async markAllAsRead(): Promise<{ success: boolean }> {
    const { data } = await this.http.post<{ success: boolean }>('/notifications/read-all', {});
    return data;
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const { data } = await this.http.delete<{ success: boolean }>(`/notifications/${id}`);
    return data;
  }
}

export type { Notification } from './types';



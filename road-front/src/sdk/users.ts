import { AxiosInstance } from 'axios';
import { CreateUserRequest, UpdateUserRequest, UserSummary } from './types';

export class UsersApi {
  constructor(private http: AxiosInstance) {}

  async create(payload: CreateUserRequest): Promise<UserSummary> {
    const { data } = await this.http.post<UserSummary>('/users', payload);
    return data;
  }

  async list(): Promise<UserSummary[]> {
    const { data } = await this.http.get<UserSummary[]>('/users');
    return data;
  }

  async getById(id: string): Promise<UserSummary> {
    const { data } = await this.http.get<UserSummary>(`/users/${id}`);
    return data;
  }

  async updateMe(payload: UpdateUserRequest): Promise<UserSummary> {
    const { data } = await this.http.patch<UserSummary>('/user/me', payload);
    return data;
  }
}



import { AxiosInstance } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  UserSummary,
} from './types';

export class AuthApi {
  constructor(private http: AxiosInstance) {}

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await this.http.post<AuthResponse>('/auth/register', payload);
    return data;
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await this.http.post<AuthResponse>('/auth/login', payload);
    return data;
  }

  async verifyOtp(payload: VerifyOtpRequest): Promise<{ success: boolean; message?: string }> {
    const { data } = await this.http.post<{ success: boolean; message?: string }>('/auth/verify-otp', payload);
    return data;
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const { data } = await this.http.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
    return data;
  }

  async logout(): Promise<{ success: boolean }> {
    const { data } = await this.http.post<{ success: boolean }>('/auth/logout');
    return data;
  }

  async me(): Promise<UserSummary> {
    const { data } = await this.http.get<UserSummary>('/auth/me');
    return data;
  }

  async addWallet(payload: { address: string; network?: string; currency?: string; isDefault?: boolean }) {
    const { data } = await this.http.post('/auth/wallets', payload);
    return data;
  }

  async listWallets() {
    const { data } = await this.http.get('/auth/wallets');
    return data;
  }
}



import { AxiosInstance } from 'axios';
import {
  CouponSummary,
  CouponUsageSummary,
  CreateCouponRequest,
  ValidateCouponRequest,
  ValidateCouponResponse,
  UseCouponRequest,
  UseCouponResponse,
} from './types';

export class CouponsApi {
  constructor(private http: AxiosInstance) {}

  async create(payload: CreateCouponRequest): Promise<CouponSummary> {
    const { data } = await this.http.post<CouponSummary>('/coupons', payload);
    return data;
  }

  async validate(payload: ValidateCouponRequest): Promise<ValidateCouponResponse> {
    const { data } = await this.http.post<ValidateCouponResponse>('/coupons/validate', payload);
    return data;
  }

  async use(payload: UseCouponRequest): Promise<UseCouponResponse> {
    const { data } = await this.http.post<UseCouponResponse>('/coupons/use', payload);
    return data;
  }

  async list(): Promise<CouponSummary[]> {
    const { data } = await this.http.get<CouponSummary[]>('/coupons');
    return data;
  }

  async getByCode(code: string): Promise<CouponSummary> {
    const { data } = await this.http.get<CouponSummary>(`/coupons/${encodeURIComponent(code)}`);
    return data;
  }

  async revoke(code: string): Promise<CouponSummary> {
    const { data } = await this.http.delete<CouponSummary>(`/coupons/${encodeURIComponent(code)}`);
    return data;
  }

  async myUsage(): Promise<CouponUsageSummary[]> {
    const { data } = await this.http.get<CouponUsageSummary[]>('/coupons/my-usage');
    return data;
  }
}

export type {
  CouponSummary,
  CouponUsageSummary,
  CreateCouponRequest,
  ValidateCouponRequest,
  ValidateCouponResponse,
  UseCouponRequest,
  UseCouponResponse,
} from './types';



export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  isSuperAdmin: boolean;
  type: 'access' | 'refresh';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    isSuperAdmin: boolean;
    wallets: Array<{
      address: string;
      network: string;
      currency: string;
      isDefault: boolean;
    }>;
  };
}

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

export type GetToken = () => string | null | Promise<string | null>;
export type SetToken = (accessToken: string | null) => void | Promise<void>;
export type GetRefreshToken = () => string | null | Promise<string | null>;

export interface ApiClientOptions {
  baseURL: string;
  getAccessToken?: GetToken;
  setAccessToken?: SetToken;
  getRefreshToken?: GetRefreshToken;
  enableAutoRefresh?: boolean;
  onUnauthorized?: () => void;
}

export function createHttpClient(options: ApiClientOptions): AxiosInstance {
  const {
    baseURL,
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    enableAutoRefresh = true,
    onUnauthorized,
  } = options;

  const http = axios.create({ baseURL });

  // Attach Authorization header
  http.interceptors.request.use(async (config) => {
    const token = getAccessToken ? await getAccessToken() : null;
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  // Token refresh queue to avoid parallel refresh calls
  let isRefreshing = false;
  let waitingResolvers: Array<(token: string | null) => void> = [];

  const resolveQueue = (token: string | null) => {
    waitingResolvers.forEach((resolve) => resolve(token));
    waitingResolvers = [];
  };

  http.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
      const status = error.response?.status;

      const canRefresh =
        enableAutoRefresh &&
        status === 401 &&
        original &&
        !original._retry &&
        typeof getRefreshToken === 'function' &&
        typeof setAccessToken === 'function';

      if (!canRefresh) {
        if (status === 401 && typeof onUnauthorized === 'function') {
          onUnauthorized();
        }
        return Promise.reject(error);
      }

      original._retry = true;

      if (isRefreshing) {
        const newToken = await new Promise<string | null>((resolve) => waitingResolvers.push(resolve));
        if (newToken) {
          original.headers = original.headers ?? {};
          (original.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
        }
        return http(original);
      }

      isRefreshing = true;
      try {
        const refreshToken = await getRefreshToken!();
        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        const resp = await axios.post<{ accessToken: string }>(`${baseURL}/auth/refresh`, {
          refreshToken,
        });
        const newAccess = resp.data?.accessToken;
        await setAccessToken!(newAccess ?? null);
        resolveQueue(newAccess ?? null);

        original.headers = original.headers ?? {};
        (original.headers as Record<string, string>)['Authorization'] = `Bearer ${newAccess}`;
        return http(original);
      } catch (e) {
        await setAccessToken!(null);
        resolveQueue(null);
        if (typeof onUnauthorized === 'function') onUnauthorized();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return http;
}



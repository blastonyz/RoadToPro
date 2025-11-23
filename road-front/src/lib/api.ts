import { createOpenLeagueApiClient, OpenLeagueApiClient } from "@/sdk";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function getAccessToken(): string | null {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;
  return token;
}

export function getRefreshToken(): string | null {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(REFRESH_TOKEN_KEY)
      : null;
  return token;
}

export async function setAccessToken(token: string | null): Promise<void> {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
}): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

const baseURL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  (typeof window !== "undefined"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? (window as any).__OPEN_LEAGUE_API_URL__
    : undefined) ||
  "/api";

export const api: OpenLeagueApiClient = createOpenLeagueApiClient({
  baseURL,
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  enableAutoRefresh: true,
  onUnauthorized: () => {
    clearTokens();
    if (typeof window !== "undefined") {
      try {
        const current = window.location.pathname;
        if (!current.startsWith("/onboarding")) {
          window.location.replace("/onboarding/login");
        }
      } catch {
        // noop
      }
    }
  },
});

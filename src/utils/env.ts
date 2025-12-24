export type AuthMode = "cookie" | "header";

const raw = import.meta.env as Record<string, string | undefined>;

export const env = {
  API_BASE_URL: raw.VITE_API_BASE_URL ?? "",
  AUTH_MODE: (raw.VITE_AUTH_MODE ?? "cookie") as AuthMode,
  ENABLE_SOCKET: (raw.VITE_ENABLE_SOCKET ?? "false") === "true",
  SOCKET_URL:
    raw.VITE_SOCKET_URL ?? raw.VITE_API_BASE_URL ?? "http://localhost:4000",
  ENABLE_REPLIES: (raw.VITE_ENABLE_REPLIES ?? "true") === "true",
} as const;

export const isHeaderAuth = env.AUTH_MODE === "header";
export const isCookieAuth = env.AUTH_MODE === "cookie";

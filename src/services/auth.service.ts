const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

const ACCESS_TOKEN_KEY = "traveline_access_token";
const REFRESH_TOKEN_KEY = "traveline_refresh_token";

export type LoginRequest = {
  username: string;
  password: string;
};

export type AuthTokens = {
  access_token: string;
  refreshToken: string;
};

export type UserProfile = {
  userId: number;
  username: string;
};

/**
 * Lưu access token vào localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

/**
 * Lấy access token từ localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

/**
 * Lưu refresh token vào localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

/**
 * Lấy refresh token từ localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

/**
 * Xóa tất cả tokens khỏi localStorage
 */
export function clearTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/**
 * Kiểm tra xem token có hợp lệ và chưa hết hạn không
 * JWT token có format: header.payload.signature
 * Payload chứa exp (expiration time) dưới dạng Unix timestamp
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    // Decode JWT payload (base64url)
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    const exp = payload.exp;

    if (!exp) return false;

    // Kiểm tra xem token đã hết hạn chưa (exp là Unix timestamp)
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch {
    return false;
  }
}

/**
 * Đăng nhập và lưu token
 */
export async function login(credentials: LoginRequest): Promise<AuthTokens> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Đăng nhập thất bại");
  }

  const tokens: AuthTokens = await response.json();
  
  // Lưu tokens vào localStorage
  setAccessToken(tokens.access_token);
  setRefreshToken(tokens.refreshToken);

  return tokens;
}

/**
 * Lấy thông tin profile của user hiện tại
 */
export async function getProfile(): Promise<UserProfile> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Không có token");
  }

  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearTokens();
    }
    throw new Error("Không thể lấy thông tin người dùng");
  }

  return response.json();
}

/**
 * Đăng xuất (xóa tokens)
 */
export function logout(): void {
  clearTokens();
}


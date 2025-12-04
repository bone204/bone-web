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

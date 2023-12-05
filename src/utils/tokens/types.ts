export interface CreateRefreshTokenResponse {
  token: string;
  expiresAt: Date;
}

export interface RefreshTokenData {
  userId: string;
}

export interface AccessTokenData {
  userId: string;
  sessionId: string;
}

export interface CreateAccessTokenResponse {
  token: string;
  expiresAt: Date;
}

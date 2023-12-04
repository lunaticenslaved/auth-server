import { Request, Response } from 'express';

import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { Constants, logger } from '#/utils';
import { DOMAIN } from '#/utils/constants';

type TokenData = {
  userId: string;
  fingerprint: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export function removeTokensFormResponse(res: Response) {
  res.clearCookie('refreshToken');
}

export function getTokens(req: Request): Partial<Tokens>;
export function getTokens(req: Request, type: 'strict'): Tokens;
export function getTokens(req: Request, type?: 'strict'): Partial<Tokens> | Tokens;
export function getTokens(req: Request, type?: 'strict' | undefined): Partial<Tokens> | Tokens {
  let accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessToken) {
    accessToken = req.cookies['accessToken'] as string | undefined;
  }

  const refreshToken = req.cookies['refreshToken'] as string | undefined;

  logger.info(
    `[TOKEN] Get tokens from request: access - ${!!accessToken}, refresh - ${!!refreshToken}`,
  );

  if ((!accessToken || !refreshToken) && type === 'strict') {
    logger.error(`[TOKEN] Get tokens from request: strict tokens not valid`);
    throw new Errors.TokenInvalidError({ messages: 'Tokens are not valid' });
  }

  return { accessToken, refreshToken };
}

export function setTokensToResponse(refreshToken: CreateRefreshTokenResponse, res: Response) {
  res.cookie('refreshToken', refreshToken.token, {
    httpOnly: true,
    secure: true,
    domain: DOMAIN,
    expires: refreshToken.expiresAt,
  });
}

type TokenDataRequest =
  | {
      refreshToken: string;
    }
  | {
      accessToken: string;
    };

export function getTokenData(prop: TokenDataRequest): TokenData | Partial<TokenData>;
export function getTokenData(prop: TokenDataRequest, type: 'strict'): TokenData;
export function getTokenData(
  prop: TokenDataRequest,
  type?: 'strict',
): TokenData | Partial<TokenData>;
export function getTokenData(
  prop: TokenDataRequest,
  type?: 'strict',
): TokenData | Partial<TokenData> {
  if ('refreshToken' in prop) {
    logger.info(`[TOKEN] Try to get refresh token data`);

    try {
      checkIfTokenIsValid(prop);

      const data = jwt.verify(
        prop.refreshToken,
        Constants.REFRESH_TOKEN_SECRET as string,
      ) as TokenData;

      logger.info(`[TOKEN] Refresh token data:\n   ${JSON.stringify(data, null, 2)}`);

      return data;
    } catch (error) {
      if (type === 'strict') {
        throw error;
      }

      return {};
    }
  } else {
    try {
      logger.info(`[TOKEN] Try to get access token data`);

      checkIfTokenIsValid(prop);

      const data = jwt.verify(
        prop.accessToken,
        Constants.ACCESS_TOKEN_SECRET as string,
      ) as TokenData;

      logger.info(`[TOKEN] Access token data:\n   ${JSON.stringify(data, null, 2)}`);

      return data;
    } catch (error) {
      if (type === 'strict') {
        throw error;
      }

      return {};
    }
  }
}

export function checkIfTokenIsValid(req: TokenDataRequest): void {
  if ('accessToken' in req) {
    logger.info(`[TOKEN] Check access token is valid`);

    try {
      jwt.verify(req.accessToken, Constants.ACCESS_TOKEN_SECRET as string);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error(`[TOKEN] Access token is expired`);
        throw new Errors.TokenExpiredError({ messages: 'Access token expired' });
      }

      logger.error(`[TOKEN] Access token is invalid`);
      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  } else {
    logger.info(`[TOKEN] Check refresh token is valid`);

    try {
      jwt.verify(req.refreshToken, Constants.REFRESH_TOKEN_SECRET as string);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        logger.error(`[TOKEN] Refresh token is expired`);
        throw new Errors.RefreshTokenExpiredError({ messages: 'Refresh token expired' });
      }

      logger.error(`[TOKEN] Refresh token is invalid`);
      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  }
}

interface RefreshTokenData {
  userId: string;
}

export interface CreateRefreshTokenResponse {
  token: string;
  expiresAt: Date;
}

export function createRefreshToken(data: RefreshTokenData): CreateRefreshTokenResponse {
  const token = jwt.sign(data, Constants.REFRESH_TOKEN_SECRET, {
    expiresIn: Constants.REFRESH_TOKEN_EXPIRES_IN,
  });

  const { exp } = jwt.decode(token) as { exp: number };

  return {
    token,
    expiresAt: new Date(exp * 1000),
  };
}

interface AccessTokenData {
  userId: string;
  sessionId: string;
}

export interface CreateAccessTokenResponse {
  token: string;
  expiresAt: Date;
}

export function createAccessToken(data: AccessTokenData): CreateAccessTokenResponse {
  const token = jwt.sign(data, Constants.ACCESS_TOKEN_SECRET, {
    expiresIn: Constants.ACCESS_TOKEN_EXPIRES_IN,
  });

  const { exp } = jwt.decode(token) as { exp: number };

  return {
    token,
    expiresAt: new Date(exp * 1000),
  };
}

export function getAccessTokenData(token: string, type: 'strict'): AccessTokenData;
export function getAccessTokenData(token: string): AccessTokenData | undefined;
export function getAccessTokenData(token: string, type?: 'strict'): AccessTokenData | undefined {
  try {
    logger.info(`[TOKEN] Try to get access token data`);

    checkIfTokenIsValid({ accessToken: token });

    const data = jwt.verify(token, Constants.ACCESS_TOKEN_SECRET as string) as AccessTokenData;

    logger.info(`[TOKEN] Access token data:\n   ${JSON.stringify(data, null, 2)}`);

    return data;
  } catch (error) {
    if (type === 'strict') {
      throw error;
    }

    return undefined;
  }
}

export function getRefreshToken(req: Request, type: 'strict'): string;
export function getRefreshToken(req: Request): string | undefined;
export function getRefreshToken(req: Request, type?: 'strict'): string | undefined {
  const token = req.cookies['refreshToken'] as string;

  if (type === 'strict') {
    throw new Errors.UnauthorizedError({ messages: 'Unknown token' });
  }

  return token;
}

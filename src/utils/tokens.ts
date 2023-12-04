import { Request, Response } from 'express';

import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { Constants, logger } from '#/utils';
import { DOMAIN } from '#/utils/constants';

export function removeTokensFormResponse(res: Response) {
  res.clearCookie('refreshToken');
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
  logger.info('[TOKEN] Get refresh token from request');

  const token = req.cookies['refreshToken'] as string;

  if (type === 'strict') {
    logger.error('[TOKEN] Refresh token not found in cookie');

    throw new Errors.UnauthorizedError({ messages: 'Unknown token' });
  }

  return token;
}

export function getAccessToken(req: Request, type: 'strict'): string;
export function getAccessToken(req: Request): string | undefined;
export function getAccessToken(req: Request, type?: 'strict'): string | undefined {
  logger.info('[TOKEN] Get access token from request');

  const token = req.headers['authorization']?.split(' ')?.[1] as string | undefined;

  if (type === 'strict' && !token) {
    logger.error('[TOKEN] Access token not found in header');

    throw new Errors.UnauthorizedError({ messages: 'Unknown token' });
  }

  return token;
}

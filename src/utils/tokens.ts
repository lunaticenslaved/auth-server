import { Request, Response } from 'express';

import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { Constants, logger } from '#/utils';
import { DOMAIN } from '#/utils/constants';

type TokenData = {
  userId: string;
  sessionId: string;
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export function removeTokensFormResponse(res: Response) {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
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

export function setTokensToResponse(tokens: Tokens, res: Response) {
  res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, domain: DOMAIN });
  res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, domain: DOMAIN });
}

export function createTokens(data: TokenData) {
  const accessToken = jwt.sign(data, Constants.ACCESS_TOKEN_SECRET, {
    expiresIn: Constants.ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(data, Constants.REFRESH_TOKEN_SECRET, {
    expiresIn: Constants.REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
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
    logger.info(`[TOKEN] Get refresh token data`);

    try {
      checkIfTokenIsValid(prop);

      return jwt.verify(prop.refreshToken, Constants.REFRESH_TOKEN_SECRET as string) as TokenData;
    } catch (error) {
      if (type === 'strict') {
        throw error;
      }

      return {};
    }
  } else {
    logger.info(`[TOKEN] Get access token data`);

    try {
      checkIfTokenIsValid(prop);

      return jwt.verify(prop.accessToken, Constants.ACCESS_TOKEN_SECRET as string) as TokenData;
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

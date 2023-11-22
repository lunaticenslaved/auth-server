import { Request, Response } from 'express';

import jwt, { TokenExpiredError } from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { Constants } from '#/utils';

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
}

export function getTokens(req: Request): Partial<Tokens>;
export function getTokens(req: Request, type: 'strict'): Tokens;
export function getTokens(req: Request, type?: 'strict'): Partial<Tokens> | Tokens;
export function getTokens(req: Request, type?: 'strict' | undefined): Partial<Tokens> | Tokens {
  const accessToken = req.headers['authorization']?.split(' ')[1];
  const refreshToken = req.cookies['refreshToken'] as string | undefined;

  if ((!accessToken || !refreshToken) && type === 'strict') {
    throw new Errors.TokenInvalidError({ messages: 'Tokens are not valid' });
  }

  return { accessToken, refreshToken };
}

export function setTokensToResponse(tokens: Pick<Tokens, 'refreshToken'>, res: Response) {
  res.cookie('refreshToken', tokens.refreshToken);
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
    try {
      return jwt.verify(prop.refreshToken, Constants.REFRESH_TOKEN_SECRET as string) as TokenData;
    } catch (error) {
      if (type === 'strict') throw error;

      return {};
    }
  } else {
    try {
      return jwt.verify(prop.accessToken, Constants.ACCESS_TOKEN_SECRET as string) as TokenData;
    } catch (error) {
      if (type === 'strict') throw error;

      return {};
    }
  }
}

export function checkIfTokenExpired(req: TokenDataRequest): void {
  if ('accessToken' in req) {
    try {
      jwt.verify(req.accessToken, Constants.ACCESS_TOKEN_SECRET as string);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Errors.TokenExpiredError({ messages: 'Expired token' });
      }

      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  } else {
    try {
      jwt.verify(req.refreshToken, Constants.REFRESH_TOKEN_SECRET as string);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Errors.TokenExpiredError({ messages: 'Expired token' });
      }

      throw new Errors.TokenInvalidError({ messages: 'Invalid token' });
    }
  }
}

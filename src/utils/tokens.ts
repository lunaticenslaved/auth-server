import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';

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

export function getTokens<T extends 'strict'>(
  req: Request,
  type?: T,
): T extends 'strict' ? Tokens : Partial<Tokens>;
export function getTokens<T extends 'strict'>(req: Request, type?: T): Partial<Tokens> | Tokens {
  const accessToken = req.headers['authorization']?.split(' ')[1];
  const refreshToken = req.cookies['refreshToken'] as string | undefined;

  if ((!accessToken || !refreshToken) && type === 'strict') {
    throw new Errors.UnauthorizedError({ messages: 'Tokens are not valid' });
  }

  return { accessToken, refreshToken };
}

export function setTokensToResponse(tokens: Tokens, res: Response) {
  res.setHeader('authorization', `Bearer ${tokens.accessToken}`);
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

export function getTokenData<T extends 'strict'>(
  prop: TokenDataRequest,
  type?: T,
): T extends 'strict' ? TokenData : TokenData | undefined;
export function getTokenData<T extends 'strict'>(
  prop: TokenDataRequest,
  type?: T,
): TokenData | undefined {
  if ('refreshToken' in prop) {
    try {
      return jwt.verify(prop.refreshToken, Constants.REFRESH_TOKEN_SECRET as string) as TokenData;
    } catch (error) {
      if (type === 'strict') throw error;

      return undefined;
    }
  } else {
    try {
      return jwt.verify(prop.accessToken, Constants.ACCESS_TOKEN_SECRET as string) as TokenData;
    } catch (error) {
      if (type === 'strict') throw error;

      return undefined;
    }
  }
}

export function checkIfTokenExpired(req: TokenDataRequest): void {
  if ('accessToken' in req) {
    try {
      jwt.verify(req.accessToken, Constants.ACCESS_TOKEN_SECRET as string);
    } catch (error) {
      throw new Errors.UnauthorizedError({ messages: 'Token expired' });
    }
  } else {
    try {
      jwt.verify(req.refreshToken, Constants.REFRESH_TOKEN_SECRET as string);
    } catch (error) {
      throw new Errors.UnauthorizedError({ messages: 'Token expired' });
    }
  }
}

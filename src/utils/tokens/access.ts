import { Request } from 'express';

import jwt from 'jsonwebtoken';

import { Errors } from '@lunaticenslaved/schema';

import { Constants, logger } from '#/utils';

import { AccessTokenData, CreateRefreshTokenResponse } from './types';
import { checkIfTokenIsValid } from './utils';

export function create(data: AccessTokenData): CreateRefreshTokenResponse {
  const token = jwt.sign(data, Constants.REFRESH_TOKEN_SECRET, {
    expiresIn: Constants.REFRESH_TOKEN_EXPIRES_IN,
  });

  const { exp } = jwt.decode(token) as { exp: number };

  return {
    token,
    expiresAt: new Date(exp * 1000),
  };
}

export function getData(token: string, type: 'strict'): AccessTokenData;
export function getData(token: string): AccessTokenData | undefined;
export function getData(token: string, type?: 'strict'): AccessTokenData | undefined {
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

export function get(req: Request, type: 'strict'): string;
export function get(req: Request): string | undefined;
export function get(req: Request, type?: 'strict'): string | undefined {
  logger.info('[TOKEN] Get access token from request');

  const token = req.headers['authorization']?.split(' ')?.[1] as string | undefined;

  if (type === 'strict' && !token) {
    logger.error('[TOKEN] Access token not found in header');

    throw new Errors.UnauthorizedError({ messages: 'Unknown token' });
  }

  return token;
}
